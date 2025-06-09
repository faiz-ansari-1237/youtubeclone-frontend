// src/components/SignInPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignInPage = ({ onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response, data;
      if (isSignUp) {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('channelName', channelName);
        if (profilePicture) formData.append('profilePicture', profilePicture);

        response = await fetch('https://youtubeclone-backend-b4m2.onrender.com/api/auth/signup', {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch('https://youtubeclone-backend-b4m2.onrender.com/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      }
      try {
        data = await response.json();
      } catch (err) {
        alert('Server error: Invalid response');
        return;
      }
      if (!response.ok) {
        alert(data.message || (isSignUp ? 'Signup failed' : 'Signin failed'));
        return;
      }
      // Save user and token to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      onSignIn({ ...data.user, token: data.token });
      navigate('/');
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {isSignUp ? 'Sign Up to YouTube Clone' : 'Sign In to YouTube Clone'}
        </h2>
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {isSignUp && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                id="username"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}
          {isSignUp && (
            <div>
              <label htmlFor="channelName" className="block text-sm font-medium text-gray-700 mb-1">Channel Name</label>
              <input
                type="text"
                id="channelName"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your YouTube Channel Name"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                required
              />
            </div>
          )}
          {isSignUp && (
            <div>
              <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
              <input
                type="file"
                name="profilePicture"
                onChange={e => setProfilePicture(e.target.files[0])}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            disabled={loading}
          >
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}
          <span
            className="text-blue-600 cursor-pointer hover:underline ml-1"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
