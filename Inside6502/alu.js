class ALU {

  constructor() {}

  drawALU(x, y) {
    this.x = x;
    this.y = y;

    stroke(0);
    strokeWeight(1);
    line(this.x, this.y, this.x + 15, this.y);
    line(this.x + 15, this.y, this.x + 25, this.y + 25);
    line(this.x + 25, this.y + 25, this.x + 35, this.y);
    line(this.x + 35, this.y, this.x + 50, this.y);
    line(this.x + 50, this.y, this.x + 35, this.y + 40);
    line(this.x + 35, this.y + 40, this.x + 15, this.y + 40);
    line(this.x + 15, this.y + 40, this.x, this.y);

    //le titre
    textSize(titleSize);
    strokeWeight(0);
    text("ALU", this.x + 12, this.y + 50, regBufWidth, titleSize);
  }

  highlight() {
    stroke(255, 0, 0);
    strokeWeight(1);
    line(this.x, this.y, this.x + 15, this.y);
    line(this.x + 15, this.y, this.x + 25, this.y + 25);
    line(this.x + 25, this.y + 25, this.x + 35, this.y);
    line(this.x + 35, this.y, this.x + 50, this.y);
    line(this.x + 50, this.y, this.x + 35, this.y + 40);
    line(this.x + 35, this.y + 40, this.x + 15, this.y + 40);
    line(this.x + 15, this.y + 40, this.x, this.y);
  }

  lowlight() {
    stroke(0);
    strokeWeight(1);
    line(this.x, this.y, this.x + 15, this.y);
    line(this.x + 15, this.y, this.x + 25, this.y + 25);
    line(this.x + 25, this.y + 25, this.x + 35, this.y);
    line(this.x + 35, this.y, this.x + 50, this.y);
    line(this.x + 50, this.y, this.x + 35, this.y + 40);
    line(this.x + 35, this.y + 40, this.x + 15, this.y + 40);
    line(this.x + 15, this.y + 40, this.x, this.y);
  }

  signedAddition(a, b, cpu, nbBits = 8) {
    let signeA = a[0];
    let signeB = b[0];

    let result = parseInt(a, 2) + parseInt(b, 2);
    result = result.toString(2);
    result = result.padStart(nbBits, "0");

    if (result.length > nbBits) {
      result = result.slice(1);
      cpu.status.status.carry = 1;
    } else {
      cpu.status.status.carry = 0;
    }

    if (signeA == signeB && result[0] != signeA) {
      cpu.status.status.overflow = 1;
    } else {
      cpu.status.status.overflow = 0;
    }

    return result
  }

  /********* Operations *********/

  adc(acc, number, cpu) {
    let accBin = acc.toString(2);
    accBin = accBin.padStart(8, "0");

    let numberBin = number.toString(2);
    numberBin = numberBin.padStart(8, "0");

    let carryBin = cpu.status.status.carry.toString(2);
    carryBin = carryBin.padStart(8, "0");

    let result = this.signedAddition(this.signedAddition(accBin, carryBin, cpu), numberBin, cpu);
    cpu.accumulator.setData(parseInt(result, 2));
  }

  sbc(acc, number, cpu) {
    let accBin = acc.toString(2);
    accBin = accBin.padStart(8, "0");

    let numberBin = decimaleToBinaireComp2(-number, 8);

    let carryBin = cpu.status.status.carry.toString(2);
    carryBin = carryBin.padStart(8, "0");

    let result = this.signedAddition(this.signedAddition(accBin, carryBin, cpu), numberBin, cpu);
    cpu.accumulator.setData(parseInt(result, 2));
  }

  addIndex(data, number, cpu) {
    let dataBin = data.toString(2);
    dataBin = dataBin.padStart(16, "0");

    let numberBin = number.toString(2);
    numberBin = numberBin.padStart(16, "0");

    let result = this.signedAddition(dataBin, numberBin, cpu, 16);
    cpu.addressBuffer.value = parseInt(result, 2);
  }

  addPC(data, number, cpu) {
    let dataBin = data.toString(2);
    dataBin = dataBin.padStart(8, "0");

    let numberBin = number.toString(2);
    numberBin = numberBin.padStart(8, "0");

    let result = this.signedAddition(dataBin, numberBin, cpu, 8);
    cpu.programCounter.setData(parseInt(result, 2));
  }

  and(acc, number, cpu) {
    let accBin = acc.toString(2);
    accBin = accBin.padStart(8, "0");

    let numberBin = number.toString(2);
    numberBin = numberBin.padStart(8, "0");

    let result = "";
    for (let i = 0; i < accBin.length; i++) {
      if (accBin[i] == 1 && accBin[i] == numberBin[i]) {
        result += 1;
      } else {
        result += 0;
      }
    }

    cpu.accumulator.setData(parseInt(result, 2));
  }

  bit(acc, number, cpu) {
    cpu.status.status.zeroResult = acc == number ? 1 : 0;

    let numberBin = number.toString(2);
    numberBin = numberBin.padStart(8, "0");

    cpu.status.status.negativeResult = parseInt(numberBin.slice(0, 1), 2);
    cpu.status.status.overflow = parseInt(numberBin.slice(1, 2), 2);
  }

  or(acc, number, cpu) {
    let accBin = acc.toString(2);
    accBin = accBin.padStart(8, "0");

    let numberBin = number.toString(2);
    numberBin = numberBin.padStart(8, "0");

    let result = "";
    for (let i = 0; i < accBin.length; i++) {
      if (accBin[i] == 1 || numberBin[i] == 1) {
        result += 1;
      } else {
        result += 0;
      }
    }

    cpu.accumulator.setData(parseInt(result, 2));
  }

  xor(acc, number, cpu) {
    let accBin = acc.toString(2);
    accBin = accBin.padStart(8, "0");

    let numberBin = number.toString(2);
    numberBin = numberBin.padStart(8, "0");

    let result = "";
    for (let i = 0; i < accBin.length; i++) {
      if ((accBin[i] == 1 && numberBin[i] == 0) || (accBin[i] == 0 && numberBin[i] == 1)) {
        result += 1;
      } else {
        result += 0;
      }
    }

    cpu.accumulator.setData(parseInt(result, 2));
  }


  cmp(acc, number, cpu) {
    acc = acc.toString(2);
    number = decimaleToBinaireComp2(-number, 8);

    let result = this.signedAddition(acc, number, cpu, 8);

    cpu.status.negativeFlag(parseInt(result, 2));
    cpu.status.zeroFlag(parseInt(result, 2));
    cpu.status.redrawRegister();
    cpu.status.highlight();
  }

  cpx(x, number, cpu) {
    x = x.toString(2);
    number = decimaleToBinaireComp2(-number, 8);

    let result = this.signedAddition(x, number, cpu, 8);

    cpu.status.negativeFlag(parseInt(result, 2));
    cpu.status.zeroFlag(parseInt(result, 2));
    cpu.status.redrawRegister();
    cpu.status.highlight();
  }

  cpy(y, number, cpu) {
    y = y.toString(2);
    number = decimaleToBinaireComp2(-number, 8);

    let result = this.signedAddition(y, number, cpu, 8);

    cpu.status.negativeFlag(parseInt(result, 2));
    cpu.status.zeroFlag(parseInt(result, 2));
    cpu.status.redrawRegister();
    cpu.status.highlight();
  }

  shiftLeftA(number, cpu) {
    number = number.toString(2);
    number = number.padStart(8, "0") + "0";
    cpu.accumulator.setData(parseInt(number.slice(1), 2));
    cpu.status.status.carry = number.substring(0, 1);
  }

  shiftLeft(number, cpu) {
    number = number.toString(2);
    number = number.padStart(8, "0") + "0";
    cpu.dataBuffer.value = parseInt(number.slice(1), 2);
    cpu.status.status.carry = number.substring(0, 1);
  }

  shiftRightA(number, cpu) {
    number = number.toString(2);
    number = number.padStart(8, "0");
    cpu.status.status.carry = number.substring(number.length - 1, number.length);
    number = "0" + number.substring(0, number.length - 1);
    cpu.accumulator.setData(parseInt(number.slice(1), 2));
  }

  shiftRight(number, cpu) {
    number = number.toString(2);
    number = number.padStart(8, "0");
    cpu.status.status.carry = number.substring(number.length - 1, number.length);
    number = "0" + number.substring(0, number.length - 1);
    cpu.dataBuffer.value = parseInt(number.slice(1), 2);
  }

  rolA(number, cpu) {
    number = number.toString(2);
    number = number.padStart(8, "0");
    let carry = cpu.status.status.carry;
    number = number + carry;
    cpu.status.status.carry = number.substring(0, 1);
    cpu.accumulator.setData(parseInt(number.slice(1), 2));
  }

  rol(number, cpu) {
    number = number.toString(2);
    number = number.padStart(8, "0");
    let carry = cpu.status.status.carry;
    number = number + carry;
    cpu.status.status.carry = number.substring(0, 1);
    cpu.dataBuffer.value = parseInt(number.slice(1), 2);
  }

  rorA(number, cpu) {
    number = number.toString(2);
    number = number.padStart(8, "0");
    let carry = cpu.status.status.carry;
    number = carry + number;
    cpu.status.status.carry = number.substring(number.length - 1, number.length);
    cpu.accumulator.value = parseInt(number.substring(0, number.length - 1), 2);
  }

  ror(number, cpu) {
    number = number.toString(2);
    number = number.padStart(8, "0");
    let carry = cpu.status.status.carry;
    number = carry + number;
    cpu.status.status.carry = number.substring(number.length - 1, number.length);
    cpu.dataBuffer.value = parseInt(number.substring(0, number.length - 1), 2);
  }

}

function decimaleToBinaireComp2(number, nbBits = 8) {
  number = "" + number;
	let signe = "0";
	if (number[0] == "-") {
		signe = "1";
		number = number.slice(1);
	}
  number = parseInt(number, 10);

	let valAbs = number.toString(2);
	valAbs = valAbs.padStart(nbBits, '0');

	if (signe == "0") {
			return valAbs
	}

	let comp1 = complementA1(valAbs, nbBits);
	let comp2 = (parseInt(comp1, 2) + parseInt("1", 2)).toString(2);
	return comp2
}

function complementA1(number, nbBits) {
	let comp1 = "";
	number = number.padStart(nbBits, '0');
	for (let i = 0; i < number.length; i++) {
		if (number[i] == "0") {
			comp1 += "1";
		} else {
			comp1 += "0";
		}
	}
	return comp1;
}
