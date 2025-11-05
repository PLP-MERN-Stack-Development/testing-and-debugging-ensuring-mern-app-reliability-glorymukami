import User from '../../src/models/User.js';
import bcrypt from 'bcryptjs';

describe('User Model', () => {
  const userData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  };

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('User Creation', () => {
    it('should create a new user successfully', async () => {
      const user = await User.create(userData);
      
      expect(user._id).toBeDefined();
      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // Should be hashed
      expect(user.role).toBe('user');
    });

    it('should hash password before saving', async () => {
      const user = await User.create(userData);
      
      const isPasswordHashed = await bcrypt.compare(userData.password, user.password);
      expect(isPasswordHashed).toBe(true);
    });

    it('should not include password in JSON output', async () => {
      const user = await User.create(userData);
      const userJson = user.toJSON();
      
      expect(userJson.password).toBeUndefined();
    });

    it('should validate email format', async () => {
      const invalidUserData = {
        ...userData,
        email: 'invalid-email'
      };

      await expect(User.create(invalidUserData)).rejects.toThrow();
    });

    it('should require unique email and username', async () => {
      await User.create(userData);
      
      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe('Password Comparison', () => {
    it('should compare password correctly', async () => {
      const user = await User.create(userData);
      
      const isValid = await user.comparePassword(userData.password);
      expect(isValid).toBe(true);
    });

    it('should return false for wrong password', async () => {
      const user = await User.create(userData);
      
      const isValid = await user.comparePassword('wrongpassword');
      expect(isValid).toBe(false);
    });
  });

  describe('Validation', () => {
    it('should require username', async () => {
      const invalidUser = { ...userData, username: undefined };
      await expect(User.create(invalidUser)).rejects.toThrow();
    });

    it('should require email', async () => {
      const invalidUser = { ...userData, email: undefined };
      await expect(User.create(invalidUser)).rejects.toThrow();
    });

    it('should require password', async () => {
      const invalidUser = { ...userData, password: undefined };
      await expect(User.create(invalidUser)).rejects.toThrow();
    });

    it('should validate username length', async () => {
      const invalidUser = { ...userData, username: 'ab' };
      await expect(User.create(invalidUser)).rejects.toThrow();
    });

    it('should validate password length', async () => {
      const invalidUser = { ...userData, password: '123' };
      await expect(User.create(invalidUser)).rejects.toThrow();
    });
  });
});
