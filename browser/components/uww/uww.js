// UWW Browser Preferences
// This file is loaded as a chrome script or module

export const UWWPrefs = {
    init() {
        console.log("UWW Prefs Initialized");
        this.loadZenTheme();
        
        // Initialize Subsystems
        // Note: In a real implementation, these would be initialized by the component manager or specific window listeners
        // For this sidecar, we might need to hook into window opening to attach UI elements.
    },

    loadZenTheme() {
        const sss = Cc["@mozilla.org/content/style-sheet-service;1"]
                      .getService(Ci.nsIStyleSheetService);
        const uri = Services.io.newURI("chrome://uww/content/zen.css");
        if (!sss.sheetRegistered(uri, sss.USER_SHEET)) {
            sss.loadAndRegisterSheet(uri, sss.USER_SHEET);
        }
    }
};
