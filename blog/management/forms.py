# -*- coding: utf-8 -*-

from django import forms
from django.core.urlresolvers import reverse
from blog.const.choices import UserType
from blog.utils.models import generate_url


class UserAdminForm(forms.ModelForm):

    def clean(self):
        cleaned_data = super(UserAdminForm, self).clean()
        password = cleaned_data['password']
        user_type = cleaned_data['user_type']
        if user_type == UserType.visitor and password:
            raise forms.ValidationError(
                u'%s 不能设置密码' % UserType.values_to_labels[user_type]
            )
        elif user_type != UserType.visitor and not password:
            raise forms.ValidationError(
                u'%s 需要设置密码' % UserType.values_to_labels[user_type]
            )
        return cleaned_data


class SEOAdminForm(forms.ModelForm):

    def clean(self):
        cleaned_data = super(SEOAdminForm, self).clean()
        url_name = cleaned_data['url_name']
        values = cleaned_data['values']
        url = generate_url(url_name, values)
        if not url:
            raise forms.ValidationError(
                u'url名称(%s)与url值(%s)不匹配' % (url_name, values)
            )
        return cleaned_data
