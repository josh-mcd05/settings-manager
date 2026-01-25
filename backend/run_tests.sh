#!/bin/bash

export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/settings_test_db"

python -m pytest "$@"