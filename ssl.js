const express = require('express');
const app = express();

app.get('/health-check', (req, res) => res.sendStatus(200));

app.use(express.static('static'));
app.listen(80);

// const https = require('https');
// const fs = require('fs');
// const options = {
//   key: fs.readFileSync('./sslcertcopy/privKey.pem'),
//   cert: fs.readFileSync('./sslcertcopy/cert.crt'),
//   ca: fs.readFileSync('./sslcertcopy/chain.crt')
// };
// https.createServer(options, app).listen(443, "0.0.0.0");
