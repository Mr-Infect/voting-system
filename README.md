# 🗳️ Decentralized Voting System

A **secure and transparent voting system** built using **React.js**, **Node.js**, and **MongoDB**. The system ensures fair voting, user verification using unique hash values, and real-time vote statistics.

## 🚀 Features
- **User Registration**: Generates a unique hash for each user.
- **Voting Mechanism**: Users can vote only once using their hash.
- **Admin Panel**: Admins can set candidates, monitor votes, and view voter details.
- **Real-Time Statistics**: Live vote updates using WebSockets.
- **Secure & Fraud Detection**: Prevents duplicate or fake votes.

## 🛠️ Tech Stack
- **Frontend**: React.js, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-time Updates**: Socket.io

## 📂 Project Structure
```
decentralized-voting-system/
│── backend/                 # Node.js Backend
│   ├── models/              # Database Models
│   ├── routes/              # API Routes
│   ├── controllers/         # Route Handlers (Logic)
│   ├── config/              # Database Configurations
│   ├── middleware/          # Middleware Functions
│   ├── server.js            # Main Server File
│── frontend/                # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable Components (Navbar, Table, Stats)
│   │   ├── pages/           # React Pages (User, Admin, Statistics)
│   │   ├── services/        # API Calls to Backend
│   │   ├── styles/          # CSS Stylesheets
│   │   ├── App.js           # Main React App
│   │   ├── index.js         # React Entry Point
│   ├── package.json         # Frontend Dependencies
│── README.md                # Project Documentation
```

## ⚙️ Installation & Setup
### **1️⃣ Clone the repository**
```sh
git clone https://github.com/your-username/decentralized-voting-system.git
cd decentralized-voting-system
```

### **2️⃣ Setup the Backend**
```sh
cd backend
npm install
```

#### **Configure MongoDB**
Ensure MongoDB is running locally or set up a **MongoDB Atlas** database.

```sh
sudo systemctl start mongod
```

#### **Run the Backend**
```sh
node server.js
```

### **3️⃣ Setup the Frontend**
```sh
cd frontend
npm install
npm start
```

## 🚀 Usage Guide
- **User Page:** `http://localhost:3000/` – Register and Vote
- **Admin Panel:** `http://localhost:3000/admin` – Monitor Votes
- **Statistics Page:** `http://localhost:3000/statistics` – View Live Vote Count

