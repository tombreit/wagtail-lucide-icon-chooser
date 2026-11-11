# wagtail-lucide-icon-chooser

Lucide icon chooser widget for [Wagtail](https://wagtail.org/) model fields and
StreamField.

- **Admin widget** (`LucideIconChooserWidget`) with a searchable icon modal,
  usable on any `CharField` via `FieldPanel`.
- **StreamField block** (`LucideIconChooserBlock`), stores the icon name.
- **Template tag** (`{% lucide_icon %}`) that renders an icon as inline SVG.
- **Offline**: a copy of [Lucide](https://lucide.dev)'s `icon-nodes.json`
  (v1.30.0) ships with the package. No CDN request from the admin or frontend.

Requires Python ≥ 3.13, Wagtail ≥ 7.1. Currently installable from this git
repository (no PyPI release yet):

```
wagtail-lucide-icon-chooser @ git+https://github.com/tombreit/wagtail-lucide-icon-chooser@v0.1.0
```

## Setup

Add `wagtail_lucideiconchooser` to `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    # ...
    "wagtail_lucideiconchooser",
    # ...
]
```

The admin modal loads the icon data from `<admin prefix>/lucide-icons/icon-nodes.json`,
registered via the `register_admin_urls` hook. No URLconf changes are needed.

## Usage

### StreamField block

```python
from wagtail.fields import StreamField
from wagtail_lucideiconchooser.blocks import LucideIconChooserBlock

class MyPage(Page):
    body = StreamField([
        ("icon", LucideIconChooserBlock()),
    ], blank=True)
```

### Page/Model field

```python
from django.db import models
from wagtail.admin.panels import FieldPanel
from wagtail.models import Page
from wagtail_lucideiconchooser.widgets import LucideIconChooserWidget

class MyPage(Page):
    icon = models.CharField(max_length=100, blank=True)

    content_panels = Page.content_panels + [
        FieldPanel("icon", widget=LucideIconChooserWidget),
    ]
```

### Limiting available icons

```python
LucideIconChooserBlock(icons=["arrow-down", "arrow-right", "home"])
# or
FieldPanel("icon", widget=LucideIconChooserWidget(icons=["arrow-down", "arrow-right", "home"]))
```

## Rendering icons in templates

```django
{% load lucide_icon_tags %}
{% lucide_icon "arrow-down" %}

{# Custom CSS classes and extra SVG attributes #}
{% lucide_icon "arrow-down" class_name="h-6 w-6" width="20" height="20" %}
```

Unknown icon names render nothing.

## Updating the bundled icons (maintainers)

```bash
python manage.py update_lucide_icons
```

This downloads the latest `icon-nodes.json` from `lucide-static` (unpkg.com)
and overwrites the copy inside the package directory. Run it in a checkout of
this repository, then release a new version; running it against an installed
copy changes only that environment.

## Known limitations

- UI strings are hardcoded German (i18n planned).
- Installable from the git repository only (no PyPI release yet).

## License

[EUPL-1.2](LICENSE). The bundled Lucide icon data is licensed under ISC
(with some icons derived from Feather under MIT); see
[LICENSE-lucide](LICENSE-lucide).
