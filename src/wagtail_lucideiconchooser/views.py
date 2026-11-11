from django.http import JsonResponse

from wagtail_lucideiconchooser.utils import get_icon_nodes


def icon_nodes(request):
    """Serve the bundled icon-nodes.json data for the admin modal."""
    return JsonResponse(get_icon_nodes())
