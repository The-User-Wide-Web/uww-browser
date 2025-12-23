/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { XPCOMUtils } from "resource://gre/modules/XPCOMUtils.sys.mjs";
import { ctypes } from "resource://gre/modules/ctypes.sys.mjs";

const lazy = {};

// Define the Rust FFI interface
const libuww = (function() {
  try {
    // The library name depends on the OS. 
    // Since it's linked into libxul (gkrust), we might be able to load it from the main process
    // or we might need to load the specific dylib if it was built as one.
    // However, since we linked it statically into gkrust, the symbols should be available in the main executable.
    // ctypes.libraryName("xul") might work if symbols are exported.
    // Alternatively, if we built it as a separate dylib, we'd load that.
    // Given the build config, it's in gkrust.
    
    let lib;
    try {
        // Try loading from the main library (libxul)
        lib = ctypes.open(ctypes.libraryName("xul")); 
    } catch (e) {
        // Fallback or specific handling
        console.error("Could not open libxul for UWW FFI", e);
        return null;
    }

    return {
        uww_init: lib.declare("uww_init", ctypes.default_abi, ctypes.int),
        uww_fetch_url: lib.declare("uww_fetch_url", ctypes.default_abi, ctypes.char.ptr, ctypes.char.ptr),
        uww_free_string: lib.declare("uww_free_string", ctypes.default_abi, ctypes.void_t, ctypes.char.ptr),
        close: () => lib.close()
    };
  } catch (e) {
    console.error("Failed to initialize UWW FFI", e);
    return null;
  }
})();

// Initialize the Rust subsystem once
if (libuww) {
    libuww.uww_init();
}

export class UWWProtocolHandler {
  constructor() {
    this.scheme = "uww";
    this.defaultPort = -1;
    this.protocolFlags = Ci.nsIProtocolHandler.URI_NORELATIVE |
                         Ci.nsIProtocolHandler.URI_NOAUTH |
                         Ci.nsIProtocolHandler.URI_LOADABLE_BY_ANYONE;
  }

  newURI(aSpec, aOriginCharset, aBaseURI) {
    return Cc["@mozilla.org/network/simple-uri;1"].createInstance(Ci.nsIURI).mutate().setSpec(aSpec).finalize();
  }

  newChannel(aURI, aLoadInfo) {
    let content = "";
    
    if (libuww) {
        const urlPtr = libuww.uww_fetch_url(aURI.spec);
        if (!urlPtr.isNull()) {
            content = urlPtr.readString();
            libuww.uww_free_string(urlPtr);
        } else {
            content = "Error: Failed to fetch via UWW Mixnet (Rust FFI returned null)";
        }
    } else {
        content = "Error: UWW FFI not initialized";
    }

    // Fallback HTML wrapping if raw content is returned
    if (!content.trim().startsWith("<html")) {
         content = `
            <html>
            <head>
                <title>UWW Protocol</title>
                <style>
                body { background-color: #1a1a1a; color: #39ff14; font-family: monospace; padding: 2em; }
                h1 { text-shadow: 0 0 10px #39ff14; }
                .content { border: 1px solid #39ff14; padding: 1em; margin-top: 1em; }
                </style>
            </head>
            <body>
                <h1>Connected to UWW Network</h1>
                <p>Requested: ${aURI.spec}</p>
                <div class="content">${content}</div>
            </body>
            </html>
        `;
    }
    
    const stream = Cc["@mozilla.org/io/string-input-stream;1"].createInstance(Ci.nsIStringInputStream);
    stream.setData(content, content.length);
    
    const channel = Cc["@mozilla.org/network/input-stream-channel;1"].createInstance(Ci.nsIInputStreamChannel);
    channel.setURI(aURI);
    channel.contentStream = stream;
    channel.loadInfo = aLoadInfo;
    return channel;
  }

  allowPort(port, scheme) {
    return false;
  }
}

UWWProtocolHandler.prototype.classID = Components.ID("{c0ffee00-uww0-0000-0000-000000000001}");
UWWProtocolHandler.prototype.QueryInterface = ChromeUtils.generateQI(["nsIProtocolHandler"]);
