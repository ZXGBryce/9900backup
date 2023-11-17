# Backend Setup Guide

This guide will help you set up and use the virtual environment for the backend of your project, based on the `pyproject.toml` and `poetry.lock` files.

## Prerequisites

- Git
- Python (version >=3.11 and <3.13 as specified in `pyproject.toml`)

## Installation Steps

### 1. Install Poetry

Poetry is a dependency management and packaging tool for Python. Install it using the following command:

```bash
curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -
```
Alternatively, visit the Poetry official website for more installation options.

### 2. Clone the Repository
Clone your repository to your local machine using Git. If you have already cloned the repository, skip this step.
```bash
git clone https://github.com/ZXGBryce/9900backup.git
cd 9900backup/backend
```

### 3. Create a Virtual Environment with Poetry
In the backend directory, run the following command to create a virtual environment and install all dependencies:
```bash
poetry install
```

### 4. Activate the Virtual Environment
To activate the virtual environment created by Poetry, you can run:
```bash
poetry shell
```

### 5. Alternative Dependency Installation with 'requirements.txt' (Optional)
If you encounter any issues with Poetry or if you're unable to run the project using Poetry, 
you can alternatively install all the necessary dependencies using requirements.txt. 
This file contains a list of all the packages and their specific versions used in the project.
#### Steps to Install Dependencies Using 'requirements.txt'
#### 1. Ensure Python is Installed: 
Before proceeding, make sure you have Python installed on your system. This project requires Python version 3.11 or later.
#### 2. Install Dependencies:
Open a terminal and navigate to the backend root directory. Run the following command to install all the dependencies listed in requirements.txt:

```bash
pip install -r requirements.txt
```
This command will automatically install all the packages and versions specified in the requirements.txt file.
#### 3. Verify Installation:
After the installation is complete, you can verify that all the dependencies are installed correctly by running:
```bash
pip freeze
```
This command lists all the installed Python packages in your environment. Ensure that the list matches the contents of requirements.txt.

By following these steps, you should be able to set up the project environment and run the application successfully, bypassing any potential issues with Poetry.
### 6. Start the Application:
Within the virtual environment, you can start app.py with the following command:
```bash
python app.py
```
This should launch your Flask application.

# Bakend Project Structure

- `app.py`：The project entry file, located at the root directory.

- `flask-app`：Project directory.

  - `flask-app`：Package directory.

    - `libs`：Directory for third-party middleware, which includes various dependencies such as initializations for database connections and Redis connections.

      - `db`：Module for initializing database connections.
        
    - `configs`：Directory for configuration files, containing both the configuration file structure definitions and actual configuration files.
    - `models`：Defines data models, i.e., the structure of the database tables.
    - `server`：Server-related directory.

      - `api`：Directory for HTTP API implementations. Each file corresponds to an API implementation, and each file exposes a blueprint.

      - `middlewares`：Middleware implementation directory, for instance, authentication middleware.
