from django_elasticsearch_dsl import Document, Completion, Keyword, fields
from django_elasticsearch_dsl.registries import registry
from elasticsearch_dsl import analyzer
from .models import Desire
from itertools import permutations


html_strip = analyzer(
    'html_strip',
    tokenizer="whitespace",
    filter=["lowercase", "stop", "snowball"],
    char_filter=["html_strip"]
)


@registry.register_document
class DesireDocument(Document):
    id = fields.IntegerField(attr='id')
    name = fields.TextField(
        analyzer=html_strip,
        fields={
            'raw': fields.TextField(analyzer='whitespace'),
            'suggest': fields.CompletionField(),
        }
    )

    description = fields.TextField(
        analyzer=html_strip,
        fields={
            'raw': fields.TextField(analyzer='whitespace'),
            'suggest': fields.CompletionField(),
        }
    )

    suggest = Completion()

    # def clean(self):
    #     """
    #     Automatically construct the suggestion input and weight by taking all
    #     possible permutation of Person's name as ``input`` and taking their
    #     popularity as ``weight``.
    #     """
    #     self.suggest = {
    #         'input': [' '.join(p) for p in permutations(self.name.split())]
    #     }

    class Index:
        name = 'desires'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0
        }

    class Django:
        model = Desire
