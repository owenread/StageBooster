// ==========================================================================
// 1. DATA LAYER (Simulating our Database)
// ==========================================================================
const projectsData = [
    {
        id: "proj-001",
        title: "AtmosDrive: Open-Source ECU Tuning Platform",
        author: "Owen R.",
        category: "Automotive",
        status: "active",
        excerpt: "Building a next-generation telemetry dashboard and open-source tuning interface optimized for direct-injection platforms.",
        description: "AtmosDrive is a long-term initiative to build an adaptable, open-source engine control unit (ECU) calibration interface and telemetry logging application. Our goal is to provide deep hardware integration, clean diagnostic visualizers, and cross-platform capabilities for tuning enthusiasts who want more control over direct-injection data maps.",
        roles: ["C++ Core Dev", "UI/UX Designer", "QA Tester"],
        milestones: [
            { text: "Map logging infrastructure for OBD-II streams", status: "completed" },
            { text: "Architect the real-time React/Electron dashboard UI", status: "current" },
            { text: "Build out safety guardrails and cross-platform compiles", status: "pending" }
        ],
        team: [
            { name: "Owen R.", role: "Lead Architect", initials: "OR" },
            { name: "Liam K.", role: "Systems Engineer", initials: "LK" }
        ]
    },
    {
        id: "proj-002",
        title: "Apex Dental Suite: Practice Management Ecosystem",
        author: "Dr. Sarah Miller",
        category: "Medical & Business",
        status: "planning",
        excerpt: "Developing a premium, automated patient portal and clinic coordinator software to optimize dental office workflows.",
        description: "We are establishing a robust, enterprise-grade software suite designed specifically for modern clinical operations. The goal is to build an integrated patient dashboard, smart automated text reminders, scheduling optimizers, and a secure portal that complies with high privacy standards, replacing clunky legacy dental systems.",
        roles: ["Full-Stack Engineer", "Database Architect"],
        milestones: [
            { text: "Finalize database schemas and relational data maps", status: "completed" },
            { text: "Build automated page audits and core portal routes", status: "current" },
            { text: "Integrate encrypted real-time scheduling triggers", status: "pending" }
        ],
        team: [
            { name: "Sarah M.", role: "Product Owner", initials: "SM" }
        ]
    },
    {
        id: "proj-003",
        title: "HoopMap: Urban Sports Court Directory & League Engine",
        author: "Marcus Vance",
        category: "Sports & Community",
        status: "ideation",
        excerpt: "A permanent crowdsourced map and community matchmaking platform for local sports facilities and amateur leagues.",
        description: "HoopMap is an ambitious project to map every outdoor court, field, and complex globally, pairing the data with a robust community matching engine. Users can track local court conditions, schedule pickup games, self-manage local amateur tournaments, and vote on community clean-up initiatives.",
        roles: ["React Native Dev", "Geospatial Data Specialist"],
        milestones: [
            { text: "Draft comprehensive software requirements and wireframes", status: "current" },
            { text: "Build open-source interactive mapping wrapper", status: "pending" },
            { text: "Deploy cross-platform mobile authentication protocols", status: "pending" }
        ],
        team: [
            { name: "Marcus V.", role: "Founder", initials: "MV" }
        ]
    }
];

// Global State Tracking variables
let currentSearchQuery = "";
let selectedCategoryFilter = "all";

// Safely handle the modal state without breaking global scope execution
function openCollabModal(projectTitle) {
    const collabModal = document.getElementById("collab-modal");
    if (!collabModal) return;

    const modalTitle = collabModal.querySelector('h3');
    if (modalTitle) {
        modalTitle.textContent = `Join ${projectTitle}`;
    }
    collabModal.classList.add("active");
}

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
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; background: rgba(255,255,255,0.8); border-radius: 20px; border: 1px dashed var(--border-clean); width: 100%;">
                <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">No matching ventures found</h3>
                <p style="color: var(--text-secondary);">Try readjusting your search criteria or changing selection tabs.</p>
            </div>
        `;
        return;
    }

    filteredProjects.forEach(project => {
        const roleTagsHTML = project.roles.map(role => `<span class="role-tag">${role}</span>`).join("");
        const totalMilestones = project.milestones ? project.milestones.length : 0;
        const completedMilestones = project.milestones ? project.milestones.filter(m => m.status === "completed").length : 0;
        const progressPercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
        const displayPercent = progressPercent === 0 ? 5 : progressPercent;
        const contributorCount = project.team ? project.team.length : 1;

        const cardHTML = `
            <article class="project-card" data-id="${project.id}" onclick="window.location.href='project.html?id=${project.id}'">
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
                    <button class="btn-secondary open-collab-btn" onclick="event.stopPropagation(); openCollabModal('${project.title}')">Collab!</button>
                </div>
            </article>
        `;
        feedContainer.innerHTML += cardHTML;
    });
}

// ==========================================================================
// 3. DASHBOARD INTERACTION DECK (Search & Filter Init Engine)
// ==========================================================================
function initializeFeedControls() {
    const searchInput = document.getElementById("search-input");
    const categoryFilters = document.getElementById("category-filters");

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            currentSearchQuery = e.target.value;
            renderProjectFeed();
        });
    }

    if (categoryFilters) {
        categoryFilters.addEventListener("click", (e) => {
            const targetButton = e.target.closest(".pill-btn");
            if (!targetButton) return;

            categoryFilters.querySelectorAll(".pill-btn").forEach(btn => btn.classList.remove("active"));
            targetButton.classList.add("active");

            selectedCategoryFilter = targetButton.getAttribute("data-category");
            renderProjectFeed();
        });
    }
}

// ==========================================================================
// 4. DETAIL PAGE MANIPULATION (Render dynamic individual project layouts)
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
// 5. THE CINEMATIC STORYLINE CONTROLLER (OVERLAPPING CROSS-FADE)
// ==========================================================================
function runCinematicStoryline() {
    const phrases = document.querySelectorAll('.story-phrase');
    const ctaBlock = document.getElementById('hero-cta-block');
    if (phrases.length === 0) return;

    let currentIndex = 0;

    function transitionToNext() {
        const currentPhrase = phrases[currentIndex];

        currentPhrase.classList.remove('active');
        currentPhrase.classList.add('exiting');

        currentIndex++;

        if (currentIndex < phrases.length) {
            setTimeout(() => {
                phrases[currentIndex].classList.add('active');
                setTimeout(transitionToNext, 5500);
            }, 800);
        } else {
            setTimeout(() => {
                if (ctaBlock) ctaBlock.classList.add('awoken');
            }, 1000);
        }
    }

    setTimeout(() => {
        phrases[0].classList.add('active');
        setTimeout(transitionToNext, 6000);
    }, 400);
}

// ==========================================================================
// 6. CENTRAL APPLICATION INIT ENGINE (Unified Single Router)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // A. Hamburger Mobile UI Toggles
    const hamburgerTrigger = document.getElementById("hamburger-trigger");
    const navMenu = document.getElementById("nav-menu");

    if (hamburgerTrigger && navMenu) {
        hamburgerTrigger.addEventListener("click", () => {
            hamburgerTrigger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
    }

    // B. Collaboration Modal Global Hooks
    const collabModal = document.getElementById("collab-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const modalForm = document.getElementById("modal-join-form");

    if (closeModalBtn && collabModal) {
        closeModalBtn.addEventListener("click", () => collabModal.classList.remove("active"));
        collabModal.addEventListener("click", (e) => {
            if (e.target === collabModal) collabModal.classList.remove("active");
        });
    }

    if (modalForm) {
        modalForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Application submitted successfully to the project founder!");
            collabModal.classList.remove("active");
            modalForm.reset();
        });
    }

    // C. Sidebar Detail Form Hooks
    const sidebarForm = document.getElementById("join-project-form");
    if (sidebarForm) {
        sidebarForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Application submitted successfully to the project founder!");
            sidebarForm.reset();
        });
    }

    // D. View Routing Context Engine
    const isIndexPage = document.getElementById("project-feed") !== null;
    const isDetailPage = window.location.search.includes('id=');

    if (isIndexPage) {
        runCinematicStoryline();
        initializeFeedControls();
        renderProjectFeed();
    } else if (isDetailPage) {
        renderProjectDetail();
    }
});