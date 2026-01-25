#!/bin/bash

echo "🧪 Settings Management System - Backend Tests"
echo "=============================================="
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Virtual environment not found"
    echo ""
    echo "Please run the following commands first:"
    echo "  python3.12 -m venv venv"
    echo "  source venv/bin/activate"
    echo "  pip install -r requirements.txt"
    read -p "Press Enter to exit..."
    exit 1
fi

# Check if virtual environment is activated
if [ -z "$VIRTUAL_ENV" ]; then
    echo "⚠️  Virtual environment not activated!"
    echo "Activating now..."
    source venv/bin/activate
fi

# Check if Docker DB is running
echo "📦 Checking Docker database..."
if ! docker compose ps 2>/dev/null | grep -q "db.*running"; then
    echo "Starting Docker database..."
    cd ..
    docker compose up db -d
    cd backend
    echo "⏳ Waiting for database to be ready..."
    sleep 5
else
    echo "✅ Docker database is running"
fi

# Check if test database exists, create if not
echo "🗄️  Checking test database..."
if ! docker compose exec -T db psql -U postgres -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw settings_test_db; then
    echo "Creating test database..."
    docker compose exec -T db psql -U postgres -c "CREATE DATABASE settings_test_db;" 2>/dev/null
    echo "Test database created"
else
    echo "Test database exists"
fi

# Set test database URL and run tests
echo ""
echo "🏃 Running tests..."
echo ""
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/settings_test_db"

python -m pytest "$@"

TEST_EXIT_CODE=$?

echo ""
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "✅ All tests passed!"
else
    echo "❌ Some tests failed"
fi

# PAUSE AT THE END
echo ""
read -p "Press Enter to exit..."

exit $TEST_EXIT_CODE
