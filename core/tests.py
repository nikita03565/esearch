import json

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient


class TagsTests(APITestCase):
    def test_(self):
        self.assertEqual(1, 1)