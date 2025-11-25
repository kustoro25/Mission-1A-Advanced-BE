EduCourse - Online Learning Platform

EduCourse adalah sebuah platform pembelajaran online yang dibangun dengan Node.js, Express, dan MySQL. Platform ini menyediakan sistem manajemen kursus, autentikasi pengguna, dan fitur upload file.

🔐 Autentikasi & Keamanan

- Registrasi pengguna dengan verifikasi email
- Login dengan JWT token
- Proteksi endpoint dengan middleware autentikasi
- Hash password menggunakan bcrypt

🛠 Teknologi yang Digunakan

Node.js - Runtime JavaScript
Express.js - Web framework
MySQL - Database
JWT - Autentikasi token
bcrypt - Hash password
Multer - Handling file upload
Nodemailer - Layanan email

Setup Environment Variables
Buat file .env di root directory dan sesuaikan dengan konfigurasi Anda:

# Server Configuration

NODE_ENV=development
PORT=3000
BASE_URL=http://localhost:3000

# Database Configuration

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=educourse_db

# JWT Configuration

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Email Configuration

EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Upload Configuration

MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp

📡 API Endpoints

Autentikasi
POST /api/auth/register - Registrasi pengguna baru
POST /api/auth/login - Login pengguna
GET /api/auth/verify-email - Verifikasi email
GET /api/auth/profile - Get profil pengguna (protected)

Kursus
GET /api/courses - Get semua kursus (dengan filter)
GET /api/courses/categories - Get semua kategori
GET /api/courses/:id - Get kursus by ID
POST /api/courses - Buat kursus baru (protected)
PUT /api/courses/:id - Update kursus (protected)
DELETE /api/courses/:id - Hapus kursus (protected)

Upload
POST /api/upload - Upload file umum (protected)
POST /api/upload/profile - Upload gambar profil (protected)
