from django.core.validators import RegexValidator
from core import models

phone_regex = RegexValidator(regex=r'^\+?1?\d{11}$', message="Phone number must be entered in the format:"
                                                             " '+78005553535'. 11 digits allowed.")
privacy_fields_choices = {
    'email', 'is_student', 'username', 'bio', 'middle_name', 'education', 'skills', 'phone_number', 'date_of_birth',
    'links', 'tags', 'experience', 'projects'
}

privacy_flags_choices = {"AUTH", "ALL", "NOBODY", "FRIEND"}


def validate_privacy_settings(privacy_data):
    validated_data = []
    for record in privacy_data:
        field, flag = next(iter(record.items()))
        if field in privacy_fields_choices and flag in privacy_flags_choices:
            validated_data.append(record)
    return validated_data


def get_or_create_city(data):
    country_data = data.pop('country')
    country, created = models.Country.objects.get_or_create(**country_data)
    instance, created = models.City.objects.get_or_create(**data, country=country)
    return instance


def get_or_create_district(data):
    city_data = data.pop('city')
    city = get_or_create_city(city_data)
    instance, created = models.District.objects.get_or_create(**data, city=city)
    return instance


def get_or_create_street(data):
    city_data = data.pop('city')
    city = get_or_create_city(city_data)
    instance, created = models.Street.objects.get_or_create(**data, city=city)
    return instance


def get_or_create_location(data):
    country_data = data.pop('country', None)
    city_data = data.pop('city', None)
    street_data = data.pop('street', None)
    district_data = data.pop('district', None)

    country, _ = models.Country.objects.get_or_create(**country_data) if country_data else None
    city = get_or_create_city(city_data) if city_data else None
    street = get_or_create_street(street_data) if street_data else None
    district = get_or_create_district(district_data) if district_data else None

    instance = models.Location.objects.create(**data, country=country, city=city,
                                              street=street, district=district)
    return instance
