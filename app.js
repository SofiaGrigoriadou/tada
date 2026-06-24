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
const FIB = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418, 317811, 514229, 832040, 1346269, 2178309, 3524578, 5702887, 9227465, 14930352, 24157817, 39088169, 63245986, 102334155];

/* =========================
   SAVE SYSTEM
========================= */
function saveGame() {
    localStorage.setItem("state", JSON.stringify(state));
}

/* =========================
   UI UPDATE
========================= */
function updateStats() {
    document.getElementById("xp").textContent = state.xp;
    document.getElementById("level").textContent = state.level;

    document.getElementById("str").textContent = state.stats.strength.level;
    document.getElementById("int").textContent = state.stats.intelligence.level;
    document.getElementById("cha").textContent = state.stats.charisma.level;
    document.getElementById("wil").textContent = state.stats.willpower.level;
    document.getElementById("anc").textContent = state.stats.anchoring.level;
}

/* =========================
   XP REQUIREMENTS
========================= */
function skillXPNeeded(level) {
    return FIB[level + 2] || 9999;
}

function characterXPNeeded(level) {
    return (FIB[level + 2] || 9999) * 10;
}

/* =========================
   LEVEL UPS
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
   XP CALCULATION
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

        const sXP = skillXP(difficulty);
        const cXP = characterXP(difficulty);

        /* 🌍 GLOBAL XP */
        state.xp += cXP;

        /* 🧠 SKILL XP */
        state.stats[type].xp += sXP;

        /* LEVEL CHECKS */
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
