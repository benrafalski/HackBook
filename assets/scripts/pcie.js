// PCI CONFIG_ADDRESS Converter
function parseVal(str) {
  if (!str) return 0 >>> 0;
  const s = str.trim().toLowerCase();
  try {
    if (s.startsWith('0x')) return Number.parseInt(s, 16) >>> 0;
    if (s.startsWith('0b')) return Number.parseInt(s.slice(2), 2) >>> 0;
    if (/^[0-9]+$/.test(s)) return Number.parseInt(s, 10) >>> 0;
    return 0 >>> 0;
  } catch { return 0 >>> 0; }
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
    
    if (bus > 255 || device > 31 || func > 7 || offset > 255 || (offset & 3) !== 0) {
      return null;
    }
    
    return { bus, device, func, offset };
  } catch {
    return null;
  }
}

function bdfoToConfigAddress(bus, device, func, offset) {
  let configAddr = 0x80000000; // Enable bit set
  configAddr |= (bus & 0xFF) << 16;
  configAddr |= (device & 0x1F) << 11;
  configAddr |= (func & 0x07) << 8;
  configAddr |= (offset & 0xFC);
  return configAddr >>> 0;
}

function configAddressToBDFO(configAddr) {
  const enable = (configAddr >>> 31) & 1;
  const bus = (configAddr >>> 16) & 0xFF;
  const device = (configAddr >>> 11) & 0x1F;
  const func = (configAddr >>> 8) & 0x07;
  const offset = configAddr & 0xFC;
  
  return { enable, bus, device, func, offset };
}

function updateConfigDisplay(configAddr) {
  const decoded = configAddressToBDFO(configAddr);
  
  // Update bit fields in diagram
  document.getElementById('enableBit').textContent = decoded.enable ? '1' : '0';
  document.getElementById('busBits').textContent = `0x${decoded.bus.toString(16).padStart(2, '0').toUpperCase()}`;
  document.getElementById('deviceBits').textContent = `0x${decoded.device.toString(16).toUpperCase()}`;
  document.getElementById('functionBits').textContent = `0x${decoded.func.toString(16).toUpperCase()}`;
  document.getElementById('offsetBits').textContent = `0x${decoded.offset.toString(16).padStart(2, '0').toUpperCase()}`;
  
  // Update info fields
  document.getElementById('busValue').textContent = `0x${decoded.bus.toString(16).padStart(2, '0').toUpperCase()} (${decoded.bus})`;
  document.getElementById('deviceValue').textContent = `0x${decoded.device.toString(16).toUpperCase()} (${decoded.device})`;
  document.getElementById('functionValue').textContent = `0x${decoded.func.toString(16).toUpperCase()} (${decoded.func})`;
  document.getElementById('offsetValue').textContent = `0x${decoded.offset.toString(16).padStart(2, '0').toUpperCase()} (${decoded.offset})`;
  document.getElementById('enableValue').textContent = `${decoded.enable} (${decoded.enable ? 'Enabled' : 'Disabled'})`;
}

// Initialize PCI converter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const configRegInput = document.getElementById('configRegInput');
  const bdfoInput = document.getElementById('bdfoInput');
  
  if (!configRegInput || !bdfoInput) return;
  
  let updating = false;
  
  // Update from CONFIG_ADDRESS register value
  configRegInput.addEventListener('input', () => {
    if (updating) return;
    updating = true;
    
    const configAddr = parseVal(configRegInput.value);
    updateConfigDisplay(configAddr);
    
    // Update BDFO field
    const decoded = configAddressToBDFO(configAddr);
    const bdfoStr = `${decoded.bus.toString(16).padStart(2, '0')}:${decoded.device.toString(16).padStart(2, '0')}.${decoded.func.toString(16)} 0x${decoded.offset.toString(16).padStart(2, '0')}`;
    bdfoInput.value = bdfoStr;
    
    updating = false;
  });
  
  // Update from BDFO value
  bdfoInput.addEventListener('input', () => {
    if (updating) return;
    updating = true;
    
    const parsed = parseBDFO(bdfoInput.value);
    if (parsed) {
      const configAddr = bdfoToConfigAddress(parsed.bus, parsed.device, parsed.func, parsed.offset);
      updateConfigDisplay(configAddr);
      configRegInput.value = `0x${configAddr.toString(16).toUpperCase()}`;
    }
    
    updating = false;
  });
  
  // Initialize with example
  updateConfigDisplay(0);
  
  // Demo values on Enter
  configRegInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.target.value.trim()) {
      configRegInput.value = '0x80000f8f0';
      configRegInput.dispatchEvent(new Event('input'));
    }
  });
  
  bdfoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.target.value.trim()) {
      bdfoInput.value = '00:1f.7 0xf0';
      bdfoInput.dispatchEvent(new Event('input'));
    }
  });
});