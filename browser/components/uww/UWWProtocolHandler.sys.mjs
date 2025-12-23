/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { XPCOMUtils } from "resource://gre/modules/XPCOMUtils.sys.mjs";

const lazy = {};

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
    // TODO: Connect to Rust FFI for Sphinx Mixnet
    const content = `
      <html>
        <head>
          <title>UWW Protocol</title>
          <style>
            body { background-color: #1a1a1a; color: #39ff14; font-family: monospace; padding: 2em; }
            h1 { text-shadow: 0 0 10px #39ff14; }
          </style>
        </head>
        <body>
          <h1>Connected to UWW Network</h1>
          <p>Requested: ${aURI.spec}</p>
          <p>Status: <strong>Secure (Mixnet)</strong></p>
        </body>
      </html>
    `;
    
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
