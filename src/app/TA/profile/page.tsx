'use client';

export default function Profile() {
  const profile = {
    name: 'Alex Johnson',
    taId: 'TA2024001',
    email: 'alex.johnson@university.edu',
    department: 'Computer Science',
    joinedDate: 'January 2024',
    courses: ['CS101', 'CS202', 'CS303'],
    expertise: ['Programming', 'Data Structures', 'Databases'],
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-600">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
              <p className="text-gray-600">Teaching Assistant</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">TA ID</h3>
                <p className="mt-1 text-gray-800">{profile.taId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-gray-800">{profile.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Department</h3>
                <p className="mt-1 text-gray-800">{profile.department}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Joined Date</h3>
                <p className="mt-1 text-gray-800">{profile.joinedDate}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Assigned Courses</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.courses.map((course) => (
                    <span
                      key={course}
                      className="px-3 py-1 text-sm bg-purple-100 text-purple-600 rounded-full"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Areas of Expertise</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.expertise.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
