# GradePro - Intelligent Academic Grading Platform

GradePro is a modern, intelligent grading platform designed to streamline the academic assessment process for students, teaching assistants, and faculty members. Built with Next.js and featuring a clean, intuitive interface, GradePro makes assignment submission and grading more efficient and transparent.

## Features

### For Students
- **Dashboard Overview**: View all enrolled courses and assignment statuses at a glance
- **Assignment Management**:
  - View pending and submitted assignments
  - Upload assignments with support for multiple file formats (PDF, DOC, DOCX)
  - Real-time submission status updates
  - Track grades and feedback for submitted work

### For Teaching Assistants (TAs)
- **Assignment Review**:
  - Access to submitted assignments
  - Provide detailed feedback and grades
  - Track grading progress
- **Evaluation Tools**:
  - Streamlined grading interface
  - Batch processing capabilities
  - Comment templates for common feedback

### For Faculty
- **Course Management**:
  - Create and manage courses
  - Set up assignments with due dates
  - Monitor student progress
  - Oversee TA grading activities

### General Features
- **Modern UI/UX**: Clean, responsive interface built with Tailwind CSS
- **Real-time Updates**: Instant status updates for submissions and grades
- **Role-based Access**: Secure access control for students, TAs, and faculty
- **File Support**: Handles multiple document formats up to 10MB
- **Status Tracking**: Visual indicators for assignment status (pending, submitted, graded)

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Heroicons
- **State Management**: React Hooks
- **UI Components**: Custom components with modern design patterns
- **Authentication**: [Add authentication details if implemented]

## Getting Started

1. **Prerequisites**:
   - Node.js 18+ installed
   - npm or yarn package manager

2. **Installation**:
   ```bash
   # Clone the repository
   git clone https://github.com/Jasharaj/AI-Grading-Platform.git
   
   # Navigate to project directory
   cd AI-Grading-Platform
   
   # Install dependencies
   npm install
   ```

3. **Development**:
   ```bash
   # Run development server
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

4. **Build**:
   ```bash
   # Create production build
   npm run build
   
   # Start production server
   npm start
   ```

## Project Structure

```
src/
├── app/
│   ├── components/    # Reusable UI components
│   ├── faculty/      # Faculty-specific pages
│   ├── student/      # Student-specific pages
│   ├── ta/          # TA-specific pages
│   └── store/       # State management
├── public/          # Static assets
└── styles/         # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

[Add your license information]

## Contact

[Add contact information]

---

Built with ❤️ for the Formidium DevFest 4.0 Goa
