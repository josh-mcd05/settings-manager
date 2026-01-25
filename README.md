## Setting Management System


To start Docker Container:
cd to main project directory and run "docker compose up --build"

Once boot-up is complete, connect to "http://localhost"

Can view API information at "http://localhost:8000/docs"



To run backend tests:
cd to backend folder, run "source venv/bin/activate" to activate venv
Make sure docker container is up for database connections
run "./run_tests.sh" to run tests.


To run frontend tests:
cd to frontend folder
run "npm test run" to run tests.