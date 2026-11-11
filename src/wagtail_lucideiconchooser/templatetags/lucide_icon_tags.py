from django import template
from django.utils.safestring import mark_safe

from wagtail_lucideiconchooser.utils import get_icon_nodes, nodes_to_svg

register = template.Library()


@register.simple_tag
def lucide_icon(icon_name: str, *, class_name: str = "lucide-icon", **attrs):
    """Render a Lucide icon inline as SVG.

    Usage:
        {% load lucide_icon_tags %}
        {% lucide_icon "arrow-down" %}
        {% lucide_icon "arrow-down" class_name="h-6 w-6" width="24" height="24" %}
    """
    icon_nodes = get_icon_nodes()
    if icon_name not in icon_nodes:
        return ""
    css_class = attrs.pop("class", class_name)
    lucide_classes = f"lucide lucide-{icon_name}".split()
    css_class = " ".join([*lucide_classes, *css_class.split()])
    node_attrs = {"class": css_class, **attrs}
    return mark_safe(nodes_to_svg(icon_nodes[icon_name], node_attrs))
