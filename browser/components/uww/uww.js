// UWW Browser Preferences
// This file is loaded as a chrome script or module

import { UWWStewardship } from "resource:///modules/stewardship/UWWStewardship.sys.mjs";
import { UWWPay } from "resource:///modules/pay/UWWPay.sys.mjs";

export const UWWPrefs = {
    init() {
        console.log("UWW Prefs Initialized");
        this.applyHardening();
        this.loadZenTheme();
        this.initWindowListener();
    },

    applyHardening() {
        // Hard Removals: Telemetry, SafeBrowsing, Geo, Google DNS
        const prefs = Services.prefs;
        
        // Telemetry
        prefs.setBoolPref("toolkit.telemetry.enabled", false);
        prefs.setBoolPref("toolkit.telemetry.unified", false);
        prefs.setBoolPref("datareporting.healthreport.uploadEnabled", false);
        
        // Safe Browsing (Google Services)
        prefs.setBoolPref("browser.safebrowsing.malware.enabled", false);
        prefs.setBoolPref("browser.safebrowsing.phishing.enabled", false);
        prefs.setBoolPref("browser.safebrowsing.downloads.enabled", false);
        
        // Location Services
        prefs.setBoolPref("geo.enabled", false);
        
        // DNS / TRR (Remove Google DNS)
        prefs.setIntPref("network.trr.mode", 5); // 5 = Off
        prefs.setCharPref("network.trr.uri", "");
    },

    loadZenTheme() {
        const sss = Cc["@mozilla.org/content/style-sheet-service;1"]
                      .getService(Ci.nsIStyleSheetService);
        const uri = Services.io.newURI("chrome://uww/content/zen.css");
        if (!sss.sheetRegistered(uri, sss.USER_SHEET)) {
            sss.loadAndRegisterSheet(uri, sss.USER_SHEET);
        }
    },

    initWindowListener() {
        // Handle existing windows
        for (let win of Services.wm.getEnumerator("navigator:browser")) {
            this.attachToWindow(win);
        }

        // Listen for new windows
        Services.wm.addListener({
            onOpenWindow: (xulWindow) => {
                const win = xulWindow.docShell.domWindow;
                win.addEventListener("load", () => {
                    if (win.document.documentElement.getAttribute("windowtype") === "navigator:browser") {
                        this.attachToWindow(win);
                    }
                }, { once: true });
            },
            onCloseWindow: () => {},
            onWindowTitleChange: () => {}
        });
    },

    attachToWindow(win) {
        if (win.UWW_Attached) return;
        win.UWW_Attached = true;

        console.log("Attaching UWW components to window");

        // Initialize UI Components
        new UWWStewardship(win);
        new UWWPay(win);
        this.addVerifiedSourceMenu(win);
    },

    addVerifiedSourceMenu(win) {
        const doc = win.document;
        const menu = doc.getElementById("contentAreaContextMenu");
        if (menu) {
            const item = doc.createXULElement("menuitem");
            item.id = "context-uww-verified-source";
            item.setAttribute("label", "View Verified Source");
            item.setAttribute("class", "menuitem-iconic");
            // item.setAttribute("image", "chrome://uww/content/stewardship/shield.svg");
            item.addEventListener("command", () => {
                const browser = win.gBrowser.selectedBrowser;
                const url = browser.currentURI.spec;
                console.log("View Verified Source for: " + url);
                // In a real impl, this would open the on-chain viewer
                win.gBrowser.addTab("uww://verified-source/" + encodeURIComponent(url));
            });
            
            // Insert after "View Page Source"
            const viewSource = doc.getElementById("context-viewsource");
            if (viewSource) {
                menu.insertBefore(item, viewSource.nextSibling);
            } else {
                menu.appendChild(item);
            }
        }
    }
};
