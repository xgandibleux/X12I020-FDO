/*
* Ce fichier contient les deux fonctions necessaires au fonctionnement
* de p5.js
*/

// Constants
const textTitlePolice = 25;
const textPolice = 15;

function setup() {
  createCanvas(880, 640);
	background(220);

	// Base converter UI
  setTitle();
  setNumberInpTitle();

	setBaseSelectTitle();
  setBaseSelect();

	setResultText();

	setConvertButton();

	setLsbIndicator();

	// Ligne de separation
  stroke(0, 0, 0);
	strokeWeight(1);
  line(10, 140, 350, 140); // Premiere ligne horizontale
	line(360, 10, 360, 310); // Premiere ligne verticale
	line(370, 140, 870, 140); // Seconde ligne horizontale
  line(10, 320, 870, 320);
	noStroke()

	// Signed converter UI

	setSignedTitle();

	setSignedBaseSelectTitle();
	setSignedBaseSelect();

	setSignedConvertButton();

	setSelectTitle();
	setSignedSelect();

	setSignedResult();

	setSignedNumberInpTitle();

  // Additionneur

  setAddTitle();

  setAInputTitle();

  setPlusSign();

  setBInputTitle();
  setBInput();

  setEqualSign();

  setSigneCheckbox();

  setAddBitsSelectTitle();
  setAddBitsSelect();

  setCalculButton();

  setCarryFlagTitle();
  setCarryFlag();

  setOverflowFlagTitle();
  setOverflowFlag();
}

function draw() {

	// Base converter UI

	// Ajoute un rectangle en dessous de input pour signaler la presence d'erreurs
	badInput(20, 100, isInputCorrect);
  setNumberInput();

	// Signed converter UI

  // Ajoute un rectangle en dessous de input pour signaler la presence d'erreurs
	badInput(380, 100, isSignedInputCorrect);
	setSignedNumberInput();

  // Addition UI

  badInput(20, 410, aValid);
  setAInput();

  badInput(160, 410, bValid);
  setBInput();
}

function badInput(x, y, bool) {
  if (!bool) {
    stroke(255, 0, 0);
	} else {
		stroke(220)
	}
  strokeWeight(5);
  rect(x, y, 106, 16)
  noStroke();
}
