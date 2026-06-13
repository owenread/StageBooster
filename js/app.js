// ==========================================================================
// 1. DATA LAYER (Simulating our Database)
// ==========================================================================
const projectsData = [
    {
        id: "proj-001",
        title: "Build a Backyard Half-Court",
        author: "Alex Jenkins",
        category: "Sports & Community",
        status: "planning",
        excerpt: "Looking to pour a concrete slab and set up a pro-grade hoop. Need people to split tool rentals and help build.",
        description: "I have an empty, unlevel dirt patch in my backyard that is the perfect size for a half-court. The goal is to clear the ground, pour a professional-grade concrete slab, seal it, and install a top-tier adjustable basketball hoop system complete with court lines.",
        roles: ["Concrete Finisher", "General Help"],
        milestones: [
            { text: "Excavate and level dirt patch", status: "completed" },
            { text: "Build wooden framing and pour concrete", status: "current" },
            { text: "Let cure and apply weather sealant paint", status: "pending" },
            { text: "Anchor the basketball hoop structure and paint lines", status: "pending" }
        ],
        team: [
            { name: "Alex Jenkins", role: "Owner", initials: "AJ" },
            { name: "Sarah M.", role: "Contributor", initials: "SM" }
        ]
    },
    {
        id: "proj-002",
        title: "Subaru WRX Vinyl Wrap Collaboration",
        author: "Owen R.",
        category: "Automotive",
        status: "ideation",
        excerpt: "Planning to wrap my car in a satin slate gray finish. Looking for anyone who has experience with heat guns or vinyl stretching.",
        description: "I am taking on the challenge of completely vinyl wrapping my 2016 WRX in satin slate gray. I have the vinyl roll ready, but wrapping complex bumpers and door handles is a massive headache solo. Looking for a fellow enthusiast who wants to learn, has a heat gun, or has experience tucking edges cleanly.",
        roles: ["Vinyl Wrapper", "Body Work Help"],
        milestones: [
            { text: "Deep clean exterior and remove badges/handles", status: "current" },
            { text: "Wrap the hood and roof main panels", status: "pending" },
            { text: "Tackle complex front and rear bumpers", status: "pending" },
            { text: "Reassemble hardware and ceramic coat vinyl", status: "pending" }
        ],
        team: [
            { name: "Owen R.", role: "Owner", initials: "OR" }
        ]
    },
    {
        id: "proj-003",
        title: "Pop-Up Indie Ramen Shop",
        author: "Miko T.",
        category: "Culinary & Events",
        status: "active",
        excerpt: "Hosting a 2-night backyard traditional ramen pop-up event. Need a secondary prep cook and a ticketing coordinator.",
        description: "We are turning our outdoor patio into an open-air Tokyo-style ramen stall for one weekend. The menu is fully locked down, but managing 45 bowls of fresh noodles, broth plating, and hot toppings simultaneously requires clean communication. Looking for passionate foodies to join the crew!",
        roles: ["Prep Cook", "Event Coordinator"],
        milestones: [
            { text: "Recipe testing and ingredient sourcing", status: "completed" },
            { text: "Ticket sales and seating arrangements", status: "completed" },
            { text: "Prep days and kitchen staging", status: "current" },
            { text: "Execute the 2-night event service", status: "pending" }
        ],
        team: [
            { name: "Miko T.", role: "Owner", initials: "MT" },
            { name: "Kenji S.", role: "Contributor", initials: "KS" }
        ]
    }
];

// Global State Tracking variables for search metrics
let currentSearchQuery = "";
let selectedCategoryFilter = "all";

// ==========================================================================
// 2. DOM MANIPULATION & INTERACTION ENGINE (Index Page Dashboard)
// ==========================================================================
function renderProjectFeed() {
    const feedContainer = document.getElementById("project-feed");
    if (!feedContainer) return;

    feedContainer.innerHTML = "";

    const filteredProjects = projectsData.filter(project => {
        const matchesCategory = selectedCategoryFilter === "all" || project.category === selectedCategoryFilter;
        const combinedText = `${project.title} ${project.excerpt} ${project.roles.join(" ")}`.toLowerCase();
        const matchesSearch = combinedText.includes(currentSearchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filteredProjects.length === 0) {
        feedContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; background: white; border-radius: 20px; border: 1px dashed var(--border-clean); width: 100%;">
                <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">No matching ventures found</h3>
                <p style="color: var(--text-secondary);">Try readjusting your search criteria or changing selection tabs.</p>
            </div>
        `;
        return;
    }

    filteredProjects.forEach(project => {
        const roleTagsHTML = project.roles
            .map(role => `<span class="role-tag">${role}</span>`)
            .join("");

        // UX CALCULATION A: Get percentage of completed milestones
        const totalMilestones = project.milestones ? project.milestones.length : 0;
        const completedMilestones = project.milestones ? project.milestones.filter(m => m.status === "completed").length : 0;
        const progressPercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
        const displayPercent = progressPercent === 0 ? 5 : progressPercent;

        // UX CALCULATION B: Count current team members
        const contributorCount = project.team ? project.team.length : 1;

        const cardHTML = `
            <article class="project-card" data-id="${project.id}">
                <div class="card-progress-bar" style="--target-width: ${displayPercent}%;"></div>

                <div class="card-header">
                    <span class="badge badge-${project.status}">${project.status}</span>
                    <span class="project-category">${project.category}</span>
                </div>
                <h2 class="project-title">${project.title}</h2>
                <p class="project-author">By ${project.author}</p>
                <p class="project-excerpt">${project.excerpt}</p>

                <div class="card-roles">
                    <strong>Recruiting Contributors:</strong>
                    ${roleTagsHTML}
                </div>

                <div class="card-footer-layout">
                    <span class="contributor-count">
                        👤 <strong>${contributorCount}</strong> ${contributorCount === 1 ? 'member' : 'crew members'}
                    </span>
                    <a href="project.html?id=${project.id}" class="btn-secondary">View Project</a>
                </div>
            </article>
        `;
        feedContainer.innerHTML += cardHTML;
    });
}

function initializeFeedControls() {
    const searchInput = document.getElementById("search-input");
    const filterContainer = document.getElementById("category-filters");

    // Listen for live character input matching
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            currentSearchQuery = e.target.value;
            renderProjectFeed();
        });
    }

    // Listen for category navigation tab pill actions
    if (filterContainer) {
        filterContainer.addEventListener("click", (e) => {
            const clickedBtn = e.target.closest(".pill-btn");
            if (!clickedBtn) return;

            // Update UI pill active states
            document.querySelectorAll(".pill-btn").forEach(btn => btn.classList.remove("active"));
            clickedBtn.classList.add("active");

            // Update state and refresh cards
            selectedCategoryFilter = clickedBtn.getAttribute("data-category");
            renderProjectFeed();
        });
    }
}

// ==========================================================================
// 3. DETAIL PAGE MANIPULATION (Render dynamic individual project layouts)
// ==========================================================================
function renderProjectDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) return;

    const metaRow = document.querySelector(".meta-row");
    const titleHeader = document.querySelector(".project-detail-header h1");
    const authorTag = document.querySelector(".author-tag strong");
    const descSection = document.querySelector(".project-description");
    const milestonesList = document.querySelector(".milestone-list");
    const rolesContainer = document.querySelector(".sidebar-roles");
    const teamList = document.querySelector(".team-list");

    if (!metaRow || !titleHeader || !authorTag || !descSection || !milestonesList || !rolesContainer || !teamList) {
        return;
    }

    const project = projectsData.find(p => p.id === projectId);

    if (!project) {
        document.body.innerHTML = `<div style="text-align:center; padding: 5rem;"><h1>Project Exosphere Not Found</h1><a href="index.html">Return to Explore</a></div>`;
        return;
    }

    document.title = `${project.title} | PeX`;

    metaRow.innerHTML = `
        <span class="badge badge-${project.status}">${project.status}</span>
        <span class="project-category">${project.category}</span>
    `;
    titleHeader.textContent = project.title;
    authorTag.textContent = project.author;

    descSection.innerHTML = `
        <h2>About the Project</h2>
        <p>${project.description}</p>
    `;

    rolesContainer.innerHTML = project.roles
        .map(role => `<span class="role-tag">${role}</span>`)
        .join("");

    milestonesList.innerHTML = project.milestones
        .map(m => {
            let className = "";
            if (m.status === "completed") className = 'class="completed"';
            if (m.status === "current") className = 'class="current"';
            return `<li ${className}>${m.text}</li>`;
        })
        .join("");

    teamList.innerHTML = project.team
        .map(member => `
            <li>
                <span class="team-avatar">${member.initials}</span> 
                ${member.name} (${member.role})
            </li>
        `)
        .join("");
}

// ==========================================================================
// 4. THE CINEMATIC STORYLINE CONTROLLER (OVERLAPPING CROSS-FADE)
// ==========================================================================
function runCinematicStoryline() {
    const phrases = document.querySelectorAll('.story-phrase');
    const ctaBlock = document.getElementById('hero-cta-block');
    if (phrases.length === 0) return;

    let currentIndex = 0;

    function transitionToNext() {
        const currentPhrase = phrases[currentIndex];

        // 1. Initiate fade out on the current phrase in place
        currentPhrase.classList.remove('active');
        currentPhrase.classList.add('exiting');

        currentIndex++;

        // 2. If phrases are left, trigger the incoming phrase EARLY for a massive cross-fade overlap
        if (currentIndex < phrases.length) {
            setTimeout(() => {
                phrases[currentIndex].classList.add('active');

                // Allow the phrase to sit illuminated for 5.5 seconds before starting the next transition
                setTimeout(transitionToNext, 5500);
            }, 800); // 800ms delay means it enters well before the previous phrase finishes fading out
        } else {
            // 3. CLIMAX: Transition smoothly to the final CTA card anchor
            setTimeout(() => {
                if (ctaBlock) ctaBlock.classList.add('awoken');
            }, 1000);
        }
    }

    // First initialization beat
    setTimeout(() => {
        phrases[0].classList.add('active');
        setTimeout(transitionToNext, 6000); // Give the first statement plenty of reading room
    }, 400);
}
// ==========================================================================
// 5. CENTRAL APPLICATION INIT ENGINE (Context Aware Router)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Check which element layers are present to identify the active page context safely
    const isIndexPage = document.getElementById("project-feed") !== null;
    const isDetailPage = window.location.search.includes('id=');

    if (isIndexPage) {
        // Run specific scripts for the main browse dashboard context
        runCinematicStoryline();
        initializeFeedControls();
        renderProjectFeed();
    } else if (isDetailPage) {
        // Run specific scripts for deep dynamic project detail pages context
        renderProjectDetail();
    }
});