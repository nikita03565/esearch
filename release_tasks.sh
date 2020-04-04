#!/bin/bash
python manage.py makemigrations
python manage.py migrate
echo "y" | python manage.py search_index --rebuild
cd frontend
npm run-script build
cd ..
python manage.py collectstatic --no-input