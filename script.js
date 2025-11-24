

function loadTravelStories() {
    const container = document.getElementById("stories-list");
    if (!container) return;

    const stories = JSON.parse(localStorage.getItem("travelStories") || "[]");

    container.innerHTML = "";
    if (stories.length === 0) {
        container.innerHTML = "<p>No stories yet. Be the first to share!</p>";
        return;
    }

    stories.slice().reverse().forEach(s => {
        const el = document.createElement("div");
        el.className = "story-card";
        el.innerHTML = `
            <h4>${escapeHtml(s.title)} <small style="color:#666">by ${escapeHtml(s.author)}</small></h4>
            ${s.image ? `<img src="${escapeHtml(s.image)}" alt="story image">` : ""}
            <p>${escapeHtml(s.content)}</p>
            <small style="color:#999">${s.date}</small>
            <div style="clear:both"></div>
        `;
        container.appendChild(el);
    });
}

function submitStory(e) {
    e.preventDefault();
    const author = document.getElementById("story-author").value.trim();
    const title = document.getElementById("story-title").value.trim();
    const content = document.getElementById("story-content").value.trim();
    const image = document.getElementById("story-image").value.trim();

    if (!author || !title || !content) {
        alert("Please fill in all fields");
        return;
    }

    const stories = JSON.parse(localStorage.getItem("travelStories") || "[]");
    stories.push({
        id: Date.now(),
        author, title, content, image,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("travelStories", JSON.stringify(stories));

    document.getElementById("story-form").reset();
    loadTravelStories();
    addActivity(`New story submitted: "${title}" by ${author}`);
}

const events = [
    { id: 1, name: "Kambala Festival", date: "2025-12-10", location: "Mangalore", image_url: "https://utsav.gov.in/public/uploads/event_picture_image/event_520/1657356169943929498.jpg", description: "Traditional buffalo race." },
    { id: 2, name: "Yakshagana Night", date: "2025-09-05", location: "Mangalore", image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCIwgw7WHQIaqTihUtPcmQEL2yg-cs68WjKQ&s", description: "Cultural dance-drama." },
    { id: 3, name: "Mangalore Dasara", date: "2025-10-01", location: "Kudroli Temple", image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH5PT1k9oZvJogpQpD5cVpChZNC8Qkh1m9VA&s", description: "Grand celebration with processions." }
];

function loadEvents() {
    const container = document.getElementById("events-list");
    if (!container) return;
    container.innerHTML = "";

    events.forEach(ev => {
        container.innerHTML += `
            <div class="card">
                <img src="${ev.image_url}" alt="${ev.name}">
                <h3>${ev.name}</h3>
                <p>Date: ${ev.date}</p>
                <p>Location: ${ev.location}</p>
                <p>${ev.description}</p>
                <button onclick="registerEvent(${ev.id})">Register</button>
            </div>
        `;
    });
}

function registerEvent(id) {
    const regs = JSON.parse(localStorage.getItem("registrations") || "[]");
    const ev = events.find(e => e.id === id);

    regs.push({
        id: Date.now(),
        eventId: id,
        name: ev.name,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("registrations", JSON.stringify(regs));
    addActivity(`Registered for event: ${ev.name}`);
    alert("Registered! Visit Dashboard.");
}



function loadDashboard() {
    let visitors = parseInt(localStorage.getItem("mockVisitors") || "1234", 10);

    const stories = JSON.parse(localStorage.getItem("travelStories") || "[]");
    const regs = JSON.parse(localStorage.getItem("registrations") || "[]");

    document.getElementById("metric-visitors").textContent = visitors;
    document.getElementById("metric-stories").textContent = stories.length;
    document.getElementById("metric-registrations").textContent = regs.length;

    renderActivities();
}



function addActivity(text) {
    const acts = JSON.parse(localStorage.getItem("activities") || "[]");
    acts.push({ id: Date.now(), text, time: new Date().toLocaleString() });
    while (acts.length > 20) acts.shift();
    localStorage.setItem("activities", JSON.stringify(acts));
    renderActivities();
}

function renderActivities() {
    const ul = document.getElementById("recent-activities");
    if (!ul) return;

    const acts = JSON.parse(localStorage.getItem("activities") || "[]").slice().reverse();
    ul.innerHTML = acts.length === 0
        ? "<li>No recent activities yet.</li>"
        : acts.map(a => `<li>${a.text} — ${a.time}</li>`).join("");
}

 

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[m]));
}

window.addEventListener("load", () => {});
