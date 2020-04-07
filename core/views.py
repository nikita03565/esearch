# from django_elasticsearch_dsl_drf.constants import (
#     LOOKUP_FILTER_TERMS,
#     LOOKUP_FILTER_RANGE,
#     LOOKUP_FILTER_PREFIX,
#     LOOKUP_FILTER_WILDCARD,
#     LOOKUP_QUERY_IN,
#     LOOKUP_QUERY_GT,
#     LOOKUP_QUERY_GTE,
#     LOOKUP_QUERY_LT,
#     LOOKUP_QUERY_LTE,
#     LOOKUP_QUERY_EXCLUDE,
#     SUGGESTER_COMPLETION)
# from django_elasticsearch_dsl_drf.filter_backends import (
#     FilteringFilterBackend,
#     IdsFilterBackend,
#     OrderingFilterBackend,
#     DefaultOrderingFilterBackend,
#     SearchFilterBackend,
#     FacetedSearchFilterBackend,
#     SuggesterFilterBackend,
# )
# from django_elasticsearch_dsl_drf.viewsets import BaseDocumentViewSet
# from django_elasticsearch_dsl_drf.pagination import PageNumberPagination
#
# from core.documents import CarDocument
# from core.serializers import CarDocumentSerializer
#
#
# class CarViewSet(BaseDocumentViewSet):
#     document = CarDocument
#     serializer_class = CarDocumentSerializer
#     lookup_field = 'id'
#
#     filter_backends = [
#         DefaultOrderingFilterBackend,
#         FilteringFilterBackend,
#         SearchFilterBackend,
#         SuggesterFilterBackend,
#     ]
#
#     search_fields = (
#         'name',
#         'description',
#     )
#
#     filter_fields = {
#         'id': {
#             'field': 'id',
#             'lookups': [
#                 LOOKUP_FILTER_RANGE,
#                 LOOKUP_QUERY_IN,
#                 LOOKUP_QUERY_GT,
#                 LOOKUP_QUERY_GTE,
#                 LOOKUP_QUERY_LT,
#                 LOOKUP_QUERY_LTE,
#             ],
#         },
#         'name': 'name',
#     }
#
#     suggester_fields = {
#         'name_suggest': {
#             'field': 'name.suggest',
#             'suggesters': [
#                 SUGGESTER_COMPLETION,
#             ],
#         },
#     }

from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authentication import TokenAuthentication
from core import serializers
from rest_framework.views import APIView
from rest_framework import permissions
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import logout
from django.contrib.auth import get_user_model


class LoginView(ObtainAuthToken):
    serializer_class = serializers.AuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'username': user.username,
        }, status=status.HTTP_200_OK)


class RegistrationView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = serializers.RegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    'token': token.key,
                    'username': user.username,
                }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        user = get_object_or_404(get_user_model(), username=request.user.username)
        user.set_password(request.data.get("new_password", ""))
        user.save()
        return Response({'detail': 'Password has been saved.'})


class LogoutView(APIView):
    authentication_classes = (TokenAuthentication,)

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)
