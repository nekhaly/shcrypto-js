"use strict";
import fetch from "node-fetch";
import * as wasm_go from "./wasm_exec.js";

const WASM_URL = "./bin/shcrypto.wasm";
var shcrypto_wasm;
function init() {
  const go = new wasm_go.Go();
  if ("instantiateStreaming" in WebAssembly) {
    WebAssembly.instantiateStreaming(fetch(ENC_URL), go.importObject).then(
      function (obj) {
        shcrypto_wasm = obj.instance;
        go.run(shcrypto_wasm);
      }
    );
  } else {
    fetch(WASM_URL)
      .then((resp) => resp.arrayBuffer())
      .then((bytes) =>
        WebAssembly.instantiate(bytes, go.importObject).then(function (obj) {
          shcrypto_wasm = obj.instance;
          go.run(shcrypto_wasm);
        })
      );
  }
}

init();

module.exports = {
  encrypt: function (message, eonPublicKey, epochID, sigma) {
    return shcrypto_encrypt(message, eonPublicKey, epochID, sigma);
  },
  decrypt: function (encryptedMessage, decryptionKey) {
    return shcrypto_decrypt(encryptedMessage, decryptionKey);
  },
  verifyDecryptionKey: function (decryptionKey, eonPublicKey, epochID) {
    return shcrypto_verifyDecryptionKey(decryptionKey, eonPublicKey, epochID);
  },
};
