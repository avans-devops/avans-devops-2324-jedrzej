const request = require('supertest')
const app = require('../../app')
const { db, client } = require('../../services/database');
 

describe('Get Photos', () => {
  beforeEach(async () => {
    await db.collection('photos').deleteMany({});

  });

  afterAll(async() => {
    client.close();
  });

  it('should get all photos in array', async () => {
    const expected = { 'foo': 'bar' };
    await db.collection('photos').insertOne(expected);
    delete expected._id;
 
    const res = await request(app).get('/photos')
    expect(res.statusCode).toEqual(200)
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toEqual(expect.objectContaining(expected));
  });
});
