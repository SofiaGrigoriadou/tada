let state = JSON.parse(localStorage.getItem("state")) || {
    xp: 0,
    level: 1,

    stats: {
        strength: { xp: 0, level: 1 },
        intelligence: { xp: 0, level: 1 },
        charisma: { xp: 0, level: 1 },
        willpower: { xp: 0, level: 1 },
        anchoring: { xp: 0, level: 1 }
    }
};

/* =========================
   FIBONACCI TABLE
========================= */
const FIB = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];

/* =========================
   SAVE
========================= */
function saveGame() {
    localStorage.setItem("state", JSON.stringify(state));
}

/* =========================
   XP HELPERS
========================= */
function skillXPNeeded(level) {
    return FIB[level + 2] || 9999;
}

function characterXPNeeded(level) {
    return (FIB[level + 2] || 9999) * 10;
}

/* =========================
   UPDATE UI (STATS + BARS)
========================= */
function updateStats() {

    document.getElementById("xp").textContent = state.xp;
    document.getElementById("level").textContent = state.level;

    // levels
    document.getElementById("str").textContent = state.stats.strength.level;
    document.getElementById("int").textContent = state.stats.intelligence.level;
    document.getElementById("cha").textContent = state.stats.charisma.level;
    document.getElementById("wil").textContent = state.stats.willpower.level;
    document.getElementById("anc").textContent = state.stats.anchoring.level;

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

    // character bar
    let charPercent =
        (state.xp / characterXPNeeded(state.level)) * 100;

    document.getElementById("charBar").style.width =
        Math.min(charPercent, 100) + "%";
}

/* generic bar updater */
function updateBar(id, stat) {

    let needed = skillXPNeeded(stat.level);
    let percent = (stat.xp / needed) * 100;

    document.getElementById(id).style.width =
        Math.min(percent, 100) + "%";
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
   XP SYSTEM (BALANCED)
========================= */
function skillXP(difficulty) {
    return difficulty * 1;
}

function characterXP(difficulty) {
    return difficulty * 0.5;
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

    const li = document.createElement("li");
    li.textContent = `${text} (Diff ${difficulty}) `;

    const btn = document.createElement("button");
    btn.textContent = "Complete";

    btn.onclick = function () {

        let sXP = skillXP(difficulty);
        let cXP = characterXP(difficulty);

        // global XP
        state.xp += cXP;

        // skill XP
        state.stats[type].xp += sXP;

        // level checks
        checkSkillLevelUp(type);
        checkCharacterLevelUp();

        updateStats();
        saveGame();

        li.remove();
    };

    li.appendChild(btn);
    document.getElementById("taskList").appendChild(li);

    input.value = "";
}

/* =========================
   INIT
========================= */
updateStats();
