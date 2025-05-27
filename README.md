#  Auth API + Todo Task Manager (Node.js + Express + MongoDB)

A backend-only project that includes user authentication (signup, login, email verification, password reset) and a personal todo task manager. All task operations are protected and available only to authenticated users.

---

##  Features

### 🔐 Authentication
- Sign Up with email verification 
- Login with JWT-based session
- Change Password (requires current password)
- Forgot/Reset Password via OTP token
- Email verification and password reset tokens expire after 24 hours

### ✅ Todo Tasks
- Create, Get All, Mark as Completed, Delete
- Only authenticated users can manage their own tasks

---
 API Endpoints
 Auth
Method	Endpoint	Description
POST	/auth/signup	Register new user + OTP
POST	/auth/login	Login + JWT
POST	/auth/verify	Verify email with OTP
POST	/auth/forgot	Send reset password OTP
POST	/auth/reset	Reset password
POST	/auth/change	Change password (auth)


Todo Tasks (Auth Required)
Method	Endpoint	Description
POST	/tasks	Add new task
GET	/tasks	Get all tasks of user
PATCH	/tasks/:id/complete	Mark task as completed
DELETE	/tasks/:id	Delete a task

Authorization Header: Bearer <your_token_here>
