const supertest = require('supertest');
const app = require('../app');
const pool = require('../dao/poolConnection');
const { deleteAllItemsFromItemTable } = require('../dao/itemsDao');
const { createUser } = require('../dao/usersDao');

const api = supertest(app);

// Creating one user before tests to have a valid sellerId property

let dummyUser = {
  name: 'John Doe',
  password: 'supersecretpasswordthatwouldbenormallyhashed',
  email: 'johndoe@hotmail.com'
};

describe('Testing /api/marketplace/items route CRUD-requests', () => {
  let dummySellerId;
  test('Creating a user before item tests should work', async () => {
    await api
      .post('/api/users')
      .send(dummyUser)
      .then(res => {
        expect(res.statusCode).toBe(201);
        expect(res.body.id).toBeTruthy();
        dummySellerId = res.body.id;
      });
  });
  let dummyId;
  let dummyData = {
    name: 'Television',
    sellerId: dummySellerId,
    description: 'Perfect television for all your needs',
    category: 'electronics',
    condition: 'Perfect',
    price: 100,
    sold: false,
    listedAt: '2020-03-02T22:00:00.000Z',
    expires: '2020-04-02T21:00:00.000Z',
    pictureURL: 'http://localhost:1235/'
  };
  test('items should be returned as json', async () => {
    await api
      .get('/api/marketplace/items')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('Creating a new item should work', async () => {
    dummyData = { ...dummyData, sellerId: dummySellerId };
    await api
      .post('/api/marketplace/items')
      .send(dummyData)
      .then(res => {
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
      });
  });
  test('Creating a new item with missing price field should not work', async () => {
    await api
      .post('/api/marketplace/items')
      .send({ ...dummyData, price: null })
      .then(res => {
        expect(res.statusCode).toBe(400);
      });
  });

  test('GET ALL items should work, length should be 1', async () => {
    await api.get('/api/marketplace/items').then(res => {
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      dummyId = res.body[0].item.id;
    });
  });
  test('GET  api/marketplace/items/:id should work with previously created item id', async () => {
    await api.get(`/api/marketplace/items/${dummyId}`).then(res => {
      expect(res.statusCode).toBe(200);
    });
  });

  test('GET  api/marketplace/items/2 should not work', async () => {
    await api.get('/api/marketplace/items/2').then(res => {
      expect(res.statusCode).toBe(400);
    });
  });

  test('PUT should work with changed condition value', async () => {
    await api
      .put(`/api/marketplace/items/${dummyId}`)
      .send({ ...dummyData, condition: 'Poor' })
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
      });
  });

  test('PUT should not work with invalid id', async () => {
    await api
      .put('/api/marketplace/items/0')
      .send(dummyData)
      .then(res => {
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
      });
  });

  test('Testing that put actually changed the value: GET api/marketplace/items/:id ', async () => {
    await api.get(`/api/marketplace/items/${dummyId}`).then(res => {
      expect(res.statusCode).toBe(200);
      expect(res.body.item.condition).toBe('Poor');
    });
  });

  test('Delete with invalid ID should return statusCode 400', async () => {
    await api.delete('/api/marketplace/items/253987523').then(res => {
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  test('Delete with previously added id should return status 200', async () => {
    await api.delete(`/api/marketplace/items/${dummyId}`).then(res => {
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
  test('GET ALL items response body length should be 0 now', async () => {
    await api.get('/api/marketplace/items').then(res => {
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(0);
    });
  });
});

// Deleting all items from test database after every test run, so that testing is not dependent on your database state

afterAll(async done => {
  await deleteAllItemsFromItemTable();
  pool.end();
  done();
});
