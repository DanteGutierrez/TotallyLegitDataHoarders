const express = require('express');
const pug = require('pug');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/routes');

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, '/public')));

const urlencodedParser = bodyParser.urlencoded({
    extended: true
});

app.get('/', routes.index)
app.get('/account', routes.account);
app.get('/post', routes.post);
app.get('/create/account', routes.accountCreate);
app.post('/create/account', urlencodedParser, routes.postedAccount);
app.post('/account', urlencodedParser, routes.followedAccount);
app.get('/create/post', routes.postCreate);
app.post('/create/post', urlencodedParser, routes.postedPost);
app.post('/post', urlencodedParser, routes.commentedPost);

app.listen(3000);