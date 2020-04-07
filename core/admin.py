from django.contrib import admin
from core import models

admin.site.register(models.User)
admin.site.register(models.Desire)
admin.site.register(models.Country)
admin.site.register(models.City)
admin.site.register(models.District)
admin.site.register(models.Street)
admin.site.register(models.Location)
admin.site.register(models.Friendship)
