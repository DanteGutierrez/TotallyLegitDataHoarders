const express = require('express');
const pug = require('pug');
const path = require('path');
const routes = require('./routes/routes');

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', routes.index)
app.get('/:type', routes.type);

app.listen(3000);