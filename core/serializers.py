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

from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth import authenticate, get_user_model


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
    username = serializers.CharField(required=True, validators=[UniqueValidator(queryset=User.objects.all())])
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


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            'id',
            'last_login',
            'email',
            'name',
            'is_active',
            'joined_at',
            'password'
        )
        read_only_fields = ('last_login', 'is_active', 'joined_at')
        extra_kwargs = {
            'password': {'required': True, 'write_only': True},
            'name': {'required': True}
        }
