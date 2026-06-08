// Init or Get Data from LocalStorage
const defaultData = {
    projects: [
        { id: 1, title: 'Music Video Edit', desc: 'A cinematic music video edit for a local band.', link: '#', image: 'untitled-1-copy.jpg' },
        { id: 2, title: 'Wedding Teaser', desc: 'Premium wedding teaser with color grading.', link: '#', image: 'core.jpg' }
    ],
    skills: ['Video Editing', 'After Effects', 'Premiere Pro', 'Color Grading', 'Motion Graphics'],
    messages: [
        { id: 1, name: 'Alice Smith', email: 'alice@example.com', text: 'Love your edits! Are you available next week?', date: '2026-04-10' },
        { id: 2, name: 'Bob Jones', email: 'bob@example.com', text: 'Quote for a 3-minute corporate video?', date: '2026-04-12' }
    ],
    settings: {
        username: 'NGT Editz',
        profileImg: 'PR.jpg'
    }
};

// Initialize localStorage if empty
if (!localStorage.getItem('adminData')) {
    localStorage.setItem('adminData', JSON.stringify(defaultData));
}

let adminData = JSON.parse(localStorage.getItem('adminData'));

// Helper to save to local storage
const saveData = () => {
    localStorage.setItem('adminData', JSON.stringify(adminData));
    updateDashboardStats();
};

// DOM Elements
const sections = document.querySelectorAll('.content-section');
const navItems = document.querySelectorAll('.nav-item');

// Navigation Logic
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active nav
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Show correct section
        const targetId = item.getAttribute('data-target');
        sections.forEach(sec => sec.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');
        
        // Close sidebar on mobile after clicking
        if(window.innerWidth <= 992) {
            document.getElementById('sidebar').classList.remove('open');
        }
    });
});

// Mobile Sidebar Toggle
document.getElementById('open-sidebar').addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('open');
});
document.getElementById('close-sidebar').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
});

// --- Dashboard Stats ---
const updateDashboardStats = () => {
    document.getElementById('stat-projects').innerText = adminData.projects.length;
    document.getElementById('stat-skills').innerText = adminData.skills.length;
    document.getElementById('stat-messages').innerText = adminData.messages.length;
    
    // Update topbar profile
    document.getElementById('topbar-username').innerText = adminData.settings.username;
    document.getElementById('topbar-profile-img').src = adminData.settings.profileImg;
};

// --- Projects Logic ---
const renderProjects = () => {
    const tbody = document.getElementById('projects-table-body');
    tbody.innerHTML = '';
    
    if (adminData.projects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No projects found. Add one above!</td></tr>';
        return;
    }

    adminData.projects.forEach(project => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${project.image}" alt="${project.title}"></td>
            <td><strong>${project.title}</strong><br><small style="color: var(--text-muted)">${project.desc.substring(0, 40)}...</small></td>
            <td><a href="${project.link}" target="_blank" class="accent"><i class="fas fa-external-link-alt"></i> Link</a></td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="editProject(${project.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" onclick="deleteProject(${project.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
};

const projectForm = document.getElementById('project-form');
projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('project-id').value;
    const title = document.getElementById('project-title').value;
    const link = document.getElementById('project-link').value;
    const image = document.getElementById('project-image').value;
    const desc = document.getElementById('project-desc').value;
    
    if (id) {
        // Edit existing
        const index = adminData.projects.findIndex(p => p.id == id);
        if(index !== -1) {
            adminData.projects[index] = { id: parseInt(id), title, link, image, desc };
        }
    } else {
        // Add new
        const newId = adminData.projects.length > 0 ? Math.max(...adminData.projects.map(p => p.id)) + 1 : 1;
        adminData.projects.push({ id: newId, title, link, image, desc });
    }
    
    saveData();
    renderProjects();
    resetProjectForm();
});

window.editProject = (id) => {
    const project = adminData.projects.find(p => p.id == id);
    if(project) {
        document.getElementById('project-id').value = project.id;
        document.getElementById('project-title').value = project.title;
        document.getElementById('project-link').value = project.link;
        document.getElementById('project-image').value = project.image;
        document.getElementById('project-desc').value = project.desc;
        
        document.getElementById('project-submit-btn').innerText = 'Update Project';
        document.getElementById('project-cancel-btn').classList.remove('hidden');
        
        // Switch to projects tab
        document.querySelector('[data-target="projects-section"]').click();
    }
};

window.deleteProject = (id) => {
    if(confirm('Are you sure you want to delete this project?')) {
        adminData.projects = adminData.projects.filter(p => p.id != id);
        saveData();
        renderProjects();
    }
};

const resetProjectForm = () => {
    projectForm.reset();
    document.getElementById('project-id').value = '';
    document.getElementById('project-submit-btn').innerText = 'Add Project';
    document.getElementById('project-cancel-btn').classList.add('hidden');
};

document.getElementById('project-cancel-btn').addEventListener('click', resetProjectForm);

// --- Skills Logic ---
const renderSkills = () => {
    const container = document.getElementById('skills-container');
    container.innerHTML = '';
    
    if (adminData.skills.length === 0) {
        container.innerHTML = '<p class="empty-state">No skills added yet.</p>';
        return;
    }

    adminData.skills.forEach((skill, index) => {
        const tag = document.createElement('div');
        tag.className = 'skill-tag';
        tag.innerHTML = `
            ${skill}
            <button type="button" onclick="deleteSkill(${index})"><i class="fas fa-times"></i></button>
        `;
        container.appendChild(tag);
    });
};

document.getElementById('skill-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const skillInput = document.getElementById('skill-name');
    const newSkill = skillInput.value.trim();
    
    if(newSkill && !adminData.skills.includes(newSkill)) {
        adminData.skills.push(newSkill);
        saveData();
        renderSkills();
        skillInput.value = '';
    }
});

window.deleteSkill = (index) => {
    adminData.skills.splice(index, 1);
    saveData();
    renderSkills();
};

// --- Messages Logic ---
const renderMessages = () => {
    const list = document.getElementById('messages-list');
    list.innerHTML = '';
    
    if (adminData.messages.length === 0) {
        list.innerHTML = '<div class="empty-state">No messages received yet.</div>';
        return;
    }

    adminData.messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'message-item';
        div.innerHTML = `
            <div class="message-header">
                <div class="message-author">
                    ${msg.name} <a href="mailto:${msg.email}">(${msg.email})</a>
                </div>
                <div class="message-date">${msg.date}</div>
            </div>
            <div class="message-body">
                ${msg.text}
            </div>
            <div class="mt-4">
               <button class="btn btn-sm btn-danger" onclick="deleteMessage(${msg.id})"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `;
        list.appendChild(div);
    });
};

window.deleteMessage = (id) => {
    if(confirm('Delete this message?')) {
        adminData.messages = adminData.messages.filter(m => m.id != id);
        saveData();
        renderMessages();
    }
};

// --- Settings Logic ---
const initSettings = () => {
    document.getElementById('settings-username').value = adminData.settings.username;
    document.getElementById('settings-profile-img').value = adminData.settings.profileImg;
};

document.getElementById('settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    adminData.settings.username = document.getElementById('settings-username').value;
    adminData.settings.profileImg = document.getElementById('settings-profile-img').value;
    saveData();
    alert('Settings saved successfully!');
});

// Initialization Call
const init = () => {
    updateDashboardStats();
    renderProjects();
    renderSkills();
    renderMessages();
    initSettings();
};

init();
