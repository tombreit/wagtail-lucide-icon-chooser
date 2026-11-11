(function () {
    "use strict";

    // Get the admin URL prefix from PAGES URL which is something like /cms/ or /admin/
    // The URL registered by register_admin_urls will be at {admin_prefix}lucide-icons/icon-nodes.json
    const getAdminPrefix = () => {
        const pagesUrl = window.wagtailConfig?.ADMIN_URLS?.PAGES || '';
        // If PAGES is /cms/ or /cms/pages/, we want /cms/
        // If PAGES is /pages/ (admin at root), we want /
        // Remove trailing slash, get directory part, add trailing slash
        const withoutTrailing = pagesUrl.replace(/\/$/, '');
        const lastSlash = withoutTrailing.lastIndexOf('/');
        if (lastSlash > 0) {
            const prefix = withoutTrailing.substring(0, lastSlash) + '/';
            return prefix;
        }
        // If there's only one slash at the beginning (like /pages), return /
        if (pagesUrl.startsWith('/')) {
            return '/';
        }
        return '/admin/';
    };
    const ICON_NODES_URL = getAdminPrefix() + "lucide-icons/icon-nodes.json";

    // Shared cache across all widget instances
    let sharedIconNodes = null;

    class LucideIconChooser {
        #iconNodes = null;
        #iconsFilter = null;
        #allIconNames = [];
        #modalOpen = false;
        #loaded = false;
        #modalGrid = null;
        #modalCount = null;

        constructor(id) {
            this.id = id;
            this.input = document.getElementById(id);
            this.container = document.getElementById(`${id}-icon-container`);
            this.modalTrigger = document.getElementById(`${id}-modal-trigger`);
            this.clearBtn = document.getElementById(`${id}-icon-clear`);

            const placeholder = this.modalTrigger?.querySelector(".lucide-icon-chooser__placeholder");
            this.defaultLabel = placeholder?.innerHTML ?? "―";

            const iconsFilterAttr = this.input?.getAttribute("data-icons-filter");
            if (iconsFilterAttr) {
                this.#iconsFilter = new Set(JSON.parse(iconsFilterAttr));
            }

            if (this.modalTrigger) {
                this.modalTrigger.addEventListener("click", () => this.openModal());
            }
            if (this.clearBtn) {
                this.clearBtn.addEventListener("click", () => this.clearIcon());
            }
        }

        setValue(name) {
            if (this.input) this.input.value = name;
        }

        renderSelectedIcon(iconName) {
            if (!this.#iconNodes?.[iconName]) return;
            if (!this.container) return;
            const svg = this.#nodesToSvg(this.#iconNodes[iconName], iconName, {
                width: "24",
                height: "24",
            });
            this.container.innerHTML = `<span class="lucide-icon-chooser__selected">${svg}</span>`;
        }

        clearIcon() {
            if (this.input) this.input.value = "";
            if (this.container) this.container.innerHTML = "";
            if (this.clearBtn) this.clearBtn.style.display = "none";
            const label = this.modalTrigger?.querySelector(".lucide-icon-chooser__label");
            if (label) label.innerHTML = this.defaultLabel;
        }

        async loadIconNodes() {
            if (this.#loaded) return;
            if (!sharedIconNodes) {
                const data = await fetch(ICON_NODES_URL).then((res) => res.json());
                sharedIconNodes = data;
            }
            this.#iconNodes = sharedIconNodes;
            this.#allIconNames = Object.keys(this.#iconNodes).sort();
            if (this.#iconsFilter) {
                this.#allIconNames = this.#allIconNames.filter((name) => this.#iconsFilter.has(name));
            }
            this.#loaded = true;
        }

        openModal() {
            if (this.#modalOpen) return;
            this.#modalOpen = true;

            const overlay = document.createElement("div");
            overlay.className = "lucide-icon-chooser-modal";
            overlay.setAttribute("role", "dialog");
            overlay.setAttribute("tabindex", "-1");
            overlay.innerHTML = `
                <div class="lucide-icon-chooser-modal__dialog">
                    <div class="lucide-icon-chooser-modal__header">
                        <h2 class="lucide-icon-chooser-modal__title">Icon w&auml;hlen</h2>
                        <button type="button" class="button button-small lucide-icon-chooser-modal__close">&times;</button>
                    </div>
                    <div style="padding: 0.5rem 1rem;">
                        <input type="text" class="lucide-icon-chooser-modal__search" placeholder="Suchen..." autocomplete="off">
                    </div>
                    <div class="lucide-icon-chooser-modal__body">
                        <div class="lucide-icon-chooser-modal__grid"><span class="lucide-icon-chooser-modal__loading">Laden...</span></div>
                    </div>
                    <div class="lucide-icon-chooser-modal__count"></div>
                </div>`;

            document.body.appendChild(overlay);

            const searchInput = overlay.querySelector(".lucide-icon-chooser-modal__search");
            const grid = overlay.querySelector(".lucide-icon-chooser-modal__grid");
            const countEl = overlay.querySelector(".lucide-icon-chooser-modal__count");

            this.#modalGrid = grid;
            this.#modalCount = countEl;

            const closeModal = () => {
                this.#modalOpen = false;
                overlay.remove();
                this.#modalGrid = null;
                this.#modalCount = null;
            };

            overlay.querySelector(".lucide-icon-chooser-modal__close").addEventListener("click", closeModal);
            overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
            const handleEscape = (e) => {
                if (e.key === "Escape" && this.#modalOpen) closeModal();
            };
            document.addEventListener("keydown", handleEscape);

            const renderGrid = (iconNames) => {
                grid.innerHTML = "";
                const frag = document.createDocumentFragment();
                for (const name of iconNames) {
                    const nodes = this.#iconNodes[name];
                    if (!nodes) continue;
                    const cell = document.createElement("div");
                    cell.className = "lucide-icon-chooser__icon-cell";
                    cell.innerHTML =
                        this.#nodesToSvg(nodes, name) +
                        `<span class="lucide-icon-chooser__icon-label">${name}</span>`;
                    cell.addEventListener("click", () => this.selectIcon(name));
                    frag.appendChild(cell);
                }
                grid.appendChild(frag);
                countEl.textContent = `${iconNames.length} Icons`;
            };

            searchInput.addEventListener("input", () => {
                const filter = searchInput.value.trim().toLowerCase();
                const filtered = this.#allIconNames.filter((n) => n.includes(filter));
                renderGrid(filtered);
            });

            this.loadIconNodes().then(() => {
                searchInput.value = "";
                searchInput.focus();
                renderGrid(this.#allIconNames);
            });
        }

        selectIcon(iconName) {
            this.setValue(iconName);
            this.renderSelectedIcon(iconName);
            if (this.clearBtn) this.clearBtn.style.display = "";
            const label = this.modalTrigger?.querySelector(".lucide-icon-chooser__label");
            if (label) label.textContent = iconName;
            if (this.#modalOpen) {
                const overlay = document.querySelector(".lucide-icon-chooser-modal");
                overlay?.remove();
                this.#modalOpen = false;
            }
        }

        #nodesToSvg(nodes, iconName, attrs = {}) {
            const extraClass = attrs.class ? ` ${attrs.class}` : "";
            const cls = `lucide lucide-${iconName}${extraClass}`;
            // Default attributes for the SVG
            const defaults = {
                "xmlns": "http://www.w3.org/2000/svg",
                "width": "24",
                "height": "24",
                "viewBox": "0 0 24 24",
                "fill": "none",
                "stroke": "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
            };
            // Merge defaults with passed attrs (passed attrs override defaults)
            const mergedAttrs = { ...defaults, ...attrs };
            // Build attribute string, excluding class which is handled separately
            const svgAttrs = Object.entries(mergedAttrs)
                .filter(([k]) => k !== "class")
                .map(([k, v]) => `${k}="${v}"`)
                .join(" ");
            const children = nodes.map(([tag, a]) => {
                const nodeAttrs = Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(" ");
                return `<${tag} ${nodeAttrs}></${tag}>`;
            }).join("");
            return `<svg ${svgAttrs} class="${cls}">${children}</svg>`;
        }
    }

    window.LucideIconChooser = LucideIconChooser;
})();