from functools import cache
from pathlib import Path

_ICON_NODES_PATH = (
    Path(__file__).resolve().parent
    / "static"
    / "wagtail_lucideiconchooser"
    / "data"
    / "icon-nodes.json"
)


@cache
def get_icon_nodes() -> dict[str, list]:
    import json

    with open(_ICON_NODES_PATH) as f:
        return json.load(f)


def get_icon_names() -> list[str]:
    return sorted(get_icon_nodes().keys())


def nodes_to_svg(nodes: list, attrs: dict[str, str] | None = None) -> str:
    """Convert icon-nodes.json entry to SVG markup.

    nodes – [[tag, {attributes}], ...]  e.g. icon-nodes.json value
    attrs – top-level SVG attributes to merge/set (class, width, height, …)
    """
    default_svg = {
        "xmlns": "http://www.w3.org/2000/svg",
        "width": "24",
        "height": "24",
        "viewBox": "0 0 24 24",
        "fill": "none",
        "stroke": "currentColor",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
    }
    final_svg = {**default_svg, **(attrs or {})}
    svg_attrs = f'xmlns="{final_svg["xmlns"]}"'
    for k, v in final_svg.items():
        if k != "xmlns":
            svg_attrs += f' {k}="{v}"'
    svg_parts = [f"<svg {svg_attrs}>"]
    for tag_name, node_attrs in nodes:
        inner = "".join(f' {k}="{v}"' for k, v in node_attrs.items())
        svg_parts.append(f"<{tag_name}{inner}></{tag_name}>")
    svg_parts.append("</svg>")
    return "".join(svg_parts)
