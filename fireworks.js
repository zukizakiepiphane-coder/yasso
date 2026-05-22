// Simple multicolor "fleurs + feux d'artifice" DOM particles.
// Génère des petits points colorés autour du centre de la page.

const COLORS = ['#ff4fd8', '#7c5cff', '#38bdf8', '#34d399', '#fbbf24', '#fb7185'];

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function spawnBurst(container) {
    const count = Math.floor(rand(10, 18));
    const rect = container.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    for (let i = 0; i < count; i++) {
        const p = document.createElement('i');
        const c = COLORS[Math.floor(Math.random() * COLORS.length)];

        // CSS variables for animation
        p.style.setProperty('--c', c);
        p.style.setProperty('--x', `${cx + rand(-rect.width * 0.35, rect.width * 0.35)}px`);
        p.style.setProperty('--y', `${cy + rand(-rect.height * 0.35, rect.height * 0.35)}px`);

        // random drift
        p.style.setProperty('--dx', `${rand(-220, 220)}px`);
        p.style.setProperty('--dy', `${rand(-180, 180)}px`);

        // lifetime (ms)
        p.style.setProperty('--t', `${rand(1400, 2400)}ms`);

        container.appendChild(p);

        // cleanup
        setTimeout(() => {
            p.remove();
        }, 2600);
    }
}

export function startFireworks(container) {
    if (!container) return;

    // Taux léger pour ne pas bloquer le navigateur
    spawnBurst(container);
    const interval = setInterval(() => {
        // si le modal est ouvert, on réduit un peu
        spawnBurst(container);
    }, 1800);

    // stop handle
    return () => clearInterval(interval);
}