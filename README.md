# Api-Login-Rgistered

A simple and secure API for user registration, Two-step login, and password recovery using OTP (One-Time Password) verification.  
This project is built with **Node.js**, **Express**, and **MySQL**, and iIncluding database structure in Express with **sequelize** and managing it with **sequelize-cli**

<img src="./front-end/image/login.png" alt="page_login" width="500">
page login

## Features

- Two-step login with OTP verification.
- User registration with phone number.
- Password recovery via OTP.
- Automatic deletion of expired or used OTPs using MySQL events.
- Password hashing with bcrypt.
- Rate limiting for OTP requests to prevent abuse.
- Node.js and Express backend with MySQL database.
- Frontend integration (HTML/CSS/JS/BOOTSTRAP).
- Logs are stored in daily files (YYYY-MM-DD.log).
- Error logs are separated from general logs.
- Old logs are automatically removed after a defined retention period
- OTP SMS system sending login and authentication SMS to users

## Installation

1. Clone the repository:

```bash
    git clone https://github.com/ebrahimnezhadali8-gif/Api-Login-Rgistered.git
    cd Api-Login-Rgistered
```

2. Install backend dependencies:

```bash
    cd back-end
    npm install
```

3. Configure MySQL database:

```bash
    npx sequelize-cli db:migrate
```

4. Set environment variables in .env file

5. start server backend:

```bash
    npm run start
```
