## Setting Management System


To start Docker Container:
cd to main project directory and run "docker compose up --build"

Once boot-up is complete, connect to "http://localhost"

Can view API information at "http://localhost:8000/docs"



## Backend tests:

cd to backend folder

make sure python 3.12 is installed and run "python3.12 -m venv venv" to set up virtual environment

activate venv with "source venv/bin/activate" on mac/unix or "./venv/Scripts/Activate.ps1" on powershell

run "pip install -r requirements.txt" to install all requirements

run "./run_tests.sh" to run tests. This will set up docker container and test database and run tests.



## Frontend tests:

cd to frontend folder

run "npm install" to install all required dependencies

run "npm test run" to run tests.