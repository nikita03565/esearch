from django.core.validators import RegexValidator

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
