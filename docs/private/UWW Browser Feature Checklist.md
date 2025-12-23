# [[UWW]] Browser: Sovereign Implementation Specification

_The "Zen-Sidecar" Strategy for the New Internet._

## 1. The Core Fork Strategy (Anti-Fragile Updates)

To ensure that UWW remains secure while Mozilla updates the underlying engine, we utilize the **Sidecar Pattern**. All UWW-specific logic is isolated into dedicated directories to minimize merge conflicts during ESR rebases.

- **Rule 1: No Core Hacking.** Avoid modifying `netwerk/`, `dom/`, or `security/` C++ files. Use XPCOM shims and FFI instead.
    
- **Rule 2: The Sidecar Root.** All custom UWW code lives in `/browser/components/uww` and `/browser/themes/uww`.
    
- **Rule 3: Feature Gates.** Every modification must be wrapped in `if (AppConstants.UWW_ENABLED)` or defined in the `uww.js` preferences file.
    

## 2. Zen-Style UI & Experience

The UWW Browser is minimalist, vertical, and immersive, following the "Zen" design philosophy.

### A. Layout Transformation (Vertical Tabs)

- **Logic:** Move the primary navigation to the left sidebar.
    
- **Implementation:** * Hide the horizontal `#TabsToolbar` via CSS.
    
    - Inject `uww_zen_theme.css` into the browser chrome.
        
    - Use the `#sidebar-box` as the primary tab container with a "Compact" mode (icons only) and an "Expanded" mode (labels) on hover.
        

### B. The Protocol Address Bar

- **White (Legacy):** Standard `https://` URLs render with neutral white/gray styling.
    
- **Neon Green (Sovereign):** When a `uww://` protocol is detected, the URL bar glows with a 10px neon green shadow (`--uww-neon-green`).
    
- **Floating Omnibox:** The address bar is centered and floating, detached from the top of the frame.
    

## 3. Identity & Biometric Integration (The Invisible Keychain)

UWW treats biometrics as the primary authentication factor, mapping hardware-enclave keys to **Core 1 (Registry)** identities.

- **Hardware Support:** Native integration with **FaceID (iOS), TouchID (macOS), Windows Hello, and Android Fingerprint**.
    
- **nsIUWWIdentity:** A custom XPCOM component that serves as a C++ wrapper for the Rust `keyring` FFI.
    
- **Secure Enclave Handshake:**
    
    1. User visits a site requiring auth.
        
    2. Firefox triggers the OS biometric prompt.
        
    3. On success, the Secure Enclave signs a challenge.
        
    4. The signed hash is sent to the **Registry Core** for identity verification.
        
- **Pairing UI:** Built-in QR-code generator for cross-device key migration and "Invisible Keychain" syncing.
    

## 4. Stewardship & Authority UI

The browser acts as the "Stewardship Monitor" for the `.nu` namespace.

- **The Stewardship Widget:** A toolbar icon (left of the URL) that displays:
    
    - **Ownership Status:** Defaults to "Anonymous (Stealth)."
        
    - **Tax Health:** A progress bar showing time remaining until the domain "Burns."
        
    - **No Force Buy:** The UI is strictly prohibited from showing "Buy Now" buttons unless the owner has explicitly listed the domain for sale.
        
- **Authority UI (Web of Trust):** * **Blue Checkmarks:** Rendered if the domain has a valid **Authority Certificate** on the Social Core.
    
    - **Trust Settings:** A menu to manage "Trust Anchors" (which indexers or authorities the user trusts).
        

## 5. UWW Pay (The Economy UI)

Native payment primitives are embedded directly into the browser chrome.

- **Omnibox Actions:** Typing "Send $5 to @name" triggers a native "UWW Pay" confirmation modal.
    
- **One-Click Tip:** A dedicated "Heart/Coin" icon in the address bar that activates on sites with a valid `stewardship` record.
    
- **Fiat Converter:** Real-time conversion of NUDGE to USD/EUR/JPY in the UI for clarity.
    

## 6. Hybrid Network Architecture (`uww://`)

The browser operates a dual-stack networking engine.

- **Parallel Execution:** **Necko** (HTTP) and **UWW-Rust** (`uww://`) run in parallel.
    
- **Protocol Handler:** `uww://` requests are intercepted and handed to the **Sphinx 5-Hop Mixnet** via Rust FFI.
    
- **Bypass:** UWW traffic never touches the system DNS or standard TCP stack; it is tunneled through the Mixnet and resolved via **Core 1 (Registry)**.
    

## 7. Performance & Hard Hardening

Optimization and removal of legacy "Web2" noise.

- **The Speed-Stack:**
    
    - **Skeleton UI:** Immediate local WASM rendering while the Mixnet fetches data.
        
    - **Background Pre-fetch:** Predictive hints from `Aether` warm background circuits for likely next clicks.
        
    - **GPU-Acc Crypto:** Cryptographic packet wrapping is offloaded to the GPU to maintain 60fps scrolling.
        
- **Hard Removals:**
    
    - **Telemetry:** Every probe in `toolkit/components/telemetry` is stripped.
        
    - **Google Services:** Safe-Browsing, Location Services, and default Google DNS are removed.
        
- **Verified Source Action:** Right-click any page -> **"View Verified Source"** to open the on-chain code viewer.
    

## 8. Development Path

|   |   |   |
|---|---|---|
|**Component**|**Location**|**Implementation Detail**|
|**Rust FFI**|`/browser/components/uww/rust`|The `uww-sys` crate bridge.|
|**Zen UI**|`/browser/themes/uww/zen.css`|XUL/CSS overrides for layout.|
|**Payment UI**|`/browser/components/uww/pay`|Fluent-based UI for Nudge transfers.|
|**Identity**|`/browser/components/uww/id`|XPCOM bridge to OS Keystore/TPM.|

_UWW Browser: Where Zen Beauty meets Sovereign Security._