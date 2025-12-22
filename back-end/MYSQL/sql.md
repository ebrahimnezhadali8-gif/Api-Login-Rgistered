# API Login Database

This repository contains the database schema and stored procedures for the **API Login System**.

## Database Overview

- **Database name:** `api_login`
- **Tables:**
  - `users`: stores user information including ID, name, phone number, role, password, and creation date.
  - `otp`: stores OTP codes for login and password recovery with expiration and usage tracking.
- **Stored Procedures:**
  - `insert_user`, `update_pasword_user`, `insert_otp`, `update_used_otp`, `get_otp`, `get_user_phone`, `delete_otp`
- **Events:**
  - `delete_otp_event` (optional, auto-deletes expired or used OTP codes every 5 minutes)

## Import Instructions

1. Create a new database in MySQL:
   ```sql
   CREATE DATABASE api_login;
   USE api_login;
   
2. Import the SQL files in this order:

a. table_users.sql

b. table_otp.sql

c. proceduer.sql