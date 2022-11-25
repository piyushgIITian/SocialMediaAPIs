//During the test the env variable is set to test
process.env.NODE_ENV = 'test';



//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();


chai.use(chaiHttp);

/*
  * Test the /GET route
  */
  describe('/POST api/posts/', () => {
      it('it should register a post', (done) => {
        let posttemp = {
            title:"New Post",
            desc:"this is a test post",
        }
        chai.request(server)
            .post('/api/authenticate/')
            .send(posttemp)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.have.property('email');
                  
                  
              done();
            });
      });
  });

