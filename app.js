import { startFireworks } from './fireworks.js';

const modal = document.getElementById('loveModal');
const gift = document.querySelector('.gift-wrap');
const soundBtn = document.getElementById('soundBtn');
const replayBtn = document.getElementById('replayBtn');
const audio = document.getElementById('audio');
const poemText = document.getElementById('poemText');

const orbitPhotos = Array.from(document.querySelectorAll('.orbitPhoto'));
let slideTimer = null;
let isPlaying = false;


const poemLines = [
    'Mon amour, je t’écris avec mon cœur… pas avec des mots.',
    'Ton sourire fait taire le bruit du monde, et tout devient doux.',
    'Je veux te garder près de moi, jour après jour, sans fin.',
    'Quand je te regarde, j’oublie mes peurs et je redeviens heureux.',
    'Tu es ma lumière… mon “pour toujours”.'
];


function setActivePhoto(index) {
    orbitPhotos.forEach((img, i) => img.classList.toggle('is-active', i === index));
}

function startCarousel() {
    stopCarousel();
    if (!orbitPhotos.length) return;
    let i = 0;
    setActivePhoto(i);
    // toutes les ~2s (comme demandé)
    slideTimer = setInterval(() => {
        i = (i + 1) % orbitPhotos.length;
        setActivePhoto(i);
    }, 2000);
}

function stopCarousel() {
    if (slideTimer) clearInterval(slideTimer);
    slideTimer = null;
}


async function startPoem() {
    poemText.innerHTML = '';

    // Petite cadence touchante
    for (let i = 0; i < poemLines.length; i++) {
        const p = document.createElement('div');
        p.className = 'poemLine';
        p.textContent = poemLines[i];
        p.style.animationDelay = `${i * 420}ms`;
        poemText.appendChild(p);
        // on laisse le temps à l’animation de s’afficher
        await new Promise(r => setTimeout(r, 320));
    }
}

function openModal() {
    if (modal.classList.contains('is-open')) return;

    // Démarre un 2e effet (roses/fleurs/feux) uniquement sur la "page 2"
    if (fireworksModalContainer && !stopModalFireworks) {
        stopModalFireworks = startFireworks(fireworksModalContainer);
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    // Lecture auto au moment de l’ouverture (l’action vient du clic sur 🎁)
    // Si le navigateur bloque, le bouton "Activer le son" restera disponible.
    ensureAudioStarted();

    startCarousel();
    startPoem();
}


function closeModal() {
    // Stop le feu d'artifice multicolore de la "page 2"
    if (stopModalFireworks) {
        stopModalFireworks();
        stopModalFireworks = null;
    }

    if (!modal.classList.contains('is-open')) return;
    modal.classList.add('is-closing');
    setTimeout(() => {
        modal.classList.remove('is-open');
        modal.classList.remove('is-closing');
        modal.setAttribute('aria-hidden', 'true');
    }, 230);

    stopCarousel();
}

function ensureAudioStarted() {
    if (isPlaying) return;
    // Lancer l’audio uniquement après action utilisateur
    audio.currentTime = 0;
    audio.play()
        .then(() => {
            isPlaying = true;
            soundBtn.textContent = 'Son en cours';
        })
        .catch(() => {
            isPlaying = false;
            soundBtn.textContent = 'Activer le son';
            alert('Le navigateur a bloqué le son. Clique sur "Activer le son".');
        });
}

const fireworksContainer = document.querySelector('.fireworks');
const fireworksModalContainer = document.querySelector('.fireworks--modal');
let stopFireworks = null;
let stopModalFireworks = null;


function setup() {
    // Lance les fleurs/feux d'artifice au début (multicolore)
    // Les particules s'ajoutent via fireworks.js et s'effacent automatiquement.
    if (fireworksContainer) {
        stopFireworks = startFireworks(fireworksContainer);
    }
    // Ouvrir avec clic/keyboard sur 🎁
    gift.addEventListener('click', () => {
        openModal();
        // On ne force pas play ici (selon navigateur). On lance quand l’utilisateur veut activer.
    });
    gift.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal();
        }
    });

    // Fermer au clic sur le backdrop
    modal.addEventListener('click', (e) => {
        const t = e.target;
        if (t && t.getAttribute('data-close') === 'true') closeModal();
    });

    // Son
    soundBtn.addEventListener('click', () => {
        ensureAudioStarted();
    });

    // Rejouer animations
    replayBtn.addEventListener('click', () => {
        startCarousel();
        startPoem();
    });

    // Esc pour fermer
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

setup();