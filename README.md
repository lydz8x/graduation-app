# Web School Management System

A full-stack web application for school management built with modern technologies.

## 🚀 Tech Stack

### Frontend

- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- React Router for navigation
- Axios for API requests
- File handling with XLSX and FileSaver

### Backend

- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- Supabase
- JWT for authentication
- bcrypt for password hashing
- CORS enabled

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (Latest LTS version recommended)
- MongoDB
- Git

## 🛠️ Installation

1. Clone the repository

```bash
git clone <your-repo-url>
cd web-skl
```

2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

## 💻 Development

### Frontend

```bash
cd frontend
npm run dev
```

The frontend development server will start at `http://localhost:5173`

### Backend

```bash
cd backend
npm run dev
```

The backend server will start at `http://localhost:3000`

## 🏗️ Building for Production

### Frontend

```bash
cd frontend
npm run build
```

### Backend

```bash
cd backend
npm run build
```

## 🔑 Environment Variables

### Backend (.env)

```
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:3000
```

## 📝 Features

- User Authentication
- File Management
- Excel Export Functionality
- Responsive Design
- RESTful API
- Secure Password Handling
- Database Integration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.
