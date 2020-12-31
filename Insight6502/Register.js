class Register {

  constructor(bits, name, status = false, stack = false) {
    this.numberOfBits = bits;
    this.maxNumber = Math.pow(2, bits) - 1;
    this.value = 0x0;
    this.name = name;

    // Permet d'afficher le regsitre d'une maniere differente si c'est le registre de status
    this.isStatus = status

    this.status = {
      negativeResult : 0,
      overflow       : 0,
      break          : 0,
      decimalMode    : 0,
      irqDisable     : 0,
      zeroResult     : 0,
      carry          : 0
    }

    // Le stack se situe de l'adresse 0100 à 01FF
    this.isStack = stack;
    if (stack) {
      this.value = 0xFF;
    }
  }

  setData(data) {
    if (data <= this.maxNumber) {
      this.value = data;
    }
  }

  getData() {
    return this.value;
  }

  setStatus(data) {
    data = data.toString(2);
    data = data.padStart(8, "0");
    this.status.negativeResult = data[0];
    this.status.overflow       = data[1];
    this.status.break          = data[3];
    this.status.decimalMode    = data[4];
    this.status.irqDisable     = data[5];
    this.status.zeroResult     = data[6];
    this.status.carry          = data[7];
  }

  incrementBy(increment) {
    if (this.value <= this.maxNumber - increment) {
      this.value += increment;
    } else {
      this.value = 0;
    }
  }

  increment() {
    let binaire = this.value.toString(2);
    binaire = this.signedAddition(binaire, "00000001");
    this.value = parseInt(binaire, 2);
  }

  decrement() {
    let binaire = this.value.toString(2);
    binaire = this.signedAddition(binaire, "11111111");
    this.value = parseInt(binaire, 2);
  }

  signedAddition(a, b) {
    // On met les deux nombres dans le nombre de bits choisie
    a = a.padStart(this.numberOfBits, '0');
    b = b.padStart(this.numberOfBits, '0');

    let signeA = a[0];
    let signeB = b[0];

    let result = parseInt(a, 2) + parseInt(b, 2);
    result = result.toString(2);
    result = result.padStart(this.numberOfBits, "0")

    if (result.length > this.numberOfBits) {
      result = result.slice(1);
    }

    return result
  }


  drawRegister(x, y, isHidden = false) {
    this.x = x;
    this.y = y;
    this.isHidden = isHidden;

    // Le contour du registre
    if (isHidden == false) {
      strokeWeight(1);
      stroke(0);
      fill(255)
    	rect(this.x, this.y, regBufWidth, regBufHeight);
      stroke(255);
    }

    // Le contenu du registre
    strokeWeight(1);
    stroke(255);
    fill(0);
    textSize(numberSize);
    let textX = this.x + (regBufWidth / 2) - (textRegBufWidth / 2);
    // Si le nombre de bits est trop grand on decale de 10 pour centrer la valeur
    textX = this.numberOfBits > 8 ? textX - 10 : textX;
    textX = this.isStatus ? textX - 20 : textX;

    let textY = this.y + (numberSize / 2);
    text(this.isStatus == false ? this.formatValue() : this.formatStatus(),
    textX, textY, textRegBufWidth, numberSize);

    //le titre du registre
    textSize(titleSize);
    if (this.isStatus == false) {
      textX = this.numberOfBits > 8 ? textX + 10 : textX;
      textX = this.isStatus ? textX + 20 : textX;
    } else {
      textX = textX - 8;
    }
    text(this.name, textX + 10, y + regBufHeight + (titleSize / 2), regBufWidth, titleSize);
  }

  redrawRegister() {
    // Cache le registre precedent
    noStroke();
    fill(255);
    rect(this.x, this.y, regBufWidth, regBufHeight + 1);

    this.drawRegister(this.x, this.y);
  }

  formatValue() {
    let stringValue = this.value.toString(16);
    stringValue = stringValue.toUpperCase();
    return "0x" + stringValue.padStart(this.numberOfBits / 4, "0")
  }

  // Pour representer les flags
  formatStatus() {
    let binaire = "" + this.status.negativeResult + this.status.overflow + "0" + this.status.break +
    this.status.decimalMode + this.status.irqDisable + this.status.zeroResult + this.status.carry;
    this.value = parseInt(binaire, 2);
    return binaire
  }

  highlight() {
    fill(0, 0, 0, 0);
    strokeWeight(1);
    stroke(255, 0, 0);
    if (this.isHidden) {
      rect(this.x + 7, this.y, regBufWidth - 10, regBufHeight);
    } else {
      rect(this.x, this.y, regBufWidth, regBufHeight);
    }
    stroke(0);
    fill(255);
  }

  lowlight() {
    fill(0, 0, 0, 0);
    strokeWeight(1);
    stroke(0);
    if (this.isHidden) {
      rect(this.x + 7, this.y, regBufWidth - 10, regBufHeight);
    } else {
      rect(this.x, this.y, regBufWidth, regBufHeight);
    }
    fill(255);
  }

  /******** Methode pour obtenir les flags *******/

  negativeFlag(data) {
    if (this.status.carry != 1) {
      if (data < 128) { // Positif
        this.status.negativeResult = 0;
      } else {
        this.status.negativeResult = 1;
      }
    }
  }

  zeroFlag(data) {
    if (this.status.carry != 1) {
      if (data == 0) {
        this.status.zeroResult = 1;
      } else {
        this.status.zeroResult = 0;
      }
    }
  }
}
