class Memory {

  constructor() {
    this.maxAdress = 0xffff;

    this.array = [];

    // Initialise l'array avec 0x00
    // L'index de l'array represente une adresse
    // Une adresse vaut 1 octet, ainsi la taille de la memoire
    // vaut maxAdress * 8 bits

    for (let i = 0x0; i <= this.maxAdress; i++) {
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

  isAddressDrawn(address) {
    return address >= this.startAddress && address < (this.startAddress + (this.octetPerRow * 16))
  }

  drawMemory(x, y, startAddress) {

    this.x = x;
    this.y = y;
    this.startAddress = startAddress;

    this.octetPerRow = 8;
    this.padding = 9;
    this.textWidth = 35;

  	let numberOfRow = 16;

    // Le contour de la memoire
    strokeWeight(1);
    stroke(0);
    let memoryWidth = (this.octetPerRow + 1) * this.padding + (this.octetPerRow * this.textWidth);
    let memoryHeight = (numberOfRow + 1) * this.padding + (numberOfRow * numberSize);
  	rect(this.x + this.padding + this.textWidth + 30, this.y, memoryWidth, memoryHeight);
    stroke(255);

    // On stocke ces valeurs pour les reutiliser dans redrawMemory()
    this.memoryWidth = memoryWidth;
    this.memoryHeight = memoryHeight;

    // Remplissage de la memoire
  	let row = 1;
  	let col = 0;
  	for (let address = startAddress; address < startAddress + (numberOfRow * this.octetPerRow); address++) {

  		if (col >= this.octetPerRow) {
  			row += 1;
  			col = 0;
  		}

  		let data = this.getData(address);

  		if (data == "err") {
  			data = "";
  		} else {
        data = this.format(data);
      }

      fill(0);
  		textSize(numberSize);
      let dataWidth = (this.x + this.padding + this.textWidth) + this.padding + (this.padding * col)
      + (col * this.textWidth);
      let dataHeight = (this.y - this.padding) + (this.padding * row) + (row * numberSize);
  		text(data, dataWidth + 30, dataHeight, this.textWidth, numberSize);


  		col++;
  	}

    // L'addresse de la premiere donnée de la rangée
  	for (let row = 0; row < numberOfRow; row++) {
  		let address = this.formatAddress(startAddress + (row * 8));

      if (address.length < 7) {

        textSize(numberSize);
        let addressWidth = this.x;
        let addressHeight = (this.y + numberSize) + (this.padding * row) + (row * numberSize);
    		text(address, addressWidth, addressHeight, this.textWidth, numberSize);
      }

      this.memoryWidth += this.padding / 2;
  	}
    fill(255);
  }

  redrawMemory() {
    // Cache la memoire precedente
    noStroke();
    fill(255);
    rect(this.x, this.y, this.memoryWidth, this.memoryHeight + 1);

    this.drawMemory(this.x, this.y, this.startAddress);
  }

  format(data) {
  	data = data.toString(16);
  	if (data.length == 1) {
  		data = "0" + data;
  	}

  	return "0x" + data.toUpperCase()
  }

  formatAddress(address) {
    address = address.toString(16);
  	address = address.padStart(4, "0");
  	return "0x" + address.toUpperCase()
  }

  reset() {
    for (let address = 0x0; address < this.numberOfAddress; address++) {
      this.array[address] = 0x00;
    }
    this.redrawMemory();
  }

  highlight(address) {

    if (this.isAddressDrawn(address) == false) {
      this.startAddress = address;
      this.redrawMemory();
    }

    let row = Math.floor((address - this.startAddress) / this.octetPerRow);
    let col = (address - this.startAddress) % this.octetPerRow;

    let x = this.x + (1.75 * this.padding) + this.textWidth + (this.padding * col)
    + (col * this.textWidth) + 30;

    let y = this.y + (this.padding * row) + (row * numberSize) + (numberSize - 2);

    fill(0, 0, 0, 0);
    strokeWeight(1);
    stroke(255, 0, 0);
    rect(x, y, this.textWidth + this.padding, numberSize);
    stroke(0);
    fill(255);
  }

  lowlight(address) {
    let row = Math.floor((address - this.startAddress) / this.octetPerRow);
    let col = (address - this.startAddress) % this.octetPerRow;

    let x = this.x + (1.75 * this.padding) + this.textWidth + (this.padding * col)
    + (col * this.textWidth) + 30;

    let y = this.y + (this.padding * row) + (row * numberSize) + (numberSize - 2);

    fill(0, 0, 0, 0);
    strokeWeight(3);
    stroke(255);
    rect(x, y, this.textWidth + this.padding, numberSize);
    stroke(0);
    fill(255);
  }

}
