# Title
Blog API

## Description
RESTful API for a blogging platform.

## Features
-  User Authentication (JWT-based)
-  CRUD Operations for Transactions (Create, Read, Update, Delete)
-  Pagination & Filtering for posts
-  MongoDB Integration for persistent storage
-  Basic security (Helmet, XSS-clean, Mongo-sanitize, Rate limiting)


## Installation & Usage instructions\
'''bash
git clone https://github.com/Don-pizu/blog-api.git

# Navigate into the project folder
cd blog-api

# Install dependencies
npm install

# Start the server
node server.js

project-root/
├── controllers/
     -- authController.js
     -- commentConroller.js
     -- postController.js
├── models/
     -- comment.js
     -- post.js
     -- User.js
├── routes/
     -- authRoutes.js
     -- commentRoutes.js
     -- postRoutes.js
     -- protectedRoutes
├── middleware/
     -- authMiddleware
├── config/
     --db.js
├── tests/
|    -- auth.test.js
     -- comment.test.js
     --post.test.jd
     --setup.js
├── app.js
├── server.js
|__ jest.config.js
|__ swagger.js
|__ .end
├── .env.test
├── .gitignore
├── README.md


## Technologies used
-Node.js
-Express.js
-MongoDB
-JWT Authentication
-Bcrypt.js (password hashing)
-dotenv (environment variables)
-Helmet, Express-rate-limit, Mongo-sanitize, XSS-clean
-Jest
-Swagger


## Author name

-Asiru Adedolapo

## Stage, Commit, and Push**

```bash

git add .
git commit -m "feat: initial project setup with folder structure and README"
git branch -M main
git remote add origin https://github.com/Don-pizu/blog-api.git
git push -u origin main

git commit -m "feat: add jest and update README"
git branch -M main
git remote add origin https://github.com/Don-pizu/blog-api.git
git push -u origin main

git commit -m "feat: Blog api with jest, swagger amd updated README"
git branch -M main
git remote add origin https://github.com/Don-pizu/blog-api.git
git push -u origin main