const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../../server/app');
// const bcryptjs = require('bcryptjs');

const request = supertest(app);

describe('/api/users routes:', () => {
  beforeAll(async () => {
    await mongoose.disconnect();
    const url = 'mongodb://127.0.0.1/test';
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
  
  /* register post */
  test('POST: /api/users - expect register success 200', async (done) => {
    await request
      .post('/api/users')
      .send({
        username: 'neilonlyhim',
        password: 'njcpassword',
        firstname: 'Neil Jason',
        middlename: 'Illana',
        lastname: 'Canete',
        birthday: new Date('07/28/1996'),
        gender: 'Male',
        civilstatus: 'Single',
        address: 'Maon',
        aboutme: 'Secretary',
        photo: '/profile-photo/123.jpeg'
      })
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(!!res.body.success).toStrictEqual(true)
        done();
      });
  })
  /* register post */
  test('POST: /api/users - expected error 403 with error attribute', async (done) => {
    await request
      .post('/api/users')
      .send({
        username: 'neilonlyhim',
        middlename: 'Illana',
        lastname: 'Canete',
        birthday: new Date('07/28/1996'),
        gender: 'Male',
        civilstatus: 'Single',
        address: 'Maon',
        aboutme: 'Secretary'
      })
      .then(res => {
        expect(res.statusCode).toBe(403);
        expect(res.body).toStrictEqual({ error: { status: 403, statusCode: 403, message: 'Invalid Request!' }})
        done();
      });
  })
  /* register post */
  test('POST: /api/users - expect register success 500', async (done) => {
    await request
      .post('/api/users')
      .send({
        username: 'neilonlyhim',
        password: 'njcpassword',
        firstname: 'Neil Jason',
        middlename: 'Illana',
        lastname: 'Canete',
        birthday: new Date('07/28/1996'),
        gender: 'Male',
        civilstatus: 'Single',
        address: 'Maon',
        aboutme: 'Secretary',
        photo: '/profile-photo/123.jpeg'
      })
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual({ error: { status: 500, statusCode: 500, message: 'Failed to register user!' }})
        done();
      });
  })
  /* login post */
  test('POST: /api/users/login - expected status 200 with success attribute', async (done) => {
    await request
      .post('/api/users/login')
      .send({
        username: 'neilonlyhim',
        password: 'njcpassword'
      })
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(!!res.body.success).toStrictEqual(true)
        expect(res.body.success.message).toStrictEqual('Successfully Logged In!')
        done();
      });
  })
  /* login post error request */
  test('POST: /api/users/login - expected status 403 with error attribute', async (done) => {
    await request
      .post('/api/users/login')
      .send({
        username: 'neilonlyhim'
      })
      .then(res => {
        expect(res.statusCode).toBe(403);
        expect(res.body).toStrictEqual({ error: { status: 403, statusCode: 403, message: 'Invalid Request!' }})
        done();
      });
  })
  /* login post invalid password */
  test('POST: /api/users/login - expected invalid password status 200 with error attribute', async (done) => {
    await request
      .post('/api/users/login')
      .send({
        username: 'neilonlyhim',
        password: 'invalidpassword'
      })
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual({
          error: { status: 401, statusCode: 401, message: 'Invalid Username or Password!'}
        })
        done();
      });
  })
  /* login post no user exists */
  test('POST: /api/users/login - expected status 200 with error attribute', async (done) => {
    await request
      .post('/api/users/login')
      .send({
        username: 'invalidusername',
        password: 'invalidpassword'
      })
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual({
          error: {
            status: 404, statusCode: 404,
            message: 'No Username Exists!'
          }
        })
        done();
      });
  })

});
