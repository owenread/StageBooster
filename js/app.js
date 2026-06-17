// ==========================================================================
// MOCK DATA ARCHITECTURE (Exosphere Sample Grid)
// ==========================================================================
const sampleProjects = [
    {
        id: 1,
        title: "Subaru WRX High-Pressure Fuel Tuning",
        author: "Alex V.",
        category: "Automotive",
        status: "active",
        excerpt: "Optimizing flow rates and drivetrain mechanics for high-output setups practicing manual rev-matching cycles.",
        roles: ["Mechanical Tech", "Tuner"],
        progress: "85%",
        contributors: 3
    },
    {
        id: 2,
        title: "American Fork Member Directory Engine",
        author: "Dev Network",
        category: "Sports & Community",
        status: "planning",
        excerpt: "A high-performance localized ecosystem directory focusing on UI clean components and quick query filtering.",
        roles: ["Front-end Dev", "UI Designer"],
        progress: "40%",
        contributors: 2
    },
    {
        id: 3,
        title: "Alps Cinematic Gala Planners",
        author: "Elena R.",
        category: "Culinary & Events",
        status: "ideation",
        excerpt: "Drafting scalable full-screen presentation workflows for specialized regional exhibitions and catering hubs.",
        roles: ["Event Lead", "Sponsorships"],
        progress: "15%",
        contributors: 1
    }
];

// ==========================================================================
// CORE APP INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    initCinematicHero();
    renderProjectGrid(sampleProjects);
    initFilterSystem();
    initGlobalUIUX();
});

// ==========================================================================
// 1. CINEMATIC HERO SYSTEM
// ==========================================================================
function initCinematicHero() {
    const phrases = document.querySelectorAll(".story-phrase");
    const ctaBlock = document.getElementById("hero-cta-block");
    let currentIdx = 0;

    if (phrases.length === 0) return;

    // Display first text line immediately
    phrases[currentIdx].classList.add("active");

    const phraseInterval = setInterval(() => {
        phrases[currentIdx].classList.remove("active");
        phrases[currentIdx].classList.add("exiting");

        currentIdx++;

        if (currentIdx < phrases.length) {
            phrases[currentIdx].classList.add("active");
        } else {
            // Once all text lines complete, clear interval and transition out to the main Call To Action block
            clearInterval(phraseInterval);
            document.querySelector(".hero-phrase-gallery").style.display = "none";
            ctaBlock.classList.add("awoken");
        }
    }, 3000);

    // Dynamic scroll trigger for the "Explore Space" button
    const exploreBtn = document.querySelector(".btn-launch-rocket");
    if (exploreBtn) {
        exploreBtn.addEventListener("click", () => {
            document.querySelector(".feed-container").scrollIntoView({ behavior: "smooth" });
        });
    }
}

// ==========================================================================
// 2. RENDERING ENGINE & TEMPLATING
// ==========================================================================
function renderProjectGrid(projects) {
    const feed = document.getElementById("project-feed");
    if (!feed) return;

    if (projects.length === 0) {
        feed.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center; padding: 3rem;">No active ventures found matching the query.</p>`;
        return;
    }

    feed.innerHTML = projects.map(project => {
        const badgeClass = `badge-${project.status}`;
        const tagsHTML = project.roles.map(role => `<span class="role-tag">${role}</span>`).join("");

        return `
            <div class="project-card" data-id="${project.id}" style="--target-width: ${project.progress}">
                <div>
                    <div class="card-header">
                        <span class="project-category">${project.category}</span>
                        <span class="badge ${badgeClass}">${project.status}</span>
                    </div>
                    <h3 class="project-title">${project.title}</h3>
                    <div class="project-author">by <strong>${project.author}</strong></div>
                    <p class="project-excerpt">${project.excerpt}</p>
                    <div class="card-roles">
                        <strong>Required Roles</strong>
                        <div>${tagsHTML}</div>
                    </div>
                </div>
                
                <div class="card-progress-bar"></div>
                
                <div class="card-footer-layout">
                    <span class="contributor-count">👥 <strong>${project.contributors}</strong></span>
                    <button class="btn-secondary open-collab-trigger" style="padding: 0.4rem 1rem; font-size: 0.8rem;">Join</button>
                </div>
            </div>
        `;
    }).join("");

    // Re-attach listeners to dynamically generated element trees
    attachCardModalTriggers();
}

// ==========================================================================
// 3. FILTER & LIVE SEARCH ENGINE
// ==========================================================================
function initFilterSystem() {
    const searchInput = document.getElementById("search-input");
    const filterPills = document.querySelectorAll("#category-filters .pill-btn");

    let currentCategory = "all";
    let currentSearchQuery = "";

    function performFilter() {
        const filtered = sampleProjects.filter(project => {
            const matchesCategory = (currentCategory === "all" || project.category === currentCategory);
            const matchesSearch = project.title.toLowerCase().includes(currentSearchQuery) ||
                project.excerpt.toLowerCase().includes(currentSearchQuery) ||
                project.roles.some(r => r.toLowerCase().includes(currentSearchQuery));
            return matchesCategory && matchesSearch;
        });
        renderProjectGrid(filtered);
    }

    // Search Input Tracker
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            currentSearchQuery = e.target.value.toLowerCase();
            performFilter();
        });
    }

    // Category Pill Tracker
    filterPills.forEach(pill => {
        pill.addEventListener("click", (e) => {
            filterPills.forEach(p => p.classList.remove("active"));
            e.target.classList.add("active");
            currentCategory = e.target.getAttribute("data-category");
            performFilter();
        });
    });
}

// ==========================================================================
// 4. MODALS & RESPONSIVE DRAWER UI MANAGEMENT
// ==========================================================================
function initGlobalUIUX() {
    const hamburger = document.getElementById("hamburger-trigger");
    const navMenu = document.getElementById("nav-menu");
    const modal = document.getElementById("collab-modal");
    const closeModal = document.getElementById("close-modal-btn");
    const form = document.getElementById("modal-join-form");

    // Hamburger Mobile Toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
    }

    // Close Modal
    if (closeModal && modal) {
        closeModal.addEventListener("click", () => modal.classList.remove("active"));
        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.classList.remove("active");
        });
    }

    // Form Interception
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Application dispatched to venture deck stream successfully!");
            form.reset();
            modal.classList.remove("active");
        });
    }
}

function attachCardModalTriggers() {
    const modal = document.getElementById("collab-modal");
    const openBtns = document.querySelectorAll(".open-collab-trigger");

    openBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation(); // Avoid triggering card click effects
            if (modal) modal.classList.add("active");
        });
    });
}