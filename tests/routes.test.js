import supertest from 'supertest';
import mongoose from 'mongoose';
import User from '../src/models/user.model';
import Location from '../src/models/location.model';
import app from '../app';
import {signUpData, loginData} from'./__fixtures__/userData';
import {createLocationData} from'./__fixtures__/locationData';

let token;
let request;
let server;

beforeAll(function (done) {
  server = app.listen(4000, () => {
    global.agent = request.agent(server);
    done();
  });

  request = supertest(server);
  function clearDB() {
    const promises = [
      User.remove().exec(),
      Location.remove().exec()
    ];

    Promise.all(promises)
      .then(function () {
        done();
      })
  }

  if (mongoose.connection.readyState === 0) {
    mongoose.connect(process.env.TEST_MONGO_DB_URI, function (err) {
      if (err) {
        throw err;
      }
      return clearDB();
    });
  } else {
    return clearDB();
  }
});

afterAll(async () => {
  await server.close();
  await mongoose.disconnect();
});

describe('Authentication', () => {

  it("should create a user successfully", async () => {
    const response = await request.post('/auth/register').send(signUpData);
    expect(response.status).toEqual(201);
    expect(response.body.message).toContain('Account created successfully');
  });

  it("should not create a user with same email", async () => {
    const response = await request.post('/auth/register').send(signUpData);
    expect(response.status).toEqual(400);
    expect(response.body.email.msg).toContain('Email has been used');
  });

  it("should not create a user with invalid name ", async () => {
    const newSignUpData = {...signUpData, name: '    '};
    const response = await request.post('/auth/register').send(newSignUpData);
    expect(response.status).toEqual(400);
    expect(response.body.name.msg).toContain('Must be a string');
  })

  it("should not create a user with invalid email address ", async () => {
    const newSignUpData = {...signUpData, email: '    '};
    const response = await request.post('/auth/register').send(newSignUpData);
    expect(response.status).toEqual(400);
    expect(response.body.email.msg).toContain('Invalid email address');
  });

  it("should not create a user with a short password", async () => {
    const newSignUpData = {...signUpData, password: 'ab'};
    const response = await request.post('/auth/register').send(newSignUpData);
    expect(response.status).toEqual(400);
    expect(response.body.password.msg).toContain('Password must be at least 8 characters long');
  });

  it("should login a user successfully", async () => {
    const response = await request.post('/auth/login').send(loginData);
    expect(response.status).toEqual(200);
    expect(response.body.token).toBeDefined();
  });

  it("should not login a user with invalid credentials", async () => {
    const newLoginData = {...loginData, password: 'ab'};
    const response = await request.post('/auth/login').send(newLoginData);
    expect(response.status).toEqual(401);
    expect(response.body.message).toContain('Invalid login credentials');
  });
});

describe('Locations', () => {

  it("should login a user successfully", async () => {
    const response = await request.post('/auth/login').send(loginData);
    token = response.body.token
    expect(response.status).toEqual(200);
  });

  it("should deny access to an unathorized user", async () => {
    const response = await request.get('/locations').send();
    expect(response.status).toEqual(401);
    expect(response.body.message).toContain('Sorry, auth token is not provided');
  });

  it("should deny access to a user with an invalid token", async () => {
    const response = await request.get('/locations').send().set('authorization', 'Bearer tuwytuywt');
    expect(response.status).toEqual(401);
    expect(response.body.message).toContain('Sorry, token is invalid');
  });

  it("should create a location successfully", async () => {
    const response = await request.post('/locations').send(createLocationData).set('authorization', `Bearer ${token}`);;
    expect(response.status).toEqual(201);
    expect(response.body.message).toContain('Location saved successfully');
  });

  it("should not create a location with an invalid name", async () => {
    const newLocationData = {...createLocationData, name: ''}
    const response = await request.post('/locations').send(newLocationData).set('authorization', `Bearer ${token}`);;
    expect(response.status).toEqual(400);
    expect(response.body.name.msg).toContain('Must be a string');
  });

  it("should not create a location with an invalid parent id", async () => {
    const newLocationData = {...createLocationData, parentId: '7296'}
    const response = await request.post('/locations').send(newLocationData).set('authorization', `Bearer ${token}`);;
    expect(response.status).toEqual(400);
    expect(response.body.parentId.msg).toContain('Invalid parent id');
  });

  it("should not create a location with a non-existent parent location", async () => {
    const newLocationData = {...createLocationData, parentId: '5d27455d7abdab983fa10054'}
    const response = await request.post('/locations').send(newLocationData).set('authorization', `Bearer ${token}`);;
    expect(response.status).toEqual(400);
    expect(response.body.parentId.msg).toContain('Location does not exis');
  });

  it("should not create a location with an invalid male number", async () => {
    const newLocationData = {...createLocationData, male: 'ieue'}
    const response = await request.post('/locations').send(newLocationData).set('authorization', `Bearer ${token}`);;
    expect(response.status).toEqual(400);
    expect(response.body.male.msg).toContain('Invalid male number');
  });

  it("should not create a location with an invalid female number", async () => {
    const newLocationData = {...createLocationData, female: 'ieue'}
    const response = await request.post('/locations').send(newLocationData).set('authorization', `Bearer ${token}`);;
    expect(response.status).toEqual(400);
    expect(response.body.female.msg).toContain('Invalid female number');
  });

  it("should not create a location with female number less than 0", async () => {
    const newLocationData = {...createLocationData, female: -1}
    const response = await request.post('/locations').send(newLocationData).set('authorization', `Bearer ${token}`);;
    expect(response.status).toEqual(400);
    expect(response.body.female.msg).toContain('Female number must be between 0 and 10,000,000');
  });

  it("should not create a location with male number less than 0", async () => {
    const newLocationData = {...createLocationData, male: -1}
    const response = await request.post('/locations').send(newLocationData).set('authorization', `Bearer ${token}`);;
    expect(response.status).toEqual(400);
    expect(response.body.male.msg).toContain('Male number must be between 0 and 10,000,000');
  });

  it("should not get a non existent location", async () => {
    const response = await request.get('/locations/5d27455d7abdab983fa10054').send().set('authorization', `Bearer ${token}`);;
    expect(response.status).toEqual(404);
    expect(response.body.message).toContain('Location does not exist');
  });

  it("should not delete a non existent location", async () => {
    const response = await request.delete('/locations/5d27455d7abdab983fa10054').send().set('authorization', `Bearer ${token}`);;
    expect(response.status).toEqual(404);
    expect(response.body.message).toContain('Location does not exist');
  });

  it("should not update a non existent location", async () => {
    const response = await request.put('/locations/5d27455d7abdab983fa10054').send(createLocationData).set('authorization', `Bearer ${token}`);;
    expect(response.status).toEqual(404);
    expect(response.body.message).toContain('Location does not exist');
  });

  it("should get all locations", async () => {
    const response = await request.get('/locations').send().set('authorization', `Bearer ${token}`);;
    expect(response.status).toEqual(200);
    expect(response.body.locations.length).toEqual(1);
  });

});