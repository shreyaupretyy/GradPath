# File: create_admin.py

from extensions import cnxpool, logger
from models import User

def create_default_admin():
    try:
        conn = cnxpool.get_connection()
        cursor = conn.cursor(dictionary=True)
        # Default admin credentials
        name = 'Admin User'
        email = 'admin@gradpath.com'
        password = 'admin123'  # Ensure this is a strong password
        role = 'admin'

        # Check if admin already exists
        existing_admin = User.get_by_email(cursor, email)
        if existing_admin:
            logger.info(f"Admin user with email {email} already exists.")
            return

        # Create admin user
        success = User.create_user(cursor, name, email, password, role)
        if success:
            logger.info("Default admin user created successfully.")
        else:
            logger.error("Failed to create default admin user.")

    except Exception as e:
        logger.exception(f"Error creating default admin: {e}")
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn and conn.is_connected():
            conn.close()

if __name__ == "__main__":
    create_default_admin()