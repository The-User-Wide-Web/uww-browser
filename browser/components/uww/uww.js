// UWW Browser Preferences
// This file is loaded as a chrome script or module

export const UWWPrefs = {
    init() {
        console.log("UWW Prefs Initialized");
        this.loadZenTheme();
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
