class CPU {

  constructor() {

    // Buffer
    this.addressBuffer = new Buffer(4, typeOfBuffer.ADDRESS);
    this.dataBuffer = new Buffer(2, typeOfBuffer.DATA);
    this.controlBuffer = new Buffer(1, typeOfBuffer.CONTROL);

    // Registre
    this.accumulator = new Register(8, "A");
    this.indexX = new Register(8, "X");
    this.indexY = new Register(8, "Y");
    this.programCounter = new Register(16, "PC");
    this.instructions = new Register(8, "IR");
    this.stackPointer = new Register(8, "S", false, true);
    this.status = new Register(8, "NV-BDIZC", true);
    this.AD = new Register(16, "");

    // ALU
    this.alu = new ALU();

    // Decoder
    this.decoder = new Decoder();

    this.step = 0;
    this.cycles = 0;

    this.instruction = false;

    // Si true, permet d'obtenir le resultat du cycle Fetch-Decode sans la partie graphique
    this.shouldSkipFD = false;
  }

  reset() {
    this.addressBuffer.value = 0x00;
    this.addressBuffer.redrawBuffer();
    this.addressBuffer.lowlight();

    this.dataBuffer.value = 0x00;
    this.dataBuffer.redrawBuffer();
    this.dataBuffer.lowlight();

    this.controlBuffer.value = 0x00;
    this.controlBuffer.redrawBuffer();
    this.controlBuffer.lowlight();

    this.accumulator.setData(0x00);
    this.accumulator.redrawRegister();

    this.indexX.setData(0x00);
    this.indexX.redrawRegister();

    this.indexY.setData(0x00);
    this.indexY.redrawRegister();

    this.programCounter.setData(0x00);
    this.programCounter.redrawRegister();

    this.instructions.setData(0x00);
    this.instructions.redrawRegister();

    this.stackPointer.setData(0xFF);
    this.stackPointer.redrawRegister();

    this.decoder.lowlight();

    this.alu.lowlight();

    this.step = 0;
    this.cycles = 0;

    this.bdToA.lowlight();
    this.bdToP.lowlight();
    this.bdToS.lowlight();
    this.bdToX.lowlight();
    this.bdToY.lowlight();
    this.bdToPc.lowlight();
    this.bdToIr.lowlight();
    this.bdToAlu.lowlight();
    this.baToP.lowlight();
    this.baToPc.lowlight();
    this.baToIr.lowlight();
    this.decoderToS.lowlight();
    this.irToDecoder.lowlight();

    this.status.setStatus(0x00);
    this.status.redrawRegister();

    this.instruction = false;

    this.AD.lowlight();
    this.hideAD();
  }

  drawCPU(x, y) {

    this.x = x;
    this.y = y;

    const padding = 25;

    // Le contour du CPU
    strokeWeight(1);
    stroke(0);
    let cpuWidth = regBufWidth * 4.65;
    let cpuHeight = regBufHeight * 14;
  	rect(this.x, this.y, cpuWidth, cpuHeight);
    stroke(255);

    // buffers
    this.dataBuffer.drawBuffer(this.x + (4 * padding), this.y + padding);
    this.addressBuffer.drawBuffer(this.x + cpuWidth - (2 * padding) - regBufWidth, this.y + padding);

    // registers
    // Registre de gauche
    this.indexX.drawRegister(this.x + (2 * padding), this.y + (2 * padding) + (2 * regBufHeight));
    this.indexY.drawRegister(this.x + (2 * padding), this.y + (3 * padding) + (3 * regBufHeight));
    this.accumulator.drawRegister(this.x + (2 * padding), this.y + (4 * padding) + (4 * regBufHeight));

    // Registre de droite
    this.programCounter.drawRegister(this.x + cpuWidth - (3 * padding) - regBufWidth, this.y + (2 * padding)
     + (2 * regBufHeight));
    this.stackPointer.drawRegister(this.x + cpuWidth - (3 * padding) - regBufWidth, this.y + (3 * padding)
     + (3 * regBufHeight));
    this.instructions.drawRegister(this.x + cpuWidth - (3 * padding) - regBufWidth, this.y + (4 * padding)
     + (4 * regBufHeight));
    this.status.drawRegister(this.x + cpuWidth - (3 * padding) - regBufWidth, this.y + (6 * padding)
    + (6 * regBufHeight));

    // Decoder
    this.decoder.drawDecoder(this.x + cpuWidth - (3 * padding) - regBufWidth, this.y + (5 * padding)
     + (5 * regBufHeight));

    // ALU
    this.alu.drawALU(this.x + (2.7 * padding), this.y + (5.5 * padding) + (5.5 * regBufHeight));

    // Bus
    // Buffer de données vers X
    let lines = () => {
      line(this.x + (4 * padding) + regBufWidth - 10, this.y + padding + regBufHeight, this.x + (4 * padding)
       + regBufWidth - 10, this.y + (3.5 * padding) + regBufHeight);
      line(this.x + (2 * padding) + regBufWidth, this.y + (3.5 * padding) + regBufHeight, this.x + (4 * padding)
       + regBufWidth - 10, this.y + (3.5 * padding) + regBufHeight);
     };
     this.bdToX = new Bus(lines);
     this.bdToX.draw();

     // Buffer de données vers PC
     lines = () => {
       line(this.x + (4 * padding) + regBufWidth - 10, this.y + padding + regBufHeight, this.x + (4 * padding)
       + regBufWidth - 10, this.y + (3.5 * padding) + regBufHeight);
       line(this.x + (4 * padding) + regBufWidth - 10, this.y + (3.5 * padding) + regBufHeight, this.x
       + (2 * padding) + regBufWidth + 113, this.y + (3.5 * padding) + regBufHeight);
     };
     this.bdToPc = new Bus(lines);
     this.bdToPc.draw();

     // Buffer de données vers Y
     lines = () => {
       line(this.x + (4 * padding) + regBufWidth - 10, this.y + padding + regBufHeight, this.x + (4 * padding)
       + regBufWidth - 10, this.y + (5.5 * padding) + regBufHeight);
       line(this.x + (2 * padding) + regBufWidth, this.y + (5.5 * padding) + regBufHeight, this.x + (4 * padding)
       + regBufWidth - 10, this.y + (5.5 * padding) + regBufHeight);
     };
     this.bdToY = new Bus(lines);
     this.bdToY.draw();

     // Buffer de données vers P
     lines = () => {
       line(this.x + (4 * padding) + regBufWidth - 10, this.y + padding + regBufHeight, this.x + (4 * padding)
       + regBufWidth - 10, this.y + (5.5 * padding) + regBufHeight);
       line(this.x + (4 * padding) + regBufWidth - 10, this.y + (5.5 * padding) + regBufHeight, this.x
       + (2 * padding) + regBufWidth + 113, this.y + (5.5 * padding) + regBufHeight);
     };
     this.bdToP = new Bus(lines);
     this.bdToP.draw();

     // Buffer de données vers A
     lines = () => {
       line(this.x + (4 * padding) + regBufWidth - 10, this.y + padding + regBufHeight, this.x + (4 * padding)
       + regBufWidth - 10, this.y + (7.5 * padding) + regBufHeight);
       line(this.x + (2 * padding) + regBufWidth, this.y + (7.5 * padding) + regBufHeight, this.x +
       (4 * padding) + regBufWidth - 10, this.y + (7.5 * padding) + regBufHeight);
     };
     this.bdToA = new Bus(lines);
     this.bdToA.draw();

     // Buffer de données vers IR
     lines = () => {
       line(this.x + (4 * padding) + regBufWidth - 10, this.y + padding + regBufHeight, this.x + (4 * padding)
       + regBufWidth - 10, this.y + (7.5 * padding) + regBufHeight);
       line(this.x + (4 * padding) + regBufWidth - 10, this.y + (7.5 * padding) + regBufHeight, this.x
       + (2 * padding) + regBufWidth + 113, this.y + (7.5 * padding) + regBufHeight);
     };
     this.bdToIr = new Bus(lines);
     this.bdToIr.draw();

     // Buffer de données vers Alu
     lines = () => {
       line(this.x + (4 * padding) + regBufWidth - 10, this.y + padding + regBufHeight, this.x + (4 * padding)
       + regBufWidth - 10, this.y + (11.5 * padding) + regBufHeight);
       line(this.x + (2 * padding) + 55, this.y + (11.5 * padding) + regBufHeight, this.x + (4 * padding)
       + regBufWidth - 10, this.y + (11.5 * padding) + regBufHeight);
     };
     this.bdToAlu = new Bus(lines);
     this.bdToAlu.draw();

     // Buffer de données vers S
     lines = () => {
       line(this.x + (4 * padding) + regBufWidth - 10, this.y + padding + regBufHeight, this.x + (4 * padding)
       + regBufWidth - 10, this.y + (11.5 * padding) + regBufHeight);
       line(this.x + (4 * padding) + regBufWidth - 10, this.y + (11.5 * padding) + regBufHeight, this.x +
       (2 * padding) + regBufWidth + 113, this.y + (11.5 * padding) + regBufHeight);
     };
     this.bdToS = new Bus(lines);
     this.bdToS.draw();

     // Buffer d'adresses vers PC
     lines = () => {
       line(this.x + cpuWidth - (2 * padding) - 10, this.y + padding + regBufHeight, this.x + cpuWidth -
       (2 * padding) - 10, this.y + (3.5 * padding) + regBufHeight);
       line(this.x + cpuWidth - (3 * padding), this.y + (3.5 * padding) + regBufHeight, this.x + cpuWidth
        - (2 * padding) - 10,this.y + (3.5 * padding) + regBufHeight);
     };
     this.baToPc = new Bus(lines);
     this.baToPc.draw();

     // Buffer d'adresses vers P
     lines = () => {
       line(this.x + cpuWidth - (2 * padding) - 10, this.y + padding + regBufHeight, this.x + cpuWidth -
       (2 * padding) - 10, this.y + (5.5 * padding) + regBufHeight);
       line(this.x + cpuWidth - (3 * padding), this.y + (5.5 * padding) + regBufHeight, this.x + cpuWidth
        - (2 * padding) - 10,this.y + (5.5 * padding) + regBufHeight);
     };
     this.baToP = new Bus(lines);
     this.baToP.draw();

     // Buffer d'adresses vers Ir
     lines = () => {
       line(this.x + cpuWidth - (2 * padding) - 10, this.y + padding + regBufHeight, this.x + cpuWidth -
       (2 * padding) - 10, this.y + (7.5 * padding) + regBufHeight);
       line(this.x + cpuWidth - (3 * padding), this.y + (7.5 * padding) + regBufHeight, this.x + cpuWidth
       - (2 * padding) - 10,this.y + (7.5 * padding) + regBufHeight);
     };
     this.baToIr = new Bus(lines);
     this.baToIr.draw();

     // Bus entre IR et Decoder
     lines = () => {
       line(this.x + cpuWidth - (3 * padding) - 10, this.y + (4 * padding) + (5 * regBufHeight),
       this.x + cpuWidth - (3 * padding) - 10, this.y + (4 * padding) + (5 * regBufHeight) + 25);
     };
     this.irToDecoder = new Bus(lines);
     this.irToDecoder.draw();

     // Bus entre Decoder et Status
     lines = () => {
       line(this.x + cpuWidth - (5 * padding) + 5, this.y + (6 * padding) + (6 * regBufHeight) - 12,
       this.x + cpuWidth - (5 * padding) + 5, this.y + (6 * padding) + (6 * regBufHeight));
     };
     this.decoderToS = new Bus(lines);
     this.decoderToS.draw();
  }

  /********* Fetch-Decode *********/
  // Le cycle Execute est realisé dans la class Decoder

  cycleFDE() {
    this.step += 1;

    if (this.shouldSkipFD == false) {
      switch (this.step) {
        case 1: this.fetch1(); break;
        case 2: this.fetch2(); break;
        case 3: this.fetch3(); break;
        case 4: this.fetch4(); break;
        case 5: this.fetch5(); break;
        case 6: this.fetch6(); break;
        case 7: this.decode1(); break;
        default: this.instruction.cycle(this);
      }
    } else {
      switch (this.step) {
        case 1: this.performFetchDecode(); break;
        default: this.instruction.cycle(this);
      }
    }

  }

  performFetchDecode() {

    if (isProgrammeOver) {
      drawIndicator();
    }
    this.lowlight();
    this.cycles += 1;

    this.addressBuffer.value = this.programCounter.getData();
    this.addressBuffer.redrawBuffer();
    this.dataBuffer.value = memory.getData(this.addressBuffer.value);
    this.dataBuffer.redrawBuffer();
    this.programCounter.incrementBy(0x01);
    this.programCounter.redrawRegister();
    this.instructions.setData(this.dataBuffer.value);
    this.instructions.redrawRegister();
    this.instruction = this.decoder.searchInstruction(this.instructions.getData());

    // Change de page memoire si l'adresse n'est pas visible
    if (memory.isAddressDrawn(this.addressBuffer.value) == false) {
      memory.startAddress = this.addressBuffer.value;
      memory.redrawMemory();
    }

    this.decoder.highlight();

    if (this.instruction == false) {  // Aucune instruction correspondante trouvé dans le decoder
      this.step = 0;
      isProgrammeOver = true;
      drawInfoBox();
    } else {
      this.step = 7; // Pour pouvoir continuer le cycle Execute car on commence à l'etape 8 (voir Decoder)
      this.cycles += this.instruction.cycles - 1;
      if (this.instruction == BRK) {
        isProgrammeOver = true;
      } else {
        isProgrammeOver = false;
      }
      drawInfoBox();
    }
  }

  showAD() {
    this.AD.drawRegister(this.x + (7.5 * 25), this.y + 25, true);
  }

  hideAD() {
    noStroke();
    fill(255);
    rect(this.x + (7.7 * 25), this.y + 25, regBufWidth - 5, regBufHeight + 1);
  }

  lowlight() {
    this.irToDecoder.lowlight();
    this.decoder.lowlight();
    this.status.lowlight();
    this.decoderToS.lowlight();
    this.bdToS.lowlight();
    this.stackPointer.lowlight();
    addressBus.lowlight();
    controlBus.lowlight();
    dataBus.lowlight();
    hideControleInfo();
    memory.lowlight(cpu.addressBuffer.value);
  }

  fetch1() { // ProgramCounter
    if (isProgrammeOver) {
      drawIndicator();
    }
    this.lowlight();
    this.programCounter.highlight();
    this.baToPc.highlight();
    this.cycles += 1;
  }

  fetch2() { // Adresse buffer
    this.programCounter.lowlight();
    this.addressBuffer.highlight();
    this.addressBuffer.value = this.programCounter.getData();
    this.addressBuffer.redrawBuffer();
    this.baToPc.lowlight();
    addressBus.highlight();
  }

  fetch3() { // Memoire
    let address = this.addressBuffer.value;
    this.addressBuffer.lowlight();
    memory.highlight(address);
    addressBus.lowlight()
  }

  fetch4() { // Data buffer
    memory.lowlight(this.addressBuffer.value);
    this.dataBuffer.value = memory.getData(this.addressBuffer.value);
    this.dataBuffer.redrawBuffer();
    this.dataBuffer.highlight();
    controlBus.highlight();
    dataBus.highlight();
    showControleInfo("Read");
  }

  fetch5() { // Increment de programCounter
    this.dataBuffer.lowlight();
    this.programCounter.incrementBy(0x01);
    this.programCounter.redrawRegister();
    this.programCounter.highlight();
    controlBus.lowlight();
    dataBus.lowlight();
    hideControleInfo();
  }

  fetch6() { // Data vers IR
    this.programCounter.lowlight();
    this.instructions.setData(this.dataBuffer.value);
    this.instructions.redrawRegister();
    this.instructions.highlight();
    this.bdToIr.highlight();
  }

  decode1() {
    this.instructions.lowlight();
    this.decoder.highlight();
    this.bdToIr.lowlight();
    this.irToDecoder.highlight();

    this.instruction = this.decoder.searchInstruction(this.instructions.getData());

    if (this.instruction == false) {  // Aucune instruction correspondante trouvé dans le decoder
      this.step = 0;
      isProgrammeOver = true;
      drawInfoBox();
    } else {
      this.cycles += this.instruction.cycles - 1;
      if (this.instruction == BRK) {
        isProgrammeOver = true;
      } else {
        isProgrammeOver = false;
      }
      drawInfoBox();

    }
  }


}
