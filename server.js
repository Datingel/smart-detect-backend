const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const hash = bcrypt.hashSync('bacon');
const cors = require('cors');
const knex = require('knex');
const port = process.env.PORT || 3000;
// const {Client} = require ('pg');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/images');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

db.select('*')
  .from('users')
  .then(data => {});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('it is working');
});

app.get('/favicon.ico', (req, res) => res.sendStatus(204));

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

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
