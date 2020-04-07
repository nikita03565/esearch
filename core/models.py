from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField, JSONField
from django.db import models

from .utils import phone_regex


class Desire(models.Model):
    name = models.CharField('name', max_length=100, )
    description = models.TextField('description', max_length=512, blank=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='desires')

    def __str__(self):
        return f'{self.user}: {self.name}'


class Friendship(models.Model):
    STATUSES = (
        ('S', 'Sent'),
        ('A', 'Approved'),
        ('R', 'Rejected'),
    )
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(null=True, blank=True)
    creator = models.ForeignKey('User', related_name="friendship_creator_set", on_delete=models.CASCADE)
    friend = models.ForeignKey('User', related_name="friend_set", on_delete=models.CASCADE)
    status = models.CharField(choices=STATUSES, max_length=1)


class Country(models.Model):
    name = models.CharField('name', max_length=100, )

    def __str__(self):
        return f'{self.name}'


class City(models.Model):
    name = models.CharField('name', max_length=100, )
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='cities')

    def __str__(self):
        return f'{self.name}, {self.country}'


class District(models.Model):
    name = models.CharField('name', max_length=100, )
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='districts')

    def __str__(self):
        return f'{self.name}, {self.city}'


class Street(models.Model):
    name = models.CharField('name', max_length=100, )
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='streets')

    def __str__(self):
        return f'{self.name}, {self.city}'


class Location(models.Model):
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    city = models.ForeignKey(City, on_delete=models.CASCADE, null=True, blank=True)
    district = models.ForeignKey(District, on_delete=models.CASCADE, null=True, blank=True)
    street = models.ForeignKey(Street, on_delete=models.CASCADE, null=True, blank=True)
    building = models.CharField(max_length=64, null=True, blank=True)
    apartment = models.CharField(max_length=64, null=True, blank=True)

    def __str__(self):
        return f'{self.country}, {self.city}, {self.district}, {self.street}, {self.building}, {self.apartment}'


class User(AbstractUser):
    PRIVACY_VISIBLE_TO_ALL = 'ALL'
    PRIVACY_VISIBLE_TO_AUTH = 'AUTH'
    PRIVACY_VISIBLE_TO_NOBODY = 'NOBODY'
    PRIVACY_VISIBLE_TO_FRIENDS = 'FRIEND'

    bio = models.CharField(max_length=500, null=True, blank=True)
    date_of_birth = models.DateField("Date of birth", null=True, blank=True)
    # calculate age
    social_media_links = ArrayField(models.URLField(max_length=512, null=True, blank=True), blank=True, null=True)
    phone_number = models.CharField(validators=[phone_regex], max_length=12, null=True, blank=True)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, null=True, blank=True)
    privacy_settings = JSONField(null=True, blank=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.username
