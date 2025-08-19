// tests/comment.test.js
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const User = require("../models/User");
const Post = require("../models/post");
const Comment = require("../models/comment");

describe("Comment API", () => {
  let commenter, admin, post;

  // Helper to create user + token
  const createUserAndToken = async (username, email, role = "user") => {
    const user = await User.create({
      username,
      email,
      password: "123456",
      role,
    });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log(`🔑 Created user: ${username}, role: ${role}, token:`, token);
    return { user, token };
  };

  beforeEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    // Create users
    commenter = await createUserAndToken(
      "CommenterUser",
      "commenter@example.com"
    );
    admin = await createUserAndToken("AdminUser", "admin@example.com", "admin");
  });

  it("should add, list, update, and delete comment", async () => {
    // 🔹 Create a post by commenter
    const newPost = await request(app)
      .post("/api/post")
      .set("Authorization", `Bearer ${commenter.token}`)
      .send({ title: "Test Post", content: "Post for comments" });

    console.log("📌 Create Post Status:", newPost.statusCode);
    console.log("📌 Create Post Response:", newPost.body);

    post = newPost.body.createPost;
    if (!post || !post._id) {
      console.error("❌ Post was not created properly. Check protect middleware / JWT.");
    }
    expect(post && post._id).toBeDefined();

    // 🔹 Add comment
    const add = await request(app)
      .post(`/api/${post._id}/comment`)
      .set("Authorization", `Bearer ${commenter.token}`)
      .send({ comment: "Nice!", postId: post._id });

    console.log("📌 Add Comment Status:", add.statusCode);
    console.log("📌 Add Comment Response:", add.body);
    expect(add.statusCode).toBe(201);
    expect(add.body.createComment).toBeDefined();

    const commentFromDb = await Comment.findById(add.body.createComment._id);
    console.log("Comment from DB after add:", commentFromDb);
    expect(commentFromDb).toBeDefined();

    const commentId = commentFromDb._id.toString();
    console.log("Using CommentId for update:", commentId);

    // 🔹 List comments
    const list = await request(app).get(`/api/getcomment/${post._id}`);
    console.log("📌 List Comments Status:", list.statusCode);
    console.log("📌 List Comments Response:", list.body);

    expect(list.statusCode).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body[0].comment).toBe("Nice!");

    // 🔹 Update by commenter
    const update = await request(app)
      .put(`/api/update/${commentId}`)
      .set("Authorization", `Bearer ${commenter.token}`)
      .send({ comment: "Updated by owner" });

    console.log("Update Response (commenter):", update.body);
    expect(update.statusCode).toBe(200);
    expect(update.body.comment).toBe("Updated by owner");
    expect(update.body._id).toBe(commentId);

    // 🔹 Update by admin
    const updateByAdmin = await request(app)
      .put(`/api/update/${commentId}`)
      .set("Authorization", `Bearer ${admin.token}`)
      .send({ comment: "Updated by admin" });

    console.log("Update Response (admin):", updateByAdmin.body);
    expect(updateByAdmin.statusCode).toBe(200);
    expect(updateByAdmin.body.comment).toBe("Updated by admin");
    expect(updateByAdmin.body._id).toBe(commentId);

    // 🔹 Delete by commenter
    const del = await request(app)
      .delete(`/api/commentdelete/${commentId}`)
      .set("Authorization", `Bearer ${commenter.token}`);

    console.log("Delete Response (commenter):", del.body);
    expect(del.statusCode).toBe(200);

    // 🔹 Add another comment for admin delete test
    const add2 = await request(app)
      .post(`/api/${post._id}/comment`)
      .set("Authorization", `Bearer ${commenter.token}`)
      .send({ comment: "To be deleted by admin", postId: post._id });

    console.log("Add2 Response:", add2.body);

    const commentFromDb2 = await Comment.findById(add2.body.createComment._id);
    console.log("Comment2 from DB:", commentFromDb2);
    expect(commentFromDb2).toBeDefined();

    const newCommentId = add2.body.createComment._id;

    const deleteByAdmin = await request(app)
      .delete(`/api/commentdelete/${newCommentId}`)
      .set("Authorization", `Bearer ${admin.token}`);

    console.log("Delete Response (admin):", deleteByAdmin.body);
    expect(deleteByAdmin.statusCode).toBe(200);
  });
});
