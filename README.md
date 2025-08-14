# GradePro - Next-Gen Assignment Grading Platform

## Overview
GradePro is an innovative assignment grading platform developed for Formidium DevFest 4.0 Goa. It streamlines the academic workflow between students, teaching assistants, and faculty members through an intuitive interface and efficient grading system.

## Key Features

### Student Portal
- View and track assignments across all courses
- Upload assignments in multiple formats (PDF, DOC, DOCX)
- Real-time submission status tracking
- View grades and feedback
- User-friendly dashboard with course overview

### Teaching Assistant (TA) Interface
- Access and review student submissions
- Provide grades and detailed feedback
- Track grading progress
- Efficient batch processing of assignments

### Faculty Dashboard
- Course management and assignment creation
- Monitor submission and grading progress
- Oversee TA activities
- Generate course performance reports

## Technical Stack
- **Frontend**: Next.js 14 with TypeScript
- **Backend**: Node.js/Express API (deployed on Render)
- **UI Framework**: Tailwind CSS
- **Icons**: Heroicons
- **State Management**: React Context & Hooks
- **File Handling**: Cloudinary for file uploads and storage
- **Authentication**: JWT-based authentication

## Backend Configuration
This frontend connects to a deployed backend service:
- **Production API**: `your_production_url`
- **Environment Variables**: Configured via `.env.local`

### Environment Setup
Create a `.env.local` file in the root directory:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=your_production_url

# Cloudinary Configuration (optional)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
```

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Git for cloning the repository

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Jasharaj/AI-Grading-Platform.git

# Navigate to the frontend directory
cd frontend-grading

# Install dependencies
npm install

# Create environment file (see Backend Configuration above)
cp .env.local.example .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the application in action.

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Project Structure
```
/src
  /app
    /components      # Reusable UI components
      /auth         # Authentication components
      /common       # Shared UI components
      /faculty      # Faculty-specific components
    /faculty        # Faculty dashboard and features
    /student        # Student portal
    /TA            # Teaching Assistant interface
    /utils         # Utility functions (Cloudinary, etc.)
    config.js      # API configuration
    globals.css    # Global styles
```

## API Integration
All API calls have been migrated to use the production backend:
- Base URL: `https://backend-grading-a4r2.onrender.com`
- Authentication: JWT tokens stored in localStorage
- Error handling: Comprehensive error boundaries and user feedback
- File uploads: Integrated with Cloudinary for document storage

## Recent Updates
- ✅ Migrated all API endpoints from localhost to production backend
- ✅ Updated environment configuration for deployment
- ✅ Added comprehensive error handling and loading states
- ✅ Implemented modern UI components with Tailwind CSS
- ✅ Enhanced authentication flow across all user roles

## Features in Development
- AI-powered grading assistance
- Plagiarism detection
- Advanced analytics dashboard
- Mobile responsive design
- Real-time notifications

## Deployment
This project is configured to work with the production backend at `https://backend-grading-a4r2.onrender.com`.

### Deploy to Vercel
1. Fork this repository
2. Connect to Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL=https://backend-grading-a4r2.onrender.com`
4. Deploy

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `out` folder to Netlify
3. Configure environment variables in Netlify dashboard

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
[MIT License](LICENSE)

---
Built with ❤️ for the Formidium DevFest 4.0 Goa
