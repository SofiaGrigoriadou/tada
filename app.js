let state = JSON.parse(localStorage.getItem("state")) || {
    xp: 0,
    level: 1,
    seashells: 0,

    stats: {
        strength: { xp: 0, level: 1 },
        intelligence: { xp: 0, level: 1 },
        charisma: { xp: 0, level: 1 },
        willpower: { xp: 0, level: 1 },
        anchoring: { xp: 0, level: 1 }
    }
};

if (state.seashells === undefined || isNaN(state.seashells)) {
    state.seashells = 0;
}

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let storeItems = JSON.parse(localStorage.getItem("storeItems")) || [];

/* =========================
   FIBONACCI TABLE
========================= */
const FIB = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597];

/* =========================
   SAVE SYSTEM
========================= */
function saveGame() {
    localStorage.setItem("state", JSON.stringify(state));
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("storeItems", JSON.stringify(storeItems));
}

/* =========================
   XP REQUIREMENTS
========================= */
function skillXPNeeded(level) {
    return FIB[level + 2] || 999999;
}

function characterXPNeeded(level) {
    return (FIB[level + 2] || 999999) * 10;
}

/* =========================
   XP VALUES
========================= */
function skillXP(difficulty) {
    return difficulty * 1;
}

function characterXP(difficulty) {
    return difficulty * 0.5;
}

/* =========================
   UPDATE UI
========================= */
function updateStats() {

    const el = (id, val) => {
        const node = document.getElementById(id);
        if (node) node.textContent = val;
    };

    el("xp", state.xp);
    el("level", state.level);

    el("shells", state.seashells);

    el("str", state.stats.strength.level);
    el("int", state.stats.intelligence.level);
    el("cha", state.stats.charisma.level);
    el("wil", state.stats.willpower.level);
    el("anc", state.stats.anchoring.level);

    updateBars();
}

/* =========================
   XP BARS
========================= */
function updateBars() {

    updateBar("strBar", state.stats.strength);
    updateBar("intBar", state.stats.intelligence);
    updateBar("chaBar", state.stats.charisma);
    updateBar("wilBar", state.stats.willpower);
    updateBar("ancBar", state.stats.anchoring);

    const charBar = document.getElementById("charBar");

    if (charBar) {
        let percent =
            (state.xp / characterXPNeeded(state.level)) * 100;

        charBar.style.width = Math.min(percent, 100) + "%";
    }
}

function updateBar(id, stat) {

    const bar = document.getElementById(id);
    if (!bar) return;

    let needed = skillXPNeeded(stat.level);
    let percent = (stat.xp / needed) * 100;

    bar.style.width = Math.min(percent, 100) + "%";
}

/* =========================
   LEVEL SYSTEM
========================= */
function checkSkillLevelUp(skill) {

    let s = state.stats[skill];

    while (s.xp >= skillXPNeeded(s.level)) {
        s.xp -= skillXPNeeded(s.level);
        s.level++;
    }
}

function checkCharacterLevelUp() {

    while (state.xp >= characterXPNeeded(state.level)) {
        state.xp -= characterXPNeeded(state.level);
        state.level++;
        alert("🌊 You ascended to Level " + state.level);
    }
}

/* =========================
   TASK SYSTEM
========================= */
function addTask() {

    const input = document.getElementById("taskInput");
    const type = document.getElementById("taskType").value;
    const difficulty = Number(document.getElementById("taskDifficulty").value);

    const text = input.value.trim();
    if (!text) return;

     const task = {
        id: Date.now(),
        text,
        type,
        difficulty
    };

    tasks.push(task);
    saveGame();

    renderTask(task);

    input.value = "";

    const li = document.createElement("li");
    li.textContent = `${text} (Difficulty ${difficulty}) `;

    const btn = document.createElement("button");
    btn.textContent = "Complete";

    btn.onclick = function () {

        const sXP = skillXP(difficulty);
        const cXP = characterXP(difficulty);

        /* 🌍 GLOBAL XP */
        state.xp += cXP;

        /* 🐚 SEASHELL REWARD */
        state.seashells += Math.floor(cXP);

        /* 🧠 SKILL XP */
        state.stats[type].xp += sXP;

        /* LEVEL UPS FIRST */
        checkSkillLevelUp(type);
        checkCharacterLevelUp();

        /* SAVE STATE */
        saveGame();

        /* UPDATE UI */
        updateStats();

        /* ANIMATE REALM */
        animateRealm(type);

        /* REMOVE TASK WITH FADE */
        li.classList.add("offering-complete");

        setTimeout(() => {
            li.remove();
        }, 600);
    };

    li.appendChild(btn);

    const list = document.getElementById("taskList");
    if (list) list.appendChild(li);

    input.value = "";
}

/* =========================
   ANIMATIONS
========================= */
function animateRealm(skill) {

    const map = {
        strength: "strBar",
        intelligence: "intBar",
        charisma: "chaBar",
        willpower: "wilBar",
        anchoring: "ancBar"
    };

    const barId = map[skill];
    const bar = document.getElementById(barId);

    if (!bar) return;

    const altar = bar.closest(".altar");

    bar.classList.add("pulse");
    if (altar) altar.classList.add("glow");

    setTimeout(() => {
        bar.classList.remove("pulse");
        if (altar) altar.classList.remove("glow");
    }, 800);
}


/* =========================
   COIN SYSTEM
========================= */

function addStoreItem() {

    const name = document.getElementById("itemName").value.trim();
    const cost = Number(document.getElementById("itemCost").value);

    if (!name || !cost) return;

    const item = {
        id: Date.now(),
        name,
        cost
    };

    renderStoreItem(item);

    document.getElementById("itemName").value = "";
    document.getElementById("itemCost").value = "";
}

function renderStoreItem(item) {

    const container = document.getElementById("storeList");

    const div = document.createElement("div");
    div.className = "store-item";

    const label = document.createElement("span");
    label.textContent = `${item.name} — 🐚 ${item.cost}`;

    const btn = document.createElement("button");
    btn.textContent = "Purchase";

    btn.onclick = function () {

        if (state.seashells >= item.cost) {

            state.seashells -= item.cost;
            saveGame();
            updateStats();

            div.classList.add("purchased");

            setTimeout(() => {
                div.remove();
            }, 400);

            alert("🌊 You received: " + item.name);

        } else {
            alert("Not enough seashells.");
        }
    };

    div.appendChild(label);
    div.appendChild(btn);

    container.appendChild(div);
}

/* =========================
   INIT
========================= */
updateStats();
