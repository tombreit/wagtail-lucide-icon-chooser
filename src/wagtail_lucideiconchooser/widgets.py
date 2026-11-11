import json

from django.forms import widgets
from wagtail.admin.telepath import register
from wagtail.admin.widgets import WidgetAdapter


class LucideIconChooserWidget(widgets.TextInput):
    template_name = "wagtail_lucideiconchooser/widgets/icon-chooser-widget.html"

    class Media:
        css = {"all": ("wagtail_lucideiconchooser/css/icon-chooser-widget.css",)}  # noqa: RUF012
        js = (
            "wagtail_lucideiconchooser/js/icon-chooser-widget.js",
            "wagtail_lucideiconchooser/js/icon-chooser-widget-controller.js",
        )

    def __init__(self, attrs=None, icons=None):
        self.icons = icons or []
        default_attrs = {"class": "lucide-icon-chooser"}
        attrs = {**default_attrs, **(attrs or {})}
        super().__init__(attrs=attrs)

    def build_attrs(self, *args, **kwargs):
        attrs = super().build_attrs(*args, **kwargs)
        attrs["data-controller"] = "lucide-icon-chooser"
        if self.icons:
            attrs["data-icons-filter"] = json.dumps(self.icons)
        return attrs


class LucideIconChooserWidgetAdapter(WidgetAdapter):
    js_constructor = "wagtail_lucideiconchooser.widgets.LucideIconChooser"

    class Media:
        js = ("wagtail_lucideiconchooser/js/icon-chooser-widget-telepath.js",)


register(LucideIconChooserWidgetAdapter(), LucideIconChooserWidget)
