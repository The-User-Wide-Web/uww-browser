
export class UWWStewardship {
    constructor(win) {
        this.win = win;
        this.init();
    }

    init() {
        const doc = this.win.document;
        // Inject button into navbar
        const navbar = doc.getElementById("nav-bar-customization-target");
        if (navbar) {
            let btn = doc.getElementById("uww-stewardship-button");
            if (!btn) {
                btn = doc.createXULElement("toolbarbutton");
                btn.id = "uww-stewardship-button";
                btn.setAttribute("label", "Stewardship");
                btn.setAttribute("class", "toolbarbutton-1 chromeclass-toolbar-additional");
                btn.setAttribute("removable", "true");
                btn.addEventListener("command", this.openPanel.bind(this));
                
                // Insert before urlbar
                const urlbar = doc.getElementById("urlbar-container");
                if (urlbar) {
                    navbar.insertBefore(btn, urlbar);
                } else {
                    navbar.appendChild(btn);
                }
            }
        }
    }

    openPanel(event) {
        const doc = this.win.document;
        let panel = doc.getElementById("uww-stewardship-panel");
        
        if (!panel) {
            panel = doc.createXULElement("panel");
            panel.id = "uww-stewardship-panel";
            panel.setAttribute("type", "arrow");
            panel.setAttribute("noautofocus", "true");
            
            const vbox = doc.createXULElement("vbox");
            vbox.className = "uww-panel-content";
            
            // Title
            const title = doc.createXULElement("label");
            title.setAttribute("value", "Domain Stewardship");
            title.className = "header";
            vbox.appendChild(title);
            
            // Status
            this.addRow(doc, vbox, "Status:", "Anonymous (Stealth)");
            this.addRow(doc, vbox, "Tax Health:", "Good (95%)");
            
            // Health Bar
            const bar = doc.createXULElement("html:div");
            bar.className = "tax-health-bar";
            const fill = doc.createXULElement("html:div");
            fill.className = "tax-health-fill";
            bar.appendChild(fill);
            vbox.appendChild(bar);

            panel.appendChild(vbox);
            doc.getElementById("mainPopupSet").appendChild(panel);
        }
        
        panel.openPopup(event.target, "bottomcenter topright", 0, 0, false, false);
    }

    addRow(doc, container, labelText, valueText) {
        const row = doc.createXULElement("hbox");
        row.className = "stewardship-row";
        
        const label = doc.createXULElement("label");
        label.className = "stewardship-label";
        label.setAttribute("value", labelText);
        
        const value = doc.createXULElement("label");
        value.className = "stewardship-value";
        value.setAttribute("value", valueText);
        
        row.appendChild(label);
        row.appendChild(value);
        container.appendChild(row);
    }
}
