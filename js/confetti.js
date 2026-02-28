/**
 * Lightweight Confetti implementation using Canvas
 */

(function () {
    let animationId = null;
    let particles = [];
    let canvas = null;
    let ctx = null;

    const colors = ['#fce18a', '#ff726d', '#b48def', '#f4306d', '#4CAF50', '#2196F3', '#FFC107'];

    class Particle {
        constructor(x, y, isWin = false) {
            this.x = x;
            this.y = y;
            // Give win confetti more upward velocity
            this.vx = (Math.random() - 0.5) * (isWin ? 20 : 10);
            this.vy = (Math.random() - 0.5) * (isWin ? 20 : 10) - (isWin ? 10 : 2);

            this.size = Math.random() * 8 + 4;
            this.color = colors[Math.floor(Math.random() * colors.length)];

            this.mass = this.size / 10;
            this.gravity = 0.5;
            this.drag = 0.96; // Air resistance

            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 10;
        }

        update() {
            this.vx *= this.drag;
            this.vy *= this.drag;
            this.vy += this.gravity * this.mass;

            this.x += this.vx;
            this.y += this.vy;

            this.rotation += this.rotationSpeed;
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }

        isDead(canvasHeight) {
            return this.y > canvasHeight + 20 || this.x < -20 || this.x > canvas.width + 20;
        }
    }

    function initCanvas() {
        if (!canvas) {
            canvas = document.getElementById('confetti-canvas');
            if (canvas) {
                ctx = canvas.getContext('2d');
                // Resize handling done in main.js, but ensure it exists
            }
        }
    }

    function animate() {
        if (!ctx || particles.length === 0) {
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
            animationId = null;
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            let p = particles[i];
            p.update();
            p.draw(ctx);

            if (p.isDead(canvas.height)) {
                particles.splice(i, 1);
            }
        }

        animationId = requestAnimationFrame(animate);
    }

    // Called on finding a single object
    window.burstConfetti = function (clientX, clientY) {
        initCanvas();
        if (!canvas) return;

        // Rect to map client coords to canvas coords
        const rect = canvas.getBoundingClientRect();
        const startX = clientX - rect.left;
        const startY = clientY - rect.top;

        for (let i = 0; i < 30; i++) {
            particles.push(new Particle(startX, startY, false));
        }

        if (!animationId) {
            animate();
        }
    };

    // Generic win confetti spawner interval
    let winSpawner = null;

    window.startWinConfetti = function () {
        initCanvas();
        if (!canvas) return;

        if (winSpawner) clearInterval(winSpawner);

        // Spawn particles continuously from sides and top
        winSpawner = setInterval(() => {
            const x = Math.random() < 0.5 ? Math.random() * (canvas.width / 4) : canvas.width - (Math.random() * (canvas.width / 4));
            const y = -10;

            for (let i = 0; i < 15; i++) {
                particles.push(new Particle(x, y, true));
            }
            if (!animationId) animate();

        }, 300);

        // Stop after 5 seconds automatically
        setTimeout(() => {
            window.stopWinConfetti();
        }, 5000);
    };

    window.stopWinConfetti = function () {
        if (winSpawner) {
            clearInterval(winSpawner);
            winSpawner = null;
        }
    };

})();
