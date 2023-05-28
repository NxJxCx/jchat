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
  test('POST: /api/users', async (done) => {
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
});
