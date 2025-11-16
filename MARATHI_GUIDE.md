# Backend File Structure - संपूर्ण माहिती (Marathi)

## 📁 तयार केलेली सर्व फाईल्स (All Created Files)

### 1. **Root Files**
- `package.json` - सर्व dependencies आणि scripts
- `server.js` - मुख्य server file (application entry point)
- `.env.example` - Environment variables चा नमुना
- `.gitignore` - Git ignore rules
- `README.md` - संपूर्ण documentation (English)

### 2. **config/** फोल्डर
- `database.js` - MongoDB connection setup

### 3. **models/** फोल्डर (Database Schemas)
- `User.js` - User/Instructor/Admin schema
- `Course.js` - Course आणि Lecture schema

### 4. **controllers/** फोल्डर (Business Logic)
- `auth.controller.js` - Login, Register, GetMe
- `user.controller.js` - User management (instructors list, profile update)
- `course.controller.js` - Course CRUD operations
- `lecture.controller.js` - Lecture management आणि assignment

### 5. **routes/** फोल्डर (API Endpoints)
- `auth.routes.js` - Authentication routes
- `user.routes.js` - User routes
- `course.routes.js` - Course routes
- `lecture.routes.js` - Lecture routes

### 6. **middleware/** फोल्डर
- `auth.middleware.js` - JWT verification आणि role checking
- `error.middleware.js` - Global error handler

### 7. **scripts/** फोल्डर
- `seed.js` - Database मध्ये sample data टाकण्यासाठी

---

## 🚀 Setup कसे करायचे (How to Setup)

### Step 1: Backend फोल्डर मध्ये जा
```bash
cd Backend
```

### Step 2: Dependencies Install करा
```bash
npm install
```

### Step 3: .env File तयार करा
`.env.example` ची copy करून `.env` file तयार करा:
```bash
cp .env.example .env
```

`.env` file edit करा:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lecture-scheduling
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

### Step 4: MongoDB Start करा
Local MongoDB असेल तर:
```bash
mongod
```

किंवा MongoDB Atlas connection string वापरा

### Step 5: Database Seed करा (Optional पण recommended)
```bash
npm run seed
```

हे create करेल:
- 1 Admin (admin@test.com / password123)
- 5 Instructors (instructor1@test.com to instructor5@test.com / password123)
- 5 Courses with lectures

### Step 6: Server Start करा

Development mode (auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server येथे run होईल: `http://localhost:5000`

---

## 📚 API Endpoints - सर्व Routes

### Authentication (`/api/auth`)
- `POST /api/auth/register` - नवीन instructor register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user info (token आवश्यक)

### Users (`/api/users`)
- `GET /api/users/instructors` - सर्व instructors (token आवश्यक)
- `GET /api/users/instructors/:id` - एक instructor
- `PUT /api/users/profile` - Profile update (token आवश्यक)
- `DELETE /api/users/:id` - User delete (Admin only)

### Courses (`/api/courses`)
- `GET /api/courses` - सर्व courses
- `POST /api/courses` - नवीन course (Admin only)
- `GET /api/courses/:id` - एक course
- `PUT /api/courses/:id` - Course update (Admin only)
- `DELETE /api/courses/:id` - Course delete (Admin only)
- `POST /api/courses/:id/lectures` - Course मध्ये lecture add (Admin only)
- `GET /api/courses/:id/instructors` - Course चे instructors

### Lectures (`/api/lectures`)
- `GET /api/lectures` - सर्व lectures
- `GET /api/lectures/unassigned` - Unassigned lectures (Admin only)
- `GET /api/lectures/instructor/:id` - Instructor चे lectures
- `PUT /api/lectures/assign` - Lecture assign करा (Admin only)
- `PUT /api/lectures/:courseId/:lectureId` - Lecture update (Admin only)
- `DELETE /api/lectures/:courseId/:lectureId` - Lecture delete (Admin only)

---

## 🗄️ Database Models

### User Schema
```javascript
{
  name: String,           // नाव
  email: String,          // Email (unique)
  password: String,       // Password (hashed)
  role: String,           // 'admin' किंवा 'instructor'
  mobile: String,         // Mobile number
  bio: String,            // Bio/Description
  avatarUrl: String       // Profile picture URL
}
```

### Course Schema
```javascript
{
  name: String,           // Course नाव
  level: String,          // 'Beginner', 'Intermediate', 'Advanced'
  description: String,    // Course description
  imageUrl: String,       // Course image
  lectures: [Lecture]     // Lectures array
}
```

### Lecture Schema (Course मध्ये embedded)
```javascript
{
  title: String,          // Lecture title
  date: Date,             // Lecture date
  duration: Number,       // Duration (minutes मध्ये)
  instructorId: ObjectId, // Instructor reference (optional)
  courseId: ObjectId      // Course reference
}
```

---

## 🔧 महत्वाचे Features

### 1. Authentication
- JWT token based authentication
- Password hashing with bcrypt
- Role-based access (Admin/Instructor)

### 2. Lecture Assignment
- Instructor ला lecture assign करा
- Same day double booking check
- Unassigned lectures track करा

### 3. Course Management
- Complete CRUD operations
- Lectures course मध्ये nested
- Course instructors list

### 4. Security
- Password encryption
- JWT token verification
- Role-based route protection

---

## 📱 Frontend सोबत कसे Connect करायचे

Frontend मध्ये API calls update करा:

```javascript
const API_URL = 'http://localhost:5000/api';

// Login Example
const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  // Token save करा
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data));
  
  return data;
};

// Protected API Call Example
const getCourses = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/courses`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};
```

---

## 📦 Installed Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **dotenv** - Environment variables
- **cors** - CORS support
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT tokens
- **express-validator** - Input validation
- **nodemon** - Development auto-reload

---

## ✅ Summary

तुमच्या project साठी एक **पूर्ण Backend** तयार केला आहे:

✅ **19 files** created
✅ Complete **RESTful API** 
✅ **MongoDB** database integration
✅ **JWT Authentication**
✅ **Role-based** access control
✅ Full **CRUD** operations
✅ **Seed script** for sample data
✅ Complete **documentation**

सर्व backend code तयार आहे आणि वापरण्यास तयार आहे! 🎉