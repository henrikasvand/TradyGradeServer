const supertest = require('supertest');
const app = require('../app');
const pool = require('../dao/poolConnection');
const { deleteAllUsersFromDB } = require('../dao/usersDao');

const api = supertest(app);

let dummyUser = {
  name: 'Jane Doe',
  password: 'supersecretpasswordthatwouldbenormallyhashed',
  email: 'janedoe@hotmail.com'
};

let dummyId;

describe('Testing /api/users route CRUD-requests', () => {
  test('items should be returned as json', async () => {
    await api
      .get('/api/users/')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('Creating a new user should work', async () => {
    await api
      .post('/api/users')
      .send(dummyUser)
      .then(res => {
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.id).toBeTruthy();
        dummyId = res.body.id;
      });
  });
  test("Creating a new user missing fields shouldn't work", async () => {
    await api
      .post('/api/users')
      .send({
        name: 'Invalid User',
        password: 'secretword'
      })
      .then(res => {
        expect(res.statusCode).toBe(400);
      });
  });
  test('Creating a new user with already existing name should not work', async () => {
    await api
      .post('/api/users')
      .send({
        name: 'Jane Doe',
        password: 'secretword',
        email: 'jane123@gmail.com'
      })
      .then(res => {
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toEqual(
          'Username or email already in use, please try again.'
        );
      });
  });
  test('Creating a new user with already existing email should not work', async () => {
    await api
      .post('/api/users')
      .send({
        name: 'JaneDoe123',
        password: 'secretword',
        email: 'janedoe@hotmail.com'
      })
      .then(res => {
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toEqual(
          'Username or email already in use, please try again.'
        );
      });
  });
  test('PUT: Updating previously created user details should work', async () => {
    await api
      .put(`/api/users/${dummyId}`)
      .send({
        ...dummyUser,
        name: 'JaneDoeRocks'
      })
      .then(res => {
        expect(res.statusCode).toBe(204);
      });
  });
  test('PUT: Updating non-existing  user details should return status 400', async () => {
    await api
      .put('/api/users/0')
      .send({
        name: 'Marjatta',
        email: 'maratta123@marjatta.com',
        password: 'hashedwithbcrytpjs'
      })
      .then(res => {
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
      });
  });
  test('GET by id: Previous PUT-request should have updated the field correctly', async () => {
    await api
      .get(`/api/users/${dummyId}`)

      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('JaneDoeRocks');
      });
  });
  test('GET by id: Request with non-existing user should return status 400 and success: false', async () => {
    await api
      .get(`/api/users/0`)

      .then(res => {
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
      });
  });
  test('GET all: response length should now be 1, should be an array and the user returned should be JaneDoeRocks', async () => {
    await api
      .get('/api/users/')

      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body[0].name).toBe('JaneDoeRocks');
        expect(res.body[0].email).toBe('janedoe@hotmail.com');
      });
  });
  test('POST: Creating second new user should work', async () => {
    await api
      .post('/api/users')
      .send({
        name: 'Testiheebo',
        email: 'supertestaaja@testi.com',
        password: 'salattusana',
        picture: 'http://www.images.google.com/123'
      })
      .then(res => {
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.id).toBeTruthy();
      });
  });
  test('GET all: response length should now be 2, should be an array and the users should be Testiheebo and JaneDoeRocks', async () => {
    await api
      .get('/api/users/')

      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body[0].name).toBe('JaneDoeRocks');
        expect(res.body[0].email).toBe('janedoe@hotmail.com');
        expect(res.body[1].name).toBe('Testiheebo');
      });
  });
  test('DELETE: Deleting JaneDoeRocks should work and return status 200', async () => {
    await api.delete(`/api/users/${dummyId}`).then(res => {
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
  test('DELETE: Deleting non-existing user should  return status 400', async () => {
    await api.delete('/api/users/0').then(res => {
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});

// Deleting all items from test database after every test run, so that testing is not dependent on your database state

afterAll(async done => {
  await deleteAllUsersFromDB();
  pool.end();
  done();
});

beforeAll(async done => {
  await deleteAllUsersFromDB();
  done();
});
