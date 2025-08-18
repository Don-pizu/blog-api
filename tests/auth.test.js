// tests/auth.test.js

const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

process.env.JWT_SECRET = "testsecret";  

describe('Auth Routes', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: '123456'
    });
    await user.save(); // ensures password is hashed
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'newuser', email: 'new@example.com', password: '123456' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.username).toBe('newuser');
    expect(res.body.email).toBe('new@example.com');
  });

  it('should login a user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: '123456' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.username).toBe('testuser');
  });

  it('should access a protected route with valid token', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: '123456' });

    const token = login.body.token;

    const res = await request(app)
      .get('/api/auth/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Protected route");
  });

  it('should fail login with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'wrongpass' });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid Credentials');
  });
});
