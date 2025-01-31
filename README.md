# GradPath: Flask & React Application

## Overview
GradPath is a full-stack web application built with Flask and React to manage student and admin interactions for a university's graduate program. The application features secure authentication, role-based access control, and functionalities for handling student details, file uploads, and administrative tasks.

## Features
- **Role-based Access Control:** Separate functionalities for students and admins.
- **Student Management:** Admins can add, update, delete, and view student details.
- **File Uploads:** Students can submit documents (transcripts, CVs, photos).
- **Dashboard:** Admins can view statistics and recent activities.
- **Secure Authentication:** User authentication with role-based session management.

## Technologies Used
### Backend
- Flask: Web framework for building the application.
- MySQL: Database for storing user and student details.
- python-dotenv: For managing environment variables.
- mysql-connector-python: For connecting to the MySQL database.
- Flask-CORS: For handling Cross-Origin Resource Sharing (CORS).
- Werkzeug: For secure file handling.

### Frontend
- React: JavaScript library for building the UI.
- Axios: For making API requests to the backend.
- React Router: For managing navigation.
- Bootstrap / Tailwind CSS: For styling and responsive design.

## Project Structure
```
GradPath/
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── database.py
│   ├── extensions.py
│   ├── models.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── student.py
│   │   ├── auth_routes.py
│   ├── uploads/
│   ├── venv/
│   ├── .env
│   ├── .gitignore
│   ├── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── About.js
│   │   │   ├── AcademicInfo.js
│   │   │   ├── AdditionalInfo.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── ApplicationForm.js
│   │   │   ├── Footer.js
│   │   │   ├── Home.js
│   │   │   ├── Layout.js
│   │   │   ├── Login.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   ├── index.css
│   ├── package.json
│   ├── .gitignore
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js & npm
- MySQL Server
- Virtual Environment (optional but recommended)

### 1. Clone the Repository
```bash
git clone https://github.com/shreyaupretyy/gradpath.git
cd gradpath
```

### 2. Backend Setup
#### Create a Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```
SECRET_KEY=your_secret_key
UPLOAD_FOLDER=uploads
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
DB_PORT=3306
```

#### Set Up the Database
```sql
CREATE DATABASE IF NOT EXISTS your_database_name;
USE your_database_name;

-- users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- student_details table
CREATE TABLE IF NOT EXISTS student_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    university VARCHAR(255),
    location VARCHAR(255),
    be_percentage DECIMAL(5,2),
    be_ranking INT,
    cv_path VARCHAR(255),
    transcript_path VARCHAR(255),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    reference_details TEXT,
    statement_of_purpose TEXT,
    intended_research_areas TEXT,
    english_proficiency VARCHAR(100),
    leadership_experience TEXT,
    availability_to_start DATE,
    additional_certifications TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Run the Backend
```bash
python app.py
```
The backend will start at `http://localhost:5000`.

### 3. Frontend Setup
#### Install Dependencies
```bash
cd frontend
npm install
```

#### Run the Frontend
```bash
npm start
```
The frontend will start at `http://localhost:3000`.

## Usage
### Admin Functions
- View Dashboard: Access the admin dashboard to view statistics and recent activities.
- Manage Students: Add, update, delete, and view student details.

### Student Functions
- Submit Details: Fill out and submit academic and personal details, including file uploads.
- View Details: Access and review submitted details.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue to discuss changes.

