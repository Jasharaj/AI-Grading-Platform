'use client';

import React, { useState } from 'react';
import { Card } from '@/app/components/common/Card';
import { Button } from '@/app/components/common/Button';
import { Input } from '@/app/components/common/Input';

export default function FacultyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Dr. John Peterson',
    email: 'john.peterson@university.edu',
    department: 'Computer Science',
    position: 'Professor of Computer Science'
  });

  const handleSave = () => {
    // Here you would typically save the changes to your backend
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Faculty Profile</h1>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          variant={isEditing ? "primary" : "secondary"}
          className={isEditing ? "bg-purple-600 hover:bg-purple-700" : "text-purple-600 border-purple-600 hover:bg-purple-50"}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>
      
      <Card className="border-purple-100">
        <div className="flex items-center space-x-6 mb-6">
          <div className="h-24 w-24 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
            <span className="text-3xl font-semibold text-white">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-black">{profile.name}</h2>
            <p className="text-purple-600">{profile.position}</p>
            <p className="text-purple-600">{profile.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-black">Personal Information</h3>
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              disabled={!isEditing}
              className="focus:border-purple-500 focus:ring-purple-500"
            />
            <Input
              label="Email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              disabled={!isEditing}
              className="focus:border-purple-500 focus:ring-purple-500"
            />
            <Input
              label="Department"
              value={profile.department}
              onChange={(e) => setProfile({...profile, department: e.target.value})}
              disabled={!isEditing}
              className="focus:border-purple-500 focus:ring-purple-500"
            />
            <Input
              label="Position"
              value={profile.position}
              onChange={(e) => setProfile({...profile, position: e.target.value})}
              disabled={!isEditing}
              className="focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
