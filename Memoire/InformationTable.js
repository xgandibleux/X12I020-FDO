const ASCIITable = ["NUL", "SOH", "STX", "ETX", "EOT", "ENQ", "ACK", "BEL", "BS", "HT", "LF", "VT", "FF", "CR",
"SO", "SI", "DLE", "DC1", "DC2", "DC3", "DC4", "NAK", "SYN", "ETB", "CAN", "EM", "SUB", "ESC", "FS", "GS", "RS",
"US", "space", "!", '"', "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", "0", "1", "2", "3", "4",
"5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?", "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
"L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_", "`", "a",
"b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x",
"y", "z", "{", "}", "|", "~", "DEL"];

class InformationTable {

  constructor(value) {
    this.value = value;
  }

  drawTable(title, x, y, width, height) {
    let widthPerRow = width / 2;
    let heightPerRow = height / 5;

    this.title = title;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // Title
    textSize(policeSize);
    strokeWeight(0);
    text(title, x, y, width, heightPerRow);

    // Contour du tableau
    fill(255);
    strokeWeight(1);
    rect(x, y + heightPerRow, width, height - heightPerRow);

    // Ligne du tableau
    stroke(0);
  	strokeWeight(1);
    for (let row = 2; row < 5; row++) {
      line(x, y + (row * heightPerRow), x + width,y + (row * heightPerRow));
    }

    // Ligne des colonnes
    line(x + widthPerRow, y + heightPerRow, x + widthPerRow, y + height);

    this.setStringValue();

    // Remplissage des cases
    // Premiere ligne - ASCII
    fill(0);
    strokeWeight(0);
    text("ASCII", x + 10, y + heightPerRow + (heightPerRow / 3), widthPerRow - 20, policeSize);
    text(this.toAscii(), x + 10 + widthPerRow, y + heightPerRow + (heightPerRow / 3), widthPerRow - 20, policeSize);

    // Deuxieme ligne - Decimale
    text("Decimale NS", x + 10, y + (2 * heightPerRow) + (heightPerRow / 3), widthPerRow - 20, policeSize);
    text(this.toDecimale(), x + 10 + widthPerRow, y + (2 * heightPerRow) + (heightPerRow / 3), widthPerRow - 20, policeSize);

    // Deuxieme ligne - Decimal signe
    text("Decimale S", x + 10, y + (3 * heightPerRow) + (heightPerRow / 3), widthPerRow - 20, policeSize);
    text(this.toDecimalSigne(), x + 10 + widthPerRow, y + (3 * heightPerRow) + (heightPerRow / 3), widthPerRow - 20, policeSize);

    // Deuxieme ligne - Binaire signé
    text("Binaire", x + 10, y + (4 * heightPerRow) + (heightPerRow / 3), widthPerRow - 20, policeSize);
    text(this.toBinaire(), x + 10 + widthPerRow, y + (4 * heightPerRow) + (heightPerRow / 3), widthPerRow - 20, policeSize);
  }

  setStringValue() {
    this.value = this.value.toString(16).toUpperCase();
    this.value = this.value.padStart(this.size, "0");
    return "0x" + this.value;
  }

  toAscii() {
    let decimale = parseInt(this.value, 16);
    return decimale < ASCIITable.length ? ASCIITable[decimale] : "Out of range"
  }

  toDecimale() {
    return parseInt(this.value, 16);
  }

  toBinaire() {
    let decimale = parseInt(this.value, 16);
    let binaire = decimale.toString(2);
    return binaire.padStart(8, "0")
  }

  toDecimalSigne() {
    let decimale = parseInt(this.value, 16);
    return this.decimaleToDecimaleSigne(decimale)
  }

  redraw() {
    noStroke();
    fill(255);
    rect(this.x, this.y, this.width + 1, this.height + 1);
    fill(0);
    stroke(0);

    this.drawTable(this.title, this.x, this.y, this.width, this.height);
  }

  decimaleToDecimaleSigne(number) {

    number = number.toString(2);
    number = number.padStart(8, '0');

    let isPositif = true;
    if (number[0] == "1") {
      isPositif = false;
      number = number.slice(1);
    }

  	if (isPositif) {
  		return parseInt(number, 2)

  	} else {
      let comp1 = this.complementA1(number);
    	let comp2 = (parseInt(comp1, 2) + parseInt("1", 2)).toString(2);
    	return "-" + parseInt(comp2, 2)
    }

  }

  complementA1(number) {
  	let comp1 = "";
  	for (let i = 0; i < number.length; i++) {
  		if (number[i] == "0") {
  			comp1 += "1";
  		} else {
  			comp1 += "0";
  		}
  	}
  	return comp1;
  }


}
