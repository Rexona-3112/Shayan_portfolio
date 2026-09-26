/* ==========================================================================
   SHAYAN CHAKRABORTY — BRUTALIST TERMINAL PORTFOLIO JAVASCRIPT
   Interactive CLI, Typewriter Engine, Collapsible Cards & Navigation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Reduced motion check ── */
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── Terminal Simulation & Interactive Shell ── */
    const terminalLines = [
        { text: "shayan@forensic-lab:~$ whoami", class: "text-blue-400 font-bold" },
        { text: "> Shayan Chakraborty | Forensic Science Postgraduate", class: "text-white mb-2" },
        { text: "shayan@forensic-lab:~$ cat case-profile.txt", class: "text-blue-400 font-bold" },
        { text: "> Specialization: Digital Forensics, Cybersecurity & Cybercrime Investigation", class: "text-white mb-2" },
        { text: "shayan@forensic-lab:~$ ./verify_evidence.py -i disk_image.raw", class: "text-blue-400 font-bold" },
        { text: "> [INIT] Mounting evidence image with write-blocking...", class: "text-yellow-300" },
        { text: "[HASH] Calculating cryptographic checksum...", class: "text-gray-400" },
        { text: "[OK]   SHA-256: 8f4e2b83...c79e (Chain of Custody verified)", class: "text-green-400" },
        { text: "[INFO] Parsing partition table: NTFS & ext4 artifacts intact", class: "text-gray-400" },
        { text: "[INFO] Scanning for steganographic & encrypted carriers...", class: "text-gray-400" },
        { text: "[SUCCESS] Artifact integrity verified. Forensic workspace ready ✓", class: "text-green-400 font-bold mt-2" },
    ];

    const terminalBox = document.getElementById('terminal-content');
    const terminalShell = document.getElementById('terminal-shell');

    function termLine(text, cls) {
        if (!terminalBox) return null;
        const p = document.createElement('p');
        p.className = cls || 'text-white';
        p.textContent = text;
        terminalBox.appendChild(p);
        terminalBox.scrollTop = terminalBox.scrollHeight;
        return p;
    }

    const TERM_SECTIONS = {
        hero: 'hero',
        top: 'hero',
        home: 'hero',
        about: 'about',
        bio: 'about',
        profile: 'about',
        projects: 'projects',
        experience: 'experience',
        work: 'experience',
        research: 'research',
        skills: 'skills',
        certifications: 'certifications',
        certs: 'certifications',
        contact: 'contact'
    };

    const COMMANDS = {
        help: () => [
            ['Available Forensic Terminal Commands:', 'text-orange-400 font-bold'],
            ['  whoami         identity & postgraduate background', 'text-white'],
            ['  ls             list directory sections', 'text-white'],
            ['  projects       jump to selected case studies & tools', 'text-white'],
            ['  experience     view SFSL Cyber Division internship log', 'text-white'],
            ['  research       view PhotoDNA & forensic research topics', 'text-white'],
            ['  skills         technical competencies & lab stack', 'text-white'],
            ['  certs          view certifications & simulations', 'text-white'],
            ['  photodna       technical distinction on PhotoDNA vs ELA', 'text-yellow-300'],
            ['  sfsl           State Forensic Science Laboratory info', 'text-yellow-300'],
            ['  contact        communication endpoints', 'text-white'],
            ['  resume         open resume PDF in new tab', 'text-white'],
            ['  clear          wipe terminal output', 'text-white']
        ],
        whoami: () => [
            ['Shayan Chakraborty', 'text-white font-bold'],
            ['Forensic Science Postgraduate | Digital Forensics | Cybersecurity', 'text-green-400'],
            ['Focus: Evidence Integrity, Incident Response, Cybercrime Investigation.', 'text-gray-400']
        ],
        ls: () => [
            ['./about  ./projects/  ./experience  ./research/  ./skills/  ./certifications/  ./contact', 'text-blue-400 font-bold']
        ],
        sfsl: () => [
            ['State Forensic Science Laboratory (SFSL), West Bengal', 'text-orange-400 font-bold'],
            ['Cyber Division Internship (June 2026 — July 2026)', 'text-white'],
            ['Focus: Digital evidence acquisition, forensic imaging, and cybercrime triage.', 'text-gray-400']
        ],
        photodna: () => [
            ['PhotoDNA vs Manipulation Detection distinction:', 'text-orange-400 font-bold'],
            ['PhotoDNA = Perceptual image hashing for matching known media.', 'text-white'],
            ['Manipulation Detection = ELA, copy-move clone analysis, CFA inconsistency analysis.', 'text-green-400'],
            ['Both are analyzed within the comprehensive digital image forensics inquiry.', 'text-gray-400']
        ],
        contact: () => [
            ['GitHub:   https://github.com/Rexona-3112', 'text-orange-400'],
            ['LinkedIn: LINKEDIN_URL', 'text-gray-300'],
            ['Email:    EMAIL_ADDRESS', 'text-gray-300'],
            ['Resume:   assets/Shayan-Chakraborty-Resume.pdf', 'text-gray-300']
        ],
        resume: () => {
            window.open('assets/Shayan-Chakraborty-Resume.pdf', '_blank', 'noopener,noreferrer');
            return [['[ACTION] Opening assets/Shayan-Chakraborty-Resume.pdf in a new tab ...', 'text-green-400']];
        },
        clear: () => {
            if (terminalBox) terminalBox.innerHTML = '';
            return [];
        },
        sudo: () => [
            ['Permission denied: Chain of custody requires authorized role.', 'text-red-400 font-bold']
        ],
        exit: () => [
            ['$ exit // Forensic terminal session remains open in browser.', 'text-gray-400']
        ]
    };

    let lineIndex = 0;
    let typing = null;
    let partialEl = null;
    let introDone = false;
    let promptRow = null;
    let termInput = null;
    const cmdHistory = [];
    let histIdx = 0;

    function mountPrompt(focus) {
        if (!terminalBox) return;
        promptRow = document.createElement('div');
        promptRow.className = 'flex items-baseline gap-2 text-blue-400 font-bold mt-1';
        promptRow.innerHTML = '<span>shayan@forensic-lab:~$</span>';

        termInput = document.createElement('input');
        termInput.id = 'term-input';
        termInput.className = 'flex-1 min-w-0';
        termInput.autocomplete = 'off';
        termInput.spellcheck = false;
        termInput.setAttribute('aria-label', 'Terminal command input — type help');
        termInput.addEventListener('keydown', onTermKey);

        promptRow.appendChild(termInput);
        terminalBox.appendChild(promptRow);
        terminalBox.scrollTop = terminalBox.scrollHeight;

        if (focus) {
            termInput.focus();
        }
    }

    function runCommand(raw) {
        const cmd = raw.trim().toLowerCase();
        if (promptRow) promptRow.remove();

        termLine('shayan@forensic-lab:~$ ' + raw, 'text-blue-400 font-bold');

        if (cmd) {
            if (TERM_SECTIONS[cmd]) {
                termLine('→ navigating to ~/' + cmd + ' ...', 'text-green-400');
                const target = document.getElementById(TERM_SECTIONS[cmd]);
                if (target) {
                    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
                }
            } else if (COMMANDS[cmd]) {
                COMMANDS[cmd]().forEach(([t, c]) => termLine(t, c));
            } else {
                termLine('bash: ' + cmd + ': command not found — type `help` for commands', 'text-red-400');
            }
            cmdHistory.push(raw);
            histIdx = cmdHistory.length;
        }

        mountPrompt(true);
    }

    function onTermKey(e) {
        if (e.key === 'Enter') {
            runCommand(termInput.value);
        } else if (e.key === 'ArrowUp' && histIdx > 0) {
            e.preventDefault();
            termInput.value = cmdHistory[--histIdx];
        } else if (e.key === 'ArrowDown' && histIdx < cmdHistory.length) {
            e.preventDefault();
            histIdx++;
            termInput.value = cmdHistory[histIdx] || '';
        }
    }

    function typeLine() {
        if (introDone || !terminalBox) return;
        if (lineIndex >= terminalLines.length) {
            endIntro();
            return;
        }

        const lineData = terminalLines[lineIndex];
        const text = lineData.text;
        partialEl = termLine('', lineData.class);
        let charIndex = 0;

        typing = setInterval(() => {
            if (!partialEl) return;
            partialEl.textContent += text[charIndex];
            charIndex++;
            terminalBox.scrollTop = terminalBox.scrollHeight;

            if (charIndex === text.length) {
                clearInterval(typing);
                typing = null;
                partialEl = null;
                lineIndex++;
                setTimeout(typeLine, 280);
            }
        }, 12);
    }

    function dumpRest() {
        if (!terminalBox) return;
        while (lineIndex < terminalLines.length) {
            const l = terminalLines[lineIndex++];
            termLine(l.text, l.class);
        }
    }

    function endIntro() {
        if (introDone) return;
        introDone = true;
        termLine('// Forensic CLI ready. Type `help` for directory commands.', 'text-gray-400 mt-2');
        mountPrompt(false);
    }

    function skipIntro() {
        if (introDone) return;
        if (typing) {
            clearInterval(typing);
            typing = null;
        }
        if (partialEl) {
            partialEl.remove();
            partialEl = null;
        }
        dumpRest();
        endIntro();
    }

    if (reduceMotion) {
        dumpRest();
        endIntro();
    } else {
        typeLine();
    }

    if (terminalShell) {
        terminalShell.addEventListener('click', () => {
            if (introDone) {
                if (termInput) termInput.focus();
            } else {
                skipIntro();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!introDone && e.key === 'Enter') {
            skipIntro();
        }
    });

    /* ── Hero Role Typewriter ── */
    const roles = [
        'Digital Forensics',
        'Cybersecurity',
        'Forensic Investigation',
        'Incident Response',
        'Cybercrime Investigation'
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;
    const roleEl = document.getElementById('typed-role');

    function typeRole() {
        if (!roleEl) return;
        const current = roles[roleIdx];

        if (!deleting) {
            roleEl.textContent = current.slice(0, charIdx + 1);
            charIdx++;
            if (charIdx === current.length) {
                deleting = true;
                setTimeout(typeRole, 2000);
                return;
            }
        } else {
            roleEl.textContent = current.slice(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) {
                deleting = false;
                roleIdx = (roleIdx + 1) % roles.length;
            }
        }
        setTimeout(typeRole, deleting ? 45 : 75);
    }

    if (reduceMotion && roleEl) {
        roleEl.textContent = roles[0];
    } else {
        typeRole();
    }

    /* ── Scroll Fade-In Observer ── */
    const fadeEls = document.querySelectorAll('.fade-in');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                }
            });
        }, { threshold: 0.08 });

        fadeEls.forEach(el => observer.observe(el));
    } else {
        fadeEls.forEach(el => el.classList.add('visible'));
    }

    /* ── Mobile Navigation Drawer ── */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const closeBtn = document.getElementById('close-menu');

    window.closeMobileMenu = function() {
        if (!mobileMenu) return;
        const wasOpen = mobileMenu.classList.contains('open');
        mobileMenu.classList.remove('open');
        if (menuOverlay) menuOverlay.classList.add('hidden');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');

        // Un-inert other elements
        document.querySelectorAll('[data-inert-trapped]').forEach(el => {
            el.removeAttribute('inert');
            el.removeAttribute('data-inert-trapped');
        });

        if (wasOpen && hamburger) hamburger.focus();
    };

    if (hamburger && mobileMenu && menuOverlay) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.add('open');
            menuOverlay.classList.remove('hidden');
            hamburger.setAttribute('aria-expanded', 'true');

            // Apply inert to sibling page content for accessibility
            const pageSiblings = [...document.body.children].filter(
                el => el !== mobileMenu && el !== menuOverlay
            );
            pageSiblings.forEach(el => {
                el.setAttribute('inert', '');
                el.setAttribute('data-inert-trapped', 'true');
            });

            if (closeBtn) closeBtn.focus();
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', window.closeMobileMenu);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                window.closeMobileMenu();
            }
        });
    }

    /* ── Resume File Detection (Development Warning) ── */
    const resumeLinks = document.querySelectorAll('a[href*="Shayan-Chakraborty-Resume.pdf"]');
    resumeLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.location.protocol.startsWith('http')) {
                fetch(link.href, { method: 'HEAD' })
                    .then(res => {
                        if (!res.ok && res.status === 404) {
                            console.warn('[RESUME NOTICE] Resume PDF not yet detected at assets/Shayan-Chakraborty-Resume.pdf. Upload your actual resume PDF to the assets/ folder.');
                        }
                    })
                    .catch(() => {});
            }
        });
    });

});

/* ── Global Project Detail Toggle Function ── */
function toggleDetail(id, btn) {
    const el = document.getElementById(id);
    if (!el) return;
    const isOpen = el.classList.toggle('open');
    if (btn) {
        btn.textContent = isOpen ? '[ − HIDE METHODOLOGY ]' : '[ + READ METHODOLOGY ]';
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
}
