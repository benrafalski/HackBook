document.addEventListener("DOMContentLoaded", () => {
    // 1. Create the sidebar container
    let sidebar = document.querySelector(".sidebar");
    if (!sidebar) {
      sidebar = document.createElement("div");
      sidebar.className = "sidebar";
      document.body.appendChild(sidebar);
    }
  
    // 2. Get all h2 and h3 elements
    const headings = document.querySelectorAll("h2, h3");
    const tocMap = new Map();
  
    headings.forEach((heading) => {
      if (!heading.id) {
        heading.id = heading.textContent.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
      }
  
      if (heading.tagName === "H2") {
        tocMap.set(heading.id, {
          text: heading.textContent,
          h3s: []
        });
      } else if (heading.tagName === "H3") {
        const lastH2 = Array.from(tocMap.keys()).pop();
        if (lastH2) {
          tocMap.get(lastH2).h3s.push({
            id: heading.id,
            text: heading.textContent
          });
        }
      }
    });
  
    // 3. Generate the TOC HTML
    let tocHTML = `<h5 class="text-white mb-3">Contents</h5>`;
    let sectionIndex = 0;
  
    for (const [h2Id, data] of tocMap) {
        const collapseId = `collapse-${sectionIndex++}`;
    if(data.h3s.length > 0){
      tocHTML += `
        <div class="toc-section">
          <button class="toc-toggle" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="true" aria-controls="${collapseId}">
            <span class="arrow">&#9656;</span>
          </button>
          <a href="${window.location.pathname}#${h2Id}" class="toc-link">${data.text}</a>
        </div>
        <div class="collapse show" id="${collapseId}">
          <div class="toc-subsection">
            ${data.h3s.map(h3 => `<a href="${window.location.pathname}#${h3.id}" class="toc-link">${h3.text}</a>`).join("")}
          </div>
        </div>
      `;
    }else{
    
      tocHTML += `
        <div class="toc-section">
          <button class="toc-toggle" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="true" aria-controls="${collapseId}" style="visibility: hidden;">
            <span class="arrow">&#9656;</span>
          </button>
          <a href="${window.location.pathname}#${h2Id}" class="toc-link">${data.text}</a>
        </div>
      `;
    }

      
    }
  
    sidebar.innerHTML = tocHTML;  

    function loadNavbar() {
        // Define the entire HTML for the navbar
        const navbarHTML = `
          <nav class="navbar navbar-expand-lg navbar-dark bg-dark position-fixed top-0 w-100 z-3">
        <div class="container-fluid">
          <a class="navbar-brand" href="index.html">HackBook</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent"
            aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" id="binDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Binary Exploitation
                </a>
                <ul class="dropdown-menu bg-dark text-light" aria-labelledby="binDropdown">
                  <li><a class="dropdown-item text-light" href="pages/binary/fundamentals.html">Fundamentals</a></li>
                  <li><a class="dropdown-item text-light" href="pages/binary/stack-overflow.html">Stack Overflow</a></li>
                  <li><a class="dropdown-item text-light" href="pages/binary/format-strings.html">Format Strings</a></li>
                  <li><a class="dropdown-item text-light" href="pages/binary/rop.html">ROP</a></li>
                  <li><a class="dropdown-item text-light" href="pages/binary/got-plt.html">GOT/PLT Hijacking</a></li>
                  <li><a class="dropdown-item text-light" href="pages/binary/heap.html">Heap Exploitation</a></li>
                  <li><a class="dropdown-item text-light" href="pages/binary/shellcode.html">Shellcode</a></li>
                </ul>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" id="netDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Networking
                </a>
                <ul class="dropdown-menu bg-dark text-light" aria-labelledby="netDropdown">
                  <li><a class="dropdown-item text-light" href="pages/network/tcp-ip.html">TCP/IP</a></li>
                  <li><a class="dropdown-item text-light" href="pages/network/dns.html">DNS</a></li>
                  <li><a class="dropdown-item text-light" href="pages/network/scanning.html">Network Scanning</a></li>
                  <li><a class="dropdown-item text-light" href="pages/network/arp.html">ARP & Layer 2</a></li>
                  <li><a class="dropdown-item text-light" href="pages/network/dhcp.html">DHCP</a></li>
                  <li><a class="dropdown-item text-light" href="pages/network/wireshark.html">Wireshark</a></li>
                </ul>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" id="archDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Architecture
                </a>
                <ul class="dropdown-menu bg-dark text-light" aria-labelledby="archDropdown">
                  <li><a class="dropdown-item text-light" href="pages/arch/x86-assembly.html">x86 Assembly</a></li>
                  <li><a class="dropdown-item text-light" href="pages/arch/x86-os-internals.html">x86 OS Internals</a></li>
                  <li><a class="dropdown-item text-light" href="pages/arch/x86-firmware.html">x86 Firmware</a></li>
                  <li><a class="dropdown-item text-light" href="pages/arch/memory-management.html">Memory Management</a></li>
                </ul>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" id="webDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Web
                </a>
                <ul class="dropdown-menu bg-dark text-light" aria-labelledby="webDropdown">
                  <li><a class="dropdown-item text-light" href="pages/web/http.html">HTTP</a></li>
                  <li><a class="dropdown-item text-light" href="pages/web/xss.html">XSS</a></li>
                  <li><a class="dropdown-item text-light" href="pages/web/sqli.html">SQL Injection</a></li>
                  <li><a class="dropdown-item text-light" href="pages/web/ssrf.html">SSRF</a></li>
                  <li><a class="dropdown-item text-light" href="pages/web/auth-attacks.html">Auth Attacks</a></li>
                  <li><a class="dropdown-item text-light" href="pages/web/burp.html">Burp Suite</a></li>
                </ul>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" id="blockchainDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Blockchain
                </a>
                <ul class="dropdown-menu bg-dark text-light" aria-labelledby="blockchainDropdown">
                  <li><a class="dropdown-item text-light" href="pages/blockchain/solidity.html">Solidity</a></li>
                  <li><a class="dropdown-item text-light" href="pages/blockchain/vulnerabilities.html">Smart Contract Vulns</a></li>
                  <li><a class="dropdown-item text-light" href="pages/blockchain/defi.html">DeFi Attacks</a></li>
                </ul>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" id="winDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Windows
                </a>
                <ul class="dropdown-menu bg-dark text-light" aria-labelledby="winDropdown">
                  <li><a class="dropdown-item text-light" href="pages/windows/internals.html">Internals</a></li>
                  <li><a class="dropdown-item text-light" href="pages/windows/architecture.html">Architecture</a></li>
                  <li><a class="dropdown-item text-light" href="pages/windows/authentication.html">Authentication</a></li>
                  <li><a class="dropdown-item text-light" href="pages/windows/kernel-security.html">Kernel Security</a></li>
                  <li><a class="dropdown-item text-light" href="pages/windows/os-security.html">OS Security Mechanisms</a></li>
                  <li><a class="dropdown-item text-light" href="pages/windows/active-directory.html">Active Directory</a></li>
                  <li><a class="dropdown-item text-light" href="pages/windows/powershell.html">PowerShell Security</a></li>
                  <li><a class="dropdown-item text-light" href="pages/windows/offensive.html">Offensive / Red Team</a></li>
                  <li><a class="dropdown-item text-light" href="pages/windows/networking.html">Networking &amp; Protocols</a></li>
                  <li><a class="dropdown-item text-light" href="pages/windows/privilege-escalation.html">Privilege Escalation</a></li>
                  <li><a class="dropdown-item text-light" href="pages/windows/lateral-movement.html">Lateral Movement</a></li>
                  <li><a class="dropdown-item text-light" href="pages/windows/forensics.html">Forensics &amp; IR</a></li>
                  <li><a class="dropdown-item text-light" href="pages/windows/hardening.html">Hardening</a></li>
                </ul>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" id="cryptoDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Cryptography
                </a>
                <ul class="dropdown-menu bg-dark text-light" aria-labelledby="cryptoDropdown">
                  <li><a class="dropdown-item text-light" href="pages/crypto/classical.html">Classical Ciphers</a></li>
                  <li><a class="dropdown-item text-light" href="pages/crypto/symmetric.html">Symmetric Crypto</a></li>
                  <li><a class="dropdown-item text-light" href="pages/crypto/asymmetric.html">Asymmetric Crypto</a></li>
                  <li><a class="dropdown-item text-light" href="pages/crypto/hashing.html">Hashing</a></li>
                  <li><a class="dropdown-item text-light" href="pages/crypto/attacks.html">Crypto Attacks</a></li>
                </ul>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" id="revDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Reverse Engineering
                </a>
                <ul class="dropdown-menu bg-dark text-light" aria-labelledby="revDropdown">
                  <li><a class="dropdown-item text-light" href="pages/reversing/static-analysis.html">Static Analysis</a></li>
                  <li><a class="dropdown-item text-light" href="pages/reversing/dynamic-analysis.html">Dynamic Analysis</a></li>
                  <li><a class="dropdown-item text-light" href="pages/reversing/anti-reversing.html">Anti-Reversing</a></li>
                  <li><a class="dropdown-item text-light" href="pages/reversing/malware.html">Malware Analysis</a></li>
                </ul>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" id="browserDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Browser
                </a>
                <ul class="dropdown-menu bg-dark text-light" aria-labelledby="browserDropdown">
                  <li><a class="dropdown-item text-light" href="pages/browser/v8-internals.html">V8 Internals</a></li>
                  <li><a class="dropdown-item text-light" href="pages/browser/js-engine-exploit.html">JS Engine Exploitation</a></li>
                  <li><a class="dropdown-item text-light" href="pages/browser/sandbox-escape.html">Sandbox Escape</a></li>
                </ul>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" id="kernelDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Linux Kernel
                </a>
                <ul class="dropdown-menu bg-dark text-light" aria-labelledby="kernelDropdown">
                  <li><a class="dropdown-item text-light" href="pages/kernel/fundamentals.html">Kernel Fundamentals</a></li>
                  <li><a class="dropdown-item text-light" href="pages/kernel/exploitation.html">Kernel Exploitation</a></li>
                  <li><a class="dropdown-item text-light" href="pages/kernel/race-conditions.html">Race Conditions</a></li>
                </ul>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" id="forensicsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Forensics
                </a>
                <ul class="dropdown-menu bg-dark text-light" aria-labelledby="forensicsDropdown">
                  <li><a class="dropdown-item text-light" href="pages/forensics/disk.html">Disk Forensics</a></li>
                  <li><a class="dropdown-item text-light" href="pages/forensics/memory.html">Memory Forensics</a></li>
                  <li><a class="dropdown-item text-light" href="pages/forensics/steganography.html">Steganography</a></li>
                </ul>
              </li>



            </ul>

            <div class="d-lg-none mobile-sidebar-scroll">
              ${tocHTML}
            </div>
          </div>
        </div>
      </nav>
        `;
    
        // Inject the navbar HTML into the body or header
        const header = document.querySelector("body");
        const firstChild = header.firstChild;
        const navbarContainer = document.createElement('div');
        navbarContainer.innerHTML = navbarHTML;
    
        // Insert the navbar at the beginning of the body
        header.insertBefore(navbarContainer.firstElementChild, firstChild);
      }
    
      // Load the navbar when the page is ready
      loadNavbar();

      // Reinitialize Bootstrap dropdowns
      const dropdowns = document.querySelectorAll('.dropdown');
      dropdowns.forEach(dropdown => {
        new bootstrap.Dropdown(dropdown);
      });


      document.querySelectorAll('a.internal-link[href^="#"]').forEach(link => {
        const hash = link.getAttribute('href');
        link.setAttribute('href', window.location.pathname + hash);
      });

      // Tab system
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const container = btn.closest('.tab-container');
          container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
          btn.classList.add('active');
          container.querySelector(`#${btn.dataset.tab}`).classList.add('active');
        });
      });

      // Hint toggles
      document.querySelectorAll('.hint-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
          const hint = btn.nextElementSibling;
          hint.classList.toggle('show');
          btn.textContent = hint.classList.contains('show') ? 'Hide Hint' : 'Show Hint';
        });
      });

      
});