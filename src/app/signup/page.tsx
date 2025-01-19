'use client';

import { useState } from 'react';
import Input from '../components/Input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BASE_URL } from '../config';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    email: '',
    password: '',
    id: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setLoading(false);
      toast.success('Registration successful!');
      router.push('/login');
    } catch (err: any) {
      setLoading(false);
      toast.error(err.message || 'Something went wrong');
      console.error('Registration error:', err);
    }
  };

  const getIdField = () => {
    if (!formData.role) return null;

    const labels = {
      'Faculty': 'Faculty ID',
      'TA': 'TA ID',
      'Student': 'Student ID'
    };

    return (
      <Input
        label={labels[formData.role as keyof typeof labels]}
        id="id"
        value={formData.id}
        onChange={handleChange}
        placeholder={`Enter your ${labels[formData.role as keyof typeof labels]}`}
      />
    );
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

            {getIdField()}

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
              placeholder="Create a password"
            />

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
        <div className="max-md:hidden">
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
