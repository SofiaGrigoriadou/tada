let xp = Number(localStorage.getItem("xp")) || 0;

let level = Number(localStorage.getItem("level")) || 1;

let player = JSON.parse(localStorage.getItem("player")) || {
    strength: 1,
    intelligence: 1,
    charisma: 1
};

function saveGame() {
    localStorage.setItem("xp", xp);
    localStorage.setItem("level", level);
    localStorage.setItem("player", JSON.stringify(player));
}

function updateStats() {
    document.getElementById("xp").textContent = xp;
    document.getElementById("level").textContent = level;
    
    document.getElementById("str").textContent =player.strength;
    document.getElementById("int").textContent =player.intelligence;
    document.getElementById("cha").textContent =player.charisma;
}

function checkLevelUp() {
    while (xp >= level * 100) {
        xp -= level * 100;
        level++;
        alert(
        "Level Up! You are now level " + level);
    }
}

function addTask() {
    const input = document.getElementById("taskInput");
    const type = document.getElementById("taskType").value;
    
    const text = input.value.trim();
    if (!text) return;
    
    const li = document.createElement("li");
    
    li.textContent = taskText + " ";
    
    const btn = document.createElement("button");
    btn.textContent = "Complete";
    
    btn.onclick = function () {

        xp += 10;

       if (type === "strength") {
      player.strength += 1;
    }

    if (type === "intelligence") {
      player.intelligence += 1;
    }

    if (type === "charisma") {
      player.charisma += 1;
    }

        checkLevelUp();
        updateStats();
        saveGame();

        li.remove();

    };

li.appendChild(btn);
document.getElementById("taskList").appendChild(li);

input.value = "";
}

updateStats();
