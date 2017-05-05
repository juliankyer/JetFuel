//npm install -D mocha chai chai-http

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('Client routes', () => {
  it('should return the homepage', (done) => {
    chai.request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        //check for html elements of homepage
        done();
      });
  });
  
  it('should return a 404 for a non-existent route', (done) => {
    chai.request(server)
      .get('/nope')
      .end((error, response) => {
        response.should.have.status(404);
        
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
    it('should return all of the folders', (done) => {
      chai.request(server)
        .get('/api/v1/students')
        .end((error, response) => {
          response.shouldhave.status(200);
          
          done();
        });
    });
  });
  
  describe('POST /api/v1/folders', () => {
    it('should create a new folder', (done) => {
      
    });
    
    it('should not create a new folder if that folder already exists', () => {
      
    });    
  });
  
  describe('POST /api/v1/links', () => {
    it('should create a new link', () => {
      
    });
    
    it('should not create a new link with missing data', () => {
      
    });
  });
  
  describe('click events', () => {
    
  });
  
});