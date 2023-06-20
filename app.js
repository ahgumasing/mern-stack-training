const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors());

app.options('*', cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

const userRouter = require('./routes/userRoutes');

app.use('/api/v1/users', userRouter);

module.exports = app;
