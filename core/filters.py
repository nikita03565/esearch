from django_filters import rest_framework as filters

from .models import Desire


class DesireFilter(filters.FilterSet):
    ordering = filters.OrderingFilter(
        fields=(
            ('id', 'id'),
        ),
    )

    class Meta:
        model = Desire

        fields = {'user_id': ['exact']}
