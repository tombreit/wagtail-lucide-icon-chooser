from django.urls import path
from wagtail import hooks

from wagtail_lucideiconchooser.views import icon_nodes


@hooks.register("register_admin_urls")
def register_admin_urls():
    return [
        path("lucide-icons/icon-nodes.json", icon_nodes, name="lucide_icon_nodes"),
    ]
