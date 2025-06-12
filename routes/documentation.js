import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Serve o arquivo swagger.json como JSON direto
router.get('/swagger.json', (req, res) => {
    const specPath = path.join(process.cwd(), 'swagger.json'); // Caminho correto
    const rawSpec = fs.readFileSync(specPath, 'utf8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.send(rawSpec);
});

// Página Redoc
router.get('/', (req, res) => {
    const html = `
    <!DOCTYPE html>
<html>

<head>
  <title>Redoc</title>
  <!-- needed for adaptive design -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">

  <!--
    Redoc doesn't change outer page styles
    -->
  <style>
    body {
      margin: 0;
      padding: 0;
    }
  </style>
</head>

<body>
  <redoc spec-url="/docs/swagger.json"></redoc>
  <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"> </script>
</body>

</html>
  `;
    res.send(html);
});

export default router;
