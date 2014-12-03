# -*- coding: utf-8 -*-

from django import forms
from blog.const.choices import UserType


class UserAdminForm(forms.ModelForm):

    def clean(self):
        cleaned_data = super(UserAdminForm, self).clean()
        password = cleaned_data['password']
        user_type = cleaned_data['user_type']
        if user_type == UserType.visitor and password:
            raise forms.ValidationError(
                '%s 不能设置密码' % UserType.values_to_labels[user_type]
            )
        elif user_type != UserType.visitor and not password:
            raise forms.ValidationError(
                '%s 需要设置密码' % UserType.values_to_labels[user_type]
            )
        return cleaned_data
