// Inicializar partículas
document.addEventListener('DOMContentLoaded', function() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#bb86fc" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#03dac6",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "grab" },
                onclick: { enable: true, mode: "push" },
                resize: true
            }
        },
        retina_detect: true
    });

    // Inicializar comandos
    initTerminal();
});

// Sistema de terminal
function initTerminal() {
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    
    // Comandos disponibles
    const commands = {
        help: {
            description: "Muestra todos los comandos disponibles",
            execute: () => {
                appendResponse(
                    `<p>Comandos disponibles:</p>
                    <ul>
                        <li><span class="command">about</span> - Información sobre mí</li>
                        <li><span class="command">skills</span> - Mis habilidades técnicas</li>
                        <li><span class="command">projects</span> - Mis proyectos</li>
                        <li><span class="command">contact</span> - Información de contacto</li>
                        <li><span class="command">clear</span> - Limpiar la terminal</li>
                        <li><span class="command">bienvenido</span> - Mostrar mensaje de bienvenida</li>
                    </ul>`
                );
            }
        },
        about: {
            description: "Información sobre mí",
            execute: () => {
                showSection('about');
                appendResponse("Mostrando información sobre mí mira en la parte de abajo...");
            }
        },
        skills: {
            description: "Mis habilidades técnicas",
            execute: () => {
                showSection('skills');
                // Animar barras de habilidades
                setTimeout(animateSkillBars, 300);
                appendResponse("Mostrando mis habilidades...");
            }
        },
        projects: {
            description: "Mis proyectos",
            execute: () => {
                showSection('projects');
                appendResponse("Mostrando mis proyectos...");
            }
        },
        contact: {
            description: "Información de contacto",
            execute: () => {
                showSection('contact');
                appendResponse("Mostrando información de contacto...");
            }
        },
        clear: {
            description: "Limpiar la terminal",
            execute: () => {
                clearTerminal();
            }
        },
        bienvenido: {
            description: "Mostrar mensaje de bienvenida",
            execute: () => {
                appendResponse(
                    `<p>¡Hola! Bienvenido a mi portafolio interactivo.</p>
                    <p>Escribe <span class="command">help</span> para ver los comandos disponibles.</p>`
                );
            }
        }
    };

    // Función para añadir respuesta a la terminal
    function appendResponse(response) {
        const responseElement = document.createElement('div');
        responseElement.className = 'terminal-response';
        responseElement.innerHTML = response;
        terminalOutput.appendChild(responseElement);
        scrollToBottom();
    }

    // Función para limpiar la terminal
    function clearTerminal() {
        const lines = terminalOutput.querySelectorAll('.terminal-line, .terminal-response');
        lines.forEach((line, index) => {
            if (index > 0) { // Mantener la primera línea con el prompt
                line.remove();
            }
        });
    }

    // Función para mostrar una sección
    function showSection(sectionId) {
        // Ocultar todas las secciones
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('hidden');
        });
        
        // Mostrar la sección seleccionada
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.remove('hidden');
        }
    }

    // Función para animar las barras de habilidades
    function animateSkillBars() {
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach(item => {
            const skillLevel = item.getAttribute('data-skill');
            const progressBar = item.querySelector('.skill-progress');
            progressBar.style.width = skillLevel + '%';
        });
    }

    // Función para desplazarse al final de la terminal
    function scrollToBottom() {
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    // Función para procesar comandos
    function processCommand(command) {
        // Añadir el comando a la terminal
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';
        commandLine.innerHTML = `
            <span class="terminal-user">visitor@portafolio:</span>
            <span class="terminal-path">~$</span>
            <span class="terminal-command">${command}</span>
        `;
        terminalOutput.appendChild(commandLine);

        // Procesar el comando
        const cmd = command.trim().toLowerCase();
        
        if (commands[cmd]) {
            commands[cmd].execute();
        } else if (cmd) {
            appendResponse(`Comando no encontrado: ${command}. Escribe <span class="command">help</span> para ver los comandos disponibles.`);
        }

        // Añadir nueva línea de entrada
        const newInputLine = document.createElement('div');
        newInputLine.className = 'terminal-line';
        newInputLine.innerHTML = `
            <span class="terminal-user">visitor@portafolio:</span>
            <span class="terminal-path">~$</span>
            <span class="terminal-cursor"></span>
        `;
        terminalOutput.appendChild(newInputLine);
        
        scrollToBottom();
    }

// Event listener para el input
    terminalInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = this.value;
            this.value = '';
            processCommand(command);
            
            // Incrementar contador de comandos
            const commandCount = document.getElementById('command-count');
            commandCount.textContent = parseInt(commandCount.textContent) + 1;
        }
        
        // Autocompletar con Tab
        if (e.key === 'Tab') {
            e.preventDefault();
            const input = this.value.toLowerCase();
            const suggestions = Object.keys(commands).filter(cmd => cmd.startsWith(input));
            if (suggestions.length === 1) {
                this.value = suggestions[0];
            }
        }
    });

    // Hacer focus en el input al hacer clic en cualquier parte de la terminal
    terminalOutput.addEventListener('click', () => {
        terminalInput.focus();
    });
    
    // Sugerencias en tiempo real
    terminalInput.addEventListener('input', function() {
        const input = this.value.toLowerCase();
        const suggestions = document.getElementById('terminal-suggestions');
        
        if (input.length > 0) {
            const matchingCommands = Object.keys(commands).filter(cmd => 
                cmd.startsWith(input) && cmd !== input
            );
            
            if (matchingCommands.length > 0) {
                let suggestionsHTML = '';
                matchingCommands.slice(0, 5).forEach(cmd => {
                    suggestionsHTML += `
                        <div class="suggestion-item" onclick="selectSuggestion('${cmd}')">
                            <span class="suggestion-command">${cmd}</span>
                            <span class="suggestion-description">${commands[cmd].description}</span>
                        </div>
                    `;
                });
                suggestions.innerHTML = suggestionsHTML;
                suggestions.classList.add('show');
            } else {
                suggestions.classList.remove('show');
            }
        } else {
            suggestions.classList.remove('show');
        }
    });
    
    // Función para seleccionar sugerencia
    window.selectSuggestion = function(command) {
        terminalInput.value = command;
        document.getElementById('terminal-suggestions').classList.remove('show');
        terminalInput.focus();
    };
}

// Funciones de navegación y efectos
document.addEventListener('DOMContentLoaded', function() {
    // Loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hidden');
        startHeroAnimations();
    }, 3000);
    
    // Cursor personalizado
    initCustomCursor();
    
    // Navegación
    initNavigation();
    
    // Efectos de scroll
    initScrollEffects();
    
    // Animaciones de contadores
    initCounterAnimations();
    
    // Formulario de contacto
    initContactForm();
    
    // Efectos de hover en proyectos
    initProjectEffects();
});

// Cursor personalizado
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollow = document.querySelector('.cursor-follow');
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followX = 0, followY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        // Cursor principal (más rápido)
        cursorX += (mouseX - cursorX) * 0.3;
        cursorY += (mouseY - cursorY) * 0.3;
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        
        // Cursor seguidor (más lento)
        followX += (mouseX - followX) * 0.1;
        followY += (mouseY - followY) * 0.1;
        cursorFollow.style.transform = `translate(${followX}px, ${followY}px)`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Efectos en hover
    document.querySelectorAll('a, button, .tech-item, .project-card, .nav-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform += ' scale(1.5)';
            cursorFollow.style.transform += ' scale(0.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
            cursorFollow.style.transform = cursorFollow.style.transform.replace(' scale(0.5)', '');
        });
    });
}

// Navegación
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');
    
    // Scroll spy
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === current) {
                item.classList.add('active');
            }
        });
    });
    
    // Smooth scroll en navegación
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animaciones del hero
function startHeroAnimations() {
    // Animar contadores
    animateCounters();
    
    // Animar elementos flotantes
    animateFloatingElements();
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current >= target) {
                counter.textContent = target;
            } else {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            }
        };
        
        setTimeout(updateCounter, 1000);
    });
}

function animateFloatingElements() {
    const elements = document.querySelectorAll('.floating-element');
    
    elements.forEach((el, index) => {
        const speed = parseFloat(el.getAttribute('data-speed'));
        let position = 0;
        
        const animate = () => {
            position += speed * 0.5;
            el.style.transform = `translateY(${Math.sin(position * 0.01) * 20}px) translateX(${Math.cos(position * 0.008) * 15}px)`;
            requestAnimationFrame(animate);
        };
        
        animate();
    });
}

// Efectos de scroll
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observar elementos animables
    document.querySelectorAll('.content-section, .project-card, .skill-item, .contact-item').forEach(el => {
        observer.observe(el);
    });
}

// Animaciones de contadores en skills
function initCounterAnimations() {
    const skillItems = document.querySelectorAll('.skill-item');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillLevel = entry.target.getAttribute('data-skill');
                const progressBar = entry.target.querySelector('.skill-progress');
                
                setTimeout(() => {
                    progressBar.style.width = skillLevel + '%';
                }, 200);
                
                skillObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    skillItems.forEach(item => skillObserver.observe(item));
}

// Formulario de contacto
function initContactForm() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input, textarea');
    
    // Efectos de label flotante
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // Verificar si ya tiene contenido al cargar
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
    
    // Envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const button = form.querySelector('.btn-submit');
        const originalText = button.innerHTML;
        
        // Animación de envío
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        button.disabled = true;
        
        // Simular envío
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-check"></i> ¡Enviado!';
            button.style.background = 'linear-gradient(45deg, #4caf50, #45a049)';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
                button.disabled = false;
                form.reset();
                
                // Remover clases focused
                inputs.forEach(input => {
                    input.parentElement.classList.remove('focused');
                });
            }, 2000);
        }, 1500);
    });
}

// Efectos en proyectos
function initProjectEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Efecto de parallax en la imagen
            const image = card.querySelector('.project-image');
            image.style.transform = 'scale(1.05)';
            
            // Efecto en las tecnologías
            const techTags = card.querySelectorAll('.tech-tag');
            techTags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.transform = 'translateY(-3px)';
                }, index * 50);
            });
        });
        
        card.addEventListener('mouseleave', () => {
            const image = card.querySelector('.project-image');
            image.style.transform = 'scale(1)';
            
            const techTags = card.querySelectorAll('.tech-tag');
            techTags.forEach(tag => {
                tag.style.transform = 'translateY(0)';
            });
        });
    });
}

// Funciones de terminal específicas
function scrollToTerminal() {
    document.getElementById('terminal-section').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function downloadCV() {
    // Simulación de descarga
    const link = document.createElement('a');
    link.href = '#'; // Aquí iría la URL real del CV
    link.download = 'CV-Desarrollador.pdf';
    
    // Efecto visual
    const button = event.target.closest('.btn-secondary');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<span>Descargando...</span><i class="fas fa-spinner fa-spin"></i>';
    
    setTimeout(() => {
        button.innerHTML = '<span>¡Descargado!</span><i class="fas fa-check"></i>';
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    }, 1000);
}

// Funciones de control de terminal
function closeTerminal() {
    const terminal = document.querySelector('.terminal-container');
    terminal.style.transform = 'scale(0.8) translateY(-20px)';
    terminal.style.opacity = '0.5';
    
    setTimeout(() => {
        terminal.style.transform = 'scale(1) translateY(0)';
        terminal.style.opacity = '1';
    }, 500);
}

function minimizeTerminal() {
    const terminal = document.querySelector('.terminal-container');
    const body = terminal.querySelector('.terminal-body');
    const input = terminal.querySelector('.terminal-input-container');
    const footer = terminal.querySelector('.terminal-footer');
    
    if (body.style.display === 'none') {
        // Restaurar
        body.style.display = 'block';
        input.style.display = 'flex';
        footer.style.display = 'flex';
        terminal.style.height = 'auto';
    } else {
        // Minimizar
        body.style.display = 'none';
        input.style.display = 'none';
        footer.style.display = 'none';
        terminal.style.height = '60px';
    }
}

function maximizeTerminal() {
    const terminal = document.querySelector('.terminal-container');
    
    if (terminal.classList.contains('maximized')) {
        // Restaurar
        terminal.classList.remove('maximized');
        terminal.style.position = 'relative';
        terminal.style.top = '0';
        terminal.style.left = '0';
        terminal.style.width = '90%';
        terminal.style.height = 'auto';
        terminal.style.zIndex = '1';
    } else {
        // Maximizar
        terminal.classList.add('maximized');
        terminal.style.position = 'fixed';
        terminal.style.top = '20px';
        terminal.style.left = '20px';
        terminal.style.width = 'calc(100vw - 40px)';
        terminal.style.height = 'calc(100vh - 40px)';
        terminal.style.zIndex = '9999';
    }
}

function clearTerminal() {
    const terminalOutput = document.getElementById('terminal-output');
    
    // Mantener solo la primera línea de bienvenida
    const welcomeContent = `
        <div class="terminal-startup">
            <div class="startup-line">Sistema listo ✓</div>
            <div class="startup-line"></div>
        </div>
        <div class="terminal-line">
            <span class="terminal-user">visitor@portafolio:</span>
            <span class="terminal-path">~$</span>
            <span class="terminal-cursor"></span>
        </div>
    `;
    
    terminalOutput.innerHTML = welcomeContent;
    
    // Reset contador de comandos
    document.getElementById('command-count').textContent = '0';
}

function showHelp() {
    const terminalInput = document.getElementById('terminal-input');
    terminalInput.value = 'help';
    
    // Simular Enter
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    terminalInput.dispatchEvent(event);
}

// Efectos adicionales
document.addEventListener('DOMContentLoaded', function() {
    // Efecto de parallax suave en el hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-section');
        
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Efecto de typing en el título
    setTimeout(() => {
        const titleRole = document.querySelector('.title-role');
        if (titleRole) {
            titleRole.classList.add('typing-effect');
        }
    }, 2000);
});