# Local Development Setup

## Prerequisites

- XAMPP installed and running
- MySQL database created locally

## Step 1: Create Local Database

1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Create a new database named `classyfitters_db`
3. Import your data from the live Hostinger database:
   - Export data from Hostinger phpMyAdmin
   - Import the SQL file into your local `classyfitters_db`

## Step 2: Test Local API

1. Visit `http://localhost/T-SHIRT-ECOMMERCE-STORE/api/db_test.php`
2. Should show "Database Connection Successful"

## Step 3: Test Product Detail Page

1. Start the dev server: `npm run dev`
2. Visit `http://localhost:5173`
3. Click on any product to test the detail page

## Note

The `config.php` automatically detects if you're running locally vs on the server and uses the appropriate database credentials.
