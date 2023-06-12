const express = require('express');
const morgan = require('morgan');

const app = express();

app.get('/', (req, res) => {
    res.json({ name: 'Bechon' });
});

module.exports = app;
