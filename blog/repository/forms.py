# -*- coding: utf-8 -*-

import os.path as osp

from django import forms
from blog.settings import TEMPLATE_DIRS


class StaticPageAdminForm(forms.ModelForm):

    def clean(self):
        super(StaticPageAdminForm, self).clean()
        template = self.cleaned_data.get('template', '')
        if not template:
            raise forms.ValidationError("请输入模板路径")
        else:
            for template_dir in TEMPLATE_DIRS:
                if osp.isfile(osp.join(template_dir, template)):
                    break
            else:
                raise forms.ValidationError("未找到模板，请输入有效的模板路径")
        return self.cleaned_data
