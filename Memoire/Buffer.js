let typeOfBuffer = {
  ADDRESS : "Buffer d'adresses",
  CONTROL : "Buffer de controle",
  DATA    : "Buffer de données"
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
    const width = 135;
    const height = 20;
    const textWidth = 30;

    this.x = x;
    this.y = y;

    // Le contour du buffers
    stroke(0);
    fill(255);
    strokeWeight(1);
    rect(x, y, width, height);

    // La valeur
    fill(0);
    strokeWeight(0);
    textSize(policeSize);
    let textX = x + (width / 2) - (textWidth / 2);
    let textY = y + (height / 2) - (policeSize / 2);
    text(this.setStringValue(this.value), textX, textY, textWidth, policeSize);

    // Le titre
    text(this.type, x + 5, y + height + 5, width, policeSize);
  }

  changeText() {
    const width = 135;
    const height = 20;
    const textWidth = 30;
    // Cache le text precedent
    noStroke();
    fill(255);
    rect(this.x + 1, this.y + 1, width - 1, height - 1);
    stroke(0);
    fill(0);

    strokeWeight(0);
    textSize(policeSize);
    let textX = this.x + (width / 2) - (textWidth / 2);
    let textY = this.y + (height / 2) - (policeSize / 2);
    text(this.setStringValue(this.value), textX, textY, textWidth, policeSize);
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
}
