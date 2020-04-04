#!/bin/bash
python manage.py makemigrations
python manage.py migrate
echo "y" | python manage.py search_index --rebuild
