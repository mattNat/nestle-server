const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {DATABASE_URL} = require('./config');

function dbConnect(url = DATABASE_URL) {
    return mongoose.connect(DATABASE_URL, {useMongoClient: true}).catch(err => {
        console.error('Mongoose failed to connect');
        console.error(err);
    });
}

function dbDisconnect() {
    return mongoose.disconnect();
}

module.exports = {
    dbConnect,
    dbDisconnect
};