let player = {
  strength: 1,
  intelligence: 1,
  charisma: 1

  document
  .getElementById("str")
  .textContent =
  player.strength;

  document
  .getElementById("int")
  .textContent =
  player.intelligence;

  document
  .getElementById("cha")
  .textContent =
  player.charisma;

  const type =
 document.getElementById("taskType")
 .value;

if(type === "strength")
  player.strength++;

if(type === "intelligence")
  player.intelligence++;

if(type === "charisma")
  player.charisma++;
};

