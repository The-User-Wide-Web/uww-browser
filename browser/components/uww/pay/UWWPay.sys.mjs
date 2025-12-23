
export class UWWPay {
    constructor() {
        this.init();
    }

    init() {
        // Listen for omnibox input
        const urlbar = document.getElementById("urlbar-input");
        if (urlbar) {
            urlbar.addEventListener("input", this.checkInput.bind(this));
        }
    }

    checkInput(event) {
        const val = event.target.value;
        if (val.startsWith("Send $") || val.startsWith("send $")) {
            // Trigger Pay UI
            console.log("UWW Pay Triggered: " + val);
            // In a real implementation, show a popup
        }
    }
}
