import json
import urllib.request
from pathlib import Path
from urllib.error import URLError

from django.core.management.base import BaseCommand

JSON_URL = "https://unpkg.com/lucide-static/icon-nodes.json"

JSON_PATH = (
    Path(__file__).resolve().parent.parent.parent
    / "static"
    / "wagtail_lucideiconchooser"
    / "data"
    / "icon-nodes.json"
)


class Command(BaseCommand):
    help = "Download the latest icon-nodes.json from Lucide and replace bundled copy."

    def handle(self, *args, **options):
        self.stdout.write(f"Downloading from {JSON_URL} ...")

        try:
            with urllib.request.urlopen(JSON_URL, timeout=30) as resp:
                raw = resp.read().decode("utf-8")
        except URLError as e:
            self.stderr.write(f"Error downloading: {e}")
            return

        data = json.loads(raw)
        icon_count = len(data)
        self.stdout.write(f"Received {icon_count} icons.")

        JSON_PATH.write_text(raw, encoding="utf-8")
        self.stdout.write(self.style.SUCCESS(f"Written to {JSON_PATH}"))
        self.stdout.write(self.style.SUCCESS(f"Done. {icon_count} icons bundled."))
