class LucideIconChooserController extends window.StimulusModule.Controller {
    connect() {
        const chooser = new window.LucideIconChooser(this.element.id);
        // Render the SVG for any pre-selected icon (server-rendered initial value)
        if (this.element.value) {
            chooser.loadIconNodes().then(() => {
                chooser.renderSelectedIcon(this.element.value);
            });
        }
    }
}

window.wagtail.app.register("lucide-icon-chooser", LucideIconChooserController);