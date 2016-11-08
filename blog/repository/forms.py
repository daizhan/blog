# -*- coding: utf-8 -*-

import os.path as osp

from django import forms
from blog.settings import TEMPLATES


class StaticPageAdminForm(forms.ModelForm):

    def clean(self):
        super(StaticPageAdminForm, self).clean()
        template = self.cleaned_data.get('template', '')
        if not template:
            raise forms.ValidationError("请输入模板路径")
        else:
            for template_dir in TEMPLATES[0]['DIRS']:
                if osp.isfile(osp.join(template_dir, template)):
                    break
            else:
                raise forms.ValidationError("未找到模板，请输入有效的模板路径")
        return self.cleaned_data
