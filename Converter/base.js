/*
* Ce fichier contient le code de base converter
*/

// Varaibles
let input = '0'
let isInputCorrect = true

let base = 'Binaire'

let results = {
	binaire  : 0,
	octal		 : 0,
	decimale : 0,
	hexa		 : 0
}

/*************************
		UI fonctions
*************************/

// Set functions

function setTitle() {
  textSize(textTitlePolice);
  text("Base converter", 10, 10, 300, textTitlePolice);
}

function setNumberInpTitle() {
  textSize(textPolice);
  text("Number", 20, 75, 200, textPolice);
}

function setLsbIndicator() {
	textSize(12);
  text("LSB", 130, 100, 40, textPolice);
}

function setNumberInput() {
  let numberInp = createInput(input);
  numberInp.input(checkInput);
  numberInp.position(20, 100);
  numberInp.size(100, 10);
}

function setBaseSelectTitle() {
  textSize(textPolice);
  text("Base", 175, 75, 200, textPolice);
}

function setBaseSelect() {
  let baseSelect = createSelect();

	baseSelect.option('Binaire');
	baseSelect.option('Octal');
	baseSelect.option('Decimale');
	baseSelect.option('Hexa');

  baseSelect.position(175, 95);
  baseSelect.selected(base);
  baseSelect.changed(updateBase);
}

function setConvertButton() {
	let button = createButton('Convert');
	button.position(275, 95);
	button.mousePressed(buttonTapped);
}

function buttonTapped() {
	if (isInputCorrect) {
		convert();
	}
}

function setResultText() {

  // Creer un rectangle pour cacher les texts precedents
  noStroke();
  fill(220);
  rect(20, 160, 360, 150);
  fill(0);

	textSize(textPolice);
	if (isInputCorrect) {
		text("Binaire : " + results.binaire, 20, 160, 360, textPolice);
		text("Octal : " + results.octal, 20, 200, 360, textPolice);
		text("Decimale : " + results.decimale, 20, 240, 360, textPolice);
		text("Hexa : " + results.hexa, 20, 280, 360, textPolice);

	} else {
		text("Binaire : X", 20, 160, 360, textPolice);
		text("Octal : X", 20, 200, 360, textPolice);
		text("Decimale : X", 20, 240, 360, textPolice);
		text("Hexa : X", 20, 280, 360, textPolice);
	}
}

function updateBase() {
  base = this.value();
	// On verifie l'input car la base a etait mis a jour
	isInputCorrect = isValidInput();

  if (base == 'Binaire') {
		setLsbIndicator();
	}
}

function checkInput() {
  input = this.value().toUpperCase(); // La saise est mise en majuscule
  isInputCorrect = isValidInput();
}

function isValidInput() {

	// Listes des caracteres valides pour chaque base
	let binaireCharacters = ['0', '1'];
	let octalCharacters = ['0', '1', '2', '3', '4', '5', '6', '7'];
	let decimaleCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	let hexaCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

  switch (base) {
    case 'Binaire':
      return isValid(binaireCharacters)
    case 'Octal':
      return isValid(octalCharacters)
    case 'Decimale':
      return isValid(decimaleCharacters)
    case 'Hexa':
      return isValid(hexaCharacters)
  }
}

function isValid(liste) {
	for (let i = 0; i < input.length; i++) {

		// Permet de savoir si input[i] est dans la liste de caractere correct.
		// Si oui, alors result est un tableau de 1 element
		// Si non, alors result est un tableau vide
    let result = liste.filter(char => input[i] == char);
    if (result.length == 0) {
      return false
    }
  }
	return true
}

/*****************************
		Convert logic fonctions
*****************************/

function convert() {
	results.binaire = convertToBinaire()
	results.octal = convertToOctal()
	results.decimale = convertToDecimale()
	results.hexa = convertToHexa()

  setResultText();

}

// Conversion base 10 vers base X (2, 8, 16)
function decimaleToBaseX(baseX, number = input) {

	// Etape 1 - Determination du nombre k de position
	// (n) en base 10 -> (n) en base X
	// On cherche K tel que b^(k - 1) <= n < b^(k)

  let k = 0;
	while (number >= (baseX ** k)) {
		k += 1;
	}

	// Etape 2 - Pour exp allant de k-1 à 0, on regarde combien de fois
	// on a n - (baseX^(exp)) >= 0. Le nombre de rep pour chaque exp
	// correspond au chiffre en baseX en position exp + 1

	let result = '';

  // Permet de forcer la valeure 0 quand input vaut 0
	let temp = k - 1;
	if (temp < 0) {
		temp = 0
	}

	for (let exp = temp; exp >= 0; exp -= 1) {

		let rep = 0;
		while( number >= ((baseX ** exp)) ) {
	    number -= (baseX ** exp);
		  rep += 1;
	  }

		// Si baseX vaut 16 on doit transformer le resultat
		if (baseX == 16) {
			let hexaCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
			result += hexaCharacters[rep];
		} else {
			result += rep;
		}
	}

	return result;
}

// Conversion base X (2, 8, 16) vers base 10
function baseXToDecimale(baseX, number = input) {

	// On met chaque chiffre dans un tableau pour que quand baseX vaut 16
	// on puisse convertir les caracteres hexa en decimale

	let digits = [];
	for (let i = 0; i < input.length; i += 1) {
		if (baseX == 16) {
			digits.push(hexaFormatToDecimale(input[i]));
		} else {
			digits.push(input[i]);
		}
	}

	// Le nombre N en base X = dn...di...d1d0 avec dn le digit de poid fort
	// et d0 le digit de poid faible se converti en base 10 avec la formule :
	// N base X = dn*X^n + ... + di*X^i + ... + d0*X^0

	let result = 0;
	let exp = digits.length - 1;
	for (let i = 0; i < digits.length; i += 1) {
		result += digits[i] * (baseX ** exp);
		exp -= 1;
	}

	// Retourne le resultat en type String pour pouvoir le manipuler plus facilement
	return '' + result;
}

// Permet de representer un nombre en hexa en decimale (A -> 10)
function hexaFormatToDecimale(digit) {
	switch (digit) {
		case 'A':
			return '10'
		case 'B':
			return '11'
		case 'C':
			return '12'
		case 'D':
			return '13'
		case 'E':
			return '14'
		case 'F':
			return '15'
		default:
			return digit
	}
}

// Passe de baseX en binaire
function convertToBinaire() {
	switch (base) {
    case 'Binaire':
      return input
    case 'Octal':
			return decimaleToBaseX(2, baseXToDecimale(8))
    case 'Decimale':
			return decimaleToBaseX(2)
    case 'Hexa':
			return decimaleToBaseX(2, baseXToDecimale(16))
  }
}

// Passe de baseX en octal
function convertToOctal() {
	switch (base) {
    case 'Binaire':
			return decimaleToBaseX(8, baseXToDecimale(2))
    case 'Octal':
			return input
    case 'Decimale':
			return decimaleToBaseX(8)
    case 'Hexa':
			return decimaleToBaseX(8, baseXToDecimale(16))
  }
}

// Passe de baseX en decimale
function convertToDecimale() {
	switch (base) {
    case 'Binaire':
			return baseXToDecimale(2)
    case 'Octal':
			return baseXToDecimale(8)
    case 'Decimale':
      return input
    case 'Hexa':
			return baseXToDecimale(16)
  }
}

// Passe de baseX en hexa
function convertToHexa() {
	switch (base) {
    case 'Binaire':
			return decimaleToBaseX(16, baseXToDecimale(2))
    case 'Octal':
			return decimaleToBaseX(16, baseXToDecimale(8))
    case 'Decimale':
			return decimaleToBaseX(16)
    case 'Hexa':
			return input
  }
}
