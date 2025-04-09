import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// const api_url = import.meta.env.VITE_API;

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (redirect) {
      navigate('/Landing');
    }
  }, [redirect, navigate]);

  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
    const response = await fetch("http://localhost:3000/login", {
      method: 'POST',
      body: JSON.stringify({ username: formData.username, password: formData.password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', 
    });

    if (response.ok) {
    setRedirect(true);
    } else {
    setMessage("Wrong details. Try again.");
    }
    } catch (err) {
      console.error("Login Error:", err);
      setMessage("An error occurred. Please try again.");
    }
  }

  async function handleSignupSubmit(ev) {
    ev.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: 'POST',
        body: JSON.stringify({ username: formData.username, email: formData.email, password: formData.password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.status === 201) {
        setMessage("Registration successful!");
      } else {
        setMessage("Registration failed.");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setMessage("An error occurred. Please try again.");
    }
  }

  // Toggle Between Login and Signup
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        
        {/* Logo/Brand */}
        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">Launcher - App</h1>
          <p className="text-gray-500 text-sm mt-1">Launch Apps instantly</p>
        </div>

        {/* Toggle Button */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-1 rounded-xl w-full">
            <button
              onClick={toggleForm}
              className={`w-1/2 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                isLogin 
                  ? 'bg-white text-indigo-600 shadow-md' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={toggleForm}
              className={`w-1/2 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                !isLogin 
                  ? 'bg-white text-pink-600 shadow-md' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {message && (
          <div className="py-2 px-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
            <p>{message}</p>
          </div>
        )}

        {/* Login Form */}
        {isLogin ? (
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-gradient-to-r from-indigo-600 to-blue-500 rounded-lg hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 transform hover:-translate-y-0.5"
              >
                Login
              </button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-500">
              <a href="#" className="text-indigo-600 hover:text-indigo-800">Forgot password?</a>
            </div>
          </div>
        ) : (
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
            <form onSubmit={handleSignupSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Choose a username"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Create a password"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-gradient-to-r from-pink-600 to-rose-500 rounded-lg hover:from-pink-700 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300 transform hover:-translate-y-0.5"
              >
                Sign Up
              </button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-500">
              By signing up, you agree to our <a href="#" className="text-pink-600 hover:text-pink-800">Terms</a> and <a href="#" className="text-pink-600 hover:text-pink-800">Privacy Policy</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
