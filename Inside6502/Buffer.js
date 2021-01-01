let typeOfBuffer = {
  ADDRESS : "AB",
  CONTROL : "CB",
  DATA    : "DB"
}

let controlValue = {
  WRITE : 0x00,
  READ  : 0x01,
  RESET : 0x02
}

const hexCharacter = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

class Buffer {

  constructor(size, type) {
    this.size = size; // En octet
    this.type = type; // Du type typeOfBuffer

    this.value = 0;
  }

  incrementBy(increment) {
    this.value += increment;
    let hex = this.value.toString(16);
    if (hex.length > this.size) {
      this.value = parseInt(hex.slice(1), 10);
    }
  }

  decrementBy(decrement) {
    if (this.value == 0x00) {
      this.value = 0xFF;
    } else {
      this.value -= decrement;
    }
  }

  setStringValue(value) {
    value = value.toString(16).toUpperCase();
    if (value.length > this.size) {
      return "Err"
    } else {
      value = value.padStart(this.size, "0");
      return "0x" + value;
    }
  }

  drawBuffer(x, y) {

    const padding = 5;

    this.x = x;
    this.y = y;

    // Le contour du buffers
    stroke(0);
    fill(255);
    strokeWeight(1);
    rect(x, y, regBufWidth, regBufHeight);

    // La valeur
    fill(0);
    strokeWeight(0);
    textSize(numberSize);
    let textX = x + (regBufWidth / 2) - (textRegBufWidth / 2);
    let textY = y + (regBufHeight / 2) - (numberSize / 2) + (padding / 2);

    if (this.size == 4) {
      textX -= 10;
    }
    text(this.setStringValue(this.value), textX, textY, textRegBufWidth, numberSize);

    // Le titre
    if (this.size == 4) {
      textX += 10;
    }
    textSize(titleSize);
    text(this.type, textX + padding, y + regBufHeight + padding, regBufWidth, titleSize);
  }

  redrawBuffer() {

    // Cache le text precedent
    noStroke();
    fill(255);
    rect(this.x + 1, this.y + 1, regBufWidth - 1, regBufHeight - 1);
    stroke(0);
    fill(0);

    strokeWeight(0);
    textSize(numberSize);
    let textX = this.x + (regBufWidth / 2) - (textRegBufWidth / 2);
    let textY = this.y + (regBufHeight / 2) - (numberSize / 2) + 2.5;
    if (this.size == 4) {
      textX -= 10;
    }
    text(this.setStringValue(this.value), textX, textY, textRegBufWidth, numberSize);
  }

  isValidValue(value) {
    if (value.length > this.size || value.length == 0) {
      return false
    } else {
      for (let i = 0; i < value.length; i++) {
        if (hexCharacter.filter(char => char == value[i].toUpperCase()).length == 0) {
          return false
        }
      }
    }
    return true
  }

  highlight() {
    fill(0, 0, 0, 0);
    strokeWeight(1);
    stroke(255, 0, 0);
    rect(this.x, this.y, regBufWidth, regBufHeight);
    stroke(0);
    fill(255);
  }

  lowlight() {
    fill(0, 0, 0, 0);
    strokeWeight(1);
    stroke(0);
    rect(this.x, this.y, regBufWidth, regBufHeight);
    fill(255);
  }
}
