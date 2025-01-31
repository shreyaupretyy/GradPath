# routes/admin.py

from flask import (
    Blueprint, request, jsonify, session, redirect, url_for, flash,
    render_template
)
from functools import wraps
from datetime import datetime
import logging
from database import get_db_connection  # Importing from the dedicated database module

# Initialize the Blueprint for admin routes
admin_bp = Blueprint('admin', __name__)

# Configure Logging for the admin blueprint
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)  # Set to INFO or WARNING in production

# Create a logging handler if not already present
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)

def login_required(f):
    """
    Decorator to ensure that a user is logged in before accessing certain routes.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('auth.login'))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    """
    Decorator to ensure that the logged-in user has admin privileges.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get('user_role') != 'admin':
            flash('Admin privileges required to access this page.', 'danger')
            return redirect(url_for('auth.login'))
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/dashboard', methods=['GET'])
@login_required
@admin_required
def dashboard():
    """
    Render the admin dashboard displaying various statistics.
    """
    return render_template('dashboard.html')

@admin_bp.route('/students', methods=['GET'])
@login_required
@admin_required
def get_students():
    """
    Retrieve a list of all students from the database.
    """
    connection = None
    try:
        # Establish a database connection
        connection = get_db_connection()
        if connection is None:
            raise Exception("Database connection failed.")

        cursor = connection.cursor(dictionary=True)

        # SQL query to fetch student details
        query = """
            SELECT 
                u.id,
                u.name,
                u.email,
                COALESCE(sd.university, '') AS university,
                COALESCE(sd.location, '') AS location,
                COALESCE(sd.be_percentage, 0) AS be_percentage,
                COALESCE(sd.be_ranking, 0) AS be_ranking,
                COALESCE(sd.cv_path, '') AS cv_path,
                COALESCE(sd.transcript_path, '') AS transcript_path,
                COALESCE(sd.status, 'pending') AS status,
                sd.created_at,
                sd.updated_at
            FROM users u
            LEFT JOIN student_details sd ON u.id = sd.user_id
            WHERE u.role = 'student'
            ORDER BY COALESCE(sd.created_at, u.created_at) DESC
        """

        cursor.execute(query)
        students = cursor.fetchall()

        # Format datetime objects to strings for JSON serialization
        for student in students:
            if student['created_at']:
                student['created_at'] = student['created_at'].strftime('%Y-%m-%d %H:%M:%S')
            if student['updated_at']:
                student['updated_at'] = student['updated_at'].strftime('%Y-%m-%d %H:%M:%S')

        logger.info("Fetched all students successfully.")
        return jsonify(students), 200

    except Exception as e:
        logger.error(f"Error fetching students: {e}")
        return jsonify({'message': 'Error fetching students', 'error': str(e)}), 500

    finally:
        # Ensure that the database connection is closed
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@admin_bp.route('/student/<int:student_id>', methods=['GET'])
@login_required
@admin_required
def get_student_details(student_id):
    """
    Retrieve detailed information of a specific student by their ID.
    """
    connection = None
    try:
        connection = get_db_connection()
        if connection is None:
            raise Exception("Database connection failed.")

        cursor = connection.cursor(dictionary=True)

        # SQL query to fetch specific student details
        query = """
            SELECT 
                u.id,
                u.name,
                u.email,
                sd.university,
                sd.location,
                sd.be_percentage,
                sd.be_ranking,
                sd.cv_path,
                sd.transcript_path,
                sd.status,
                sd.reference_details,
                sd.created_at,
                sd.updated_at
            FROM users u
            LEFT JOIN student_details sd ON u.id = sd.user_id
            WHERE u.id = %s AND u.role = 'student'
        """

        cursor.execute(query, (student_id,))
        student = cursor.fetchone()

        if not student:
            logger.warning(f"Student with ID {student_id} not found.")
            return jsonify({'message': 'Student not found'}), 404

        # Format datetime objects to strings for JSON serialization
        if student['created_at']:
            student['created_at'] = student['created_at'].strftime('%Y-%m-%d %H:%M:%S')
        if student['updated_at']:
            student['updated_at'] = student['updated_at'].strftime('%Y-%m-%d %H:%M:%S')

        logger.info(f"Retrieved details for student_id {student_id}.")
        return jsonify(student), 200

    except Exception as e:
        logger.error(f"Error fetching student details: {e}")
        return jsonify({'message': 'Error fetching student details', 'error': str(e)}), 500

    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@admin_bp.route('/student', methods=['POST'])
@login_required
@admin_required
def add_student():
    """
    Add a new student to the database.
    """
    connection = None
    try:
        data = request.get_json()

        # Validate required fields
        name = data.get('name')
        email = data.get('email')
        if not all([name, email]):
            logger.warning("Name and Email are required to add a new student.")
            return jsonify({'message': 'Name and Email are required'}), 400

        university = data.get('university')
        location = data.get('location')
        be_percentage = data.get('be_percentage')
        be_ranking = data.get('be_ranking')

        connection = get_db_connection()
        if connection is None:
            raise Exception("Database connection failed.")
        
        cursor = connection.cursor(dictionary=True)

        # Check if the email already exists in the users table
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            logger.warning(f"Attempt to add student with existing email: {email}.")
            return jsonify({'message': 'Email already exists'}), 400

        # Insert the new user into the users table
        insert_user_query = """
            INSERT INTO users (name, email, role, created_at, updated_at)
            VALUES (%s, %s, 'student', %s, %s)
        """
        current_time = datetime.now()
        cursor.execute(insert_user_query, (name, email, current_time, current_time))
        user_id = cursor.lastrowid

        # Insert the corresponding student details into the student_details table
        insert_details_query = """
            INSERT INTO student_details (
                user_id, university, location, be_percentage, be_ranking, status, created_at, updated_at
            ) VALUES (%s, %s, %s, %s, %s, 'pending', %s, %s)
        """
        cursor.execute(insert_details_query, (
            user_id,
            university,
            location,
            be_percentage,
            be_ranking,
            current_time,
            current_time
        ))

        # Commit the transaction to the database
        connection.commit()

        logger.info(f"Added new student with ID {user_id}.")
        return jsonify({'message': 'Student added successfully', 'student_id': user_id}), 201

    except Exception as e:
        if connection:
            connection.rollback()  # Rollback in case of error
        logger.error(f"Error adding student: {e}")
        return jsonify({'message': 'Error adding student', 'error': str(e)}), 500

    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()