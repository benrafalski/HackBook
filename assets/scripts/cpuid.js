// --- Feature maps for CPUID EAX=0x1 ---
const CPUID_FEATURES = {
ecx: {
    31: ["HYPERVISOR", "Hypervisor present (running under a VMM)"],
    30: ["RDRAND", "RDRAND instruction"],
    29: ["F16C", "16-bit FP conversions (F16C)"],
    28: ["AVX", "Advanced Vector Extensions"],
    27: ["OSXSAVE", "OS has enabled XSAVE/XRSTOR"],
    26: ["XSAVE", "XSAVE/XRSTOR/XSETBV/XGETBV"],
    25: ["AES", "AES-NI instructions"],
    24: ["TSC-DL", "APIC TSC-deadline timer"],
    23: ["POPCNT", "POPCNT instruction"],
    22: ["MOVBE", "MOVBE instruction"],
    21: ["x2APIC", "x2APIC support"],
    20: ["SSE4.2", "Streaming SIMD Extensions 4.2"],
    19: ["SSE4.1", "Streaming SIMD Extensions 4.1"],
    18: ["DCA", "Direct Cache Access"],
    17: ["PCID", "Process-context identifiers"],
    16: ["RES", "Reserved"],
    15: ["PDCM", "Perf/Debug Capability MSR"],
    14: ["xTPR", "xTPR update control"],
    13: ["CX16", "CMPXCHG16B instruction"],
    12: ["FMA", "Fused Multiply-Add (FMA)"],
    11: ["SDBG", "Silicon Debug (enumeration)"],
    10: ["CNXT-ID", "L1 context ID"],
    9: ["SSSE3", "Supplemental SSE3"],
    8: ["TM2", "Thermal Monitor 2"],
    7: ["EIST", "Enhanced Intel SpeedStep Technology"],
    6: ["SMX", "Safer Mode Extensions (TXT)"],
    5: ["VMX", "Virtual Machine Extensions"],
    4: ["DS-CPL", "CPL qualified debug store"],
    3: ["MONITOR", "MONITOR/MWAIT"],
    2: ["DTES64", "64-bit debug store (trace)"],
    1: ["PCLMULQDQ", "Carryless multiply (CLMUL)"],
    0: ["SSE3", "Streaming SIMD Extensions 3"],
},
edx: {
    31: ["PBE", "Pending Break Enable"],
    30: ["IA64", "IA-64 capability (Itanium indicator)"],
    29: ["TM", "Thermal Monitor"],
    28: ["HTT", "Hyper-Threading Technology"],
    27: ["SS", "Self-Snoop"],
    26: ["SSE2", "Streaming SIMD Extensions 2"],
    25: ["SSE", "Streaming SIMD Extensions"],
    24: ["FXSR", "FXSAVE/FXRSTOR"],
    23: ["MMX", "MMX technology"],
    22: ["ACPI", "Thermal Monitor & Clock Control"],
    21: ["DS", "Debug Store"],
    20: ["RES", "Reserved"],
    19: ["CLFSH", "CLFLUSH instruction"],
    18: ["PSN", "Processor Serial Number"],
    17: ["PSE36", "36-bit Page Size Extension"],
    16: ["PAT", "Page Attribute Table"],
    15: ["CMOV", "Conditional Move/FCMOV/FCOMI"],
    14: ["MCA", "Machine Check Architecture"],
    13: ["PGE", "Page Global Enable"],
    12: ["MTRR", "Memory Type Range Registers"],
    11: ["SEP", "SYSENTER/SYSEXIT"],
    10: ["RES", "Reserved"],
    9: ["APIC", "On-chip APIC"],
    8: ["CX8", "CMPXCHG8B instruction"],
    7: ["MCE", "Machine Check Exception"],
    6: ["PAE", "Physical Address Extension"],
    5: ["MSR", "Model Specific Registers"],
    4: ["TSC", "Time Stamp Counter"],
    3: ["PSE", "Page Size Extension (4 MiB)"],
    2: ["DE", "Debugging Extensions"],
    1: ["VME", "Virtual 8086 Mode Enhancements"],
    0: ["FPU", "x87 FPU on chip"],
},
};

function parseVal(str) {
if (!str) return 0 >>> 0;
const s = str.trim().toLowerCase();
try {
    if (s.startsWith("0x")) return Number.parseInt(s, 16) >>> 0;
    if (s.startsWith("0b")) return Number.parseInt(s.slice(2), 2) >>> 0;
    if (/^[0-9]+$/.test(s)) return Number.parseInt(s, 10) >>> 0;
    return 0 >>> 0;
} catch {
    return 0 >>> 0;
}
}

function bitSet(val, bit) {
return ((val >>> bit) & 1) === 1;
}

function makeBitEl(bit, type, val) {
const [name, desc] = CPUID_FEATURES[type][bit] || ["RES", "Reserved"];
const el = document.createElement("div");
el.className = "cpuid-bit " + (bitSet(val, bit) ? "set" : "clear");
el.title = `bit ${bit}: ${name}\n${desc}`;
el.innerHTML = `<span class="idx">${bit}</span><span class="name">${name}</span>`;
return el;
}

function render(type, val) {
const host = document.getElementById(type);
host.innerHTML = "";
for (let bit = 31; bit >= 0; bit--)
    host.appendChild(makeBitEl(bit, type, val));
}
// Intel processor database
const INTEL_PROCESSORS = {
// Family 6 processors
// https://fossies.org/linux/cpuid/cpuid.c
// https://en.wikichip.org/wiki/intel/cpuid
6: {
    // ===== SERVER =====
    // https://en.wikichip.org/wiki/intel/xeon#Xeon_Timeline
    // P6 (Pentium)
    0xa : {
        uarch: "P6",
        node: "180nm",
        process: "P858",
        steppings :{
            0x0: {
                core: "Cascades",
                product: "Pentium III Xeon",
                type: "Big Core (Server)",
                stepping: "Cascades A0",
                year: "1999"
            },
            0x1: {
                core: "Cascades",
                product: "Pentium III Xeon",
                type: "Big Core (Server)",
                stepping: "Cascades A1",
                year: "1999"
            },
            0x4: {
                core: "Cascades",
                product: "Pentium III Xeon",
                type: "Big Core (Server)",
                stepping: "Cascades A1",
                year: "1999"
            },
        }
    },
    // Penryn - Yorkfield/Wolfdale/Harpertown
    0x17 : {
        uarch: "Penryn",
        node: "45nm",
        process: "P1266/P1269",
        steppings :{
            0x6: {
                core: "Yorkfield/Wolfdale/Harpertown",
                product: "Xeon",
                type: "Big Core (Server)",
                stepping: "Yorkfield C0/Wolfdale C0/Harpertown C0",
                year: "2007-2008"
            },
            0x7: {
                core: "Yorkfield",
                product: "Xeon",
                type: "Big Core (Server)",
                stepping: "Yorkfield C1",
                year: "2008"
            },
            0xa: {
                core: "Yorkfield",
                product: "Xeon",
                type: "Big Core (Server)",
                stepping: "Yorkfield E0/R0",
                year: "2008"
            },
        }
    },
    // Penryn - Dunnington
    0x1d : {
        uarch: "Penryn",
        node: "45nm",
        process: "P1266/P1269",
        steppings :{
            0x1: {
                core: "Dunnington",
                product: "Xeon",
                type: "Big Core (Server)",
                stepping: "Dunnington A1",
                year: "2008"
            },
        }
    },
    // Nehalem - Bloomfield/Gainestown
    0x1a : {
        uarch: "Nehalem",
        node: "45nm",
        process: "P1266/P1269",
        steppings :{
            0x4: {
                core: "Bloomfield",
                product: "Xeon",
                type: "Big Core (Client P-cores)",
                stepping: "Bloomfield C0",
                year: "2009"
            },
            0x5: {
                core: "Bloomfield/Gainestown",
                product: "Xeon",
                type: "Big Core (Server)",
                stepping: "Bloomfield/Gainestown D0",
                year: "2009"
            },
        }
    },
    // Nehalem - Jasper Forest/Lynnfield
    0x1e : {
        uarch: "Nehalem",
        node: "45nm",
        process: "P1266/P1269",
        steppings :{
            0x4: {
                core: "Jasper Forest",
                product: "Xeon",
                type: "Big Core (Server)",
                stepping: "JF B0",
                year: "2010"
            },
            0x5: {
                core: "Lynnfield",
                product: "Xeon",
                type: "Big Core (Server)",
                stepping: "LFD B1",
                year: "2009"
            },
        }
    },
    // Nehalem - Beckton
    0x2e : {
        uarch: "Nehalem",
        node: "45nm",
        process: "P1266/P1269",
        steppings :{
            0x6: {
                core: "Beckton",
                product: "Xeon",
                type: "Big Core (Server)",
                stepping: "Beckton A0",
                year: "2010"
            },
        }
    },
    // Westmere - Clarkdale
    0x25 : {
        uarch: "Westmere",
        node: "32nm",
        process: "P1268/P1269",
        steppings :{
            0x2: {
                core: "Clarkdale",
                product: "Xeon",
                type: "Big Core (Server)",
                stepping: "Clarkdale C2",
                year: "2010"
            },
        }
    },
    // Westmere - Westmere-EP
    0x2c : {
        uarch: "Westmere",
        node: "32nm",
        process: "P1268/P1269",
        steppings :{
            0x0: {
                core: "Westmere-EP",
                product: "Xeon",
                type: "Big Core (Server)",
                stepping: "WSM-EP A0",
                year: "2010"
            },
            0x1: {
                core: "Westmere-EP",
                product: "Xeon",
                type: "Big Core (Server)",
                stepping: "WSM-EP B0",
                year: "2010"
            },
            0x2: {
                core: "Westmere-EP",
                product: "Xeon",
                type: "Big Core (Server)",
                stepping: "WSM-EP B1",
                year: "2010"
            },
        }
    },
    // Westmere - Westmere-EX
    0x2f : {
        uarch: "Westmere",
        node: "32nm",
        process: "P1268/P1269",
        steppings :{
            0x2: {
                core: "Westmere-EX",
                product: "Xeon E7",
                type: "Big Core (Server)",
                stepping: "WSM-EX A2",
                year: "2011"
            },
        }
    },
    // Sandy Bridge - Sandy Bridge
    0x2a : {
        uarch: "Sandy Bridge",
        node: "32nm",
        process: "P1268/P1269",
        steppings :{
            0x7: {
                core: "Sandy Bridge",
                product: "Xeon E3",
                type: "Big Core (Server)",
                stepping: "SNB D2/J1/Q0",
                year: "May 2011"
            },
        }
    },
    // Sandy Bridge - Sandy Bridge-E
    0x2d : {
        uarch: "Sandy Bridge",
        node: "32nm",
        process: "P1268/P1269",
        steppings :{
            0x6: {
                core: "Sandy Bridge-E",
                product: "Xeon E5",
                type: "Big Core (Server)",
                stepping: "SNB-E C1/M0",
                year: "Mar 2012"
            },
            0x7: {
                core: "Sandy Bridge-E",
                product: "Xeon E5",
                type: "Big Core (Server)",
                stepping: "SNB-E C2/M1",
                year: "May 2012"
            },
        }
    },





    // // kaby, coffee, whiskey, comet lake
    // 0x8e: {
    // // Model 142
    //     0x9: {
    //     name: "Kaby Lake",
    //     product: "7th Gen Core",
    //     type: "Client",
    //     stepping: "KBL H0",
    //     process: "14nm+",
    //     year: "2016"
    //     },
    //     0xa: {
    //     name: "Kaby Lake / Coffee Lake",
    //     product: "7/8th Gen Core",
    //     type: "Client",
    //     stepping: "KBL Y0 / CFL D0",
    //     process: "14nm+/14nm++",
    //     year: "2016/18"
    //     },
    //     0xb: {
    //     name: "Whiskey Lake-U",
    //     product: "8th Gen Core",
    //     type: "Client",
    //     stepping: "WHL-U W0",
    //     process: "14nm+",
    //     year: "2018"
    //     },
    //     0xc: {
    //     name: "Comet Lake-U",
    //     product: "10th Gen Core",
    //     type: "Client",
    //     stepping: "CML-U V1",
    //     process: "14nm+",
    //     year: "2019"
    //     },
    //     0xd: {
    //     name: "Whiskey Lake-U",
    //     product: "8th Gen Core",
    //     type: "Client",
    //     stepping: "WHL-U V0",
    //     process: "14nm+",
    //     year: "2018"
    //     },
    // },
    // // kaby, coffee lake
    // 0x9e: {
    // // Model 158
    //     0x9: {
    //     name: "Kaby Lake-H",
    //     product: "7th Gen Core",
    //     type: "Client",
    //     stepping: "KBL-H B0",
    //     process: "14nm+",
    //     year: "2016"
    //     },
    //     0xa: {
    //     name: "Coffee Lake",
    //     product: "8th Gen Core",
    //     type: "Client",
    //     stepping: "CFL U0",
    //     process: "14nm++",
    //     year: "2018"
    //     },
    //     0xb: {
    //     name: "Coffee Lake",
    //     product: "8th Gen Core",
    //     type: "Client",
    //     stepping: "CFL B0",
    //     process: "14nm++",
    //     year: "2018"
    //     },
    //     0xc: {
    //     name: "Coffee Lake",
    //     product: "8th Gen Core",
    //     type: "Client",
    //     stepping: "CFL P0",
    //     process: "14nm++",
    //     year: "2018"
    //     },
    //     0xd: {
    //     name: "Coffee Lake",
    //     product: "8th Gen Core",
    //     type: "Client",
    //     stepping: "CFL R0",
    //     process: "14nm++",
    //     year: "2018"
    //     },
    // },
    // // cannon lake
    // 0x66: {
    // // Model 102
    //     0x0: {
    //     name: "Cannon Lake",
    //     product: "8th Gen Core",
    //     type: "Client",
    //     stepping: "CNL A0",
    //     process: "10nm",
    //     year: "2018"
    //     },
    //     0x1: {
    //     name: "Cannon Lake",
    //     product: "8th Gen Core",
    //     type: "Client",
    //     stepping: "CNL B0",
    //     process: "10nm",
    //     year: "2018"
    //     },
    //     0x2: {
    //     name: "Cannon Lake",
    //     product: "8th Gen Core",
    //     type: "Client",
    //     stepping: "CNL C0",
    //     process: "10nm",
    //     year: "2018"
    //     },
    //     0x3: {
    //     name: "Cannon Lake",
    //     product: "8th Gen Core",
    //     type: "Client",
    //     stepping: "CNL D0",
    //     process: "10nm",
    //     year: "2018"
    //     },
    // },
    // // ice lake core
    // 0x7d: {
    // // Model 125
    //     0x0: {
    //     name: "Ice Lake-U/Y",
    //     product: "10th Gen Core",
    //     type: "Client",
    //     stepping: "ICX-U/Y A0",
    //     process: "10nm+",
    //     year: "2019"
    //     },
    //     0x1: {
    //     name: "Ice Lake-U/Y",
    //     product: "10th Gen Core",
    //     type: "Client",
    //     stepping: "ICX-U/Y B0",
    //     process: "10nm+",
    //     year: "2019"
    //     },
    //     0x5: {
    //     name: "Ice Lake-U/Y",
    //     product: "10th Gen Core",
    //     type: "Client",
    //     stepping: "ICX-U/Y D1",
    //     process: "10nm+",
    //     year: "2019"
    //     },
    // },
    // // tiger lake
    // 0x8c: {
    // // Model 125
    //     0x0: {
    //     name: "Tiger Lake-U",
    //     product: "11th Gen Core",
    //     type: "Client",
    //     stepping: "TGL-U A0",
    //     process: "10nm++",
    //     year: "2020"
    //     },
    //     0x1: {
    //     name: "Tiger Lake-U",
    //     product: "11th Gen Core",
    //     type: "Client",
    //     stepping: "TGL-U B0/B1",
    //     process: "10nm++",
    //     year: "2020"
    //     },
    //     0x2: {
    //     name: "Tiger Lake-U",
    //     product: "11th Gen Core",
    //     type: "Client",
    //     stepping: "TGL-U C0",
    //     process: "10nm++",
    //     year: "2020"
    //     },
    // },
    // 0x8d: {
    // // Model 126
    //     0x0: {
    //     name: "Tiger Lake-H",
    //     product: "11th Gen Core",
    //     type: "Client",
    //     stepping: "TGL-H P0",
    //     process: "10nm++",
    //     year: "2020"
    //     },
    //     0x1: {
    //     name: "Tiger Lake-H",
    //     product: "11th Gen Core",
    //     type: "Client",
    //     stepping: "TGL-H R0",
    //     process: "10nm++",
    //     year: "2020"
    //     },
    // },
    // // sapphire rapids
    // 0x8f: {
    // // Model 143
    //     0x3: {
    //     name: "Sapphire Rapids",
    //     product: "4th Gen Xeon",
    //     type: "Server",
    //     stepping: "SPR D",
    //     process: "Intel 7 (7nm)",
    //     year: "2023"
    //     },
    //     0x4: {
    //     name: "Sapphire Rapids",
    //     product: "4th Gen Xeon",
    //     type: "Server",
    //     stepping: "SPR E0",
    //     process: "Intel 7 (7nm)",
    //     year: "2023"
    //     },
    //     0x5: {
    //     name: "Sapphire Rapids",
    //     product: "4th Gen Xeon",
    //     type: "Server",
    //     stepping: "SPR E2",
    //     process: "Intel 7 (7nm)",
    //     year: "2023"
    //     },
    //     0x6: {
    //     name: "Sapphire Rapids",
    //     product: "4th Gen Xeon",
    //     type: "Server",
    //     stepping: "SPR E3",
    //     process: "Intel 7 (7nm)",
    //     year: "2023"
    //     },
    //     0x7: {
    //     name: "Sapphire Rapids",
    //     product: "4th Gen Xeon",
    //     type: "Server",
    //     stepping: "SPR E4/S2",
    //     process: "Intel 7 (7nm)",
    //     year: "2023"
    //     },
    //     0x8: {
    //     name: "Sapphire Rapids",
    //     product: "4th Gen Xeon",
    //     type: "Server",
    //     stepping: "SPR E5/B3/S3",
    //     process: "Intel 7 (7nm)",
    //     year: "2023"
    //     },
    // },
    // // emerald rapids
    // 0xcf: {
    // // Model 207
    //     0x1: {
    //     name: "Emerald Rapids",
    //     product: "5th Gen Xeon",
    //     type: "Server",
    //     stepping: "EMR A0",
    //     process: "Intel 7 (7nm)",
    //     year: "2023"
    //     },
    //     0x2: {
    //     name: "Emerald Rapids",
    //     product: "5th Gen Xeon",
    //     type: "Server",
    //     stepping: "EMR A1/R1",
    //     process: "Intel 7 (7nm)",
    //     year: "2023"
    //     },
    // },
    // // granite rapids
    // 0xad: {
    // // Model 173
    //     0x1: {
    //     name: "Granite Rapids",
    //     product: "6th Gen Xeon",
    //     type: "Server",
    //     stepping: "GNR B0/H0",
    //     process: "Intel 4 (4nm)",
    //     year: "2023"
    //     },
    // },
    // 0xae: {
    // // Model 174
    //     0x1: {
    //     name: "Granite Rapids",
    //     product: "6th Gen Xeon",
    //     type: "Server",
    //     stepping: "GNR",
    //     process: "Intel 3 (3nm)",
    //     year: "2023"
    //     },
    // },
    // // sierra forest
    // 0xaf: {
    // // Model 175
    //     0x3: {
    //     name: "Sierra Forest",
    //     product: "6th Gen Xeon",
    //     type: "Server",
    //     stepping: "SRF C0",
    //     process: "Intel 3 (3nm)",
    //     year: "2024"
    //     },
    // },
    // // rocket lake
    // 0xa7: {
    // // Model 167
    //     0x1: {
    //     name: "Rocket Lake",
    //     product: "11th Gen Core",
    //     type: "Client",
    //     stepping: "RKL B0",
    //     process: "14nm+++",
    //     year: "2021"
    //     },
    // },
    // // alder lake
    // 0x97: {
    // // Model 151
    //     0x0: {
    //     name: "Alder Lake-S",
    //     product: "12th Gen Core",
    //     type: "Hybrid/Atom",
    //     stepping: "ADL-S A0",
    //     process: "Intel 7 (7nm)",
    //     year: "2021"
    //     },
    //     0x1: {
    //     name: "Alder Lake-S",
    //     product: "12th Gen Core",
    //     type: "Hybrid/Atom",
    //     stepping: "ADL-S B0",
    //     process: "Intel 7 (7nm)",
    //     year: "2021"
    //     },
    //     0x2: {
    //     name: "Alder Lake-S/HX",
    //     product: "12th Gen Core",
    //     type: "Hybrid/Atom",
    //     stepping: "ADL-S/HX C0",
    //     process: "Intel 7 (7nm)",
    //     year: "2021"
    //     },
    //     0x3: {
    //     name: "Alder Lake-P/H",
    //     product: "12th Gen Core",
    //     type: "Hybrid/Atom",
    //     stepping: "ADL-P/H",
    //     process: "Intel 7 (7nm)",
    //     year: "2021"
    //     },
    //     0x4: {
    //     name: "Alder Lake-U",
    //     product: "12th Gen Core",
    //     type: "Hybrid/Atom",
    //     stepping: "ADL-U G0",
    //     process: "Intel 7 (7nm)",
    //     year: "2021"
    //     },
    //     0x5: {
    //     name: "Alder Lake-S",
    //     product: "12th Gen Core",
    //     type: "Hybrid/Atom",
    //     stepping: "ADL-S H0",
    //     process: "Intel 7 (7nm)",
    //     year: "2021"
    //     },
    // },
    // 0x9a: {
    // // Model 155
    //     0x0: {
    //     name: "Alder Lake",
    //     product: "12th Gen Core",
    //     type: "Hybrid/Atom",
    //     stepping: "ADL-S J0",
    //     process: "Intel 7 (7nm)",
    //     year: "2021"
    //     },
    //     0x1: {
    //     name: "Alder Lake",
    //     product: "12th Gen Core",
    //     type: "Hybrid/Atom",
    //     stepping: "ADL-S Q0",
    //     process: "Intel 7 (7nm)",
    //     year: "2021"
    //     },
    //     0x2: {
    //     name: "Alder Lake",
    //     product: "12th Gen Core",
    //     type: "Hybrid/Atom",
    //     stepping: "ADL-S K0",
    //     process: "Intel 7 (7nm)",
    //     year: "2021"
    //     },
    //     0x3: {
    //     name: "Alder Lake",
    //     product: "12th Gen Core",
    //     type: "Hybrid/Atom",
    //     stepping: "ADL-S L0",
    //     process: "Intel 7 (7nm)",
    //     year: "2021"
    //     },
    //     0x4: {
    //     name: "Alder Lake",
    //     product: "12th Gen Core",
    //     type: "Hybrid/Atom",
    //     stepping: "ADL-S R0",
    //     process: "Intel 7 (7nm)",
    //     year: "2021"
    //     },
    // },
    // // raptor lake
    // 0xb7: {
    // // Model 183
    //     0x0: {
    //     name: "Raptor Lake-S/HX",
    //     product: "13/14th Gen Core",
    //     type: "Hybrid/Atom",
    //     stepping: "RPL A0",
    //     process: "Intel 7 (7nm)",
    //     year: "2022"
    //     },
    //     0x1: {
    //     name: "Raptor Lake-S/HX",
    //     product: " Gen Core",
    //     type: "Hybrid/Atom",
    //     stepping: "RPL B0",
    //     process: "Intel 7 (7nm)",
    //     year: "2022"
    //     },
    // },
    // 0xba: {
    // // Model 186
    //     0x2: {
    //     name: "Raptor Lake-H/U/P",
    //     product: "13/14th Gen Core",
    //     type: "Hybrid/Atom",
    //     stepping: "RPL J0",
    //     process: "Intel 7 (7nm)",
    //     year: "2022"
    //     },
    //     0x3: {
    //     name: "Raptor Lake-P",
    //     product: "13/14th Gen Core",
    //     type: "Hybrid/Atom",
    //     stepping: "RPL Q0",
    //     process: "Intel 7 (7nm)",
    //     year: "2022"
    //     },
    // },
    // 0xbe: {
    // // Model 190
    //     0x0: {
    //     name: "Alder Lake-N",
    //     product: "12th Gen Core",
    //     type: "Hybrid/Atom",
    //     stepping: "ADL A0/N0",
    //     process: "Intel 7 (7nm)",
    //     year: "2021"
    //     },
    // },
    // 0xbf: {
    // // Model 191
    //     0x2: {
    //     name: "Raptor Lake-S/HX",
    //     product: "13/14th Gen Core",
    //     type: "Hybrid/Atom",
    //     stepping: "RPL C0",
    //     process: "Intel 7 (7nm)",
    //     year: "2022"
    //     },
    //     0x5: {
    //     name: "Raptor Lake-S/HX/P",
    //     product: "13/14th Gen Core",
    //     type: "Hybrid/Atom",
    //     stepping: "RPL H0",
    //     process: "Intel 7 (7nm)",
    //     year: "2022"
    //     },
    // },
},
};

function decodeEAX(eaxValue) {
// Extract fields according to Intel documentation
const stepping = eaxValue & 0xf;
const model = (eaxValue >> 4) & 0xf;
const family = (eaxValue >> 8) & 0xf;
const procType = (eaxValue >> 12) & 0x3;
const extModel = (eaxValue >> 16) & 0xf;
const extFamily = (eaxValue >> 20) & 0xff;

// Calculate effective family and model
let effectiveFamily = family;
let effectiveModel = model;

if (family === 0xf) {
    effectiveFamily = family + extFamily;
}
if (family === 0x6 || family === 0xf) {
    effectiveModel = (extModel << 4) + model;
}

return {
    stepping,
    model: effectiveModel,
    family: effectiveFamily,
    procType,
    extModel,
    extFamily,
    rawModel: model,
    rawFamily: family,
};
}

function lookupProcessor(family, model, stepping) {
const familyData = INTEL_PROCESSORS[family];
if (!familyData) {
    return {
        uarch: "Unknown",
        core: "Unknown",
        product: "Unknown",
        type: "Unknown",
        steppingName: "Unknown",
        node: "Unknown",
        process: "Unknown",
        year: "Unknown",
    };
}

const modelData = familyData[model];
if (!modelData) {
    return {
        uarch: "Unknown",
        core: "Unknown",
        product: "Unknown",
        type: "Unknown",
        steppingName: "Unknown",
        node: "Unknown",
        process: "Unknown",
        year: "Unknown",
    };
}

const steppingData = modelData.steppings[stepping];
if (!steppingData) {
    return {
        uarch: modelData.uarch,
        core: "Unknown",
        product: "Unknown",
        type: "Unknown",
        steppingName: "Unknown",
        node: modelData.node,
        process: modelData.process,
        year: "Unknown",
    };
}

return {
    uarch: modelData.uarch,
    core: steppingData.core,
    product: steppingData.product,
    type: steppingData.type,
    steppingName: steppingData.stepping,
    node: modelData.node,
        process: modelData.process,
    year: steppingData.year,
};
}

function updateEAXDisplay(eaxValue) {
const decoded = decodeEAX(eaxValue);
const processor = lookupProcessor(
    decoded.family,
    decoded.model,
    decoded.stepping
);

// Update version fields
document.getElementById(
    "extFamily"
).textContent = `0x${decoded.extFamily.toString(16).toUpperCase()} (${
    decoded.extFamily
})`;
document.getElementById("extModel").textContent = `0x${decoded.extModel
    .toString(16)
    .toUpperCase()} (${decoded.extModel})`;
document.getElementById("procType").textContent = `0x${decoded.procType
    .toString(16)
    .toUpperCase()} (${decoded.procType})`;
document.getElementById("family").textContent = `0x${decoded.family
    .toString(16)
    .toUpperCase()} (${decoded.family})`;
document.getElementById("model").textContent = `0x${decoded.model
    .toString(16)
    .toUpperCase()} (${decoded.model})`;
document.getElementById("stepping").textContent = `0x${decoded.stepping
    .toString(16)
    .toUpperCase()} (${decoded.stepping})`;

// Update processor info
document.getElementById("uarch").textContent = processor.uarch;
document.getElementById("core").textContent = processor.core;
document.getElementById("product").textContent = processor.product;
document.getElementById("productType").textContent = processor.type;
document.getElementById("steppingName").textContent = processor.steppingName;
document.getElementById("node").textContent = processor.node;
document.getElementById("process").textContent = processor.process;
document.getElementById("year").textContent = processor.year;

// Update bit layout
document.getElementById("extFamilyBits").textContent = decoded.extFamily
    .toString(2)
    .padStart(8, "0");
document.getElementById("extModelBits").textContent = decoded.extModel
    .toString(2)
    .padStart(4, "0");
document.getElementById("reservedBits").textContent = "00";
document.getElementById("typeBits").textContent = decoded.procType
    .toString(2)
    .padStart(2, "0");
document.getElementById("familyBits").textContent = decoded.rawFamily
    .toString(2)
    .padStart(4, "0");
document.getElementById("modelBits").textContent = decoded.rawModel
    .toString(2)
    .padStart(4, "0");
document.getElementById("steppingBits").textContent = decoded.stepping
    .toString(2)
    .padStart(4, "0");
}
// Default values stay empty (all zero) until the user pastes.
document.addEventListener("DOMContentLoaded", () => {
render("ecx", 0);
render("edx", 0);

const ecxIn = document.getElementById("ecxIn");
const edxIn = document.getElementById("edxIn");
const eaxIn = document.getElementById("eaxIn");

// Populate the EAX dropdown
const cpuidOptions = generateCPUIDOptions();

cpuidOptions.forEach(option => {
    const optionElement = document.createElement("option");
    optionElement.value = option.value;
    optionElement.textContent = option.text;
    eaxIn.appendChild(optionElement);
});

// Add custom option at the end
const customOption = document.createElement("option");
customOption.value = "custom";
customOption.textContent = "Custom...";
eaxIn.appendChild(customOption);

const update = () => {
    render("ecx", parseVal(ecxIn.value));
    render("edx", parseVal(edxIn.value));
};

const updateEAX = () => {
    const selectedValue = eaxIn.value;
    if (selectedValue && selectedValue !== "custom") {
      updateEAXDisplay(parseVal(selectedValue));
    } else if (selectedValue === "custom") {
      // Handle custom input - you could show a text input here if needed
      const customValue = prompt("Enter custom CPUID EAX value (hex format like 0x806ec):");
      if (customValue) {
        updateEAXDisplay(parseVal(customValue));
      }
    } else {
      updateEAXDisplay(0);
    }
  };

ecxIn.addEventListener("input", update);
edxIn.addEventListener("input", update);
eaxIn.addEventListener("change", updateEAX);

// Provide a handy demo value when users paste nothing and press Enter
function maybeDemo(e) {
    if (e.key === "Enter" && !e.target.value.trim()) {
      if (e.target === ecxIn) ecxIn.value = "0x7ffafbff";
      if (e.target === edxIn) edxIn.value = "0xbfebfbff";
      update();
    }
}
ecxIn.addEventListener("keydown", maybeDemo);
edxIn.addEventListener("keydown", maybeDemo);

// Initialize displays
updateEAXDisplay(0);
});

// Add this function to generate CPUID values from the database
function generateCPUIDOptions() {
  const options = [];
  
  for (const [family, familyData] of Object.entries(INTEL_PROCESSORS)) {
    for (const [model, modelData] of Object.entries(familyData)) {
      for (const [stepping, steppingData] of Object.entries(modelData.steppings)) {
        // Calculate the CPUID value
        const familyInt = parseInt(family);
        const modelInt = parseInt(model);
        const steppingInt = parseInt(stepping);
        let cpuidValue = 0;
        
        // Set stepping (bits 3:0)
        cpuidValue |= (steppingInt & 0xF);
        
        // Set model (bits 7:4) and extended model (bits 19:16)
        const baseModel = modelInt & 0xF;
        const extModel = (modelInt >> 4) & 0xF;
        cpuidValue |= (baseModel << 4);
        cpuidValue |= (extModel << 16);
        
        // Set family (bits 11:8) and extended family (bits 27:20)
        if (familyInt === 0xF) {
          cpuidValue |= (0xF << 8); // Base family for extended
          cpuidValue |= ((familyInt - 0xF) << 20); // Extended family
        } else {
          cpuidValue |= (familyInt << 8);
        }
        
        // Type is usually 0 for client processors
        const type = steppingData.type.toLowerCase().includes("server") ? 1 : 0;
        cpuidValue |= (type << 12);
        
        const cpuidHex = `0x${cpuidValue.toString(16).toUpperCase()}`;
        const displayName = `${cpuidHex} - ${steppingData.core} (${steppingData.product})`;
        
        options.push({
          value: cpuidHex,
          text: displayName,
          data: steppingData
        });
      }
    }
  }
  
    //   Sort by CPUID value
    options.sort((a, b) => {
        // Extract generation numbers and processor types
        const extractGenInfo = (product) => {
            const coreMatch = product.match(/(\d+)(?:st|nd|rd|th)\s+Gen\s+Core/i);
            const xeonMatch = product.match(/(\d+)(?:st|nd|rd|th)\s+Gen\s+Xeon/i);
            
            if (coreMatch) {
                return { type: 'core', gen: parseInt(coreMatch[1]) };
            } else if (xeonMatch) {
                return { type: 'xeon', gen: parseInt(xeonMatch[1]) };
            }
            return { type: 'other', gen: 999 }; // Unknown products go last
        };
        
        const aInfo = extractGenInfo(a.data.product);
        const bInfo = extractGenInfo(b.data.product);
        
        // Core processors come before Xeon
        if (aInfo.type !== bInfo.type) {
            if (aInfo.type === 'core' && bInfo.type === 'xeon') return -1;
            if (aInfo.type === 'xeon' && bInfo.type === 'core') return 1;
            if (aInfo.type === 'other') return 1;
            if (bInfo.type === 'other') return -1;
        }
        
        // Sort by generation number within same type
        if (aInfo.gen !== bInfo.gen) {
            return aInfo.gen - bInfo.gen;
        }
        
        // Handle mixed generation products like "7/8th Gen Core" 
        // Extract the first generation from mixed products for sorting
        const getFirstGen = (product) => {
            const mixedMatch = product.match(/(\d+)\/\d+(?:st|nd|rd|th)\s+Gen/i);
            if (mixedMatch) return parseInt(mixedMatch[1]);
            return aInfo.gen; // Use regular gen if not mixed
        };
        
        const aFirstGen = getFirstGen(a.data.product);
        const bFirstGen = getFirstGen(b.data.product);
        
        if (aFirstGen !== bFirstGen) {
            return aFirstGen - bFirstGen;
        }
        
        // Within same first generation, single gen comes before mixed
        const aMixed = a.data.product.includes('/');
        const bMixed = b.data.product.includes('/');
        
        if (aMixed !== bMixed) {
            return aMixed ? 1 : -1; // Single gen (false) comes before mixed (true)
        }        
        // If same product, sort by name
        return a.data.core.localeCompare(b.data.core);
    });

  console.log(options)
  
  return options;
}