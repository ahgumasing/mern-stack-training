const mongoose = require('mongoose');
const env = require('dotenv');
const app = require('./app');

env.config({ path: './config.env' });

const database = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(database, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log('database connected succesfully'));

const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});

const TestModel = mongoose.model('Tour', testSchema);

const testing = new TestModel({
    name: 'Bechon12',
});

testing.save();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
