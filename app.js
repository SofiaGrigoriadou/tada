let xp = 0;
let level = 1;

function addTask() {

  const input =
    document.getElementById("taskInput");

  const taskText = input.value;

  if(taskText === "") return;

  const li =
    document.createElement("li");

  li.textContent = taskText;

  const button =
    document.createElement("button");

  button.textContent = "Complete";

  button.onclick = function() {

    xp += 10;

    checkLevelUp();

    updateStats();

    li.remove();

  };

  li.appendChild(button);

  document
    .getElementById("taskList")
    .appendChild(li);

  input.value = "";

}

function updateStats() {

  document
    .getElementById("xp")
    .textContent = xp;

  document
    .getElementById("level")
    .textContent = level;

}

function checkLevelUp() {

  while(xp >= level * 100) {

    xp -= level * 100;

    level++;

    alert(
      "Level Up! Level " + level
    );

  }

}
