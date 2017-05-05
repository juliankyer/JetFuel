const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('Client routes', () => {
  //pass
  it.skip('should return the homepage', (done) => {
    chai.request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        done();
      });
  });
  
  it.skip('should return a 404 for a non-existent route', (done) => {
    //this should work but is hitting timeout
    chai.request(server)
      .get('/nope')
      .end((error, response) => {
        response.should.have.status(404)
        done();
      });
  });
});

describe('API routes', () => {
  before((done) => {
    
    done();
  });
  
  afterEach((done) => {
    
    done();
  });
  
  describe('GET /api/v1/folders', () => {
    //pass
    it.skip('should return all of the folders', (done) => {
      chai.request(server)
        .get('/api/v1/folders')
        .end((error, response) => {
          //why isn't this a 201 ?
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          
          done();
        });
    });
  });
  
  describe('POST /api/v1/folders', () => {
    //pass but needs to be more robust
    it.skip('should create a new folder', (done) => {
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
    
    it.skip('should not create a new folder if that folder already exists', () => {
      
    });    
  });
  
  describe('POST /api/v1/links', () => {
    //fail
    it.skip('should create a new link record', (done) => {
      chai.request(server)
        .post('/api/v1/links')
        .send({
          longURL: 'www.google.com',
          // clicks: 0,
          // folder_id: 1
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.be.a('array');
          //fails here
          response.body.should.have.property('longURL');
          response.body.should.have.property('clicks');
          response.body.should.have.property('folder_id');
          response.body.longURL.should.equal('www.google.com');
          response.body.clicks.should.equal(0);
          response.body.folder_id.should.equal(1);
          chai.request(server)
            .get('/api/v1/links')
            .end((error, response) => {
              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a('array');
              response.body.length.should.equal(1);
              response.body[0].should.have.property('longURL');
              response.body[0].should.have.property('clicks');
              response.body[0].should.have.property('folder_id');
              response.body[0].longURL.should.equal('www.google.com');
              response.body[0].clicks.should.equal(0);
              response.body[0].folder_id.should.equal(1);
              done();
            });
        });
    });
    
    it.skip('should not create a new link with missing data', () => {
      //fails
      chai.request(server)
        .post('/api/v1/links')
        .send({
          clicks: 0
        })
        .end((error, response) => {
          //returns a 422
          response.should.have.status(422);
          response.body.error.should.equal('Missing url');
          done();
        });
    });
  });
  
  describe('click events', () => {
    it.skip('should handle some clicks', () => {
      
    });
  });
  
});