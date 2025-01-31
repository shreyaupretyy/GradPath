# database.py

import os
import logging
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# Configure Logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)  # Set to INFO or WARNING in production

handler = logging.StreamHandler()
formatter = logging.Formatter(
    '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
)
handler.setFormatter(formatter)
if not logger.handlers:
    logger.addHandler(handler)

# Database configuration using environment variables
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'your_mysql_username'),
    'password': os.getenv('DB_PASSWORD', 'your_mysql_password'),
    'database': os.getenv('DB_NAME', 'your_database_name'),
    'port': int(os.getenv('DB_PORT', 3306))
}

def get_db_connection():
    """
    Establishes and returns a new database connection.
    Returns:
        connection (mysql.connector.connection_cext.CMySQLConnection): Database connection object.
    """
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            logger.debug("Successfully connected to the database.")
            return connection
    except Error as e:
        logger.error(f"Error connecting to the database: {e}")
    return None