import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.connection import get_db_connection
from app.db.init import init_db
import os

TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL",
                              "postgresql://postgres:postgres@localhost:5432/settings_test_db")

# Set test database URL
os.environ["DATABASE_URL"] = TEST_DATABASE_URL

@pytest.fixture(scope="session")
def test_db():
    # Create test database schema once for all tests
    # Runs before all tests
    
    init_db()
    yield


@pytest.fixture(scope="function")
def db_connection():
    # Provide a database connection for each test

    with get_db_connection() as conn:
        yield conn


@pytest.fixture(scope="function")
def client(test_db):
    # Create Test Client for api testing
    return TestClient(app)

@pytest.fixture
def sample_setting_data():
    # Sample data for testing
    return {
        "test": "data",
        "theme": "dark",
        "type": 1
    }

@pytest.fixture
def create_test_setting(db_connection):
    # Creates a setting model for testing
    from app.db.operations import create_setting
    
    def _create_setting(data=None):
        if data is None:
            data = {"test": "data"}
        return create_setting(data)
    
    return _create_setting