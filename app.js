let xp =
Number(localStorage.getItem("xp")) || 0;

let level =
Number(localStorage.getItem("level")) || 1;

let player =
JSON.parse(
localStorage.getItem("player")
) || {
strength: 1
};

function saveGame() {

```
localStorage.setItem(
    "xp",
    xp
);

localStorage.setItem(
    "level",
    level
);

localStorage.setItem(
    "player",
    JSON.stringify(player)
);
```

}

function updateStats() {

```
document
    .getElementById("xp")
    .textContent = xp;

document
    .getElementById("level")
    .textContent = level;

document
    .getElementById("str")
    .textContent =
    player.strength;
```

}

function checkLevelUp() {

```
while (xp >= level * 100) {

    xp -= level * 100;

    level++;

    alert(
        "Level Up! You are now level "
        + level
    );

}
```

}

function addTask() {

```
const input =
    document.getElementById(
        "taskInput"
    );

const taskText =
    input.value.trim();

if (taskText === "") {
    return;
}

const li =
    document.createElement("li");

li.textContent =
    taskText + " ";

const button =
    document.createElement(
        "button"
    );

button.textContent =
    "Complete";

button.onclick =
    function () {

        xp += 10;

        player.strength += 1;

        checkLevelUp();

        updateStats();

        saveGame();

        li.remove();

    };

li.appendChild(button);

document
    .getElementById("taskList")
    .appendChild(li);

input.value = "";
```

}

updateStats();
