# Smart Delivery Platform

A full-stack smart delivery system project with login, registration, order reports, payment, and admin features.

## 📁 Project Structure

```
smart-delivery-platform/
├── backend/
│   ├── server.js
│   ├── routes.js
│   ├── controllers.js
│   ├── db.js
│   └── .env
├── frontend/
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── assets/
│   │   ├── script.js
│   │   └── style.css
└── README.md
```

## 🚀 Getting Started

### 1. Clone this repo
```bash
git clone https://github.com/Rollerpaper/smartdeliveryplatform.git
cd smartdeliveryplatform
```

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Set up `.env` in `backend/`
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=smart_delivery
PORT=3000
```

### 4. Start the server
```bash
node server.js
```

### 5. Open frontend
Use browser to open:
```
http://localhost:3000/frontend/login.html
```

## 🛠 Built With

- Node.js + Express
- MySQL + mysql2
- bcryptjs
- dotenv
- HTML/CSS/JavaScript (vanilla)

## 🔒 Security

- Environment variables are kept in `.env` and **NOT** uploaded.
- `node_modules/` are ignored.

## 📄 License

This project is licensed under the MIT License.
