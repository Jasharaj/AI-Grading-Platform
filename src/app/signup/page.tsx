'use client';

import { useState } from 'react';
import Input from '../components/Input';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    email: '',
    password: '',
    facultyId: '',
    taId: '',
    studentId: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // Add your signup logic here
  };

  const getIdField = () => {
    switch (formData.role) {
      case 'Faculty':
        return (
          <Input
            label="Faculty ID"
            id="facultyId"
            value={formData.facultyId}
            onChange={handleChange}
            placeholder="Enter your Faculty ID"
          />
        );
      case 'TA':
        return (
          <Input
            label="TA ID"
            id="taId"
            value={formData.taId}
            onChange={handleChange}
            placeholder="Enter your TA ID"
          />
        );
      case 'Student':
        return (
          <Input
            label="Student ID"
            id="studentId"
            value={formData.studentId}
            onChange={handleChange}
            placeholder="Enter your Student ID"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-6 px-4 bg-white">
      <div className="grid md:grid-cols-2 items-center gap-6 max-w-6xl w-full">
        <div className="border border-gray-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-8">
              <h3 className="text-gray-800 text-3xl font-bold">Create Account</h3>
              <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                Join us and start your journey with our platform.
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

            {formData.role && getIdField()}

            <Input
              label="Name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />

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

            <div className="!mt-8">
              <button
                type="submit"
                className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold tracking-wide rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none transition-colors duration-200"
              >
                Create Account
              </button>
            </div>

            <p className="text-sm !mt-8 text-center text-gray-500">
              Already have an account?
              <Link href="/login" className="text-purple-600 font-semibold hover:underline ml-1 whitespace-nowrap">
                Sign in here
              </Link>
            </p>
          </form>
        </div>
        <div className="max-md:mt-8">
          <img
            src="https://readymadeui.com/login-image.webp"
            className="w-full aspect-[71/50] max-md:w-4/5 mx-auto block object-cover rounded-lg"
            alt="Signup"
          />
        </div>
      </div>
    </div>
  );
}
