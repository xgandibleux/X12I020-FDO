
class Memory {

  constructor(maxAdress = 0) {
    this.maxAdress = maxAdress

    this.array = [];

    // Initialise l'array avec 0x00
    // L'index de l'array represente une adresse
    // Une adresse vaut 1 octet, ainsi la taille de la memoire
    // vaut maxAdress * 8 bits

    for (let i = 0x0; i < this.numberOfAddress; i++) {
      this.array.push(0x00);
    }

  }

  getData(address) {
    if (address > this.maxAdress) {
      return "err"
    } else {
      return this.array[address];
    }
  }

  setData(address, data) {
    // Retourne faux si address ou data est invalide
    if (address > this.maxAdress || data > 0x100) {
      return false
    } else {
      this.array[address] = data;
      return true
    }
  }

  get arraySnapshot() {
    console.log(this.array)
  }

	get numberOfAddress() {
		return this.maxAdress + 1
	}

  drawMemory(x, y) {

    this.x = x;
    this.y = y;

    const octetPerRow = 8;
    const padding = 10;
    const textWidth = 35;

  	let numberOfRow = this.numberOfAddress / octetPerRow;

    // Le contour de la memoire

    strokeWeight(1);
    stroke(0);
    let memoryWidth = (octetPerRow + 1) * padding + (octetPerRow * textWidth);
    let memoryHeight = (numberOfRow + 1) * padding + (numberOfRow * policeSize);
  	rect(this.x + padding + textWidth, this.y, memoryWidth, memoryHeight);
    stroke(255);

    // On stocke ces valeurs pour les reutiliser dans redrawMemory()
    this.memoryWidth = memoryWidth;
    this.memoryHeight = memoryHeight;

    // Remplissage de la memoire
  	let row = 0;
  	let col = 0;
  	for (let address = 0; address < this.numberOfAddress; address++) {

  		if (address % octetPerRow == 0) {
  			row += 1;
  			col = 0;
  		}

  		let data = this.getData(address);

  		if (data == "err") {
  			data = 0;
  		}

  		data = this.format(data);

      fill(0);
  		textSize(policeSize);
      let dataWidth = (this.x + padding + textWidth) + padding + (padding * col) + (col * textWidth);
      let dataHeight = (this.y - padding) + (padding * row) + (row * policeSize);
  		text(data, dataWidth, dataHeight, textWidth, policeSize);


  		col++;
  	}

    // L'addresse de la premiere donnée de la rangée
  	for (let row = 0; row < numberOfRow; row++) {
  		let address = this.format(row * 8);

  		textSize(policeSize);
      let addressWidth = this.x;
      let addressHeight = (this.y + policeSize) + (padding * row) + (row * policeSize);
  		text(address, addressWidth, addressHeight, textWidth, policeSize);

      this.memoryWidth += padding / 2;
  	}
    fill(255);
  }

  redrawMemory() {
    // Cache la memoire precedente
    noStroke();
    fill(255);
    rect(this.x, this.y, this.memoryWidth, this.memoryHeight + 1);

    this.drawMemory(this.x, this.y);
  }

  format(data) {
  	data = data.toString(16);
  	if (data.length == 1) {
  		data = "0" + data;
  	}

  	return "0x" + data
  }

  reset() {
    for (let address = 0x0; address < this.numberOfAddress; address++) {
      this.array[address] = "00";
    }
  }

}
