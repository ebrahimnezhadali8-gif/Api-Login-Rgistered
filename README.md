# Api-Login-Rgistered

Two-step login and registration system with password recovery and OTP verification.

## Features

- Two-step login with OTP verification.
- User registration with phone number.
- Password recovery via OTP.
- Automatic deletion of expired or used OTPs using MySQL events.
- Password hashing with bcrypt.
- Rate limiting for OTP requests to prevent abuse.
- Node.js backend with MySQL database.
- Frontend integration (HTML/CSS/JS).

## Installation

1. Clone the repository:

```bash
    git clone https://github.com/ebrahimnezhadali8-gif/Api-Login-Rgistered.git
    cd Api-Login-Rgistered

2. Install backend dependencies: cd back-end
npm install

3. Configure MySQL database:

Create a database (e.g., api_login).

Import SQL files in this order:
a. table_users.sql
b. table_otp.sql
c. proceduer.sql

4. Set environment variables in .env file