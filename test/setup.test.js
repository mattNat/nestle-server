'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const {TEST_DATABASE_URL} = require('../config');
const {dbConnect, dbDisconnect} = require('../db-mongoose');
const mongoose = require('mongoose');
// const {dbConnect, dbDisconnect} = require('../db-knex');

const { Note } = require('../models/note');

// Set NODE_ENV to `test` to disable http layer logs
// You can do this in the command line, but this is cross-platform
process.env.NODE_ENV = 'test';

// Clear the console before each run
process.stdout.write('\x1Bc\n');

const expect = chai.expect;
chai.use(chaiHttp);

before(function() {
    return runServer(TEST_DATABASE_URL);
});

beforeEach(function() {
    return seedTrailData();
  });

afterEach(function() {
    return tearDownDb();
  });

after(function() {
    return closeServer();
});

describe('Mocha and Chai', function() {
    it('should be properly setup', function() {
        expect(true).to.be.true;
    });
});

//****** Test endpoints below ******//

// generate an object represnting a restaurant.
// can be used to generate seed data for db
// or request.body data
function generateTrailData() {
    return {
        user: "John Doe",
        comment: "Spends his free time trying to flow",
        date: "2018-03-18",
        id: 7004682,
        name: "Royal Arch",
        type: "Featured Hike",
        summary: "A classic Boulder hike to a natural arch with great views.",
        difficulty: "blueBlack",
        stars: 4.4,
        starVotes: 68,
        location: "Boulder, Colorado",
        url: "https://www.hikingproject.com/trail/7004682/royal-arch",
        imgSqSmall: "https://cdn-files.apstatic.com/hike/7003311_sqsmall_1430066482.jpg",
        imgSmall: "https://cdn-files.apstatic.com/hike/7003311_small_1430066482.jpg",
        imgSmallMed: "https://cdn-files.apstatic.com/hike/7003311_smallMed_1430066482.jpg",
        imgMedium: "https://cdn-files.apstatic.com/hike/7003311_medium_1430066482.jpg",
        length: 3.3,
        ascent: 1311,
        descent: -1312,
        high: 6917,
        low: 5691,
        longitude: -105.283,
        latitude: 39.9997,
        conditionStatus: "Minor Issues",
        conditionDetails: "Icy",
        conditionDate: "2018-03-15 08:47:48"
    };
}

function seedTrailData() {
    console.info('seeding trail data');
    const seedData = [];
  
    for (let i=1; i<=10; i++) {
      seedData.push(generateTrailData());
    }
    // this will return a promise
    // console.log(seedData);
    
    return Note.insertMany(seedData);
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

// run/close server only for testing
// this function connects to our database, then starts the server
function runServer(TEST_DATABASE_URL, port = 3005) {

    return new Promise((resolve, reject) => {
      mongoose.connect(TEST_DATABASE_URL, {useMongoClient: true}, err => {
        if (err) {
          return reject(err);
        }
        server = app.listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
          .on('error', err => {
            mongoose.disconnect();
            reject(err);
          });
      });
    });
  }
  
let server;
// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
            if (err) {
            return reject(err);
            }
            resolve();
        });
        });
    });
}