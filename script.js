// Initialize Lucide icons
lucide.createIcons();

// Member Data - Discord'dan çekilen members.json, yoksa yedek liste
let members = [];
let discordMemberCount = 0;

const fallbackMembers = [
    { name: "Üye 1", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Uye1&backgroundColor=b6e3f4" },
    { name: "Üye 2", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Uye2&backgroundColor=ffdfbf" },
    { name: "Üye 3", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Uye3&backgroundColor=c0aede" },
    { name: "Üye 4", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Uye4&backgroundColor=ffd5dc" },
    { name: "Üye 5", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Uye5&backgroundColor=d1f4d1" }
];

async function loadMembers() {
    try {
        const res = await fetch('members.json');
        if (!res.ok) throw new Error();
        const data = await res.json();
        members = data.members;
        discordMemberCount = data.count;
    } catch {
        members = fallbackMembers;
    }
}

// Render Members
function renderMembers() {
    const grid = document.getElementById('membersGrid');
    grid.innerHTML = members.map((member, index) => `
        <div class="member-card glass-card rounded-2xl p-4 text-center scroll-reveal" data-index="${index}" style="animation-delay: ${index * 0.05}s">
            <div class="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-brand/30">
                <img src="${member.avatar}" alt="${member.name}" class="w-full h-full object-cover">
            </div>
            <h4 class="font-semibold text-white text-sm">${member.name}</h4>
            ${member.role ? `<p class="text-brand text-xs">${member.role}</p>` : ''}
        </div>
    `).join('');

    // Add click events to member cards
    document.querySelectorAll('.member-card').forEach(card => {
        card.addEventListener('click', () => {
            const index = parseInt(card.dataset.index);
            openMemberModal(members[index]);
        });
    });
}

// Modal Functions
function openMemberModal(member) {
    const modal = document.getElementById('memberModal');
    const content = document.getElementById('modalContent');
    const body = document.getElementById('modalBody');

    body.innerHTML = `
        <div class="text-center">
            <div class="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-brand/30">
                <img src="${member.avatar}" alt="${member.name}" class="w-full h-full object-cover">
            </div>
            <h3 class="text-2xl font-bold text-white">${member.name}</h3>
            ${member.role ? `<p class="text-brand font-medium">${member.role}</p>` : ''}
        </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function closeMemberModal() {
    const modal = document.getElementById('memberModal');
    const content = document.getElementById('modalContent');
    content.classList.add('scale-95', 'opacity-0');
    content.classList.remove('scale-100', 'opacity-100');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 300);
}

// Modal close events
document.getElementById('closeModal').addEventListener('click', closeMemberModal);
document.getElementById('memberModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeMemberModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMemberModal();
});

// Generate Filter Buttons Dynamically
function generateFilters() {
    const activeTab = document.querySelector('.event-tab.active').dataset.tab;
    const container = activeTab === 'upcoming' ? 'upcoming-events' : 'past-events';
    const events = document.querySelectorAll(`#${container} .event-card`);
    const categories = new Set();

    events.forEach(card => {
        categories.add(card.dataset.category);
        categories.add(card.dataset.type);
    });

    const filterContainer = document.getElementById('eventFilters');
    filterContainer.innerHTML = '';

    // All button
    const allBtn = document.createElement('button');
    allBtn.className = 'filter-btn active px-4 py-2 rounded-full text-xs font-medium glass hover:bg-white/10 transition-all';
    allBtn.dataset.filter = 'all';
    allBtn.textContent = 'Tümü';
    filterContainer.appendChild(allBtn);

    const typeLabels = { online: 'Online', physical: 'Fiziki' };
    const typeIcons = { online: 'wifi', physical: 'map-pin' };

    categories.forEach(cat => {
        if (cat === 'all') return;
        const btn = document.createElement('button');
        btn.className = 'filter-btn px-4 py-2 rounded-full text-xs font-medium glass hover:bg-white/10 transition-all';
        btn.dataset.filter = cat;

        if (typeIcons[cat]) {
            btn.innerHTML = `<i data-lucide="${typeIcons[cat]}" class="w-3 h-3 inline mr-1"></i>${typeLabels[cat]}`;
        } else {
            btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        }

        filterContainer.appendChild(btn);
    });

    lucide.createIcons();

    // Re-attach filter events
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            const tab = document.querySelector('.event-tab.active').dataset.tab;
            const ctr = tab === 'upcoming' ? 'upcoming-events' : 'past-events';

            document.querySelectorAll(`#${ctr} .event-card`).forEach(card => {
                const type = card.dataset.type;
                const category = card.dataset.category;

                if (filter === 'all' || type === filter || category === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Tab Switching
document.querySelectorAll('.event-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.event-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.dataset.tab;
        document.getElementById('upcoming-events').classList.toggle('hidden', target !== 'upcoming');
        document.getElementById('past-events').classList.toggle('hidden', target !== 'past');

        generateFilters();
    });
});

// Mobile Menu
document.getElementById('mobileMenuBtn').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.toggle('hidden');
});

// Close mobile menu on link click
document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('mobileMenu').classList.add('hidden');
    });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('shadow-lg');
    } else {
        navbar.classList.remove('shadow-lg');
    }

    lastScroll = currentScroll;
});

// Scroll Reveal Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Generate Particles
function generateParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = Math.random() * 10 + 5 + 'px';
        particle.style.height = particle.style.width;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = Math.random() * 5 + 5 + 's';
        container.appendChild(particle);
    }
}

// Counter Animation
function animateCounter(element, target, suffix = '') {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 30);
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadMembers();
    renderMembers();
    generateParticles();
    generateFilters();

    // Observe all scroll-reveal elements (after renderMembers)
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });

    // Animate stats on scroll
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(document.getElementById('memberCount'), discordMemberCount || 100, '+');
                animateCounter(document.getElementById('eventCount'), 5, '+');
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.grid.grid-cols-3');
    if (statsSection) statsObserver.observe(statsSection);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
