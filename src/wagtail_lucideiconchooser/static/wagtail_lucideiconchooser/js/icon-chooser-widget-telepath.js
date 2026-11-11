class LucideIconChooserTelepath {
    render(_placeholder, name, id, initialState = "") {
        const value = initialState || "";
        const hasValue = value !== "";
        _placeholder.outerHTML = `
            <div class="lucide-icon-chooser">
                <div class="lucide-icon-chooser__selector">
                    <input type="hidden" name="${name}" id="${id}" data-controller="lucide-icon-chooser" class="lucide-icon-chooser" value="${value}">
                    <div class="lucide-icon-chooser__preview">
                        <button type="button" id="${id}-modal-trigger" class="button button-secondary lucide-icon-chooser__open-modal">
                            <span id="${id}-icon-container" class="lucide-icon-chooser__icon-container">${hasValue ? '<span class="lucide-icon-chooser__selected" data-icon-name="' + value + '"></span>' : ""}</span>
                            <span class="lucide-icon-chooser__label">${hasValue ? value : "—"}</span>
                        </button>
                        <button type="button" id="${id}-icon-clear" class="button button-small lucide-icon-chooser__clear-btn" style="${hasValue ? '' : 'display:none'}">Löschen</button>
                    </div>
                </div>
            </div>`;
        return new window.LucideIconChooser(id);
    }
}

window.telepath.register("wagtail_lucideiconchooser.widgets.LucideIconChooser", LucideIconChooserTelepath);