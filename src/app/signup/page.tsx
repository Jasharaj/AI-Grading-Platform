'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import InputField from '../components/InputField';

type Role = 'Faculty' | 'TA' | 'Student';

const SignupPage = () => {
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

  return (
    <div className="font-[sans-serif]">
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="grid lg:grid-cols-2 items-center gap-6 max-w-6xl max-lg:max-w-lg w-full">
          <form onSubmit={handleSubmit} className="lg:max-w-md w-full">
            <h3 className="text-gray-800 text-2xl font-bold mb-8">Create an account</h3>
            <div className="space-y-6">
              <div>
                <label className="text-gray-800 text-sm mb-2 block">Select Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 focus:bg-transparent border border-gray-100 focus:border-purple-600 outline-none transition-all"
                >
                  <option value="">Select a role</option>
                  <option value="Faculty">Faculty</option>
                  <option value="TA">TA</option>
                  <option value="Student">Student</option>
                </select>
              </div>

              {formData.role === 'Faculty' && (
                <InputField
                  label="Faculty ID"
                  name="facultyId"
                  type="text"
                  placeholder="Enter your Faculty ID"
                  value={formData.facultyId}
                  onChange={handleChange}
                />
              )}

              {formData.role === 'TA' && (
                <InputField
                  label="TA ID"
                  name="taId"
                  type="text"
                  placeholder="Enter your TA ID"
                  value={formData.taId}
                  onChange={handleChange}
                />
              )}

              {formData.role === 'Student' && (
                <InputField
                  label="Student ID"
                  name="studentId"
                  type="text"
                  placeholder="Enter your Student ID"
                  value={formData.studentId}
                  onChange={handleChange}
                />
              )}

              <InputField
                label="Name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />

              <InputField
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />

              <InputField
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-3 px-6 text-sm text-white tracking-wide bg-purple-600 hover:bg-purple-700 focus:outline-none rounded-md transition-colors"
              >
                Register
              </button>
            </div>
            <p className="text-sm text-gray-800 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-600 font-semibold hover:underline ml-1">
                Login here
              </Link>
            </p>
          </form>

          <div className="h-full">
            <img
              src="https://readymadeui.com/login-image.webp"
              className="w-full h-full object-contain aspect-[628/516]"
              alt="login img"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
