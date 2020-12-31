/*
* Ce fichier contient le code de signed converter
*/

// Variables
let select;

let allBase = {
		BIN8: "Binaire 8 bits",
		BIN16: "Binaire 16 bits",
		BIN32: "Binaire 32 bits",
		DECIMALE: 'Decimale'
};

let signedBase = allBase.BIN8;

let signedInput = '0';

let convention = {
	COMPLEMENT: "Complement à 2",
	VALSIGNE: "Valeur signée"
};

let selectedConvention = convention.COMPLEMENT;

let bits = {
	b8: 8,
	b16: 16,
	b32: 32
};

let selectedBits = bits.b8;

let signedResult = {
	decimale: "0",
	comp2: "0",
	valSigne: "0"
};

let isSignedInputCorrect = true;

/*************************
		UI fonctions
*************************/

function setSignedTitle() {
  textSize(textTitlePolice);
  text("Signed converter", 380, 10, 300, textTitlePolice);
}

function setSignedNumberInpTitle() {
  textSize(textPolice);
  text("Number", 380, 75, 200, textPolice);
}

function setSignedNumberInput() {
  let numberInp = createInput(signedInput);
  numberInp.input(checkSignedInput);
  numberInp.position(380, 100);
  numberInp.size(120, 10);
}

function setSignedBaseSelectTitle() {
  textSize(textPolice);
  text("Base", 535, 75, 200, textPolice);
}

function setSignedBaseSelect() {
  let baseSelect = createSelect();

	baseSelect.option(allBase.BIN8);
	baseSelect.option(allBase.BIN16);
	baseSelect.option(allBase.BIN32);
	baseSelect.option(allBase.DECIMALE);

  baseSelect.position(535, 95);
  baseSelect.selected(signedBase);
  baseSelect.changed(updateSignedBase);
}

function setSignedConvertButton() {
	button = createButton('Convert');
	button.position(800, 95);
	button.mousePressed(signedButtonTapped);
}

function signedButtonTapped() {
	if (isSignedInputCorrect) {
		convertSigned();
	}
}

function updateSignedBase() {
  signedBase = this.value();

	switch (signedBase) {
		case allBase.BIN8:
			selectedBits = 8;
			break;
		case allBase.BIN16:
			selectedBits = 16;
			break;
		case allBase.BIN32:
			selectedBits = 32;
			break;
	}

	select.remove();
	setSignedSelect();
	setSelectTitle();

	setSignedResult();
}

function checkSignedInput() {
  signedInput = this.value().toUpperCase(); // La saise est mise en majuscule
	isSignedInputCorrect = isValidSignedInput();
}

function setSelectTitle() {
	textSize(textPolice)

	// Creer un rectangle pour cacher les texts precedents
  noStroke();
  fill(220);
  rect(665, 75, 200, textPolice);
  fill(0);

	if (signedBase == allBase.DECIMALE) {
		textSize(textPolice);
		text("Bits", 665, 75, 200, textPolice);
	} else {
		textSize(textPolice);
		text("Convention", 665, 75, 200, textPolice);
	}
}

function setSignedSelect() {
	select = createSelect();

	if (signedBase == allBase.DECIMALE) {
		select.option(bits.b8);
		select.option(bits.b16);
		select.option(bits.b32);
		select.selected(selectedBits);

	} else {
		select.option(convention.COMPLEMENT);
		select.option(convention.VALSIGNE);
		select.selected(selectedConvention);
	}

	select.position(665, 95);
	select.changed(updateSelect);

}

function updateSelect() {
	if (signedBase == allBase.DECIMALE) {
		selectedBits = this.value();
	} else {
		selectedConvention = this.value();
	}
}

function setSignedResult() {

	// Creer un rectangle pour cacher les texts precedents
  noStroke();
  fill(220);
  rect(380, 160, 500, 160);
  fill(0);

	switch (signedBase) {
		case allBase.DECIMALE:
			setDecimaleResult();
			break
		default:
			setBinResult();
	}
}

function setBinResult() {
	textSize(textPolice);
	text("Decimale : " + signedResult.decimale, 380, 160, 380, textPolice);
}

function setDecimaleResult() {
	textSize(textPolice);
	text("Convention bit de poid fort : " + signedResult.valSigne, 380, 160, 500, textPolice)
	text("Convention complement à 2 : " + signedResult.comp2, 380, 200, 500, textPolice);
}

function isValidSignedInput() {
	let decimaleCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

	for (let i = 0; i < signedInput.length; i++) {

		// Permet de savoir si input[i] est dans la liste de caractere correct.
		// Si oui, alors result est un tableau de 1 element
		// Si non, alors result est un tableau vide
    let result = decimaleCharacters.filter(char => (signedInput[i] == char) || (i == 0 && signedInput[i] == "-"));
    if (result.length == 0) {
      return false
    }
  }
	return true
}


/*************************
		Logic fonctions
*************************/

function convertSigned() {
	switch (signedBase) {
		case allBase.DECIMALE:
			signedResult.valSigne = decimaleToBinaireValSigne(selectedBits);
			signedResult.comp2 = decimaleToBinaireComp2(selectedBits);
			break;
		default:
			switch (selectedConvention) {
				case convention.COMPLEMENT:
					signedResult.decimale = binaireCmp2ToDecimale(selectedBits);
					break;
				case convention.VALSIGNE:
				  signedResult.decimale = binaireValSigToDecimale(selectedBits);
					break;
			}
	}

	setSignedResult();
}

function decimaleToBinaireValSigne(nbBit, number = signedInput) {

	// Etape 1 - Determination du signe
	let signe = "0";
	if (number[0] == "-") {
		signe = "1";
		number = number.slice(1);
	}

	// Etape 2 - Determination du nombre k de position necessaire pour
	// representer number en binaire
	k = nombreDePoisiton(number);

	// Etape 3 - Determine si il y'a un overflow

	if (k >= nbBit) {
		return "overflow"
	}

	// Etape 4 - Conversion de number en binaire
	let valAbs = deciamleToBinaire(number);

	// Etape 5 - Si k < (nbBit - 1) alors on doit rajouter des zeros
	valAbs = valAbs.padStart(nbBit - 1, '0');

	return signe + valAbs
}

function decimaleToBinaireComp2(nbBit, number = signedInput) {

	// Etape 1 - Determination du signe
	let signe = "0";
	if (number[0] == "-") {
		signe = "1";
		number = number.slice(1);
	}

	// Etape 2 - Determination du nombre k de position necessaire pour
	// representer number en binaire
	k = nombreDePoisiton(number);

	console.log("k :" + k);

	// Etape 3 - Obtenir la valeur absolue en binaire
	let valAbs = deciamleToBinaire(number);
	console.log("val abs : " + valAbs);

	// Etape 4 - Si k < (nbBit - 1) alors on doit rajouter des zeros
	valAbs = valAbs.padStart(nbBit, '0');

	if (signe == "0") {
		if (k >= nbBit) {
			return "overflow"
		} else {
			return valAbs
		}
	}

	// Etape 5 - Complement à 2

	let comp1 = complementA1(valAbs, nbBit);

	// parseInt(,2) met un chiffre en decimale, ainsi on peut faire une addition binaire
	// toString(2) converti un chiffre en chaine binaire
	let comp2 = (parseInt(comp1, 2) + parseInt("1", 2)).toString(2);

	return comp2.length == nbBit ? comp2 : "overflow"
}

function binaireValSigToDecimale(nbBit, number = signedInput) {
	if (number.length <= nbBit) {
		number = number.padStart(nbBit, "0");
	} else {
		return "overflow"
	}

	let signe = number[0] == "1" ? "-" : "";

	let valAbs = parseInt(number.slice(1), 2);

	return signe + valAbs
}

function binaireCmp2ToDecimale(nbBit, number = signedInput) {

	// Etape 1 - On met le nombre binaire en nbBit

	if (number.length > nbBit) {
		return "overflow"
	} else {
		number = number.padStart(nbBit, "0");
	}

	console.log("input = " + number);

	// Etape 2 - Determination du signe

	if (number[0] == "1") {
		let comp2 = complementA1(number, nbBit);
		let carry = "1";

		for (let i = comp2.length - 1; i >= 0; i--) {
			if (comp2[i] == "0" && carry == "1") {
				carry = "0";
				comp2 = replaceAt(comp2, i, "1");
			} else if (comp2[i] == "1" && carry == "1") {
				comp2 = replaceAt(comp2, i, "0");
			}
		}

		return "-" + parseInt(comp2, 2);

	} else {

		return parseInt(number, 2)
	}
}

function nombreDePoisiton(number) {
	// (n) en base 10 -> (n) en base 2
	// On cherche K tel que b^(k - 1) <= n < b^(k)

  let k = 0;
	while (number >= (2 ** k)) {
		k += 1;
	}

	return k
}

function deciamleToBinaire(number) {
	// Pour exp allant de k-1 à 0, on regarde combien de fois
	// on a n - (2^(exp)) >= 0. Le nombre de rep pour chaque exp
	// correspond au chiffre en base 2 en position exp + 1

	let valAbs = '';

  // Permet de forcer la valeure 0 quand input vaut 0
	let temp = k - 1;
	if (temp < 0) {
		temp = 0
	}

	for (let exp = temp; exp >= 0; exp -= 1) {

		let rep = 0;
		while ( number >= ((2 ** exp)) ) {
	    number -= (2 ** exp);
		  rep += 1;
	  }

		valAbs += rep;
	}

	return valAbs
}

function complementA1(number, nbBit) {
	let comp1 = "";
	number = number.padStart(nbBit, '0');
	for (let i = 0; i < number.length; i++) {
		if (number[i] == "0") {
			comp1 += "1";
		} else {
			comp1 += "0";
		}
	}
	return comp1;
}

function replaceAt(string, index, replace) {
  return string.substring(0, index) + replace + string.substring(index + 1);
}
