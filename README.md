# HackBook — Comprehensive Cybersecurity Knowledge Base

A wiki-style website for CTF players and cybersecurity researchers. Every page includes three tabs:
- **Notes** — Detailed, cheatsheet-style reference material
- **Lab** — 12+ hands-on exercises per page with source code and step-by-step instructions
- **CTF Challenges** — 10+ practice challenges per page with hints

---

## Site Structure (12 Sections, 40+ Pages)

### Binary Exploitation (`pages/binary/`)
| Page | File | Topics |
|------|------|--------|
| Fundamentals | `fundamentals.html` | ELF format, memory layout, security protections, GDB, pwntools |
| Stack Overflow | `stack-overflow.html` | Buffer overflows, offset discovery, ret2win, ret2shellcode, canary bypass |
| Format Strings | `format-strings.html` | Stack leaks, %n writes, GOT overwrite, canary leak, pwntools fmtstr_payload |
| ROP | `rop.html` | Gadget finding, ret2libc, mprotect, SROP, stack pivots, ret2csu, ret2dlresolve |
| GOT/PLT Hijacking | `got-plt.html` | Dynamic linking, lazy binding, libc leaks, ret2plt, ASLR bypass |
| Heap Exploitation | `heap.html` | ptmalloc2 internals, tcache poison, UAF, double free, House of * techniques |
| Shellcode | `shellcode.html` | Writing shellcode, encoding, NOP sleds, staged, egg hunter, polymorphic |

### Networking (`pages/network/`)
| Page | File | Topics |
|------|------|--------|
| TCP/IP | `tcp-ip.html` | Protocol stack, 3-way handshake, sockets, netcat, scapy |
| DNS | `dns.html` | Record types, zone transfers, DNS tunneling, enumeration tools |
| Network Scanning | `scanning.html` | Nmap, masscan, service enumeration, recon methodology |
| ARP & Layer 2 | `arp.html` | ARP spoofing, MITM, MAC flooding, VLAN hopping |
| DHCP | `dhcp.html` | DORA process, starvation, rogue servers, snooping defense |
| Wireshark | `wireshark.html` | Packet analysis, display filters, pcap forensics |

### Architecture (`pages/arch/`)
| Page | File | Topics |
|------|------|--------|
| x86 Assembly | `x86-assembly.html` | Registers, instructions, calling conventions, syscalls, NASM |
| x86 OS Internals | `x86-os-internals.html` | OS architecture |
| x86 Firmware | `x86-firmware.html` | BIOS/UEFI firmware security |
| Memory Management | `memory-management.html` | Virtual memory, ASLR, mmap/mprotect, DEP/NX, SMEP/SMAP |

### Web (`pages/web/`)
| Page | File | Topics |
|------|------|--------|
| JavaScript | `javascript.html` | Language fundamentals, prototype pollution, DOM clobbering |
| XSS | `xss.html` | Reflected/stored/DOM-based, filter bypass, cookie theft, CSP evasion, mXSS |
| SQL Injection | `sqli.html` | UNION, blind, time-based, sqlmap, NoSQL injection, stacked queries |
| SSRF | `ssrf.html` | Internal access, cloud metadata, gopher://, DNS rebinding, PDF SSRF |
| Auth Attacks | `auth-attacks.html` | JWT attacks, OAuth, session management, IDOR, 2FA bypass |
| Burp Suite | `burp.html` | Proxy, repeater, intruder, extensions, Turbo Intruder, HTTP smuggling |

### Blockchain (`pages/blockchain/`)
| Page | File | Topics |
|------|------|--------|
| Solidity | `solidity.html` | Language fundamentals, ERC standards, Hardhat, gas optimization |
| Smart Contract Vulns | `vulnerabilities.html` | Reentrancy, overflow, access control, oracle manipulation, signature replay |
| DeFi Attacks | `defi.html` | Flash loans, price manipulation, sandwich attacks, MEV, governance |

### Windows (`pages/windows/`)
| Page | File | Topics |
|------|------|--------|
| Internals | `internals.html` | EPROCESS, tokens, DLL loading, syscalls, mitigations |
| Active Directory | `active-directory.html` | Kerberos, Kerberoasting, Golden/Silver tickets, DCSync, BloodHound |
| Privilege Escalation | `privilege-escalation.html` | Service misconfig, token impersonation, UAC bypass, Potato exploits |
| Lateral Movement | `lateral-movement.html` | PtH, PtT, WinRM, pivoting, C2 frameworks, LOLBAS |

### Cryptography (`pages/crypto/`)
| Page | File | Topics |
|------|------|--------|
| Classical Ciphers | `classical.html` | Caesar, Vigenère, substitution, transposition, XOR, OTP |
| Symmetric Crypto | `symmetric.html` | AES modes (ECB/CBC/CTR/GCM), padding oracle, bit-flipping |
| Asymmetric Crypto | `asymmetric.html` | RSA attacks, Wiener, Hastad, Fermat, DH, ECC, ECDSA nonce reuse |
| Hashing | `hashing.html` | Hash cracking (hashcat/john), length extension, HMAC, birthday attacks |
| Crypto Attacks | `attacks.html` | PRNG prediction, Mersenne Twister, timing attacks, Z3 solver |

### Reverse Engineering (`pages/reversing/`)
| Page | File | Topics |
|------|------|--------|
| Static Analysis | `static-analysis.html` | Ghidra, IDA, radare2, Angr symbolic execution, binary patching |
| Dynamic Analysis | `dynamic-analysis.html` | GDB scripting, Frida hooking, unicorn emulation, AFL fuzzing |
| Anti-Reversing | `anti-reversing.html` | Anti-debug bypass, unpacking (UPX/custom), obfuscation, VM detection |
| Malware Analysis | `malware.html` | Behavioral analysis, PE format, YARA rules, IOC extraction |

### Browser Exploitation (`pages/browser/`)
| Page | File | Topics |
|------|------|--------|
| V8 Internals | `v8-internals.html` | Object model, JIT compilation, heap structure, pointer compression |
| JS Engine Exploitation | `js-engine-exploit.html` | Type confusion, OOB, addrof/fakeobj, WASM shellcode execution |
| Sandbox Escape | `sandbox-escape.html` | Chrome IPC/Mojo, site isolation, full chain anatomy |

### Linux Kernel (`pages/kernel/`)
| Page | File | Topics |
|------|------|--------|
| Kernel Fundamentals | `fundamentals.html` | Modules, syscalls, SLUB allocator, cred structure, QEMU setup |
| Kernel Exploitation | `exploitation.html` | ret2usr, kernel ROP, modprobe_path, msg_msg, pipe_buffer |
| Race Conditions | `race-conditions.html` | TOCTOU, userfaultfd, FUSE, double fetch, Dirty COW |

### Forensics (`pages/forensics/`)
| Page | File | Topics |
|------|------|--------|
| Disk Forensics | `disk.html` | File carving, NTFS artifacts, registry, Sleuth Kit, timeline |
| Memory Forensics | `memory.html` | Volatility 3, process analysis, rootkit detection, IOCs |
| Steganography | `steganography.html` | LSB, steghide, spectrograms, PNG chunks, file tricks |

---

## Content Scale

| Metric | Count |
|--------|-------|
| Total sections | 12 |
| Total pages | 40+ |
| Labs per page | 12+ (minimum) |
| CTF challenges per page | 10+ (minimum) |
| Total labs | ~500+ |
| Total CTF challenges | ~400+ |

Every lab includes complete source code, compilation flags, and step-by-step instructions.
Every CTF challenge includes difficulty rating (Easy/Medium/Hard) and expandable hints with solution guidance.

---

## Technical Details

### Tab System
- Tab switching handled by `main.js` using `data-tab` attributes
- Hint toggles use `.hint-toggle` buttons with `.hint-content` divs
- All styling in `assets/styles/styles.css` under "TAB SYSTEM"
- Difficulty badges: `.difficulty-easy`, `.difficulty-medium`, `.difficulty-hard`
- Lab/CTF cards: `.lab-card` and `.ctf-card` classes

### Navigation
- Navbar dynamically generated in `main.js` with Bootstrap dropdowns
- 12 dropdown menus, one per section
- Homepage (`index.html`) links to all pages with descriptions
