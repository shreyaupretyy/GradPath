# routes/students.py

from flask import (
    Blueprint, request, jsonify, session, redirect, url_for, flash,
    current_app, send_file, render_template
)
from functools import wraps
import os
from werkzeug.utils import secure_filename
from datetime import datetime
import logging
from database import get_db_connection  # Importing from the dedicated database module

# Initialize the Blueprint for student routes
student_bp = Blueprint('student', __name__)

# Configure Logging for the student blueprint
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

# Allowed file extensions for uploads
ALLOWED_FILE_EXTENSIONS = {
    'transcript': {'pdf', 'doc', 'docx'},
    'cv': {'pdf', 'doc', 'docx'},
    'photo': {'jpg', 'jpeg', 'png'}
}

def allowed_file(filename, file_type):
    """
    Check if the file has an allowed extension based on its type.
    """
    if '.' in filename:
        ext = filename.rsplit('.', 1)[1].lower()
        return ext in ALLOWED_FILE_EXTENSIONS.get(file_type, set())
    return False

# Decorator to require user login
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

@student_bp.route('/dashboard', methods=['GET'])
@login_required
def dashboard():
    """
    Render the student dashboard.
    """
    return render_template('dashboard.html')

@student_bp.route('/submit-details', methods=['POST'])
@login_required
def submit_student_details():
    """
    Handle the submission of student details, including file uploads.
    """
    connection = None
    try:
        user_id = session['user_id']
        form_data = request.form.to_dict()
        files = request.files

        # Process and validate file uploads
        transcript = files.get('transcript')
        cv = files.get('cv')
        photo = files.get('photo')

        # Initialize file paths
        transcript_path = None
        cv_path = None
        photo_path = None

        # Directory configurations
        upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')

        # Handle Transcript Upload
        if transcript:
            if allowed_file(transcript.filename, 'transcript'):
                filename = secure_filename(
                    f"{user_id}_transcript_{int(datetime.utcnow().timestamp())}_{transcript.filename}"
                )
                transcript_dir = os.path.join(upload_folder, 'transcripts')
                os.makedirs(transcript_dir, exist_ok=True)
                transcript.save(os.path.join(transcript_dir, filename))
                transcript_path = os.path.join('transcripts', filename)
                logger.debug(f"Transcript saved at {transcript_path}")
            else:
                logger.warning("Invalid file type for transcript upload.")
                return jsonify({'message': 'Invalid file type for transcript.'}), 400

        # Handle CV Upload
        if cv:
            if allowed_file(cv.filename, 'cv'):
                filename = secure_filename(
                    f"{user_id}_cv_{int(datetime.utcnow().timestamp())}_{cv.filename}"
                )
                cv_dir = os.path.join(upload_folder, 'cvs')
                os.makedirs(cv_dir, exist_ok=True)
                cv.save(os.path.join(cv_dir, filename))
                cv_path = os.path.join('cvs', filename)
                logger.debug(f"CV saved at {cv_path}")
            else:
                logger.warning("Invalid file type for CV upload.")
                return jsonify({'message': 'Invalid file type for CV.'}), 400

        # Handle Photo Upload
        if photo:
            if allowed_file(photo.filename, 'photo'):
                filename = secure_filename(
                    f"{user_id}_photo_{int(datetime.utcnow().timestamp())}_{photo.filename}"
                )
                photo_dir = os.path.join(upload_folder, 'photos')
                os.makedirs(photo_dir, exist_ok=True)
                photo.save(os.path.join(photo_dir, filename))
                photo_path = os.path.join('photos', filename)
                logger.debug(f"Photo saved at {photo_path}")
            else:
                logger.warning("Invalid file type for photo upload.")
                return jsonify({'message': 'Invalid file type for photo.'}), 400

        # Prepare data for database insertion
        data = {
            'user_id': user_id,
            'final_percentage': form_data.get('final_percentage'),
            'tentative_ranking': form_data.get('tentative_ranking'),
            'final_year_project': form_data.get('final_year_project'),
            'other_research': form_data.get('other_research'),
            'publications': form_data.get('publications'),
            'extracurricular': form_data.get('extracurricular'),
            'professional_experience': form_data.get('professional_experience'),
            'strong_points': form_data.get('strong_points'),
            'weak_points': form_data.get('weak_points'),
            'preferred_programs': form_data.get('preferred_programs'),
            'reference_details': form_data.get('reference_details'),  # Changed from 'references'
            'statement_of_purpose': form_data.get('statement_of_purpose'),
            'intended_research_areas': form_data.get('intended_research_areas'),
            'english_proficiency': form_data.get('english_proficiency'),
            'leadership_experience': form_data.get('leadership_experience'),
            'availability_to_start': form_data.get('availability_to_start'),
            'additional_certifications': form_data.get('additional_certifications'),
            'transcript_path': transcript_path,
            'cv_path': cv_path,
            'photo_path': photo_path
        }

        # Connect to the database
        connection = get_db_connection()
        if connection is None:
            raise Exception("Database connection failed.")

        cursor = connection.cursor(dictionary=True)

        # Insert or Update the student_details record
        insert_query = """
            INSERT INTO student_details (
                user_id, final_percentage, tentative_ranking, final_year_project,
                other_research, publications, extracurricular, professional_experience,
                strong_points, weak_points, preferred_programs, reference_details,
                statement_of_purpose, intended_research_areas, english_proficiency,
                leadership_experience, availability_to_start, additional_certifications,
                transcript_path, cv_path, photo_path
            ) VALUES (
                %(user_id)s, %(final_percentage)s, %(tentative_ranking)s, %(final_year_project)s,
                %(other_research)s, %(publications)s, %(extracurricular)s, %(professional_experience)s,
                %(strong_points)s, %(weak_points)s, %(preferred_programs)s, %(reference_details)s,
                %(statement_of_purpose)s, %(intended_research_areas)s, %(english_proficiency)s,
                %(leadership_experience)s, %(availability_to_start)s, %(additional_certifications)s,
                %(transcript_path)s, %(cv_path)s, %(photo_path)s
            )
            ON DUPLICATE KEY UPDATE
                final_percentage = VALUES(final_percentage),
                tentative_ranking = VALUES(tentative_ranking),
                final_year_project = VALUES(final_year_project),
                other_research = VALUES(other_research),
                publications = VALUES(publications),
                extracurricular = VALUES(extracurricular),
                professional_experience = VALUES(professional_experience),
                strong_points = VALUES(strong_points),
                weak_points = VALUES(weak_points),
                preferred_programs = VALUES(preferred_programs),
                reference_details = VALUES(reference_details),
                statement_of_purpose = VALUES(statement_of_purpose),
                intended_research_areas = VALUES(intended_research_areas),
                english_proficiency = VALUES(english_proficiency),
                leadership_experience = VALUES(leadership_experience),
                availability_to_start = VALUES(availability_to_start),
                additional_certifications = VALUES(additional_certifications),
                transcript_path = VALUES(transcript_path),
                cv_path = VALUES(cv_path),
                photo_path = VALUES(photo_path),
                updated_at = CURRENT_TIMESTAMP
        """

        cursor.execute(insert_query, data)
        connection.commit()

        logger.info(f"Student details for user_id {user_id} have been submitted/updated successfully.")
        flash('Your details have been recorded successfully!', 'success')
        return jsonify({'message': 'Details submitted successfully.'}), 200

    except Exception as e:
        if connection:
            connection.rollback()
        logger.error(f"Error storing student details: {e}")
        return jsonify({'message': 'Error storing details', 'error': str(e)}), 500

    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@student_bp.route('/get-details', methods=['GET'])
@login_required
def get_student_details():
    """
    Retrieve all details of the logged-in student.
    """
    connection = None
    try:
        user_id = session['user_id']
        connection = get_db_connection()
        if connection is None:
            raise Exception("Database connection failed.")

        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT 
                final_percentage,
                tentative_ranking,
                final_year_project,
                other_research,
                publications,
                extracurricular,
                professional_experience,
                strong_points,
                weak_points,
                preferred_programs,
                reference_details,
                statement_of_purpose,
                intended_research_areas,
                english_proficiency,
                leadership_experience,
                availability_to_start,
                additional_certifications,
                transcript_path,
                cv_path,
                photo_path,
                status,
                created_at,
                updated_at
            FROM student_details
            WHERE user_id = %s
        """

        cursor.execute(query, (user_id,))
        result = cursor.fetchone()

        if not result:
            logger.warning(f"No details found for user_id {user_id}.")
            return jsonify({'message': 'No details found for this user.'}), 404

        # Format datetime fields
        if result['created_at']:
            result['created_at'] = result['created_at'].strftime('%Y-%m-%d %H:%M:%S')
        if result['updated_at']:
            result['updated_at'] = result['updated_at'].strftime('%Y-%m-%d %H:%M:%S')

        logger.info(f"Retrieved student details for user_id {user_id}.")
        return jsonify(result), 200

    except Exception as e:
        logger.error(f"Error retrieving student details: {e}")
        return jsonify({'message': 'Error retrieving details', 'error': str(e)}), 500

    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@student_bp.route('/download-file/<file_type>/<filename>', methods=['GET'])
@login_required
def download_file(file_type, filename):
    """
    Allows users to download their uploaded files (transcript, CV, photo).
    """
    upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')

    # Mapping file types to directories
    directory_mapping = {
        'transcript': 'transcripts',
        'cv': 'cvs',
        'photo': 'photos'
    }

    directory = directory_mapping.get(file_type)
    if not directory:
        logger.warning(f"Invalid file type requested: {file_type}")
        return jsonify({'message': 'Invalid file type requested.'}), 400

    file_path = os.path.join(upload_folder, directory, filename)

    if not os.path.exists(file_path):
        logger.warning(f"File does not exist: {file_path}")
        return jsonify({'message': 'File does not exist.'}), 404

    try:
        logger.info(f"Sending file {file_path} to user {session['user_id']}.")
        return send_file(file_path, as_attachment=True)
    except Exception as e:
        logger.error(f"Error sending file: {e}")
        return jsonify({'message': 'Error downloading file.', 'error': str(e)}), 500