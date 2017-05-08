const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
require('locus');

const knexConfig = require('../knexfile.js')['test']
const knex = require('knex')(knexConfig)

chai.use(chaiHttp);

describe('Client routes', () => {
  it('should return the homepage', (done) => {
    chai.request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        done();
      });
  });

  it('should return a 404 for a non-existent route', (done) => {
    chai.request(server)
      .get('/nope')
      .end((error, response) => {
        response.should.have.status(404)
        done();
      });
  });
});

describe('API routes', () => {
  beforeEach((done) => {
    knex.migrate.rollback()
     .then(function() {
       knex.migrate.latest()
       .then(function() {
         return knex.seed.run()
         .then(function() {
           done();
         });
       });
     });
  });

  afterEach((done) => {
    knex.migrate.rollback()
      .then(function() {
        done();
      });
  });

  describe('GET /api/v1/folders', () => {
    it('should return all of the folders', (done) => {
      chai.request(server)
        .get('/api/v1/folders')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');

          done();
        });
    });
  });

  describe('POST /api/v1/folders', () => {
    it('should create a new folder', (done) => {
      chai.request(server)
        .post('/api/v1/folders')
        .send({
          name: 'Tests'
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('name');
          response.body.name.should.equal('Tests');
          response.body.should.have.property('id');
          chai.request(server)
            .get('/api/v1/folders')
            .end((error, response) => {
              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a('array');
              response.body[0].should.have.property('name');
              response.body[0].should.have.property('id');

              done();
            });
        });
    });

  });

  describe('POST /api/v1/links', function () {
    this.timeout(150000000);
    
    it('should create a new link record', (done) => {
      chai.request(server)
        .post('/api/v1/links')
        .send(
              {
                newURL: 'www.google.com',
                folderID: 1
              }
            )
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.be.a('array');
          response.body[0].should.equal(3);
          chai.request(server)
            .get('/api/v1/folders/1')
            .end((error, response) => {
              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a('array');
              response.body.length.should.equal(3);
              response.body[2].should.have.property('longURL');
              response.body[2].should.have.property('clicks');
              response.body[2].should.have.property('folder_id');
              response.body[2].longURL.should.equal('www.google.com');
              response.body[2].clicks.should.equal(0);
              response.body[2].folder_id.should.equal(1);
              done();
            });
        });
    });

    it('should not create a new link with missing data', (done) => {
      chai.request(server)
        .post('/api/v1/links')
        .send({
          clicks: 0
        })
        .end((error, response) => {
          console.log(response.error.text)
          response.should.have.status(422);
          response.error.text.should.equal('Missing url');
          done();
        });
    });
  });

});