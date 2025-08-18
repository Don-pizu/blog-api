// tests/comment.test.js
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/post');
const Comment = require('../models/comment');

describe('Comment API', () => {
  let commenter, admin, post;

  // Helper to create user + token
  const createUserAndToken = async (username, email, role = 'user') => {
    const user = await User.create({ 
      username,   
      email, 
      password: '123456',
      role 
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
    await Comment.deleteMany({});

    // Create users
    commenter = await createUserAndToken('CommenterUser', 'commenter@example.com');
    admin = await createUserAndToken('AdminUser', 'admin@example.com', 'admin');
  });

  it('should add, list, update, and delete comment', async () => {
    // Create a post by commenter
    const newPost = await request(app)
      .post('/api/post')
      .set('Authorization', `Bearer ${commenter.token}`)
      .send({ title: 'Test Post', content: 'Post for comments' });

    post = newPost.body.createPost || newPost.body.post || newPost.body;
    expect(post && post._id).toBeDefined();

    // Add comment
    const add = await request(app)
      .post(`/api/${post._id}/comment`)
      .set('Authorization', `Bearer ${commenter.token}`)
      .send({ comment: 'Nice!' });

    expect(add.statusCode).toBe(201);
    const commentId = add.body.createComment._id;

    // List comments
    const list = await request(app).get(`/api/getcomment/${post._id}`);
    expect(list.statusCode).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body[0].comment).toBe('Nice!');

    // Update by commenter
    const update = await request(app)
      .put(`/api/update/${commentId}`)
      .set('Authorization', `Bearer ${commenter.token}`)
      .send({ comment: 'Updated by owner' });

    expect(update.statusCode).toBe(200);
    expect(update.body.comment).toBe('Updated by owner');

    // Update by admin
    const updateByAdmin = await request(app)
      .put(`/api/update/${commentId}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ comment: 'Updated by admin' });

    expect(updateByAdmin.statusCode).toBe(200);
    expect(updateByAdmin.body.comment).toBe('Updated by admin');

    // Delete by commenter
    const del = await request(app)
      .delete(`/api/commentdelete/${commentId}`)
      .set('Authorization', `Bearer ${commenter.token}`);

    expect(del.statusCode).toBe(200);

    // Add comment again for admin delete test
    const add2 = await request(app)
      .post(`/api/${post._id}/comment`)
      .set('Authorization', `Bearer ${commenter.token}`)
      .send({ comment: 'To be deleted by admin' });

    const newCommentId = add2.body.createComment._id;

    const deleteByAdmin = await request(app)
      .delete(`/api/commentdelete/${newCommentId}`)
      .set('Authorization', `Bearer ${admin.token}`);

    expect(deleteByAdmin.statusCode).toBe(200);
  });
});
