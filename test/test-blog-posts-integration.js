const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const should = chai.should();

const {BlogPost} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const {DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedBlogPostData() {
    console.info('seeding blog post data');
    const seedData = [];
    for (let i=0; i<=10; i++) {
        seedData.push({
            author: {
              firstName: faker.name.firstName(),
              lastName: faker.name.lastName()
            },
            title: faker.lorem.sentence(),
            content: faker.lorem.text()
          });
    }
    return BlogPost.insertMany(seedData);
}


function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Blog Posts API Resource', function() {
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });
    beforeEach(function() {
        return seedBlogPostData();
    });
    afterEach(function() {
        return tearDownDb();
    });
    after(function() {
        return closeServer();
    });

    describe('GET endpoint', function() {
        it('should return all existing posts', function() {
            let res;
            return chai.request(app)
                .get('/posts')
                .then(_res => {
                    res = _res;
                    res.should.have.status(200);
                    res.body.should.have.length.of.at.least(1);

                    return BlogPost.count();
                })
                .then(count => {
                    res.body.should.have.length.of(count);
                });
        });

        
    });
})