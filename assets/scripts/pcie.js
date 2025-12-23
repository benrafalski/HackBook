// PCI CONFIG_ADDRESS Converter
function parseVal(str) {
  if (!str) return 0 >>> 0;
  const s = str.trim().toLowerCase();
  try {
    if (s.startsWith("0x")) return Number.parseInt(s, 16) >>> 0;
    if (s.startsWith("0b")) return Number.parseInt(s.slice(2), 2) >>> 0;
    if (/^[0-9]+$/.test(s)) return Number.parseInt(s, 10) >>> 0;
    // Also try parsing as hex without 0x prefix (common for VID/DID)
    if (/^[0-9a-f]+$/.test(s)) return Number.parseInt(s, 16) >>> 0;
    return 0 >>> 0;
  } catch {
    return 0 >>> 0;
  }
}

function parseHexId(str) {
  if (!str) return null;
  const s = str.trim().toLowerCase().replace(/^0x/, '');
  if (/^[0-9a-f]{1,4}$/.test(s)) {
    return s.padStart(4, '0');
  }
  return null;
}

function parseBDFO(bdfoStr) {
  // Parse format like "00:1f.7 0xf0" or "0:31.7 240"
  const parts = bdfoStr.trim().split(/\s+/);
  if (parts.length !== 2) return null;

  const [bdf, offsetStr] = parts;
  const bdfParts = bdf.split(/[:.]/);
  if (bdfParts.length !== 3) return null;

  try {
    const bus = parseInt(bdfParts[0], 16);
    const device = parseInt(bdfParts[1], 16);
    const func = parseInt(bdfParts[2], 16);
    const offset = parseVal(offsetStr);

    if (
      bus > 255 ||
      device > 31 ||
      func > 7 ||
      offset > 255 ||
      (offset & 3) !== 0
    ) {
      return null;
    }

    return { bus, device, func, offset };
  } catch {
    return null;
  }
}

function bdfoToConfigAddress(bus, device, func, offset) {
  let configAddr = 0x80000000; // Enable bit set
  configAddr |= (bus & 0xff) << 16;
  configAddr |= (device & 0x1f) << 11;
  configAddr |= (func & 0x07) << 8;
  configAddr |= offset & 0xfc;
  return configAddr >>> 0;
}

function configAddressToBDFO(configAddr) {
  const enable = (configAddr >>> 31) & 1;
  const bus = (configAddr >>> 16) & 0xff;
  const device = (configAddr >>> 11) & 0x1f;
  const func = (configAddr >>> 8) & 0x07;
  const offset = configAddr & 0xfc;

  return { enable, bus, device, func, offset };
}

function updateConfigDisplay(configAddr) {
  const decoded = configAddressToBDFO(configAddr);

  // Update bit fields in diagram
  document.getElementById("enableBit").textContent = decoded.enable ? "1" : "0";
  document.getElementById("busBits").textContent = `0x${decoded.bus
    .toString(16)
    .padStart(2, "0")
    .toUpperCase()}`;
  document.getElementById("deviceBits").textContent = `0x${decoded.device
    .toString(16)
    .toUpperCase()}`;
  document.getElementById("functionBits").textContent = `0x${decoded.func
    .toString(16)
    .toUpperCase()}`;
  document.getElementById("offsetBits").textContent = `0x${decoded.offset
    .toString(16)
    .padStart(2, "0")
    .toUpperCase()}`;

  // Update info fields
  document.getElementById("busValue").textContent = `0x${decoded.bus
    .toString(16)
    .padStart(2, "0")
    .toUpperCase()} (${decoded.bus})`;
  document.getElementById("deviceValue").textContent = `0x${decoded.device
    .toString(16)
    .toUpperCase()} (${decoded.device})`;
  document.getElementById("functionValue").textContent = `0x${decoded.func
    .toString(16)
    .toUpperCase()} (${decoded.func})`;
  document.getElementById("offsetValue").textContent = `0x${decoded.offset
    .toString(16)
    .padStart(2, "0")
    .toUpperCase()} (${decoded.offset})`;
  document.getElementById("enableValue").textContent = `${decoded.enable} (${
    decoded.enable ? "Enabled" : "Disabled"
  })`;
}

// BAR Decoder Functions
function decodeBAR(bar0, bar1) {
  const isIoSpace = (bar0 & 0x1) === 1;

  if (isIoSpace) {
    // I/O Space BAR
    const address = bar0 & 0xfffffffc;
    return {
      type: "I/O Space",
      address: `0x${address.toString(16).toUpperCase()}`,
      size: "N/A (probe required)",
      prefetchable: "N/A",
      is64bit: false,
    };
  } else {
    // Memory Space BAR
    const type = (bar0 >> 1) & 0x3;
    const prefetchable = (bar0 & 0x8) !== 0;

    let address;
    let is64bit = false;

    if (type === 0) {
      // 32-bit address
      address = (bar0 & 0xfffffff0) >>> 0;
    } else if (type === 2) {
      // 64-bit address
      is64bit = true;
      const low = (bar0 & 0xfffffff0) >>> 0;
      const high = bar1 >>> 0;
      // Use BigInt for proper 64-bit arithmetic
      address = (BigInt(high) << 32n) | BigInt(low);
    } else {
      return {
        type: "Reserved/Invalid",
        address: "N/A",
        size: "N/A",
        prefetchable: "N/A",
        is64bit: false,
      };
    }

    return {
      type: is64bit ? "Memory Space (64-bit)" : "Memory Space (32-bit)",
      address: `0x${address.toString(16).toUpperCase()}`,
      size: "N/A (probe required)",
      prefetchable: prefetchable ? "Yes" : "No",
      is64bit: is64bit,
    };
  }
}

function updateBARDisplay(bar0, bar1) {
  const decoded = decodeBAR(bar0, bar1);

  document.getElementById("barType").textContent = decoded.type;
  document.getElementById("barAddress").textContent = decoded.address;
  document.getElementById("barSize").textContent = decoded.size;
  document.getElementById("barPrefetch").textContent = decoded.prefetchable;
}

// Command Register Decoder Functions
function decodeCommandRegister(cmdValue) {
  return {
    ioSpace: (cmdValue & 0x1) !== 0,
    memSpace: (cmdValue & 0x2) !== 0,
    busMaster: (cmdValue & 0x4) !== 0,
    specialCycles: (cmdValue & 0x8) !== 0,
    memWrInv: (cmdValue & 0x10) !== 0,
    vgaSnoop: (cmdValue & 0x20) !== 0,
    parityErr: (cmdValue & 0x40) !== 0,
    serrEn: (cmdValue & 0x100) !== 0,
    fastB2b: (cmdValue & 0x200) !== 0,
    intDisable: (cmdValue & 0x400) !== 0,
  };
}

function updateCommandDisplay(cmdValue) {
  const decoded = decodeCommandRegister(cmdValue);

  const formatBit = (enabled) => (enabled ? "1 (Enabled)" : "0 (Disabled)");

  document.getElementById("cmdIoSpace").textContent = formatBit(
    decoded.ioSpace
  );
  document.getElementById("cmdMemSpace").textContent = formatBit(
    decoded.memSpace
  );
  document.getElementById("cmdBusMaster").textContent = formatBit(
    decoded.busMaster
  );
  document.getElementById("cmdSpecialCycles").textContent = formatBit(
    decoded.specialCycles
  );
  document.getElementById("cmdMemWrInv").textContent = formatBit(
    decoded.memWrInv
  );
  document.getElementById("cmdVgaSnoop").textContent = formatBit(
    decoded.vgaSnoop
  );
  document.getElementById("cmdParityErr").textContent = formatBit(
    decoded.parityErr
  );
  document.getElementById("cmdSerrEn").textContent = formatBit(decoded.serrEn);
  document.getElementById("cmdFastB2b").textContent = formatBit(
    decoded.fastB2b
  );
  document.getElementById("cmdIntDisable").textContent = formatBit(
    decoded.intDisable
  );
}

// VID/DID Lookup Functions
let vidDidLookupTimeout = null;

async function lookupVidDid(vendorId, deviceId) {
  const vendorDescEl = document.getElementById("vendorDesc");
  const deviceDescEl = document.getElementById("deviceDesc");

  // Reset display
  vendorDescEl.textContent = "-";
  deviceDescEl.textContent = "-";

  if (!vendorId && !deviceId) {
    return;
  }

  // Build API URL with CORS proxy
  let targetUrl = "https://pcilookup.com/api.php?action=search";
  if (vendorId) {
    targetUrl += `&vendor=${vendorId}`;
  }
  if (deviceId) {
    targetUrl += `&device=${deviceId}`;
  }

  // Use allorigins.win proxy to bypass CORS
  const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

  vendorDescEl.textContent = "Looking up...";
  deviceDescEl.textContent = "Looking up...";

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    // allorigins wraps response in { contents: "..." }
    const wrapper = await response.json();
    const data = JSON.parse(wrapper.contents);

    if (data && data.length > 0) {
      const result = data[0];
      vendorDescEl.textContent = result.venDesc ? result.venDesc.trim() : `Unknown (0x${vendorId})`;
      deviceDescEl.textContent = result.desc ? result.desc.trim() : `Unknown (0x${deviceId})`;
    } else {
      vendorDescEl.textContent = vendorId ? `Unknown (0x${vendorId})` : "-";
      deviceDescEl.textContent = deviceId ? `Unknown (0x${deviceId})` : "-";
    }
  } catch (error) {
    console.error("VID/DID lookup failed:", error);
    vendorDescEl.textContent = vendorId ? `Lookup failed (0x${vendorId})` : "-";
    deviceDescEl.textContent = deviceId ? `Lookup failed (0x${deviceId})` : "-";
  }
}

function debouncedVidDidLookup() {
  const vidInput = document.getElementById("vidInput");
  const didInput = document.getElementById("didInput");

  if (vidDidLookupTimeout) {
    clearTimeout(vidDidLookupTimeout);
  }

  vidDidLookupTimeout = setTimeout(() => {
    const vendorId = parseHexId(vidInput.value);
    const deviceId = parseHexId(didInput.value);
    lookupVidDid(vendorId, deviceId);
  }, 500); // 500ms debounce
}

// Decoder Panel Switching
function switchDecoderPanel(panelType) {
  const panels = {
    viddid: document.getElementById("viddidDecoder"),
    bar: document.getElementById("barDecoder"),
    command: document.getElementById("commandDecoder"),
  };

  // Hide all panels
  Object.values(panels).forEach((panel) => {
    if (panel) panel.style.display = "none";
  });

  // Show selected panel
  if (panels[panelType]) {
    panels[panelType].style.display = "block";
  }
}

// Update the DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", () => {
  // Decoder panel selector initialization
  const decoderSelect = document.getElementById("decoderSelect");
  if (decoderSelect) {
    decoderSelect.addEventListener("change", (e) => {
      switchDecoderPanel(e.target.value);
    });
    // Initialize to show VID/DID panel by default
    switchDecoderPanel("viddid");
  }

  // VID/DID Decoder initialization
  const vidInput = document.getElementById("vidInput");
  const didInput = document.getElementById("didInput");

  if (vidInput && didInput) {
    vidInput.addEventListener("input", debouncedVidDidLookup);
    didInput.addEventListener("input", debouncedVidDidLookup);

    // Demo values on Enter
    vidInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.target.value.trim()) {
        vidInput.value = "8086";
        didInput.value = "09A2";
        debouncedVidDidLookup();
      }
    });

    didInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.target.value.trim()) {
        vidInput.value = "8086";
        didInput.value = "09A2";
        debouncedVidDidLookup();
      }
    });
  }

  // CONFIG_ADDRESS converter initialization
  const configRegInput = document.getElementById("configRegInput");
  const bdfoInput = document.getElementById("bdfoInput");

  if (configRegInput && bdfoInput) {
    let updating = false;

    // Update from CONFIG_ADDRESS register value
    configRegInput.addEventListener("input", () => {
      if (updating) return;
      updating = true;

      const configAddr = parseVal(configRegInput.value);
      updateConfigDisplay(configAddr);

      // Update BDFO field
      const decoded = configAddressToBDFO(configAddr);
      const bdfoStr = `${decoded.bus
        .toString(16)
        .padStart(2, "0")}:${decoded.device
        .toString(16)
        .padStart(2, "0")}.${decoded.func.toString(16)} 0x${decoded.offset
        .toString(16)
        .padStart(2, "0")}`;
      bdfoInput.value = bdfoStr;

      updating = false;
    });

    // Update from BDFO value
    bdfoInput.addEventListener("input", () => {
      if (updating) return;
      updating = true;

      const parsed = parseBDFO(bdfoInput.value);
      if (parsed) {
        const configAddr = bdfoToConfigAddress(
          parsed.bus,
          parsed.device,
          parsed.func,
          parsed.offset
        );
        updateConfigDisplay(configAddr);
        configRegInput.value = `0x${configAddr.toString(16).toUpperCase()}`;
      }

      updating = false;
    });

    // Initialize with example
    updateConfigDisplay(0);

    // Demo values on Enter
    configRegInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.target.value.trim()) {
        configRegInput.value = "0x80000f8f0";
        configRegInput.dispatchEvent(new Event("input"));
      }
    });

    bdfoInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.target.value.trim()) {
        bdfoInput.value = "00:1f.7 0xf0";
        bdfoInput.dispatchEvent(new Event("input"));
      }
    });
  }

  // BAR Decoder initialization
  const bar0Input = document.getElementById("bar0Input");
  const bar1Input = document.getElementById("bar1Input");

  if (bar0Input && bar1Input) {
    const updateBAR = () => {
      const bar0 = parseVal(bar0Input.value);
      const bar1 = parseVal(bar1Input.value);
      updateBARDisplay(bar0, bar1);
    };

    bar0Input.addEventListener("input", updateBAR);
    bar1Input.addEventListener("input", updateBAR);

    // Initialize
    updateBARDisplay(0, 0);

    // Demo values on Enter
    bar0Input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.target.value.trim()) {
        bar0Input.value = "0xfed1c004";
        bar1Input.value = "0x00000000";
        updateBAR();
      }
    });
  }

  // Command Register Decoder initialization
  const commandInput = document.getElementById("commandInput");

  if (commandInput) {
    commandInput.addEventListener("input", () => {
      const cmdValue = parseVal(commandInput.value);
      updateCommandDisplay(cmdValue);
    });

    // Initialize
    updateCommandDisplay(0);

    // Demo value on Enter
    commandInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.target.value.trim()) {
        commandInput.value = "0x0006";
        commandInput.dispatchEvent(new Event("input"));
      }
    });
  }
});
