#!/bin/bash
python manage.py makemigrations
python manage.py migrate
echo "y" | python manage.py search_index --rebuild
cd frontend
npm install
ls
npm run build
ls
cd ..
python manage.py collectstatic --no-input
ls