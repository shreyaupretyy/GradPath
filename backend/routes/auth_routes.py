# File: routes/auth_routes.py

from flask import Blueprint, request, jsonify, session
from functools import wraps
import re
from models import User
from extensions import cnxpool, logger

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

def is_valid_email(email):
    """
    Validate the email format using a regular expression.
    """
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

def login_required(f):
    """
    Decorator to require authentication for certain routes.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'message': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    """
    Decorator to require admin privileges for certain routes.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_role' not in session or session['user_role'] != 'admin':
            return jsonify({'message': 'Admin privileges required'}), 403
        return f(*args, **kwargs)
    return decorated_function

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """
    Handle user signup by creating a new user in the database.
    """
    try:
        if not request.is_json:
            return jsonify({'message': 'Content-Type must be application/json'}), 415

        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400

        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'student')  # Default role

        # Validate input fields
        if not name or not email or not password:
            return jsonify({'message': 'Name, email, and password are required'}), 400

        if not is_valid_email(email):
            return jsonify({'message': 'Invalid email format'}), 400

        # Get connection from pool
        conn = cnxpool.get_connection()
        cursor = conn.cursor(dictionary=True)

        # Check if user already exists
        existing_user = User.get_by_email(cursor, email)
        if existing_user:
            logger.warning(f"Signup attempt with existing email: {email}")
            return jsonify({'message': 'Email already registered'}), 409

        # Create new user
        success = User.create_user(cursor, name, email, password, role)
        if not success:
            return jsonify({'message': 'Failed to create user'}), 500

        logger.info(f"User {email} signed up successfully.")

        return jsonify({'message': 'User created successfully'}), 201

    except Exception as e:
        logger.exception(f"Signup error: {e}")
        if cursor and conn.is_connected():
            conn.rollback()
        return jsonify({'message': 'Signup failed', 'error': str(e)}), 500
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn and conn.is_connected():
            conn.close()
            logger.debug("MySQL connection closed.")

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Handle user login by verifying credentials and initializing a session.
    """
    try:
        if not request.is_json:
            return jsonify({'message': 'Content-Type must be application/json'}), 415

        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400

        email = data.get('email')
        password = data.get('password')

        # Validate input fields
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400

        logger.debug(f"Attempting to login user with email: {email}")

        # Get connection from pool
        conn = cnxpool.get_connection()
        cursor = conn.cursor(dictionary=True)

        user = User.get_by_email(cursor, email)

        if not user or not User.verify_password(user['password_hash'], password):
            logger.warning(f"Invalid login attempt for email: {email}")
            return jsonify({'message': 'Invalid credentials'}), 401

        # Store user information in session
        session['user_id'] = user['id']
        session['user_name'] = user['name']
        session['user_role'] = user['role']

        logger.info(f"User {user['email']} logged in successfully.")

        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'role': user['role']
            }
        }), 200

    except Exception as e:
        logger.exception(f"Login error: {e}")
        return jsonify({'message': 'Login failed.', 'error': str(e)}), 500
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn and conn.is_connected():
            conn.close()
            logger.debug("MySQL connection closed.")

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    """
    Handle user logout by clearing the session.
    """
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200

@auth_bp.route('/create-admin', methods=['POST'])
@admin_required
def create_admin():
    """
    Allow an admin to create another admin account.
    """
    try:
        if not request.is_json:
            return jsonify({'message': 'Content-Type must be application/json'}), 415

        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400

        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        # Validate input fields
        if not name or not email or not password:
            return jsonify({'message': 'All fields are required'}), 400

        if not is_valid_email(email):
            return jsonify({'message': 'Invalid email format'}), 400

        if len(password) < 12:
            return jsonify({'message': 'Admin password must be at least 12 characters'}), 400

        # Get connection from pool
        conn = cnxpool.get_connection()
        cursor = conn.cursor(dictionary=True)

        # Check if admin already exists
        query = 'SELECT id FROM users WHERE email = %s AND role = %s'
        cursor.execute(query, (email, 'admin'))
        if cursor.fetchone():
            logger.warning(f"Admin account already exists for email: {email}")
            return jsonify({'message': 'Admin already exists'}), 400

        # Create new admin
        success = User.create_user(cursor, name, email, password, role='admin')
        if not success:
            return jsonify({'message': 'Failed to create admin'}), 500

        logger.info(f"Admin {email} created successfully.")

        return jsonify({'message': 'Admin created successfully'}), 201

    except Exception as e:
        logger.exception(f"Error creating admin: {e}")
        if cursor and conn.is_connected():
            conn.rollback()
        return jsonify({'message': 'Failed to create admin', 'error': str(e)}), 500
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn and conn.is_connected():
            conn.close()
            logger.debug("MySQL connection closed.")