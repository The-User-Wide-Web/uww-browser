
export class UWWPay {
    constructor(win) {
        this.win = win;
        this.init();
    }

    init() {
        const doc = this.win.document;
        // Listen for omnibox input
        const urlbar = doc.getElementById("urlbar-input");
        if (urlbar) {
            urlbar.addEventListener("input", this.checkInput.bind(this));
        }
    }

    checkInput(event) {
        const val = event.target.value;
        // Regex for "Send $5 to @name"
        const match = val.match(/^Send \$(\d+) to @(\w+)$/i);
        
        if (match) {
            const amount = match[1];
            const recipient = match[2];
            
            // Show payment confirmation
            this.showPaymentPopup(amount, recipient);
        }
    }

    showPaymentPopup(amount, recipient) {
        const browser = this.win.gBrowser.selectedBrowser;
        const PopupNotifications = this.win.PopupNotifications;
        
        if (!PopupNotifications) return;

        PopupNotifications.show(
            browser,
            "uww-pay-confirmation",
            `Send $${amount} to @${recipient}?`,
            "uww-pay-icon", // Needs CSS class or image
            {
                label: "Confirm Payment",
                accessKey: "C",
                callback: () => {
                    this.processPayment(amount, recipient);
                }
            },
            [
                {
                    label: "Cancel",
                    accessKey: "N",
                    callback: () => {}
                }
            ]
        );
    }

    processPayment(amount, recipient) {
        console.log(`Processing payment of $${amount} to @${recipient} via Nudge Network`);
        // In a real implementation, this would call the Rust FFI to construct and send the transaction
        // const txId = libuww.send_payment(amount, recipient);
        
        // Show success notification
        const browser = this.win.gBrowser.selectedBrowser;
        this.win.PopupNotifications.show(
            browser,
            "uww-pay-success",
            `Sent $${amount} to @${recipient}!`,
            null,
            null,
            null
        );
    }
}
