import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const generateAccessToken = (user) => {
  try {
    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '10m',
    });
    return accessToken;
  } catch (error) {
    console.error('Erro ao gerar token de acesso:', error);
    throw new Error('Erro ao gerar token de acesso');
  }
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

// REGISTRO
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const existingUser = await User.find({ username });

  if (existingUser.length > 0) {
    return res.status(400).json({ error: 'Nome de usuario indisponivel' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  }
  catch (error) {
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // true se HTTPS
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 10000,
    })
    .json({
      accessToken: accessToken,
      user: { id: user._id, username: user.username, photo: user.photo, role: user.role },
    });
});

// Update User
router.put('/update', async (req, res) => {
  const { id, currentPassword, newPassword, photo } = req.body;
  console.log('Dados recebidos para atualização:', req.body);

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  if (currentPassword && !(await bcrypt.compare(currentPassword, user.password))) {
    return res.status(401).json({ error: 'Senha atual incorreta' });
  }
  if (newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { password: hashedPassword, photo },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      res.json({ message: 'Usuário atualizado com sucesso', user: updatedUser });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  } else {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { photo },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      res.json({ message: 'Usuário atualizado com sucesso', user: updatedUser });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  }
});

router.post('/usersByIds', async (req, res) => {
  const { ids } = req.body;
  try {
    const users = await User.find({ _id: { $in: ids } }, '_id username');
    const userMap = {};
    users.forEach(u => {
      userMap[u._id] = u.username;
    });
    res.json(userMap);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// REFRESH TOKEN
router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ error: 'Refresh token ausente' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const newAccessToken = generateAccessToken(user);

    res.json({
      accessToken: newAccessToken,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        photo: user.photo,
      },
    });
  } catch (err) {
    console.error("Erro ao fazer refresh:", err);
    return res.status(403).json({ error: 'Refresh token inválido' });
  }
});
/*router.post('/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ error: 'Refresh token ausente' });
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken(decoded);

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ error: 'Refresh token inválido' });
  }
});*/

// LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken').json({ message: 'Logout realizado com sucesso' });
});

export default router;
