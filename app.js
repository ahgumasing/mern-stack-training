const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.options('*', cors());

const userRouter = require('./routes/userRoutes');

app.use('/api/v1/users', userRouter);

module.exports = app;
