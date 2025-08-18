// tests/post.test.js

const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/post');
const jwt = require('jsonwebtoken');

describe('Post Routes', () => {
  let token, userId;

  // helper to create user and token
  const createUserAndToken = async (role = 'user') => {
    const unique = Date.now() + Math.floor(Math.random() * 1000);

    const user = await User.create({
      username: `user_${unique}`,
      email: `user_${unique}@test.com`,
      password: '123456',
      role,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { user, token };
  };

  beforeEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});

    const uSer = await createUserAndToken();
    userId = uSer.user._id;
    token = uSer.token;
  });

  /*
  afterAll(async () => {
    await mongoose.connection.close();
  });
  */


  it('should make a post', async () => {
    const res = await request(app)
      .post('/api/post')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'POST', content: 'new post', tags: ['intro'] });

    expect(res.statusCode).toBe(201);
    expect(res.body.createPost.title).toBe('POST');   
    expect(res.body.createPost.content).toBe('new post');
    expect(String(res.body.createPost.user)).toBe(String(userId));
  });

  it('should read all post with pagination', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/post')  //Check
        .set('Authorization', `Bearer ${token}`)
        .send({ title: `title_${i}`, content: 'content' });
    }

    const res = await request(app).get('/api/getposts?page=1&limit=10');

    expect(res.statusCode).toBe(200);
    expect(res.body.posts.length).toBe(5);
  });

  it('should update a post by author and admin only', async () => {
    const { token: authorToken } = await createUserAndToken();
    const { token: adminToken } = await createUserAndToken('admin');
    const { token: otherToken } = await createUserAndToken();

    const created = await request(app)
      .post('/api/post')
      .set('Authorization', `Bearer ${authorToken}`)
      .send({ title: 'Original', content: 'Post', tags: ['tag'] });

    const postId = created.body.createPost._id;

    // other user tries
    const res = await request(app)
      .put(`/api/update/${postId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'Hacked' });

    expect(res.statusCode).toBe(403);

    // author updates
    const resAuthor = await request(app)
      .put(`/api/update/${postId}`)
      .set('Authorization', `Bearer ${authorToken}`)
      .send({ title: 'Updated by Author' });

    expect(resAuthor.statusCode).toBe(200);
    expect(resAuthor.body.title).toBe('Updated by Author');

    // Admin updates
    const resAdmin = await request(app)
      .put(`/api/update/${postId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Updated by Admin' });

    expect(resAdmin.statusCode).toBe(200);
    expect(resAdmin.body.title).toBe('Updated by Admin');
  });

  it('should delete post by admin and author', async () => {
  const { token: authorToken } = await createUserAndToken();
  const { token: adminToken } = await createUserAndToken('admin');
  const { token: otherToken } = await createUserAndToken();

  // --- Author creates a post ---
  const created = await request(app)
    .post('/api/post')
    .set('Authorization', `Bearer ${authorToken}`)
    .send({ title: 'Delete Me', content: 'Temporary' });

  const postId = created.body.createPost?._id || created.body._id;
  expect(postId).toBeDefined();

  // --- Other user tries to delete (should fail) ---
  const res = await request(app)
    .delete(`/api/delete/${postId}`)
    .set('Authorization', `Bearer ${otherToken}`);

  expect(res.statusCode).toBe(403);

  // --- Author deletes successfully ---
  const resAuthor = await request(app)
    .delete(`/api/delete/${postId}`)
    .set('Authorization', `Bearer ${authorToken}`);

  expect(resAuthor.statusCode).toBe(200);
  expect(resAuthor.body.message).toMatch(/deleted/i);

  // --- Re-create post for admin ---
  const recreated = await request(app)
    .post('/api/post')
    .set('Authorization', `Bearer ${authorToken}`) 
    .send({ title: 'Delete Again', content: 'Temporary' });

  const postId2 = recreated.body.createPost?._id || recreated.body._id;
  expect(postId2).toBeDefined();

  // --- Admin deletes successfully ---
  const resAdmin = await request(app)
    .delete(`/api/delete/${postId2}`)
    .set('Authorization', `Bearer ${adminToken}`);

  console.log(resAdmin.body);
  expect(resAdmin.statusCode).toBe(200);
  expect(resAdmin.body.message).toMatch(/deleted/i);
});

});
