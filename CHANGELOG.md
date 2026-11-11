# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-11-11

### Added

- Initial release, extracted from the pflastr (bdfy.de) project.
- `LucideIconChooserWidget` admin widget with a searchable icon modal, incl.
  an optional `icons=[...]` filter; Telepath adapter for StreamField.
- `LucideIconChooserBlock` StreamField block.
- `{% lucide_icon %}` template tag rendering icons as inline SVG.
- Bundled offline copy of Lucide's `icon-nodes.json` (v1.30.0), served to the
  admin via a `register_admin_urls` hook.
- `update_lucide_icons` management command to refresh the bundled icon data.

### Known limitations

- UI strings are hardcoded German (i18n planned).
- Installable from the git repository only (no PyPI release yet).
