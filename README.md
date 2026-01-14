# 🔬 FacialDerma AI - Frontend

![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-06B6D4?logo=tailwindcss)
![Node.js](https://img.shields.io/badge/Node.js-16%2B-green?logo=node.js)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation Guide](#installation-guide)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Components Overview](#components-overview)
- [Routing](#routing)
- [Available Scripts](#available-scripts)
- [Configuration](#configuration)
- [Features Details](#features-details)
- [User Roles & Permissions](#user-roles--permissions)
- [API Integration](#api-integration)
- [Styling & UI](#styling--ui)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)
- [Live Preview](#live-preview)
- [Contact & Support](#contact--support)

---

## 🎯 Overview

**FacialDerma AI** is a comprehensive AI-powered web application designed to analyze facial skin conditions, provide personalized treatment recommendations, and offer aesthetic enhancement suggestions. The frontend is built with **React.js** and styled with **Tailwind CSS**, providing an intuitive user experience for patients, dermatologists, and administrators.

The platform leverages cutting-edge machine learning and dermatological science to empower users to take charge of their skin health. It enables patients to upload facial images for analysis, receive AI-powered diagnostic results, and connect with professional dermatologists for consultations.

---

## 🚀 Key Features

### 🤖 AI-Powered Analysis
- **Facial Image Analysis**: Upload facial images for AI-powered skin condition detection
- **Automated Detection**: Machine learning models identify dermatological conditions
- **Confidence Scoring**: Get probability scores for detected conditions
- **Multi-condition Detection**: Identify multiple skin conditions in a single image

### 📊 Comprehensive Reports
- **Detailed Analysis Reports**: Generate PDF reports with findings and recommendations
- **Treatment Suggestions**: AI-recommended treatment plans based on condition
- **Progress Tracking**: Track skin condition improvements over time
- **Report History**: Access all previous analysis reports

### 👥 Multi-Role System
- **Patient Dashboard**: View analysis history, manage profile, book consultations
- **Dermatologist Portal**: Review patient cases, provide professional insights, manage consultations
- **Admin Dashboard**: Manage users, moderate content, system analytics

### 🔒 Security & Privacy
- **Secure Authentication**: Email/password authentication with OTP verification
- **Data Encryption**: HTTPS/SSL encryption for all data transmission
- **Privacy First**: User data is securely stored and processed
- **Email Verification**: Two-factor authentication via OTP

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Camera Integration**: Direct camera access for image capture
- **Image Cropping**: Built-in image editor for optimal analysis
- **Real-time Notifications**: Get instant updates on consultations and responses
- **Dark/Light Mode Support**: Enhanced visual comfort

### 🗺️ Location Services
- **Find Dermatologists**: Locate nearest dermatology clinics on interactive map
- **Distance Calculation**: View distance to nearby clinics
- **Clinic Information**: Access clinic details and contact information

### 💬 Communication
- **Support Tickets**: Create and track support requests
- **Activity Log**: View all account activities and consultation history
- **Real-time Notifications**: Get notified about new messages and updates
- **FAQ Section**: Comprehensive FAQ for common questions

### 🔄 Additional Features
- **Account Management**: Update profile information and password
- **Treatment Management**: Track ongoing treatments and medications
- **Email Recovery**: Password reset through email verification
- **Role-Based Access**: Content and features vary by user role
- **Account Suspension Handling**: Automatic suspension checks for inactive accounts

---

## 💻 Technology Stack

### Frontend Core
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.1.0 | UI library and component framework |
| **React Router DOM** | 7.5.3 | Client-side routing |
| **React DOM** | 19.1.0 | React rendering engine |

### Styling & UI
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Tailwind CSS** | 3.x | Utility-first CSS framework |
| **PostCSS** | Latest | CSS preprocessing |
| **React Bootstrap** | 2.10.9 | Bootstrap components for React |
| **Lucide React** | 0.507.0 | Beautiful SVG icons |
| **Hero Icons** | 2.2.0 | Hero icon library |
| **React Icons** | 5.5.0 | Popular icon sets |

### State Management & Data
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Axios** | 1.9.0 | HTTP client for API requests |
| **Firebase** | 12.7.0 | Backend services and authentication |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing |

### UI Components & Animation
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Framer Motion** | 12.23.24 | Advanced animations and transitions |
| **React Hot Toast** | 2.6.0 | Toast notifications |
| **React Toastify** | 11.0.5 | Toast notification library |
| **React Loader Spinner** | 6.1.6 | Loading spinners |
| **React Spinners** | 0.17.0 | CSS spinners for React |
| **Lottie React** | 0.17.8 | Lottie animation support |

### Image & Media
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React Webcam** | 7.2.0 | Webcam access for image capture |
| **React Easy Crop** | 5.5.6 | Image cropping functionality |
| **React Dropzone** | 14.3.8 | File upload and drag-drop |

### PDF & Reporting
| Technology | Version | Purpose |
|-----------|---------|---------|
| **jsPDF** | 3.0.3 | PDF generation |
| **jsPDF AutoTable** | 5.0.2 | Table generation in PDFs |

### Maps & Location
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Leaflet** | 1.9.4 | Interactive map library |
| **React Leaflet** | 5.0.0 | React bindings for Leaflet |
| **React Google Maps API** | 2.20.7 | Google Maps integration |

### AI & Machine Learning
| Technology | Version | Purpose |
|-----------|---------|---------|
| **TensorFlow.js** | 4.22.0 | Machine learning in browser |

### Utilities
| Technology | Version | Purpose |
|-----------|---------|---------|
| **JS Cookie** | 3.0.5 | Cookie management |
| **Hamburger React** | 2.5.2 | Mobile menu icon |
| **React Responsive** | 10.0.1 | Responsive design utilities |
| **Disposable Email Domains** | 1.0.62 | Email validation |

### Testing
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React Testing Library** | 16.3.0 | Component testing |
| **Jest** | Included | Test runner |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v8.0.0 or higher) - Comes with Node.js
- **Git** (for cloning the repository) - [Download](https://git-scm.com/)
- **A code editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)
- **A modern web browser** (Chrome, Firefox, Safari, or Edge)

### Verify Installation

Open your terminal and run:

```bash
node --version   # Should show v16.0.0 or higher
npm --version    # Should show v8.0.0 or higher
git --version    # Should show git version
```

---

## 🔧 Installation Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/Asad-Zaidi/FacialDerma_AI.git
cd FacialDerma_AI
```

### Step 2: Navigate to Frontend Directory

```bash
# Make sure you're in the frontend directory
cd src
# Or if the structure is different, ensure you're where package.json is located
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install all the required packages listed in `package.json`. The installation process may take a few minutes.

### Step 4: Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_ENDPOINT=http://localhost:5000/api

# Firebase Configuration (if applicable)
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Google Maps API (if applicable)
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Application Configuration
REACT_APP_NODE_ENV=development
```

Replace the placeholder values with your actual configuration details.

### Step 5: Verify Installation

```bash
npm list react
npm list react-router-dom
```

---

## ▶️ Running the Application

### Development Mode

To run the application in development mode with hot-reloading:

```bash
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

If it doesn't open automatically, manually navigate to `http://localhost:3000` in your web browser.

### Production Build

To create an optimized production build:

```bash
npm run build
```

This will create a `build/` directory containing the optimized production files. The build process optimizes assets, minifies code, and prepares the application for deployment.

### Run Tests

To run the test suite:

```bash
npm test
```

This will launch the test runner in interactive mode. You can run all tests with:

```bash
npm test -- --coverage
```

---

## 📁 Project Structure

```
FacialDerma_AI/
├── public/                          # Static files
│   ├── index.html                   # Main HTML file
│   ├── manifest.json                # PWA manifest
│   ├── robots.txt                   # SEO robots file
│   └── Assets/                      # Static images and assets
├── src/
│   ├── index.js                     # React entry point
│   ├── index.css                    # Global styles
│   ├── App.js                       # Main App component and routing
│   ├── App.css                      # App-level styles
│   ├── App.test.js                  # App component tests
│   ├── reportWebVitals.js           # Performance monitoring
│   │
│   ├── api/                         # API integration
│   │   ├── api.js                   # Main API endpoints
│   │   └── tempapi.js               # Temporary/test API
│   │
│   ├── components/                  # Reusable React components
│   │   ├── ActivityLog.jsx          # User activity history
│   │   ├── Auth.jsx                 # Login/Signup component
│   │   ├── CameraCapture.jsx        # Webcam capture functionality
│   │   ├── ChangePassword.jsx       # Password change form
│   │   ├── ConfirmSignout.jsx       # Logout confirmation modal
│   │   ├── DermatologistPicker.jsx  # Select dermatologist
│   │   ├── DiseaseLikelihood.jsx    # Disease probability display
│   │   ├── EmailVerification.jsx    # Email verification component
│   │   ├── EmailVerificationOTPModal.jsx # OTP verification modal
│   │   ├── ForgotPassword.jsx       # Password recovery component
│   │   ├── ImageCropModal.jsx       # Image cropping tool
│   │   ├── LogoutButton.jsx         # Logout button component
│   │   ├── NearestDermatologyMap.jsx # Maps for finding clinics
│   │   ├── Notifications.jsx        # Notification center
│   │   ├── PatientReviewModal.jsx   # Patient case review modal
│   │   ├── PdfReportGenerator.jsx   # PDF report generation
│   │   ├── ReviewPreviewModal.jsx   # Review preview
│   │   ├── RoleSelect.jsx           # User role selection
│   │   ├── SmartHome.jsx            # Smart home/landing component
│   │   ├── SupportTickets.jsx       # Support ticket management
│   │   ├── SuspensionCheck.jsx      # Account suspension check
│   │   ├── TreatmentManagement.jsx  # Treatment tracking
│   │   ├── TreatmentSuggestions.jsx # AI treatment recommendations
│   │   ├── UpdateProfilePopup.jsx   # Profile update modal
│   │   └── ui/                      # UI subcomponents
│   │       ├── AnimatedCheck.jsx    # Animated checkmark
│   │       ├── DropDown.jsx         # Dropdown component
│   │       └── redMarkerIcon.js     # Custom map marker
│   │
│   ├── contexts/                    # React Context for state management
│   │   └── AuthContext.js           # Authentication context
│   │
│   ├── hooks/                       # Custom React hooks
│   │   └── useEmailValidator.js     # Email validation hook
│   │
│   ├── lib/                         # Utility libraries
│   │   ├── api.js                   # API utility functions
│   │   └── passwordValidation.js    # Password validation rules
│   │
│   ├── Nav_Bar/                     # Navigation components
│   │   ├── Header.jsx               # Header/Top navigation
│   │   ├── Footer.jsx               # Footer component
│   │   └── NavBar.jsx               # Main navigation bar
│   │
│   ├── Pages/                       # Full page components
│   │   ├── Home.jsx                 # Home page
│   │   ├── About.jsx                # About page
│   │   ├── Analysis.jsx             # Skin analysis page (patients)
│   │   ├── Admin.jsx                # Admin dashboard
│   │   ├── ContactSupport.jsx       # Support contact page
│   │   ├── DermatologistHome.jsx    # Dermatologist dashboard
│   │   ├── DermatologistProfile.jsx # Dermatologist profile
│   │   ├── FAQ.jsx                  # FAQ page
│   │   └── UserProfile.jsx          # Patient profile page
│   │
│   ├── Routes/                      # Routing components
│   │   └── PrivateRoutes.jsx        # Protected route wrapper
│   │
│   ├── services/                    # Business logic services
│   │   └── (Service files)
│   │
│   ├── Styles/                      # Global and page styles
│   │   ├── Admin.css                # Admin page styles
│   │   └── MapStyles.css            # Map component styles
│   │
│   └── Assets/                      # Static assets
│       └── treatmentSuggestions.json # Treatment data
│
├── build/                           # Production build (generated)
├── package.json                     # Dependencies and scripts
├── package-lock.json                # Locked dependency versions
├── tailwind.config.js               # Tailwind CSS configuration
├── postcss.config.js                # PostCSS configuration
├── README.md                        # Project documentation
└── .env                             # Environment variables (not in repo)
```

---

## 🧩 Components Overview

### Authentication Components
- **Auth.jsx**: Handles user login and signup with form validation
- **EmailVerification.jsx**: Email verification process
- **EmailVerificationOTPModal.jsx**: OTP modal for email verification
- **ForgotPassword.jsx**: Password recovery workflow
- **ChangePassword.jsx**: Change existing password
- **SuspensionCheck.jsx**: Check for account suspension status

### Dashboard & Profile Components
- **UserProfile.jsx**: Patient profile management
- **DermatologistProfile.jsx**: Dermatologist profile with credentials
- **SmartHome.jsx**: Intelligent landing/home page
- **Analysis.jsx**: Main skin analysis interface
- **DermatologistHome.jsx**: Dermatologist dashboard with patient cases
- **Admin.jsx**: Admin control panel for system management

### Analysis & Reporting Components
- **CameraCapture.jsx**: Real-time webcam capture
- **ImageCropModal.jsx**: Image cropping and editing
- **DiseaseLikelihood.jsx**: Display AI analysis results
- **TreatmentSuggestions.jsx**: AI-generated treatment plans
- **PdfReportGenerator.jsx**: Create downloadable PDF reports
- **PatientReviewModal.jsx**: Review patient cases

### User Interaction Components
- **DermatologistPicker.jsx**: Select dermatologist for consultation
- **NearestDermatologyMap.jsx**: Find nearby dermatology clinics
- **SupportTickets.jsx**: Create and track support tickets
- **ActivityLog.jsx**: View user activity history
- **Notifications.jsx**: Notification center
- **TreatmentManagement.jsx**: Manage ongoing treatments

### UI Components
- **AnimatedCheck.jsx**: Animated checkmark animation
- **DropDown.jsx**: Reusable dropdown component
- **redMarkerIcon.js**: Custom map marker icon

### Navigation Components
- **Header.jsx**: Top header with branding
- **NavBar.jsx**: Main navigation menu
- **Footer.jsx**: Footer with links and info

---

## 🛣️ Routing

The application uses **React Router** for client-side routing. Here's the route structure:

| Path | Component | Access | Description |
|------|-----------|--------|-------------|
| `/` | SmartHome | Public | Landing/home page |
| `/home` | SmartHome | Public | Alternative home route |
| `/about` | About | Public | About the application |
| `/login` | Auth | Public | Login page |
| `/signup` | Auth | Public | User registration |
| `/verify-email` | EmailVerification | Public | Email verification |
| `/forgot-password` | ForgotPassword | Public | Password recovery |
| `/contact-support` | ContactSupport | Public | Support contact |
| `/faq` | FAQ | Public | Frequently asked questions |
| `/profile` | UserProfile | Private (Patients) | Patient profile |
| `/dprofile` | DermatologistProfile | Private (Dermatologists) | Dermatologist profile |
| `/analysis` | Analysis | Private (Patients) | Skin analysis tool |
| `/dermatologist` | DermatologistHome | Private (Dermatologists) | Dermatologist dashboard |
| `/admin` | Admin | Private (Admins) | Admin control panel |

### Private Routes
Protected routes require authentication and specific user roles. Unauthorized access redirects to login.

---

## 📜 Available Scripts

In the project directory, you can run:

### `npm start`
- Runs the app in development mode
- Opens [http://localhost:3000](http://localhost:3000) in the browser
- The page reloads automatically when you make changes
- You will see build errors and lint warnings in the console

### `npm run build`
- Builds the app for production in the `build/` folder
- Correctly bundles React in production mode
- Optimizes the build for the best performance
- The build is minified and filenames include hashes
- Your app is ready to be deployed

### `npm test`
- Launches the test runner in interactive mode
- Watch mode is enabled by default
- Press `a` to run all tests
- Press `f` to run only failed tests
- Press `q` to quit

### `npm run eject`
- **Note: this is a one-way operation. Once you eject, you can't go back!**
- Exposes all configuration files and dependencies
- Use only if you need to customize the build configuration

---

## ⚙️ Configuration

### Tailwind CSS Configuration

The project uses Tailwind CSS for styling. Configuration is in `tailwind.config.js`:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### PostCSS Configuration

PostCSS is configured in `postcss.config.js` to process Tailwind CSS:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### API Configuration

The application is configured to communicate with the backend API via a proxy:

```json
// package.json
"proxy": "http://localhost:5000"
```

This means API calls to `/api/*` are forwarded to `http://localhost:5000/api/*`

---

## ✨ Features Details

### 1. 🤖 AI-Powered Skin Analysis
- Upload or capture facial images
- Machine learning model analyzes the image
- Identifies multiple dermatological conditions
- Returns confidence scores for each condition
- Provides severity assessment

### 2. 📊 Comprehensive Reporting
- Generates detailed analysis reports
- Includes findings, recommendations, and treatment options
- Downloadable PDF reports
- Report history and progress tracking
- Before/after comparison capabilities

### 3. 👨‍⚕️ Dermatologist Consultation
- Browse certified dermatologists
- Schedule appointments/consultations
- Real-time messaging with dermatologists
- Share analysis results with specialists
- Get professional insights and recommendations

### 4. 🗺️ Clinic Locator
- Interactive map showing nearby dermatology clinics
- Filter by specialty and distance
- View clinic information and contact details
- Get directions using Google Maps
- See clinic ratings and reviews

### 5. 💊 Treatment Management
- Track prescribed treatments
- Medication reminders
- Follow-up schedule management
- Progress tracking on treatment effectiveness
- Treatment history

### 6. 🔔 Notifications & Alerts
- Real-time notifications for new messages
- Appointment reminders
- Analysis result notifications
- Activity notifications
- Customizable notification preferences

### 7. 🆔 Multi-Role Authentication
- **Patient**: Can upload images, receive analysis, consult dermatologists
- **Dermatologist**: Can review cases, provide professional feedback, manage consultations
- **Admin**: Can manage users, moderate content, view analytics

### 8. 👤 Profile Management
- Update personal information
- Change password
- Manage preferences
- View activity history
- Delete account (if applicable)

### 9. 📞 Customer Support
- Create support tickets
- Track ticket status
- Chat with support team
- FAQ section for self-service help
- Community forum (if available)

### 10. 🔐 Security Features
- Secure authentication with password hashing
- OTP verification for critical actions
- Session management
- HTTPS/SSL encryption
- Rate limiting on API requests
- Input validation and sanitization

---

## 👥 User Roles & Permissions

### 1. **Patient Role**
**Capabilities:**
- Create account and manage profile
- Upload/capture facial images
- Receive AI-powered analysis
- View detailed reports and recommendations
- Book consultations with dermatologists
- Track treatment progress
- Access FAQ and support
- View activity logs
- Receive notifications

**Restrictions:**
- Cannot access dermatologist or admin features
- Cannot moderate other users
- Limited access to system analytics

### 2. **Dermatologist Role**
**Capabilities:**
- Create professional profile with credentials
- View patient analysis results
- Provide professional feedback and recommendations
- Manage patient consultations
- Create treatment plans
- Access patient history
- Communicate with patients
- Generate professional reports

**Restrictions:**
- Cannot access admin panel
- Cannot modify other dermatologists' content
- Cannot access other patients' data without consent

### 3. **Admin Role**
**Capabilities:**
- Full system access
- Manage user accounts
- View system analytics
- Moderate content
- Manage dermatologist verification
- View all activity logs
- Configure system settings
- Generate system reports
- Manage support tickets

**Restrictions:**
- Should not access patient data except for moderation
- Should maintain data privacy and security

---

## 🔌 API Integration

The application communicates with the backend via RESTful API endpoints.

### API Configuration

Base URL: `http://localhost:5000/api`

### Common Endpoints

**Authentication:**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/verify-email` - Email verification
- `POST /auth/forgot-password` - Password recovery
- `POST /auth/reset-password` - Reset password

**Analysis:**
- `POST /analysis/upload` - Upload image for analysis
- `GET /analysis/results/:id` - Get analysis results
- `GET /analysis/history` - Get analysis history
- `DELETE /analysis/:id` - Delete analysis

**Users:**
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update profile
- `PUT /users/password` - Change password
- `DELETE /users/account` - Delete account

**Dermatologists:**
- `GET /dermatologists` - List all dermatologists
- `GET /dermatologists/:id` - Get specific dermatologist
- `POST /dermatologists/book` - Book consultation
- `GET /dermatologists/nearest` - Find nearest dermatologists

**Consultations:**
- `POST /consultations` - Create consultation
- `GET /consultations` - Get consultations
- `PUT /consultations/:id` - Update consultation
- `POST /consultations/:id/review` - Add review

### Error Handling

The application handles API errors gracefully:
- Network errors show user-friendly messages
- 401 Unauthorized redirects to login
- 403 Forbidden shows permission denied message
- 404 Not Found shows item not found message
- 500 Server errors show generic error message

---

## 🎨 Styling & UI

### Tailwind CSS

The application uses Tailwind CSS for styling with a utility-first approach:
- Custom color schemes
- Responsive design (mobile-first)
- Dark mode support (if configured)
- Custom spacing and sizing
- Component-based styling

### UI Libraries

**Icon Libraries:**
- Lucide React - Modern icon set
- Hero Icons - Beautiful hand-crafted icons
- React Icons - Popular icon sets (Font Awesome, Feather, etc.)

**Animation:**
- Framer Motion - Advanced animations and transitions
- Lottie - JSON-based animations

**Notifications:**
- React Hot Toast - Beautiful toast notifications
- React Toastify - Toast notifications with advanced features

### Responsive Design

The application is fully responsive:
- **Mobile** (< 640px): Stack layout, simplified navigation
- **Tablet** (640px - 1024px): 2-column layout
- **Desktop** (> 1024px): Full layout with sidebars
- **Extra Large** (> 1280px): Maximum width containers

---

## 🔄 Development Workflow

### Setting Up Development Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/Asad-Zaidi/FacialDerma_AI.git
   cd FacialDerma_AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm start
   ```

### Best Practices

**Component Development:**
- Use functional components with hooks
- Keep components small and focused
- Use prop drilling or Context for state management
- Use `React.memo` for optimization
- Follow naming conventions (PascalCase for components)

**Styling:**
- Use Tailwind utility classes
- Avoid inline styles
- Create reusable component classes in CSS
- Use CSS modules for scoped styling

**API Calls:**
- Use axios for HTTP requests
- Handle loading and error states
- Use try-catch for error handling
- Implement proper error messages

**State Management:**
- Use Context API for global state
- Use local state for component-level data
- Use useReducer for complex state logic
- Avoid prop drilling with deep nesting

**Code Quality:**
- Follow ESLint rules
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions DRY (Don't Repeat Yourself)

### Git Workflow

```bash
# Create a new branch for features
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "descriptive commit message"

# Push to remote
git push origin feature/feature-name

# Create a Pull Request
# Request review and merge to main
```

---

## 🆘 Troubleshooting

### Common Issues and Solutions

**Issue: Dependencies installation fails**
```bash
# Solution: Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Issue: Port 3000 already in use**
```bash
# Solution: Kill the process using port 3000
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

**Issue: React not updating after changes**
```bash
# Solution: Clear React cache
rm -rf node_modules/.cache
npm start
```

**Issue: `npm start` shows white screen**
```bash
# Solution: Check console for errors
# Clear browser cache
# Restart development server
npm start
```

**Issue: Build fails with memory error**
```bash
# Solution: Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

**Issue: API calls returning 404 or CORS errors**
- Check if backend server is running on port 5000
- Verify API endpoints in `.env` file
- Check CORS configuration on backend
- Use network tab in browser DevTools

**Issue: Image upload not working**
- Check file size limits
- Verify file format (JPEG, PNG supported)
- Check browser console for errors
- Ensure proper permissions

### Debugging Tips

1. **Browser DevTools:**
   - Use Network tab to check API calls
   - Use Console tab for errors and warnings
   - Use React DevTools extension for component debugging
   - Use Redux DevTools for state debugging

2. **Console Logging:**
   ```javascript
   console.log('Debug info:', variable);
   console.error('Error:', error);
   console.table(arrayOfObjects);
   ```

3. **React DevTools:**
   - Install React DevTools extension
   - Inspect component props and state
   - Check component hierarchy

4. **Network Inspection:**
   - Check API responses
   - Verify request headers
   - Monitor network performance
   - Check for CORS issues

---

## 🌐 Live Preview

You can access the live preview of the application here: 
**[FacialDerma AI Live Preview](https://facialdermaai.vercel.app/)**

**Deployment Platform:** Vercel

---

## 📞 Contact & Support

### Contact Information

**GitHub Repository:**
- [FacialDerma_AI on GitHub](https://github.com/Asad-Zaidi/FacialDerma_AI)

### Getting Help

1. **Check FAQ Section:** Visit the FAQ page in the application
2. **Create Support Ticket:** Use the support ticket system in the app
3. **Contact Support Team:** Email the support address
4. **Report Issues:** Use GitHub Issues for bug reports
5. **Community Support:** Check GitHub discussions

### Feedback & Suggestions

We welcome feedback and suggestions for improvements:
- File an issue on GitHub
- Email suggestions to support
- Submit feedback through the in-app feedback form

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for full details.

The MIT License allows you to:
- Use the software for private and commercial purposes
- Modify the software
- Distribute the software
- Use the software for patent claims

With conditions:
- License and copyright notice must be included
- The software is provided "as-is" without warranty

---

## 🙏 Acknowledgments

- **React Team** - For the excellent React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **TensorFlow** - For machine learning capabilities
- **Vercel** - For hosting and deployment
- **Open Source Community** - For all the amazing libraries used

---

## 📌 Important Notes

1. **Environment Variables:** Never commit `.env` files to version control
2. **Security:** Keep API keys and sensitive data secure
3. **Backend Required:** Ensure the backend server is running for full functionality
4. **Browser Support:** Works best in modern browsers (Chrome, Firefox, Safari, Edge)
5. **Mobile Optimization:** The app is fully optimized for mobile devices
6. **Performance:** Initial load may take a few seconds on slow connections

---

## 🔄 Version History

**Current Version:** 0.1.0 (Beta)

### Planned Features for Future Releases:
- [ ] Multi-language support
- [ ] Offline mode functionality
- [ ] Advanced analytics dashboard
- [ ] Integration with insurance providers
- [ ] Video consultation support
- [ ] Prescription management system
- [ ] Telemedicine integration
- [ ] Mobile app development

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Axios Documentation](https://axios-http.com)

---
