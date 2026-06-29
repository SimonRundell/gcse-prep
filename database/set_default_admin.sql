--- This SQL script sets the default admin user's password hash in the database.

UPDATE admin_users
SET password_hash = '$2y$10$WFglr.0/wIX4Nb/cZ6NY..blbt3n5ryo4.3NiafYV0iYGgGhQ3l8e'
WHERE email = 'your-admin-email@address';