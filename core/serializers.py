# from django_elasticsearch_dsl_drf.serializers import DocumentSerializer
#
# from core.documents import CarDocument
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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ('id', 'username', 'first_name', 'last_name', 'email',
                  'date_joined', 'bio', 'date_of_birth', 'social_media_links',
                  'phone_number', 'privacy_settings', 'location',
                  )


class DesireSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Desire
        fields = '__all__'


class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Friendship
        fields = '__all__'


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Country
        fields = '__all__'


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.City
        fields = '__all__'


class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.District
        fields = '__all__'


class StreetSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Street
        fields = '__all__'


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Location
        fields = '__all__'


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
