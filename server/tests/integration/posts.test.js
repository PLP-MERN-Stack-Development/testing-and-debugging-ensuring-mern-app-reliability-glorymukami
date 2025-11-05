import request from 'supertest';
import app from '../../src/app.js';
import User from '../../src/models/User.js';
import Post from '../../src/models/Post.js';
import { generateToken } from '../../src/utils/auth.js';

describe('Posts API Integration Tests', () => {
  let token;
  let userId;
  let postId;

  beforeAll(async () => {
    // Create a test user
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    userId = user._id;
    token = generateToken(user);
  });

  beforeEach(async () => {
    // Create a test post before each test that needs it
    const post = await Post.create({
      title: 'Test Post',
      content: 'This is a test post content for integration testing',
      author: userId,
      slug: 'test-post-integration'
    });
    postId = post._id;
  });

  afterEach(async () => {
    // Clean up posts after each test
    await Post.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
  });

  describe('GET /api/posts', () => {
    it('should return all posts', async () => {
      const res = await request(app).get('/api/posts');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('posts');
      expect(Array.isArray(res.body.posts)).toBe(true);
      expect(res.body.posts.length).toBeGreaterThan(0);
    });

    it('should paginate results', async () => {
      const res = await request(app).get('/api/posts?page=1&limit=5');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('currentPage', 1);
      expect(res.body).toHaveProperty('totalPages');
      expect(res.body).toHaveProperty('total');
    });
  });

  describe('GET /api/posts/:id', () => {
    it('should return a post by ID', async () => {
      const res = await request(app).get(`/api/posts/${postId}`);
      
      expect(res.status).toBe(200);
      expect(res.body.post._id).toBe(postId.toString());
      expect(res.body.post.title).toBe('Test Post');
    });

    it('should return 404 for non-existent post', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011'; // Valid ObjectId but doesn't exist
      const res = await request(app).get(`/api/posts/${nonExistentId}`);
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/posts', () => {
    it('should create a new post when authenticated', async () => {
      const newPost = {
        title: 'New Integration Test Post',
        content: 'This is content for integration test post',
        tags: ['test', 'integration']
      };

      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send(newPost);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Post created successfully');
      expect(res.body.post).toHaveProperty('_id');
      expect(res.body.post.title).toBe(newPost.title);
      expect(res.body.post.content).toBe(newPost.content);
      expect(res.body.post.author).toBe(userId.toString());
    });

    it('should return 401 if not authenticated', async () => {
      const newPost = {
        title: 'Unauthorized Post',
        content: 'This should not be created'
      };

      const res = await request(app)
        .post('/api/posts')
        .send(newPost);

      expect(res.status).toBe(401);
    });

    it('should return 400 if validation fails', async () => {
      const invalidPost = {
        // Missing title and content
        tags: ['test']
      };

      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidPost);

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/posts/:id', () => {
    it('should update a post when authenticated as author', async () => {
      const updates = {
        title: 'Updated Integration Test Post',
        content: 'This content has been updated during integration test'
      };

      const res = await request(app)
        .put(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates);

      expect(res.status).toBe(200);
      expect(res.body.post.title).toBe(updates.title);
      expect(res.body.post.content).toBe(updates.content);
    });

    it('should return 401 if not authenticated', async () => {
      const updates = { title: 'Unauthorized Update' };

      const res = await request(app)
        .put(`/api/posts/${postId}`)
        .send(updates);

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('should delete a post when authenticated as author', async () => {
      const res = await request(app)
        .delete(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Post deleted successfully');

      // Verify the post is actually deleted
      const deletedPost = await Post.findById(postId);
      expect(deletedPost).toBeNull();
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .delete(`/api/posts/${postId}`);

      expect(res.status).toBe(401);
    });
  });
});
