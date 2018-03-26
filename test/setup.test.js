'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const chai = require('chai');
const chaiHttp = require('chai-http');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {TEST_DATABASE_URL} = require('../config');
const {dbConnect, dbDisconnect} = require('../db-mongoose');
// const {dbConnect, dbDisconnect} = require('../db-knex');

const { Note } = require('../models/note');
const { app } = require('../index');

// Set NODE_ENV to `test` to disable http layer logs
// You can do this in the command line, but this is cross-platform
process.env.NODE_ENV = 'test';

// Clear the console before each run
process.stdout.write('\x1Bc\n');

const expect = chai.expect;

// const app = express();
// app.use(bodyParser.json());

chai.use(chaiHttp);

before(function() {
  return dbConnect(TEST_DATABASE_URL);
});

// beforeEach(function() {
//     return seedTrailData();
// });

// afterEach(function() {
//     return tearDownDb();
// });

after(function() {
  return dbDisconnect();
});

describe('Mocha and Chai', function() {
  it('should be properly setup', function() {
    expect(true).to.be.true;
  });
});

describe('GET endpoint', function() {
    it('should return all existing trails', function() {
        let res;
    return chai.request(app)
        .get('/notes')
        .then(function(_res) {
            // so subsequent .then blocks can access response object
            res = _res;
            // console.log('res is', res.body);
            expect(res).to.have.status(200);
            expect(res.body).to.have.length.of.at.least(1);
        })
    })
})

describe('POST endpoint', function() {
    it('should add a new trail', function() {
        const newTrail = generateTrailData();

        return chai.request(app)
            .post('/notes')
            .send(newTrail)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys(
                    'ascent', 'conditionDate', 'conditionDetails', 'conditionStatus', 'descent', 'difficulty', 'high', 'id', 'imgMedium', 'imgSmall', 'imgSmallMed', 'imgSqSmall', 'latitude', 'length', 'location', 'longitude', 'low', 'name', 'starVotes', 'stars', 'summary', 'type', 'url', 'user', 'comment', 'date'
                )
                expect(res.body.name).to.equal(newTrail.name);
                expect(res.body.id).to.not.be.null;
                expect(res.body.user).to.equal(newTrail.user);
                expect(res.body.comment).to.equal(newTrail.comment);
                expect(res.body.date).to.equal(newTrail.date);
                return res.body;
            })
            .then(function(trail) {
                expect(trail.name).to.equal(newTrail.name);
                expect(trail.ascent).to.equal(newTrail.ascent);
                expect(trail.conditionDate).to.equal(newTrail.conditionDate);
                expect(trail.conditionDetails).to.equal(newTrail.conditionDetails);
                expect(trail.conditionStatus).to.equal(newTrail.conditionStatus);
                expect(trail.descent).to.equal(newTrail.descent);
                expect(trail.difficulty).to.equal(newTrail.difficulty);

                expect(trail.high).to.equal(newTrail.high);
                expect(trail.imgMedium).to.equal(newTrail.imgMedium);
                expect(trail.imgSmall).to.equal(newTrail.imgSmall);
                expect(trail.imgSmallMed).to.equal(newTrail.imgSmallMed);
                expect(trail.imgSqSmall).to.equal(newTrail.imgSqSmall);
                expect(trail.latitude).to.equal(newTrail.latitude);
                expect(trail.length).to.equal(newTrail.length);

                expect(trail.location).to.equal(newTrail.location);
                expect(trail.longitude).to.equal(newTrail.longitude);
                expect(trail.low).to.equal(newTrail.low);
                expect(trail.name).to.equal(newTrail.name);
                expect(trail.starVotes).to.equal(newTrail.starVotes);
                expect(trail.stars).to.equal(newTrail.stars);
                expect(trail.summary).to.equal(newTrail.summary);
                expect(trail.type).to.equal(newTrail.type);
                expect(trail.url).to.equal(newTrail.url);
              });
    })
})

describe('DELETE endpoint', function() {
    // strategy:
    //  1. get a restaurant
    //  2. make a DELETE request for that restaurant's id
    //  3. assert that response has right status code
    //  4. prove that restaurant with the id doesn't exist in db anymore
    it('delete a trail by id', function() {
        let trail;

        return chai.request(app)
            .get('/notes')
            .then(function(_trail) {
                trail = _trail.body[0];
                // console.log('id is:', trail.id);
                
                return chai.request(app).delete(`/notes/${trail.id}`);
            })
            .then(function(res) {
                // console log to see status code
                expect(res).to.have.status(204);
            })
    })
})

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

// const chai = require('chai');
// const chaiHttp = require('chai-http');

// const {app} = require('../index');

// const should = chai.should();
// chai.use(chaiHttp);

// describe('API', function () {

//     it('should 200 on GET requests', function () {
//         return chai.request(app)
//             .get('/notes')
//             .then(function (res) {
//                 res.should.have.status(200);
//                 res.should.be.json;
//             });
//     });
// });