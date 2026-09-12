# Digital Library Management System with QR Code Integration

A modern, full-stack Digital Library Management System featuring:
- **Instant QR Code Access**: Users can open the live Digital Library by scanning the scannable website QR code on their smartphone camera.
- **Book & Student QR Borrowing**: Quick issue and return of library books via QR code scanning.
- **Role-Based Portals**: Dedicated portals for Students and Librarians/Admins.
- **24/7 Continuous Cloud Deployment**: Continuous deployment on **Vercel** (Frontend) and **Render** (Backend Docker Container) with automatic zero-downtime offline demo fallback.

---

## 🌐 Live Access

- **Public Web Link**: [https://digital-library-qr-m6g0xy412-sivab9382-os-projects.vercel.app](https://digital-library-qr-m6g0xy412-sivab9382-os-projects.vercel.app)
- **Mobile QR Code**: Click **"Scan QR to Open"** on the login page or in the navigation bar to generate a scannable QR code and printable poster for your library.

### 🔑 Demo Accounts
| Role | Email / ID | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin / Librarian** | `admin@library.com` | `admin123` | Full dashboard, book management, issuance & returns, user list |
| **Student** | `john.doe@student.com` | `student123` | Personal loans, digital library search, student QR badge |

*(Tip: Click the "Quick Demo Accounts" buttons on the Login page to auto-fill credentials instantly!)*

---

## 🚀 Continuous 24/7 Full-Stack Deployment

### 1. Frontend on Vercel
1. Connect your repository `sivab9382-o/Digital-library` to **Vercel**.
2. **Framework Preset**: `Vite`
3. **Root Directory**: `frontend` (or leave default with root `vercel.json`)
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. Under **Environment Variables**, set:
   - `VITE_API_URL` = `https://<your-render-backend-url>/api` (or omit for automatic smart fallback)

### 2. Backend on Render (Free 24/7 Cloud Service)
1. Go to [Render.com](https://render.com) and click **New + > Web Service**.
2. Connect your GitHub repository `sivab9382-o/Digital-library`.
3. Choose **Docker** environment:
   - **Root Directory**: `backend`
   - **Dockerfile Path**: `./Dockerfile` (or `backend/Dockerfile` from root)
4. Set Environment Variable:
   - `PORT` = `8082`
5. Render will automatically build the Spring Boot `.jar` inside Docker and provide a permanent HTTPS URL (`https://<service-name>.onrender.com`).
6. Every `git push origin main` will automatically rebuild and deploy both frontend (Vercel) and backend (Render)!

---

## 💻 Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend (Java 17 + Maven)
```bash
cd backend
./mvnw spring-boot:run
# Or using Maven: mvn spring-boot:run
```
