const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const { router } = require('./routes');

mongoose.connect('mongodb://localhost:27017/react-auth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('!Connected to mongoDB!');
});

const app = express()

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

app.use(session({
  secret : 'some secret',
  resave : true,
  saveUninitialized : true,
}));

app.use(cors({
  credentials : true,
  origin : ['http://localhost:3000'],
}));

app.use('/api', router);

app.listen(5000, () => {
  console.log('App listening on port 5000');
});