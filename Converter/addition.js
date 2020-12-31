/*
<<<<<<< HEAD
* Ce fichier contient le d'addition
=======
* Ce fichier contient le contenu d'addition
>>>>>>> 48e7d163dfc3f8f852e64ce8aee0d39e07f04e0d
*/

 // Variables

let a = 0;
let b = 0;

let allBits = {
  BITS4  : "4 bits",
  BITS8  : "8 bits",
  BITS16 : "16 Bits"
}

let selectedAddBits = allBits.BITS4;
let addBits = 4;

let isSigned = false;

let aValid = true;
let bValid = true;

let addResult = 0;
let carry = false;
let overflow = false;

 /*************************
 		UI fonctions
 *************************/

 // Set functions

 function setAddTitle() {
   textSize(textTitlePolice);
   text("Additionneur", 10, 330, 300, textTitlePolice);
 }

 function setAInputTitle() {
   textSize(textPolice);
   text("a", 65, 385, 200, textPolice);
 }

 function setAInput() {
   let aInp = createInput(a);
   aInp.input(updateA);
   aInp.position(20, 410);
   aInp.size(100, 10);
 }

function updateA() {
  a = this.value();
  if ( isValidAddInput(a) ) {
    aValid = true;

  } else {
    aValid = false;
  }
}

function setPlusSign() {
  textSize(textPolice);
  text("+", 140, 407, 10, textPolice);
}

function setBInputTitle() {
  textSize(textPolice);
  text("b", 215, 385, 200, textPolice);
}

function setBInput() {
  let bInp = createInput(b);
  bInp.input(updateB);
  bInp.position(160, 410);
  bInp.size(100, 10);
}

function updateB() {
  b = this.value();
  if (isValidAddInput(b)) {
    bValid = true;

  } else {
    bValid = false;
  }
}

function setEqualSign() {
  textSize(textPolice);
  text("=", 280, 407, 10, textPolice);
}

function setSigneCheckbox() {
  let box = createCheckbox("signé", isSigned);
  box.position(20, 470);
  box.changed(updateCheckbox);
}

function updateCheckbox() {
  isSigned = this.checked();
}

function setAddBitsSelectTitle() {
  textSize(textPolice);
  text("Base", 90, 450, 50, textPolice);
}

function setAddBitsSelect() {
  let select = createSelect();
  select.position(90, 470);
  select.option(allBits.BITS4);
  select.option(allBits.BITS8);
  select.option(allBits.BITS16);
  select.selected(selectedAddBits);
  select.changed(updateAddBits);
}

function updateAddBits() {
  selectedAddBits = this.value();
  switch (this.value()) {
    case allBits.BITS4:
      addBits = 4;
      break;
    case allBits.BITS8:
      addBits = 8;
      break;
    case allBits.BITS16:
      addBits = 16;
      break;
  }

  aValid = isValidAddInput(a);
  bValid = isValidAddInput(b);
}

function setCalculButton() {
  let button = createButton("Calcul")
  button.position(190, 470);
  button.mousePressed(proceedCalculation);
}

function isValidAddInput(input) {
   let binaireCharacters = [0, 1];
   if (input.length > addBits) {
     return false
   }
   for (let i = 0; i < input.length; i++) {

 		// Permet de savoir si input[i] est dans la liste de caractere correct.
 		// Si oui, alors result est un tableau de 1 element
 		// Si non, alors result est un tableau vide
     let result = binaireCharacters.filter(char => input[i] == char);
     if (result.length == 0) {
       return false
     }
   }
 	return true
}

function setAddResult() {
  // Ajout d'un rectangle pour cacher le text precedent
  fill(220);
  rect(300, 408, 100, textPolice);
  fill(0);

  textSize(textPolice);
  text(addResult, 300, 408, 100, textPolice);
}

function setCarryFlagTitle() {
  textSize(textPolice);
  text("C", 20, 520, 10, textPolice);
}

function setCarryFlag() {
  // Ajout d'un rectangle pour cacher le text precedent
  fill(220);
  rect(20, 540, 10, textPolice);
  fill(0);

  textSize(textPolice);
  let value = carry == true ? 1 : 0;
  text(value, 20, 540, 10, textPolice);
}

function setOverflowFlagTitle() {
  textSize(textPolice);
  text("V", 40, 520, 10, textPolice);
}

function setOverflowFlag() {
  // Ajout d'un rectangle pour cacher le text precedent
  fill(220);
  rect(40, 540, 10, textPolice);
  fill(0);

  textSize(textPolice);
  let value = overflow == true ? 1 : 0;
  text(value, 40, 540, 10, textPolice);
}


/*************************
		Logic fonctions
*************************/

function proceedCalculation() {
  if (aValid && bValid) {
    if (isSigned) {
      addResult = signedAddition();
    } else {
      addResult = unsignedAddition();
    }

    setAddResult();
    setCarryFlag();
    setOverflowFlag();
  }
}

function signedAddition() {
  // On met les deux nombres dans le nombre de bits choisie
  a = a.padStart(addBits, '0');
  b = b.padStart(addBits, '0');

  let signeA = a[0];
  let signeB = b[0];

  let result = parseInt(a, 2) + parseInt(b, 2);
  result = result.toString(2);
  result = result.padStart(addBits, "0")

  carry = false;
  overflow = false;

  if (result.length > addBits) {
    result = result.slice(1);
    carry = true;
  }

  if (signeA == signeB && result[0] != signeA) {
    overflow = true;
  } else {
    carry = false;
    overflow = false;
  }

  return result
}

function unsignedAddition() {
  // On met les deux nombres dans le nombre de bits choisie
  a = a.padStart(addBits, '0');
  b = b.padStart(addBits, '0');

  let result = parseInt(a, 2) + parseInt(b, 2);
  result = result.toString(2);

  if (result.length > addBits) {
    carry = true;
    overflow = false;

    result = result.slice(1);
  } else {
    carry = false;
    overflow = false;
  }

  return result.padStart(addBits, "0")
}
