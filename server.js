// This file will both host a local webserver & launch the project on OpenFin
// For the actual demo, we will not need to launch the project on OpenFin - just serve it up with express
// This is strictly a local POC

const path = require('path');
const express = require('express');
const openfinLauncher = require('openfin-launcher');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.listen(8080, () => {
    console.log('App being served on localhost:8080');
    openfinLauncher.launchOpenFin({
        configPath: 'http://localhost:8080/app.json'
    }).then(() => {
        process.exit();
    })
})