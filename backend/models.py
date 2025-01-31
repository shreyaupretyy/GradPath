# File: models.py

import mysql.connector  # Import the mysql.connector module
from extensions import bcrypt, cnxpool
import logging
from logging import getLogger

logger = getLogger(__name__)

class User:
    def __init__(self, cursor, name, email, password_hash, role='student'):
        self.cursor = cursor
        self.name = name
        self.email = email
        self.password_hash = password_hash
        self.role = role
        self.id = None  # To be set after insertion

    @staticmethod
    def get_by_email(cursor, email):
        """
        Retrieve a user from the database by email.
        """
        try:
            query = "SELECT id, name, email, password_hash, role FROM users WHERE email = %s"
            cursor.execute(query, (email,))
            result = cursor.fetchone()
            if result:
                logger.debug(f"User found: {result['email']}")
            else:
                logger.debug(f"No user found with email: {email}")
            return result
        except mysql.connector.Error as err:
            logger.exception(f"Error fetching user by email: {err}")
            return None

    @staticmethod
    def create_user(cursor, name, email, password, role='student'):
        """
        Create a new user in the database with a hashed password using Flask-Bcrypt.
        """
        try:
            # Hash the password using Flask-Bcrypt
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            query = "INSERT INTO users (name, email, password_hash, role) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (name, email, hashed_password, role))
            cursor._connection.commit()
            logger.debug(f"User {email} created successfully.")
            return True
        except mysql.connector.Error as err:
            logger.exception(f"Error creating user: {err}")
            cursor._connection.rollback()
            return False

    @staticmethod
    def verify_password(stored_password_hash, provided_password):
        """
        Verify a stored password hash against the provided password using Flask-Bcrypt.
        """
        try:
            return bcrypt.check_password_hash(stored_password_hash, provided_password)
        except Exception as e:
            logger.exception(f"Error verifying password: {e}")
            return False

class StudentDetails:
    def __init__(self, cursor, user_id, university='', location='', be_percentage=0, be_ranking=0,
                 cv_path=None, transcript_path=None, status='pending'):
        self.cursor = cursor
        self.user_id = user_id
        self.university = university
        self.location = location
        self.be_percentage = be_percentage
        self.be_ranking = be_ranking
        self.cv_path = cv_path
        self.transcript_path = transcript_path
        self.status = status

    def create_or_update(self):
        """
        Insert or update student details in the database.
        """
        try:
            self.cursor.execute("""
                INSERT INTO student_details (user_id, university, location, be_percentage, be_ranking, cv_path, transcript_path, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE
                    university = VALUES(university),
                    location = VALUES(location),
                    be_percentage = VALUES(be_percentage),
                    be_ranking = VALUES(be_ranking),
                    cv_path = VALUES(cv_path),
                    transcript_path = VALUES(transcript_path),
                    status = VALUES(status)
            """, (self.user_id, self.university, self.location, self.be_percentage, self.be_ranking,
                  self.cv_path, self.transcript_path, self.status))
            self.cursor._connection.commit()
            logger.debug(f"Student details for user_id {self.user_id} updated successfully.")
        except mysql.connector.Error as err:
            logger.exception(f"Error updating student details: {err}")
            self.cursor._connection.rollback()