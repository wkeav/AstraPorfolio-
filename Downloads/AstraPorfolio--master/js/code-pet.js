/**
 * Code Pet - VS Code Pet Extension Style
 * An interactive pet that follows the cursor and adds personality to the portfolio
 */

(function() {
    'use strict';

    // Pet configuration
    const PET_CONFIG = {
        size: 80, // Size of the pet image
        speed: 0.1,
        idleTime: 3000, // Time before pet goes idle (ms)
        bounceDistance: 20, // How far pet bounces
        imagePath: 'images/cat-pet.png', // Path to the pixel art cat image
        wanderInterval: 8000, // How often pet picks a new destination (ms) - increased for less wandering
        wanderSpeed: 0.05, // Speed when wandering - slower for calmer movement
        followSpeed: 0.12, // Speed when following cursor
        pauseChance: 0.6, // Chance to pause instead of moving (0-1) - increased for more resting
        pauseDurationMin: 2000, // Minimum pause duration (ms)
        pauseDurationMax: 5000 // Maximum pause duration (ms)
    };

    class CodePet {
        constructor(container) {
            this.container = container;
            this.canvas = null;
            this.ctx = null;
            this.petImage = null;
            this.imageLoaded = false;
            this.x = 0;
            this.y = 0;
            this.targetX = 0;
            this.targetY = 0;
            this.vx = 0;
            this.vy = 0;
            this.state = 'wandering'; // idle, following, wandering, sleeping
            this.idleTimer = 0;
            this.animationFrame = 0;
            this.isInitialized = false;
            this.facingDirection = 1; // 1 for right, -1 for left
            this.wanderTimer = 0;
            this.isPaused = false;
            this.pauseDuration = 0;
            this.mouseNearby = false;
            
            this.loadImage();
        }
        
        loadImage() {
            this.petImage = new Image();
            this.petImage.onload = () => {
                this.imageLoaded = true;
                this.init();
            };
            this.petImage.onerror = () => {
                console.warn('Pet image not found, using fallback drawing');
                this.imageLoaded = false;
                this.init();
            };
            this.petImage.src = PET_CONFIG.imagePath;
        }

        init() {
            // Create canvas (covers most of sidebar for pet to move around)
            const sidebar = document.getElementById('colorlib-aside');
            const sidebarWidth = sidebar ? sidebar.offsetWidth : 300;
            const sidebarHeight = sidebar ? sidebar.offsetHeight : 800;
            
            this.canvas = document.createElement('canvas');
            this.canvas.width = sidebarWidth - 40; // Leave some margin
            this.canvas.height = sidebarHeight - 200; // Leave space for header/footer
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = '150px'; // Below the header
            this.canvas.style.left = '20px';
            this.canvas.style.zIndex = '1002';
            this.canvas.style.pointerEvents = 'auto'; // Allow clicking the pet
            this.canvas.style.transition = 'opacity 0.3s';
            this.canvas.id = 'code-pet-canvas';
            
            this.ctx = this.canvas.getContext('2d');
            this.container.appendChild(this.canvas);
            
            // Set initial position (center of canvas)
            this.x = this.canvas.width / 2;
            this.y = this.canvas.height / 2;
            this.targetX = this.x;
            this.targetY = this.y;
            
            // Event listeners
            this.setupEventListeners();
            
            // Start wandering immediately
            this.pickNewDestination();
            
            // Start animation loop
            this.animate();
            this.isInitialized = true;
        }

        setupEventListeners() {
            // Track mouse movement in sidebar
            const sidebar = document.getElementById('colorlib-aside');
            if (!sidebar) return;

            sidebar.addEventListener('mousemove', (e) => {
                const sidebarRect = sidebar.getBoundingClientRect();
                const canvasRect = this.canvas.getBoundingClientRect();
                
                // Get mouse position relative to sidebar
                const mouseX = e.clientX - sidebarRect.left;
                const mouseY = e.clientY - sidebarRect.top;
                
                // Get canvas position relative to sidebar
                const canvasX = canvasRect.left - sidebarRect.left;
                const canvasY = canvasRect.top - sidebarRect.top;
                
                // Calculate target position within canvas
                const relativeX = mouseX - canvasX;
                const relativeY = mouseY - canvasY;
                
                // Check if mouse is near the pet (within 100px)
                const distanceToMouse = Math.sqrt(
                    Math.pow(relativeX - this.x, 2) + 
                    Math.pow(relativeY - this.y, 2)
                );
                
                if (distanceToMouse < 100) {
                    // Mouse is nearby - follow it
                    this.targetX = Math.max(PET_CONFIG.size / 2, 
                        Math.min(relativeX, this.canvas.width - PET_CONFIG.size / 2));
                    this.targetY = Math.max(PET_CONFIG.size / 2, 
                        Math.min(relativeY, this.canvas.height - PET_CONFIG.size / 2));
                    this.state = 'following';
                    this.mouseNearby = true;
                    this.idleTimer = 0;
                } else {
                    // Mouse is far - resume wandering
                    this.mouseNearby = false;
                    if (this.state === 'following') {
                        this.state = 'wandering';
                        this.pickNewDestination();
                    }
                }
            });

            sidebar.addEventListener('mouseleave', () => {
                // Resume wandering when mouse leaves
                this.mouseNearby = false;
                this.state = 'wandering';
                this.pickNewDestination();
            });

            // Click interaction - make pet bounce
            this.canvas.addEventListener('click', (e) => {
                e.stopPropagation();
                this.bounce();
            });
            
            // Make canvas clickable (already set in init)
            this.canvas.style.cursor = 'pointer';
        }

        bounce() {
            // Make pet bounce when clicked
            const bounceY = this.y - PET_CONFIG.bounceDistance;
            this.targetY = bounceY;
            setTimeout(() => {
                this.targetY = this.y + PET_CONFIG.bounceDistance;
            }, 200);
        }
        
        pickNewDestination() {
            // Sometimes pause instead of moving (more often now)
            if (Math.random() < PET_CONFIG.pauseChance) {
                this.isPaused = true;
                this.pauseDuration = PET_CONFIG.pauseDurationMin + 
                    Math.random() * (PET_CONFIG.pauseDurationMax - PET_CONFIG.pauseDurationMin);
                return; // Don't set a destination if pausing
            }
            
            // Pick a random destination within canvas bounds
            const margin = PET_CONFIG.size;
            this.targetX = margin + Math.random() * (this.canvas.width - margin * 2);
            this.targetY = margin + Math.random() * (this.canvas.height - margin * 2);
            this.isPaused = false;
        }

        update() {
            const currentTime = Date.now();
            
            // Handle pausing
            if (this.isPaused) {
                if (this.pauseDuration > 0) {
                    this.pauseDuration -= 16; // ~60fps
                } else {
                    this.isPaused = false;
                    this.pickNewDestination();
                }
                this.animationFrame++;
                return;
            }
            
            // Update wander timer for autonomous movement
            if (this.state === 'wandering' && !this.mouseNearby) {
                if (this.wanderTimer === 0) {
                    this.wanderTimer = currentTime;
                } else if (currentTime - this.wanderTimer > PET_CONFIG.wanderInterval) {
                    this.pickNewDestination();
                    this.wanderTimer = currentTime;
                }
            }
            
            // Update position with smooth interpolation
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Use different speeds for different states
            const currentSpeed = this.state === 'following' ? PET_CONFIG.followSpeed : PET_CONFIG.wanderSpeed;
            
            // If we've reached the destination, wait longer before picking a new one
            if (distance < 5 && this.state === 'wandering' && !this.mouseNearby) {
                // Don't immediately pick new destination - let it rest a bit
                if (this.wanderTimer === 0) {
                    this.wanderTimer = currentTime;
                } else if (currentTime - this.wanderTimer > PET_CONFIG.wanderInterval) {
                    this.pickNewDestination();
                    this.wanderTimer = currentTime;
                }
            } else {
                this.vx += dx * currentSpeed;
                this.vy += dy * currentSpeed;
            }
            
            this.vx *= 0.85; // Friction
            this.vy *= 0.85;
            
            this.x += this.vx;
            this.y += this.vy;
            
            // Keep pet within bounds
            const margin = PET_CONFIG.size / 2;
            this.x = Math.max(margin, Math.min(this.x, this.canvas.width - margin));
            this.y = Math.max(margin, Math.min(this.y, this.canvas.height - margin));
            
            this.animationFrame++;
        }

        draw() {
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Only draw if initialized
            if (!this.isInitialized) {
                return;
            }
            
            // Save context
            this.ctx.save();
            this.ctx.translate(this.x, this.y);
            
            // Determine facing direction based on movement
            if (Math.abs(this.vx) > 0.5) {
                this.facingDirection = this.vx > 0 ? 1 : -1;
            }
            
            // Flip image horizontally if moving left
            if (this.facingDirection === -1) {
                this.ctx.scale(-1, 1);
            }
            
            // Add slight rotation based on movement (subtle)
            const rotation = Math.atan2(this.vy, this.vx) * 0.1;
            this.ctx.rotate(rotation);
            
            // Draw pet image
            this.drawPet();
            
            // Restore context
            this.ctx.restore();
        }

        drawPet() {
            const size = PET_CONFIG.size;
            
            if (this.imageLoaded && this.petImage) {
                // Draw the pixel art cat image
                // Calculate image dimensions maintaining aspect ratio
                const imgWidth = this.petImage.width;
                const imgHeight = this.petImage.height;
                const aspectRatio = imgWidth / imgHeight;
                
                let drawWidth = size;
                let drawHeight = size / aspectRatio;
                
                // Center the image
                this.ctx.drawImage(
                    this.petImage,
                    -drawWidth / 2,
                    -drawHeight / 2,
                    drawWidth,
                    drawHeight
                );
            } else {
                // Fallback: simple circle if image doesn't load
                this.ctx.fillStyle = '#2c98f0';
                this.ctx.beginPath();
                this.ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }

        animate() {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.animate());
        }

        destroy() {
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
        }
    }

    // Initialize pet when DOM is ready
    function initCodePet() {
        const sidebar = document.getElementById('colorlib-aside');
        if (sidebar) {
            // Wait a bit for sidebar to be fully rendered
            setTimeout(() => {
                window.codePet = new CodePet(sidebar);
            }, 500);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCodePet);
    } else {
        initCodePet();
    }

})();

