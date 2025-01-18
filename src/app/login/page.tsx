'use client';

import { useState } from 'react';
import Input from '../components/Input';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    role: '',
    id: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-6 px-4 bg-white">
      <div className="grid md:grid-cols-2 items-center gap-6 max-w-6xl w-full">
        <div className="border border-gray-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-8">
              <h3 className="text-gray-800 text-3xl font-bold">Sign in</h3>
              <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                Sign in to your account and explore a world of possibilities.
              </p>
            </div>

            <div className="mb-4">
              <label className="text-gray-800 text-sm mb-2 block">Select Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full text-sm text-gray-800 border border-gray-300 pl-4 pr-10 py-3 rounded-lg outline-purple-600"
                required
              >
                <option value="">Select a role</option>
                <option value="Faculty">Faculty</option>
                <option value="TA">TA</option>
                <option value="Student">Student</option>
              </select>
            </div>

            {formData.role && (
              <Input
                label={`${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} ID`}
                id="id"
                value={formData.id}
                onChange={handleChange}
                placeholder={`Enter your ${formData.role} ID`}
              />
            )}

            <Input
              label="Email"
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

            <Input
              label="Password"
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 shrink-0 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-800">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="/forgot-password" className="text-purple-600 hover:underline font-semibold">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="!mt-8">
              <button
                type="submit"
                className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold tracking-wide rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none transition-colors duration-200"
              >
                Sign in
              </button>
            </div>

            <p className="text-sm !mt-8 text-center text-gray-500">
              Don't have an account?
              <a href="/signup" className="text-purple-600 font-semibold hover:underline ml-1 whitespace-nowrap">
                Register here
              </a>
            </p>
          </form>
        </div>
        <div className="max-md:mt-8">
          <img
            src="https://readymadeui.com/login-image.webp"
            className="w-full aspect-[71/50] max-md:w-4/5 mx-auto block object-cover rounded-lg"
            alt="Login"
          />
        </div>
      </div>
    </div>
  );
}
