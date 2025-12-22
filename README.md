# Api-Login-Rgistered

A simple and secure API for user registration, Two-step login, and password recovery using OTP (One-Time Password) verification.  
This project is built with **Node.js**, **Express**, and **MySQL**, and includes proper database structure with stored procedures and automated OTP cleanup.

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

## Installation

1. Clone the repository:

```bash
    git clone https://github.com/ebrahimnezhadali8-gif/Api-Login-Rgistered.git
    cd Api-Login-Rgistered
```
2. Install backend dependencies: cd back-end
`npm install`

3. Configure MySQL database:

Create a database (api_login).

Import SQL files in this order:
a. table_users.sql
b. table_otp.sql
c. proceduer.sql

4. Set environment variables in .env file