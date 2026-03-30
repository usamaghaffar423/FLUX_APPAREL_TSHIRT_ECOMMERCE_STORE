# Deployment Guide for Hostinger Shared Hosting

## Prerequisites

- Hostinger shared hosting account
- Database already created with tables and data
- FTP access to your hosting

## Step 1: Update Database Configuration

1. Open `api/config.php`
2. Replace the placeholder values with your actual Hostinger database credentials:
   - `DB_USER`: Your database username (e.g., u123456789_user)
   - `DB_PASS`: Your database password
   - `DB_NAME`: Your database name (e.g., u123456789_classyfitters_db)

## Step 2: Build the Frontend

```bash
npm run build
```

**Important**: After any changes to the build configuration, always rebuild and re-upload the `dist/` folder.

**Note**: The project has been configured with `base: '/'` for proper asset loading on shared hosting. If you encounter MIME type errors, ensure the `.htaccess` file is uploaded and mod_rewrite is enabled.

This will create a `dist` folder with the production build.

## Step 3: Upload Files to Hostinger

Using FTP or File Manager, upload the following to your `public_html` directory:

### Frontend Files (from `dist` folder):

- All files from the `dist` folder to `public_html/`

### Backend Files:

- The entire `api` folder to `public_html/api`

### Configuration Files:

- `.htaccess` (already created) to `public_html/`

## Step 3.5: Test Database Connection

1. Upload the `api/db_test.php` file (created for testing)
2. Visit `yourdomain.com/api/db_test.php` in your browser
3. It should show "Database Connection Successful" and list tables
4. If it fails, check your credentials in `api/config.php`

## Step 3.6: Test Product Detail Page

1. Visit your live site
2. Click on any product from the shop or home page
3. The product detail page should load with:
   - High-quality product image display
   - Complete product information (title, price, category, rating)
   - Quantity selector and Add to Cart functionality
   - Related products section at the bottom
4. Test the Add to Cart button and cart functionality

## Step 4: Verify Setup

1. Visit your domain
2. Test the application functionality
3. Check browser console for any errors
4. Test API endpoints (e.g., yourdomain.com/api/get_products.php)

## Troubleshooting

- **MIME Type Error ("Failed to load module script")**: This occurs when the server serves HTML instead of JS files. Ensure:
  - You have rebuilt the project (`npm run build`) after any configuration changes
  - All files from the latest `dist/` build are uploaded to `public_html/`
  - The `.htaccess` file is uploaded to `public_html/` (the updated version includes better routing rules)
  - Mod_rewrite is enabled on your Hostinger account
  - File permissions are correct (644 for files, 755 for directories)
  - Clear your browser cache (Ctrl+F5) after uploading new files
- If API calls fail, check that the database credentials are correct
- Ensure the database tables exist and have data
- If routing doesn't work, ensure .htaccess is uploaded and mod_rewrite is enabled

## Notes

- The frontend is configured to use absolute paths (`base: '/'`) for production
- API endpoints are accessible at `/api/*`
- CORS is enabled for development; you may need to adjust for production if needed
