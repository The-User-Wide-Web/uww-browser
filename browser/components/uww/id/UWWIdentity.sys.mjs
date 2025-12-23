import { XPCOMUtils } from "resource://gre/modules/XPCOMUtils.sys.mjs";
import { ctypes } from "resource://gre/modules/ctypes.sys.mjs";

const lazy = {};

// Define the Rust FFI interface for Identity
const libuwwid = (function() {
  try {
    let lib;
    try {
        // Assuming linked into libxul as well, or we need to add it to gkrust
        lib = ctypes.open(ctypes.libraryName("xul")); 
    } catch (e) {
        console.error("Could not open libxul for UWW Identity FFI", e);
        return null;
    }

    return {
        uww_identity_sign_challenge: lib.declare("uww_identity_sign_challenge", ctypes.default_abi, ctypes.char.ptr, ctypes.char.ptr),
        uww_free_string: lib.declare("uww_free_string", ctypes.default_abi, ctypes.void_t, ctypes.char.ptr), // Reuse from uww-sys if possible, or duplicate
    };
  } catch (e) {
    console.error("Failed to initialize UWW Identity FFI", e);
    return null;
  }
})();

export class UWWIdentity {
  constructor() {
    this.QueryInterface = ChromeUtils.generateQI(["nsIUWWIdentity"]);
  }

  signChallenge(challenge) {
    if (!libuwwid) {
        throw new Error("UWW Identity FFI not initialized");
    }
    
    const sigPtr = libuwwid.uww_identity_sign_challenge(challenge);
    if (sigPtr.isNull()) {
        throw new Error("Failed to sign challenge");
    }
    
    const signature = sigPtr.readString();
    // libuwwid.uww_free_string(sigPtr); // Need to ensure we have a free function
    return signature;
  }
}
