const mongoose = require('mongoose');
require('dotenv').config()
const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const router = require('./router/router.js');
const path = require('path');
const PORT = process.env.PORT || 8999;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}));

app.use('/api', router);

app.use(express.static(path.join(__dirname, '../mongoose-auth/dist')));

const arrayPath = ['/', '/register', '/users/:p', '/users', '/statistics', '/otherpage', 'otherpage/:p', '/othertwo', '/adminlistpage', '/create', '/update/:id', '/view/:id'];

app.get(arrayPath, function (req, res) {
  res.sendFile(path.join(__dirname, '../mongoose-auth/dist', 'index.html'));
});

const start = async() => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/testmongo')
    app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
  } catch (error) {
    console.log(error)
  }
}

start()
