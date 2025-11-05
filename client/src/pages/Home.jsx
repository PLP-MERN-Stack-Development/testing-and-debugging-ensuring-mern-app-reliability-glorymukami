import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Welcome to MERN Testing App
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        A comprehensive MERN stack application with testing and debugging features
      </p>
      
      {isAuthenticated ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-green-800 mb-2">
            Welcome back, {user.username}!
          </h2>
          <p className="text-green-600 mb-4">
            You're successfully logged in and can access all features.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/posts">
              <Button>Browse Posts</Button>
            </Link>
            <Link to="/create-post">
              <Button variant="secondary">Create Post</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-blue-800 mb-2">
            Get Started
          </h2>
          <p className="text-blue-600 mb-4">
            Please log in or register to access all features.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/login">
              <Button>Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary">Register</Button>
            </Link>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Backend Testing</h3>
          <p className="text-gray-600">
            Comprehensive unit and integration tests for Express.js API with MongoDB
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Frontend Testing</h3>
          <p className="text-gray-600">
            React component testing with Jest and React Testing Library
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">E2E Testing</h3>
          <p className="text-gray-600">
            End-to-end testing with Cypress for critical user flows
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
