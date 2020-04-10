from django_elasticsearch_dsl_drf.serializers import DocumentSerializer

from core.documents import DesireDocument
#
#
# class CarDocumentSerializer(DocumentSerializer):
#     class Meta:
#         document = CarDocument
#         fields = (
#             'id',
#             'name',
#             'type',
#             'description',
#             'points',
#             'color',
#             'auction_title',
#             'manufacturer',
#         )

from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from core import models
from core.utils import get_or_create_city, get_or_create_district, get_or_create_street, get_or_create_location


class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Friendship
        fields = '__all__'


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Country
        fields = '__all__'
        extra_kwargs = {
            'name': {
                'validators': []
            }
        }


class CitySerializer(serializers.ModelSerializer):
    country = CountrySerializer(many=False)

    def create(self, validated_data):
        return get_or_create_city(validated_data)

    class Meta:
        model = models.City
        fields = '__all__'


class DistrictSerializer(serializers.ModelSerializer):
    city = CitySerializer(many=False)

    def create(self, validated_data):
        return get_or_create_district(validated_data)

    class Meta:
        model = models.District
        fields = '__all__'


class StreetSerializer(serializers.ModelSerializer):
    city = CitySerializer(many=False)

    def create(self, validated_data):
        return get_or_create_street(validated_data)

    class Meta:
        model = models.Street
        fields = '__all__'


class LocationSerializer(serializers.ModelSerializer):
    country = CountrySerializer(many=False)
    city = CitySerializer(many=False)
    street = StreetSerializer(many=False)
    district = DistrictSerializer(many=False)

    def create(self, validated_data):
        return get_or_create_location(validated_data)

    class Meta:
        model = models.Location
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    location = LocationSerializer(many=False)

    def update(self, instance, validated_data):
        location_data = validated_data.pop('location', None)
        if location_data is not None:
            if location_data:
                location = get_or_create_location(location_data)
                instance.location = location
            else:
                instance.location = None
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if data['social_media_links']:
            links = [{'id': i, 'link': link} for i, link in enumerate(data['social_media_links'])]
            data['social_media_links'] = links
        return data

    class Meta:
        model = models.User
        fields = ('id', 'username', 'first_name', 'last_name', 'email',
                  'date_joined', 'bio', 'date_of_birth', 'social_media_links',
                  'phone_number', 'privacy_settings', 'location',
                  )


class DesireSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False)

    def create(self, validated_data):
        user_id = self.context['request'].user.id
        instance = models.Desire.objects.create(**validated_data, user_id=user_id)
        instance.save()
        return instance

    class Meta:
        model = models.Desire
        fields = ['name', 'description', 'user', 'id']


class DesireDocSerializer(DocumentSerializer):

    class Meta:
        document = DesireDocument
        model = models.Desire
        fields = ['name', 'description', 'id', 'user']


class AuthTokenSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(request=self.context.get('request'),
                                username=username, password=password)

            if not user:
                msg = 'Unable to log in with provided credentials.'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Must include "username" and "password".'
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs


class RegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True, validators=[UniqueValidator(queryset=models.User.objects.all())])
    password = serializers.CharField(min_length=8, write_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()

    def create(self, validated_data):
        userModel = get_user_model()
        user = userModel(username=validated_data['username'],
                         first_name=validated_data['first_name'],
                         last_name=validated_data['last_name'])
        user.set_password(validated_data['password'])
        user.save()
        return user

    class Meta:
        model = get_user_model()
        fields = ('email', 'username', 'password', 'first_name', 'last_name')
