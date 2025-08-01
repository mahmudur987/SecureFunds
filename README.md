# Secure-Fund

A secure, modular, and role-based backend API for a digital wallet system inspired by services like **Bkash** and **Nagad**. Built with **Express.js**, **MongoDB**, **JWT**, and **Zod**, the system enables users to manage wallets and perform secure financial operations.

---

## 🚀 Features

- User, Agent, and Admin roles with permission-based access
- JWT-based authentication
- Wallet creation and management
- Add money, send money, cash-in/cash-out
- Transaction fees and agent commissions
- Transaction history tracking
- Modular code structure and Zod validation

---

## 🚀 credential

- Admin Phone: 01671706882
- Admin Password : 12345678

---

## 🛠 Tech Stack

- **Backend:** Express.js, Node.js ,Express js ,Type script
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + Bcrypt
- **Validation:** Zod
- **Testing:** Postman (included)

---

## ⚙️ Getting Started

### Prerequisites

- Node.js & npm
- MongoDB (local or cloud)

### Installation

```bash
git clone https://github.com/yourusername/secure-fund.git
cd secure-fund
npm install
```

### Environment Variables

Create a `.env` file in the root with the following structure:

```env
PORT=5000
DATABASE_URL=mongodb+srv://SecureFunds:SecureFunds@cluster0.ddhlldi.mongodb.net/SecureFunds?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=development
SUPER_ADMIN_EMAIL=super@gmail.com
SUPER_ADMIN_PHONE=01671706882
SUPER_ADMIN_PASSWORD=12345678
ACCESS_TOKEN_SECRET=Ph-tour-Management Backend
ACCESS_TOKEN_EXPIRES=1d
REFRESH_TOKEN_SECRET=Ph-tour-Management Backend
REFRESH_TOKEN_EXPIRES=30d


```

### Run the Server

```bash
npm run dev
```

---

## 🔐 Authentication

| Method | Endpoint      | Description                 |
| ------ | ------------- | --------------------------- |
| POST   | `/auth/login` | Login with phone & password |

---

## 👤 User Routes

| Method | Endpoint            | Description                      |
| ------ | ------------------- | -------------------------------- |
| POST   | `/user/create-user` | Register a new user/agent        |
| PATCH  | `/user/:id`         | Update user status (admin only)  |
| GET    | `/user`             | Get all users (admin only)       |
| GET    | `/user/profile`     | Get authenticated user’s profile |

---

## 💼 Wallet Routes

| Method | Endpoint      | Description             |
| ------ | ------------- | ----------------------- |
| GET    | `/wallet`     | Get all wallets (admin) |
| PATCH  | `/wallet/:id` | Update wallet (admin)   |

---

## 💸 Transaction Routes

| Method | Endpoint                        | Description                           |
| ------ | ------------------------------- | ------------------------------------- |
| POST   | `/transaction/send-money`       | Send money (user → user)              |
| POST   | `/transaction/cashIn`           | Cash-in (agent → user)                |
| POST   | `/transaction/cashOut`          | Cash-out (user → agent)               |
| POST   | `/transaction/addMoney`         | Add money to own wallet (bank → user) |
| GET    | `/transaction`                  | Get all transactions (admin)          |
| GET    | `/transaction/user-transaction` | Get transactions for logged-in user   |

---

## 💰 Transaction Fees & Commission Logic

- **Send Money**: Includes a platform-defined transaction fee
- **Cash-In / Cash-Out**: Includes commission credited to agent's wallet
- Fees and commissions are stored in each `Transaction` document

---

## 📁 Postman Collection

The Postman collection for all routes is included in the project (`SecureFunds Backend.postman_collection.json`).

Import it into Postman to test all available endpoints easily .I include in in a root of my repository,add envvariables https://secure-funds-backend.vercel.app/api/v1

---

## 👮 Role-Based Access Summary

| Role  | Access Capabilities                                       |
| ----- | --------------------------------------------------------- |
| User  | Send, add, withdraw, view own transactions                |
| Agent | Cash-in/out for users, view commission (via transactions) |
| Admin | Manage users, view all wallets & transactions             |

---

## 📦 Project Structure

```bash
src/
├── app/
│   ├── routes/
│   ├── config/
│   ├── errorHandler/
│   ├── middleware/
│   ├── modules/
│   └── utils/
│   └── interfaces/
├── app.ts
├── server.ts
└── ...
```

---

## 🙌 Author

- **Project Name:** Secure-Fund
- **Built by:** [Md Mahmudur Rahman]
- **GitHub:** [[Github](https://github.com/mahmudur987/SecureFunds)]
- **Live:** [[vercel-link](https://secure-funds-backend.vercel.app/api/v1)]

---

Feel free to contribute or fork the project!
