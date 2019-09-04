const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const hash = bcrypt.hashSync('bacon');
const cors = require('cors');
const knex = require('knex');
const port = process.env.PORT || 3000;

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'datingel',
    password: '',
    database: 'smart-brain',
  },
});

db.select('*')
  .from('users')
  .then(data => {});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

const ignoreFavicon(req, res, next) => {
  if (req.originalUrl === '/favicon.ico') {
    res.status(204).json({nope: true});
  } else {
    next();
  }
}

app.use(ignoreFavicon);

app.get('*', (req, res) => {
  res.send('it is working');
});

// app.get('/favicon.ico', (req, res) => res.sendStatus(204));

app.post('/signin', (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

app.post('/register', register.handleRegister(db, bcrypt)); //other syntax to write the endpoint-> see register.js

app.get('/profile/:id', (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.put('/image', (req, res) => {
  image.hanldeImagePut(req, res, db);
});

app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(process.env.PORT || port, err => {
  if (err) {
    throw new Error('Something bad happened...');
  }
  console.log(`Server is listening on ${process.env.PORT}`);
});
