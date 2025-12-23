
export class UWWStewardship {
    constructor() {
        this.init();
    }

    init() {
        // Inject button into navbar
        const navbar = document.getElementById("nav-bar-customization-target");
        if (navbar) {
            let btn = document.getElementById("uww-stewardship-button");
            if (!btn) {
                btn = document.createXULElement("toolbarbutton");
                btn.id = "uww-stewardship-button";
                btn.setAttribute("label", "Stewardship");
                btn.setAttribute("class", "toolbarbutton-1 chromeclass-toolbar-additional");
                btn.setAttribute("removable", "true");
                btn.addEventListener("command", this.openPanel.bind(this));
                
                // Insert before urlbar
                const urlbar = document.getElementById("urlbar-container");
                navbar.insertBefore(btn, urlbar);
            }
        }
    }

    openPanel(event) {
        // TODO: Open a panel with stewardship info
        console.log("Open Stewardship Panel");
    }
}
