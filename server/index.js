const express = require('express');
const compression = require('compression')
const app = express();

app.use(compression());
app.use(express.json());
app.use('/',express.static(__dirname + '/web'))

app.listen(5000)

