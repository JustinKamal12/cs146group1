// ============================================================
//  D&D Character Creator Quiz - quiz.js
//  This file runs the character creation form on create-character.html
//  and saves the character data so generated-character.html can read it.
// ============================================================

// --------------------
// DATA
// --------------------

/*
Notes:
- you should be able to add a personality trait, and then have a button to add another one if they want. max 3
   - same with ideals, bonds, and flaws

- fix dice rolling mechanic

- does not collect all necessary data to fill out character sheet
*/

// The standard array values the player must assign to their six stats
let STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

// The six stats that appear on the character sheet
let STATS = [
  "Strength",
  "Dexterity",
  "Constitution",
  "Intelligence",
  "Wisdom",
  "Charisma",
];

// All 16 backgrounds from the 2024 PHB and which 3 stats they boost
// Each background gives +2 to one stat and +1 to another, OR +1 to all three
// We store the three eligible stats here; the player picks how to distribute
let BACKGROUNDS = {
  Acolyte: { stats: ["Intelligence", "Wisdom", "Charisma"] },
  Artisan: { stats: ["Strength", "Dexterity", "Intelligence"] },
  Charlatan: { stats: ["Dexterity", "Constitution", "Charisma"] },
  Criminal: { stats: ["Dexterity", "Constitution", "Intelligence"] },
  Entertainer: { stats: ["Strength", "Dexterity", "Charisma"] },
  Farmer: { stats: ["Strength", "Constitution", "Wisdom"] },
  Guard: { stats: ["Strength", "Intelligence", "Wisdom"] },
  Guide: { stats: ["Dexterity", "Constitution", "Wisdom"] },
  Hermit: { stats: ["Constitution", "Wisdom", "Charisma"] },
  Merchant: { stats: ["Constitution", "Intelligence", "Charisma"] },
  Noble: { stats: ["Strength", "Wisdom", "Charisma"] },
  Sage: { stats: ["Constitution", "Intelligence", "Wisdom"] },
  Sailor: { stats: ["Strength", "Dexterity", "Wisdom"] },
  Scribe: { stats: ["Dexterity", "Intelligence", "Wisdom"] },
  Soldier: { stats: ["Strength", "Dexterity", "Constitution"] },
  Wayfarer: { stats: ["Dexterity", "Wisdom", "Charisma"] },
};

// All 10 species from the 2024 PHB (no racial stat bonuses in 2024 - backgrounds handle that)
let SPECIES = [
  "Aasimar",
  "Dragonborn",
  "Dwarf",
  "Elf",
  "Gnome",
  "Goliath",
  "Halfling",
  "Human",
  "Orc",
  "Tiefling",
];

// All 12 classes from the 2024 PHB
let CLASSES = [
  "Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard",
];

// The nine alignments in D&D
let ALIGNMENTS = [
  "Lawful Good",
  "Neutral Good",
  "Chaotic Good",
  "Lawful Neutral",
  "True Neutral",
  "Chaotic Neutral",
  "Lawful Evil",
  "Neutral Evil",
  "Chaotic Evil",
];

// --------------------
// PAGE SETUP
// --------------------

// Wait for the page to fully load before doing anything
window.addEventListener("load", function () {
  // Grab the two screens from the HTML
  let setupScreen = document.getElementById("setup-screen");
  let quizScreen = document.getElementById("quiz-screen");

  // Grab the Start button and the name input from the setup screen
  let startButton = document.querySelector("#setup-screen .button");
  let nameInput = document.getElementById("player-name");

  // Hide the quiz screen at first - player sees setup screen first
  quizScreen.style.display = "none";

  // --------------------
  // BUILD THE QUIZ FORM
  // --------------------

  // Create a <form> element to hold all the quiz questions
  let form = document.createElement("form");
  form.id = "character-form";

  // We'll replace the example quiz content with our real form
  // First clear out the old example content inside the quiz screen
  quizScreen.innerHTML = "<h2>Character Quiz</h2>";
  quizScreen.appendChild(form);

  // ---- SECTION 1: Species (dropdown) ----
  let speciesLabel = document.createElement("label");
  speciesLabel.textContent = "Choose Your Species:";
  speciesLabel.htmlFor = "species-select";
  form.appendChild(speciesLabel);

  let speciesSelect = document.createElement("select");
  speciesSelect.id = "species-select";
  speciesSelect.name = "species";

  // Add a default blank option
  let defaultSpecies = document.createElement("option");
  defaultSpecies.value = "";
  defaultSpecies.textContent = "-- Select a Species --";
  speciesSelect.appendChild(defaultSpecies);

  // Loop through the species list and add each one as an option
  for (let i = 0; i < SPECIES.length; i++) {
    let opt = document.createElement("option");
    opt.value = SPECIES[i];
    opt.textContent = SPECIES[i];
    speciesSelect.appendChild(opt);
  }
  form.appendChild(speciesSelect);

  // ---- SECTION 2: Class (dropdown) ----
  let classLabel = document.createElement("label");
  classLabel.textContent = "Choose Your Class:";
  classLabel.htmlFor = "class-select";
  form.appendChild(classLabel);

  let classSelect = document.createElement("select");
  classSelect.id = "class-select";
  classSelect.name = "characterClass";

  let defaultClass = document.createElement("option");
  defaultClass.value = "";
  defaultClass.textContent = "-- Select a Class --";
  classSelect.appendChild(defaultClass);

  for (let i = 0; i < CLASSES.length; i++) {
    let opt = document.createElement("option");
    opt.value = CLASSES[i];
    opt.textContent = CLASSES[i];
    classSelect.appendChild(opt);
  }
  form.appendChild(classSelect);

  // ---- SECTION 3: Background (dropdown) ----
  let bgLabel = document.createElement("label");
  bgLabel.textContent = "Choose Your Background:";
  bgLabel.htmlFor = "background-select";
  form.appendChild(bgLabel);

  let bgSelect = document.createElement("select");
  bgSelect.id = "background-select";
  bgSelect.name = "background";

  let defaultBg = document.createElement("option");
  defaultBg.value = "";
  defaultBg.textContent = "-- Select a Background --";
  bgSelect.appendChild(defaultBg);

  for (let bgName in BACKGROUNDS) {
    let opt = document.createElement("option");
    opt.value = bgName;
    opt.textContent =
      bgName + " (+" + BACKGROUNDS[bgName].stats.join(", +") + ")";
    bgSelect.appendChild(opt);
  }
  form.appendChild(bgSelect);

  // ---- SECTION 4: Alignment (dropdown) ----
  let alignLabel = document.createElement("label");
  alignLabel.textContent = "Choose Your Alignment:";
  alignLabel.htmlFor = "alignment-select";
  form.appendChild(alignLabel);

  let alignSelect = document.createElement("select");
  alignSelect.id = "alignment-select";
  alignSelect.name = "alignment";

  let defaultAlign = document.createElement("option");
  defaultAlign.value = "";
  defaultAlign.textContent = "-- Select an Alignment --";
  alignSelect.appendChild(defaultAlign);

  for (let i = 0; i < ALIGNMENTS.length; i++) {
    let opt = document.createElement("option");
    opt.value = ALIGNMENTS[i];
    opt.textContent = ALIGNMENTS[i];
    alignSelect.appendChild(opt);
  }
  form.appendChild(alignSelect);

  // ---- SECTION 5: Standard Array Ability Score Assignment ----
  // The player assigns each value (15, 14, 13, 12, 10, 8) to one stat.
  // Each stat gets a dropdown. The player cannot use the same value twice.

  let statHeading = document.createElement("h3");
  statHeading.textContent =
    "Assign Your Ability Scores (Standard Array: 15, 14, 13, 12, 10, 8)";
  form.appendChild(statHeading);

  let statNote = document.createElement("p");
  statNote.textContent =
    "Assign each number to exactly one stat. Each number can only be used once.";
  statNote.className = "prototype-note";
  form.appendChild(statNote);

  // Keep track of all six stat dropdowns so we can validate them later
  let statSelects = {};

  for (let i = 0; i < STATS.length; i++) {
    let statName = STATS[i];

    let statLabel = document.createElement("label");
    statLabel.textContent = statName + ":";
    statLabel.htmlFor = "stat-" + statName;
    form.appendChild(statLabel);

    let statSelect = document.createElement("select");
    statSelect.id = "stat-" + statName;
    statSelect.name = "stat-" + statName;
    statSelect.className = "stat-select";

    let defaultStatOpt = document.createElement("option");
    defaultStatOpt.value = "";
    defaultStatOpt.textContent = "-- Choose a value --";
    statSelect.appendChild(defaultStatOpt);

    // Add all 6 standard array values as options
    for (let j = 0; j < STANDARD_ARRAY.length; j++) {
      let valOpt = document.createElement("option");
      valOpt.value = STANDARD_ARRAY[j];
      valOpt.textContent = STANDARD_ARRAY[j];
      statSelect.appendChild(valOpt);
    }

    form.appendChild(statSelect);

    // Save a reference to this dropdown
    statSelects[statName] = statSelect;
  }

  // ---- SECTION 6: Personality Traits, Ideals, Bonds, Flaws (text inputs) ----
  // These match the four boxes on the character sheet

  let personalityHeading = document.createElement("h3");
  personalityHeading.textContent = "Character Personality";
  form.appendChild(personalityHeading);

  // Helper function to make a labeled text area
  function makeTextarea(labelText, inputId) {
    let lbl = document.createElement("label");
    lbl.textContent = labelText;
    lbl.htmlFor = inputId;
    form.appendChild(lbl);

    let ta = document.createElement("textarea");
    ta.id = inputId;
    ta.name = inputId;
    ta.rows = 2;
    ta.placeholder = "Write a short description...";
    form.appendChild(ta);

    return ta;
  }

  let traitsInput = makeTextarea("Personality Traits:", "personality-traits");
  let idealsInput = makeTextarea("Ideals:", "ideals");
  let bondsInput = makeTextarea("Bonds:", "bonds");
  let flawsInput = makeTextarea("Flaws:", "flaws");

  // ---- ERROR MESSAGE AREA ----
  // This paragraph will show validation errors to the user
  let errorMsg = document.createElement("p");
  errorMsg.id = "error-message";
  errorMsg.style.color = "red";
  errorMsg.style.fontWeight = "bold";
  errorMsg.textContent = "";
  form.appendChild(errorMsg);

  // ---- SUBMIT BUTTON ----
  let submitBtn = document.createElement("button");
  submitBtn.type = "button"; // not "submit" so we control what happens
  submitBtn.className = "button";
  submitBtn.textContent = "Generate My Character!";
  form.appendChild(submitBtn);

  // --------------------
  // EVENT LISTENERS
  // --------------------

  // When the player clicks "Start Character Quiz", show the quiz and use their name
  startButton.addEventListener("click", function () {
    // Validation: make sure they entered a name
    let characterName = nameInput.value.trim();
    if (characterName === "") {
      alert("Please enter a character name before starting!");
      return;
    }

    // Hide setup screen, show quiz screen
    setupScreen.style.display = "none";
    quizScreen.style.display = "block";

    // Update the quiz heading to include the character's name (DOM manipulation)
    quizScreen.querySelector("h2").textContent =
      "Create Your Character: " + characterName;

    // Save the name for later
    quizScreen.dataset.characterName = characterName;
  });

  // When the player clicks "Generate My Character!", validate and save the data
  submitBtn.addEventListener("click", function () {
    // Clear any old error message
    errorMsg.textContent = "";

    // -- Collect all form values --
    let characterName = quizScreen.dataset.characterName;
    let species = speciesSelect.value;
    let charClass = classSelect.value;
    let background = bgSelect.value;
    let alignment = alignSelect.value;

    // -- Validation: check all dropdowns are filled in --
    if (!species) {
      errorMsg.textContent = "Please choose a Species.";
      return;
    }
    if (!charClass) {
      errorMsg.textContent = "Please choose a Class.";
      return;
    }
    if (!background) {
      errorMsg.textContent = "Please choose a Background.";
      return;
    }
    if (!alignment) {
      errorMsg.textContent = "Please choose an Alignment.";
      return;
    }

    // -- Validation: check all stat scores are assigned --
    let assignedStats = {};
    let usedValues = [];

    for (let i = 0; i < STATS.length; i++) {
      let statName = STATS[i];
      let statValue = statSelects[statName].value;

      if (!statValue) {
        errorMsg.textContent = "Please assign a value to " + statName + ".";
        return;
      }

      // Check for duplicate values
      if (usedValues.indexOf(statValue) !== -1) {
        errorMsg.textContent =
          "You used the value " +
          statValue +
          " more than once! Each value can only be used once.";
        return;
      }

      usedValues.push(statValue);
      assignedStats[statName] = parseInt(statValue);
    }

    // -- Apply Background stat bonuses (+2 to one, +1 to another, or +1 to all three) --
    // For simplicity on a beginner portal, we apply +1 to all three eligible stats
    let bgStats = BACKGROUNDS[background].stats;
    for (let i = 0; i < bgStats.length; i++) {
      assignedStats[bgStats[i]] += 1;
    }

    // -- Collect personality fields --
    let personalityTraits = traitsInput.value.trim();
    let ideals = idealsInput.value.trim();
    let bonds = bondsInput.value.trim();
    let flaws = flawsInput.value.trim();

    // -- Save everything to localStorage so the next page can read it --
    let characterData = {
      name: characterName,
      species: species,
      charClass: charClass,
      background: background,
      alignment: alignment,
      level: 1,
      stats: assignedStats,
      personality: {
        traits: personalityTraits,
        ideals: ideals,
        bonds: bonds,
        flaws: flaws,
      },
    };

    localStorage.setItem("dndCharacter", JSON.stringify(characterData));

    // -- Redirect to the character sheet page --
    window.location.href = "generated-character.html";
  });
});
