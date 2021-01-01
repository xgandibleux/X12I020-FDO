  class Decoder {

  constructor() {

    this.listOfInstructions = [ASLacc, CLC, BRK, CLV, CLI, LDAimm, DEX, DEY, INX, INY, LSR, NOP, TAX, TAY, TSX,
      TXA, TXS, TYA, SEI, SEC, ROL, ADCimm, LDXimm, LDYimm, ANDimm, CMPimm, CPXimm, CPYimm, LDAzerop, ADCzerop,
      LDXzerop, LDYzerop, ANDzerop, STAzerop, STXzerop, STYzerop, CMPzerop, CPXzerop, CPYzerop, LDAindY,
      ADCindY, ANDindY, CMPindY, STAindY, ADCzeropX, ANDzeropX, CMPzeropX, LDAzeropX, LDYzeropX, STAzeropX,
      STYzeropX, LDXzeropY, STXzeropY, ADCindX, ANDindX, CMPindX, LDAindX, STAindX, BCC, BCS, BEQ, BNE, BMI,
      BPL, BVC, BVS, ADCabs, ANDabs, CMPabs, CPYabs, CPXabs, LDAabs, LDXabs, LDYabs, STAabs, STXabs, STYabs,
      ADCabsX, ADCabsY, ANDabsX, ANDabsY, CMPabsX, CMPabsY, LDAabsX, LDAabsY, LDXabsY, LDYabsX, STAabsX,
      STAabsY, JMPabs, JMPind, JSR, RTS, ASLzerop, ASLzeropX, ASLabs, ASLabsX, LSRabs, LSRabsX, LSRzerop,
      LSRzeropX, ROLabs, ROLabsX, ROLzerop, ROLzeropX, ROR, RORabs, RORabsX, RORzerop, RORzeropX, INCabs,
      INCabsX, INCzerop, INCzeropX, DECabs, DECabsX, DECzerop, DECzeropX, ORAimm, ORAabs, ORAabsX, ORAabsY,
      ORAindX, ORAindY, ORAzerop, ORAzeropX, EORabs, EORimm, EORabsX, EORabsY, EORindX, EORindY, EORzerop,
      EORzeropX, PHA, PHP, PLA, SBCabs, SBCimm, SBCabsX, SBCabsY, SBCindX, SBCindY, SBCzerop, SBCzeropX, PLP,
      BITabs, BITzerop];
  }

  searchInstruction(instruction) {
    for (let i = 0; i < this.listOfInstructions.length; i++) {
      if (this.listOfInstructions[i].opCode == instruction) {
        return this.listOfInstructions[i]
      }
    }
    return false
  }

  drawDecoder(x, y) {
    const padding = 5;

    this.x = x;
    this.y = y;

    // Le contour du decoder
    stroke(0);
    fill(255);
    strokeWeight(1);
    rect(x, y, regBufWidth, regBufHeight * 1.5);

    // Le titre
    fill(0);
    strokeWeight(0);
    textSize(titleSize);
    let textX = this.x + (regBufWidth / 4);
    let textY = this.y + (regBufHeight / 1.5) - (titleSize / 3);
    text("Decoder", textX, textY, textRegBufWidth, numberSize);

  }

  redrawDecoder() {
    // Cache le decodeur precedent
    noStroke();
    fill(255);
    rect(this.x, this.y, regBufWidth, regBufHeight * 1.5);

    this.drawRegister(this.x, this.y);
  }

  highlight() {
    fill(0, 0, 0, 0);
    strokeWeight(1);
    stroke(255, 0, 0);
    rect(this.x, this.y, regBufWidth, regBufHeight * 1.5);
    stroke(0);
    fill(255);
  }

  lowlight() {
    fill(0, 0, 0, 0);
    strokeWeight(1);
    stroke(0);
    rect(this.x, this.y, regBufWidth, regBufHeight * 1.5);
    fill(255);
  }

}

function setNZFlag(data, cpu) {
  cpu.status.negativeFlag(data);
  cpu.status.zeroFlag(data);
  cpu.status.redrawRegister();
  cpu.status.highlight();
}

// Addressage implicite

function immediate1(cpu) {
  cpu.decoder.lowlight();
  cpu.irToDecoder.lowlight();
  cpu.programCounter.highlight();
  cpu.baToPc.highlight();
  cpu.addressBuffer.value = cpu.programCounter.getData();
  cpu.addressBuffer.redrawBuffer();
  cpu.addressBuffer.highlight();
}

function immediate2(cpu) {
  cpu.programCounter.lowlight();
  cpu.baToPc.lowlight();
  cpu.addressBuffer.lowlight();
  addressBus.highlight();
  memory.highlight(cpu.addressBuffer.value);
}

function immediate3(cpu) {
  addressBus.lowlight();
  memory.lowlight(cpu.addressBuffer.value);
  dataBus.highlight();
  cpu.dataBuffer.value = memory.getData(cpu.addressBuffer.value);
  cpu.dataBuffer.redrawBuffer();
  cpu.dataBuffer.highlight();
  controlBus.highlight();
  showControleInfo("Read");
}

function immediate4(cpu) {
  controlBus.lowlight();
  cpu.dataBuffer.lowlight()
  hideControleInfo();
  dataBus.lowlight();
  cpu.programCounter.incrementBy(1);
  cpu.programCounter.redrawRegister();
  cpu.programCounter.highlight();
}

// Adressage zero page
// Etant donné que le debut de l'adressage zero page correspond à l'adressage immediat
// les premieres fonctions d'adressage zero page sont immediate1 2 3 4

function zerop5(cpu) {
  cpu.programCounter.lowlight();
  cpu.dataBuffer.highlight();
}

function zerop6(cpu) {
  cpu.dataBuffer.lowlight();
  cpu.addressBuffer.value = cpu.dataBuffer.value;
  cpu.addressBuffer.redrawBuffer();
  cpu.addressBuffer.highlight();
}

function zerop7(cpu) {
  cpu.addressBuffer.lowlight();
  addressBus.highlight();
  memory.highlight(cpu.addressBuffer.value);
}

function zerop8(cpu) {
  addressBus.lowlight();
  memory.lowlight(cpu.addressBuffer.value);
  dataBus.highlight();
  cpu.dataBuffer.value = memory.getData(cpu.addressBuffer.value);
  cpu.dataBuffer.redrawBuffer();
  cpu.dataBuffer.highlight();
  controlBus.highlight();
  showControleInfo("Read");
}

// Adressage absolue

function absolute1(cpu) {
  dataBus.lowlight();
  controlBus.lowlight();
  hideControleInfo();
  cpu.dataBuffer.lowlight();
  cpu.programCounter.lowlight();
  cpu.AD.setData(cpu.dataBuffer.value);
  cpu.showAD();
  cpu.AD.highlight();
}

function absolute2(cpu) {
  cpu.AD.lowlight();
  cpu.addressBuffer.value = cpu.programCounter.getData();
  cpu.addressBuffer.redrawBuffer();
  cpu.addressBuffer.highlight();
  cpu.baToPc.highlight();
}

function absoluteInd2(cpu) {
  cpu.baToPc.lowlight();
  cpu.AD.lowlight();
  cpu.addressBuffer.incrementBy(0x01);
  cpu.addressBuffer.redrawBuffer();
  cpu.addressBuffer.highlight();
}

function absolute3(cpu) {
  cpu.baToPc.lowlight();
  cpu.addressBuffer.lowlight();
  addressBus.highlight();
  memory.highlight(cpu.addressBuffer.value);
}

function absolute4(cpu) {
  addressBus.lowlight();
  dataBus.highlight();
  memory.lowlight(cpu.addressBuffer.value);
  cpu.dataBuffer.value = memory.getData(cpu.addressBuffer.value);
  cpu.dataBuffer.redrawBuffer();
  cpu.dataBuffer.highlight();
  controlBus.highlight();
  showControleInfo("Read");
}

function absolute5(cpu) {
  dataBus.lowlight();
  cpu.dataBuffer.lowlight();
  controlBus.lowlight();
  hideControleInfo();
  let dataStr = cpu.AD.formatValue().slice(4);
  cpu.AD.setData(parseInt((cpu.dataBuffer.value.toString(16) + dataStr), 16));
  cpu.hideAD();
  cpu.showAD();
  cpu.AD.highlight();
}

function absolute6(cpu) {
  cpu.AD.lowlight();
  cpu.hideAD();
  cpu.addressBuffer.value = cpu.AD.getData();
  cpu.addressBuffer.redrawBuffer();
  cpu.addressBuffer.highlight();
}

function absolute7(cpu) {
  cpu.addressBuffer.lowlight();
  addressBus.highlight();
  memory.highlight(cpu.addressBuffer.value);
}

function absolute8(cpu) {
  addressBus.lowlight();
  dataBus.highlight();
  memory.lowlight(cpu.addressBuffer.value);
  cpu.dataBuffer.value = memory.getData(cpu.addressBuffer.value);
  cpu.dataBuffer.redrawBuffer();
  cpu.dataBuffer.highlight();
  controlBus.highlight();
  showControleInfo("Read");
}

function absolute9(cpu) {
  cpu.dataBuffer.lowlight();
  hideControleInfo();
  dataBus.lowlight();
  controlBus.lowlight();
  cpu.addressBuffer.lowlight();
  cpu.programCounter.incrementBy(1);
  cpu.programCounter.redrawRegister();
  cpu.programCounter.highlight();
}

function absoluteX1(cpu) {
  cpu.indexX.highlight();
}

function absoluteX2(cpu) {
  cpu.addressBuffer.lowlight();
  cpu.indexX.lowlight();
  cpu.alu.highlight();
  cpu.alu.addIndex(cpu.indexX.getData(), cpu.addressBuffer.value, cpu);
}

function absoluteX3(cpu) {
  cpu.alu.lowlight();
  cpu.addressBuffer.redrawBuffer();
  cpu.addressBuffer.highlight();
}

function absoluteY1(cpu) {
  cpu.indexY.highlight();
}

function absoluteY2(cpu) {
  cpu.addressBuffer.lowlight();
  cpu.indexY.lowlight();
  cpu.alu.highlight();
  cpu.alu.addIndex(cpu.indexY.getData(), cpu.addressBuffer.value, cpu);
}

function absoluteY3(cpu) {
  cpu.alu.lowlight();
  cpu.addressBuffer.redrawBuffer();
  cpu.addressBuffer.highlight();
}

function absoluteInd1(cpu) {
  cpu.AD.lowlight();
  cpu.addressBuffer.incrementBy(1);
  cpu.addressBuffer.redrawBuffer();
  cpu.addressBuffer.highlight();
}

//  Addresage ind x

function indX1(cpu) {
  dataBus.lowlight();
  controlBus.lowlight();
  hideControleInfo();
  cpu.programCounter.lowlight();
  cpu.dataBuffer.highlight();
  cpu.indexX.highlight();
}

function indX2(cpu) {
  cpu.indexX.lowlight();
  cpu.dataBuffer.lowlight();
  cpu.alu.highlight();
  cpu.alu.addIndex(cpu.dataBuffer.value, cpu.indexX.getData(), cpu);
}

function indX3(cpu) {
  cpu.alu.lowlight();
  cpu.addressBuffer.redrawBuffer();
  cpu.addressBuffer.highlight();
}

function indX4(cpu) {
  cpu.addressBuffer.lowlight();
  addressBus.highlight();
  memory.highlight(cpu.addressBuffer.value);
}

function indX5(cpu) {
  addressBus.lowlight();
  memory.lowlight(cpu.addressBuffer.value);
  dataBus.highlight();
  cpu.dataBuffer.value = memory.getData(cpu.addressBuffer.value);
  cpu.dataBuffer.redrawBuffer();
  cpu.dataBuffer.highlight();
  controlBus.highlight();
  showControleInfo("Read");
}

// Pour ST
function indX6(cpu) {
  controlBus.lowlight();
  cpu.dataBuffer.lowlight()
  hideControleInfo();
  dataBus.lowlight();
  cpu.addressBuffer.value = cpu.dataBuffer.value
  cpu.addressBuffer.redrawBuffer();
  cpu.addressBuffer.highlight();
}

//  Addresage ind16 x

function ind16X1(cpu) {
  cpu.indexX.highlight();
}

function ind16X2(cpu) {
  cpu.indexX.lowlight();
  cpu.addressBuffer.lowlight()
  cpu.alu.highlight();
  cpu.alu.addIndex(cpu.addressBuffer.value, cpu.indexX.getData(), cpu);
}

//  Addresage ind y

function indY1(cpu) {
  dataBus.lowlight();
  controlBus.lowlight();
  hideControleInfo();
  cpu.programCounter.lowlight();
  cpu.indexY.highlight();
  cpu.dataBuffer.highlight();
}

function indY2(cpu) {
  cpu.dataBuffer.lowlight();
  cpu.indexY.lowlight();
  cpu.alu.highlight();
  cpu.alu.addIndex(cpu.dataBuffer.value, cpu.indexY.getData(), cpu);
}

function indY3(cpu) {
  cpu.alu.lowlight();
  cpu.addressBuffer.redrawBuffer();
  cpu.addressBuffer.highlight();
}

function indY4(cpu) {
  cpu.addressBuffer.lowlight();
  addressBus.highlight();
  memory.highlight(cpu.addressBuffer.value);
}

function indY5(cpu) {
  addressBus.lowlight();
  memory.lowlight(cpu.addressBuffer.value);
  dataBus.highlight();
  cpu.dataBuffer.value = memory.getData(cpu.addressBuffer.value);
  cpu.dataBuffer.redrawBuffer();
  cpu.dataBuffer.highlight();
  controlBus.highlight();
  showControleInfo("Read");
}

// Pour ST
function indY6(cpu) {
  controlBus.lowlight();
  cpu.dataBuffer.lowlight()
  hideControleInfo();
  dataBus.lowlight();
  cpu.addressBuffer.value = cpu.dataBuffer.value
  cpu.addressBuffer.redrawBuffer();
  cpu.addressBuffer.highlight();
}

//  Addresage ind16 y

function ind16Y1(cpu) {
  cpu.indexY.highlight();
}

function ind16Y2(cpu) {
  cpu.indexY.lowlight();
  cpu.addressBuffer.lowlight()
  cpu.alu.highlight();
  cpu.alu.addIndex(cpu.addressBuffer.value, cpu.indexY.getData(), cpu);
}

// Indirect index x

function indirectIndX1(cpu) {
  cpu.decoder.lowlight();
  cpu.irToDecoder.lowlight();
  cpu.programCounter.lowlight();
  cpu.dataBuffer.highlight();
  cpu.indexX.highlight();
}

function indirectIndX2(cpu) {
  cpu.dataBuffer.lowlight();
  cpu.indexX.lowlight();
  cpu.alu.highlight();
  cpu.alu.addIndex(cpu.indexX.getData(), cpu.dataBuffer.value, cpu);
}

function indirectIndX3(cpu) {
  cpu.alu.lowlight();
  cpu.addressBuffer.redrawBuffer();
  cpu.addressBuffer.highlight();
}

function indirectIndX4(cpu) {
  cpu.addressBuffer.lowlight();
  addressBus.highlight();
  memory.highlight(cpu.addressBuffer.value);
}

function indirectIndX5(cpu) {
  addressBus.lowlight();
  memory.lowlight(cpu.addressBuffer.value);
  dataBus.highlight();
  cpu.dataBuffer.value = memory.getData(cpu.addressBuffer.value);
  cpu.dataBuffer.redrawBuffer();
  cpu.dataBuffer.highlight();
  controlBus.highlight();
  showControleInfo("Read");
}

function indirectIndX6(cpu) {
  controlBus.lowlight();
  cpu.dataBuffer.lowlight()
  hideControleInfo();
  dataBus.lowlight();
  cpu.programCounter.incrementBy(1);
  cpu.programCounter.redrawRegister();
  cpu.programCounter.highlight();
}

/******************
* Declaration des cycles executes
******************/

// ADC

function adcExecute1(cpu) {
  controlBus.lowlight();
  cpu.dataBuffer.lowlight()
  hideControleInfo();
  dataBus.lowlight();
  cpu.programCounter.lowlight();
  cpu.accumulator.highlight();
  cpu.dataBuffer.highlight();
}

function adcExecute2(cpu) {
  cpu.bdToA.lowlight();
  cpu.accumulator.lowlight();
  cpu.dataBuffer.lowlight();
  cpu.alu.highlight();
  cpu.alu.adc(cpu.accumulator.getData(), cpu.dataBuffer.value, cpu);
}

function adcExecute3(cpu) {
  cpu.alu.lowlight();
  cpu.accumulator.redrawRegister();
  cpu.accumulator.highlight();
}

function adcExecute4(cpu) {
  cpu.accumulator.lowlight();
  setNZFlag(cpu.accumulator.getData(), cpu);
  cpu.status.redrawRegister();
  cpu.status.highlight();
  cpu.step = 0;
}

// SBC

function sbcExecute1(cpu) {
  controlBus.lowlight();
  cpu.dataBuffer.lowlight()
  hideControleInfo();
  dataBus.lowlight();
  cpu.programCounter.lowlight();
  cpu.accumulator.highlight();
  cpu.dataBuffer.highlight();
}

function sbcExecute2(cpu) {
  cpu.bdToA.lowlight();
  cpu.accumulator.lowlight();
  cpu.dataBuffer.lowlight();
  cpu.alu.highlight();
  cpu.alu.sbc(cpu.accumulator.getData(), cpu.dataBuffer.value, cpu);
}

function sbcExecute3(cpu) {
  cpu.alu.lowlight();
  cpu.accumulator.redrawRegister();
  cpu.accumulator.highlight();
}

function sbcExecute4(cpu) {
  cpu.accumulator.lowlight();
  setNZFlag(cpu.accumulator.getData(), cpu);
  cpu.status.redrawRegister();
  cpu.status.highlight();
  cpu.step = 0;
}

// LDA

function ldaExecute1(cpu) {
  controlBus.lowlight();
  cpu.dataBuffer.lowlight()
  hideControleInfo();
  dataBus.lowlight();
  cpu.addressBuffer.lowlight()
  cpu.bdToA.highlight();
  cpu.programCounter.lowlight();
  cpu.accumulator.setData(cpu.dataBuffer.value);
  cpu.accumulator.redrawRegister();
  cpu.accumulator.highlight();
}

function ldaExecute2(cpu) {
  cpu.accumulator.lowlight();
  cpu.bdToA.lowlight();
  cpu.bdToS.highlight();

  let data = cpu.dataBuffer.value;
  setNZFlag(data, cpu);

  cpu.status.redrawRegister();
  cpu.status.highlight();
  cpu.step = 0;
}

// LDX

function ldxExecute1(cpu) {
  controlBus.lowlight();
  cpu.dataBuffer.lowlight()
  hideControleInfo();
  dataBus.lowlight();
  cpu.programCounter.lowlight();
  cpu.bdToX.highlight();
  cpu.indexX.setData(cpu.dataBuffer.value);
  cpu.indexX.redrawRegister();
  cpu.indexX.highlight();
}

function ldxExecute2(cpu) {
  cpu.indexX.lowlight();
  cpu.bdToX.lowlight();
  cpu.bdToS.highlight();

  let data = cpu.dataBuffer.value;
  setNZFlag(data, cpu);

  cpu.status.redrawRegister();
  cpu.status.highlight();
  cpu.step = 0;
}

// LDY

function ldyExecute1(cpu) {
  controlBus.lowlight();
  cpu.dataBuffer.lowlight()
  hideControleInfo();
  dataBus.lowlight();
  cpu.programCounter.lowlight();
  cpu.bdToY.highlight();
  cpu.indexY.setData(cpu.dataBuffer.value);
  cpu.indexY.redrawRegister();
  cpu.indexY.highlight();
}

function ldyExecute2(cpu) {
  cpu.indexY.lowlight();
  cpu.bdToY.lowlight();
  cpu.bdToS.highlight();

  let data = cpu.dataBuffer.value;
  setNZFlag(data, cpu);

  cpu.status.redrawRegister();
  cpu.status.highlight();
  cpu.step = 0;
}

// AND

function andExecute1(cpu) {
  controlBus.lowlight();
  cpu.dataBuffer.lowlight()
  hideControleInfo();
  dataBus.lowlight();
  cpu.programCounter.lowlight();
  cpu.accumulator.highlight();
  cpu.dataBuffer.highlight();
}

function andExecute2(cpu) {
  cpu.dataBuffer.lowlight();
  cpu.accumulator.lowlight();
  cpu.alu.highlight();
  cpu.alu.and(cpu.accumulator.getData(), cpu.dataBuffer.value, cpu);
}

function andExecute3(cpu) {
  cpu.alu.lowlight();
  cpu.accumulator.redrawRegister();
  cpu.accumulator.highlight();
}

function andExecute4(cpu) {
  cpu.accumulator.lowlight();
  setNZFlag(cpu.accumulator.getData(), cpu);
  cpu.status.redrawRegister();
  cpu.status.highlight();
  cpu.step = 0;
}

// AND

function bitExecute1(cpu) {
  controlBus.lowlight();
  cpu.dataBuffer.lowlight()
  hideControleInfo();
  dataBus.lowlight();
  cpu.programCounter.lowlight();
  cpu.accumulator.highlight();
  cpu.dataBuffer.highlight();
}

function bitExecute2(cpu) {
  cpu.dataBuffer.lowlight();
  cpu.accumulator.lowlight();
  cpu.alu.highlight();
  cpu.alu.bit(cpu.accumulator.getData(), cpu.dataBuffer.value, cpu);
}

function bitExecute3(cpu) {
  cpu.alu.lowlight();
  cpu.status.redrawRegister();
  cpu.status.highlight();
  cpu.step = 0;
}

// ORA

function oraExecute1(cpu) {
  controlBus.lowlight();
  cpu.dataBuffer.lowlight()
  hideControleInfo();
  dataBus.lowlight();
  cpu.programCounter.lowlight();
  cpu.accumulator.highlight();
  cpu.dataBuffer.highlight();
}

function oraExecute2(cpu) {
  cpu.dataBuffer.lowlight();
  cpu.accumulator.lowlight();
  cpu.alu.highlight();
  cpu.alu.or(cpu.accumulator.getData(), cpu.dataBuffer.value, cpu);
}

function oraExecute3(cpu) {
  cpu.alu.lowlight();
  cpu.accumulator.redrawRegister();
  cpu.accumulator.highlight();
}

function oraExecute4(cpu) {
  cpu.accumulator.lowlight();
  setNZFlag(cpu.accumulator.getData(), cpu);
  cpu.status.redrawRegister();
  cpu.status.highlight();
  cpu.step = 0;
}

// EOR

function eorExecute1(cpu) {
  controlBus.lowlight();
  cpu.dataBuffer.lowlight()
  hideControleInfo();
  dataBus.lowlight();
  cpu.programCounter.lowlight();
  cpu.accumulator.highlight();
  cpu.dataBuffer.highlight();
}

function eorExecute2(cpu) {
  cpu.dataBuffer.lowlight();
  cpu.accumulator.lowlight();
  cpu.alu.highlight();
  cpu.alu.xor(cpu.accumulator.getData(), cpu.dataBuffer.value, cpu);
}

function eorExecute3(cpu) {
  cpu.alu.lowlight();
  cpu.accumulator.redrawRegister();
  cpu.accumulator.highlight();
}

function eorExecute4(cpu) {
  cpu.accumulator.lowlight();
  setNZFlag(cpu.accumulator.getData(), cpu);
  cpu.status.redrawRegister();
  cpu.status.highlight();
  cpu.step = 0;
}

// ASL

function aslAExecute1(cpu) {
  cpu.decoder.lowlight();
  cpu.irToDecoder.lowlight();
  let accValue = cpu.accumulator.getData();
  cpu.alu.shiftLeftA(accValue, cpu);
  cpu.alu.highlight();
}

function aslAExecute2(cpu) {
  cpu.alu.lowlight();
  cpu.accumulator.redrawRegister();
  cpu.accumulator.highlight();
}

function aslAExecute3(cpu) {
  cpu.accumulator.lowlight();
  setNZFlag(cpu.accumulator.getData(), cpu);
  cpu.step = 0;
}

function aslExecute1(cpu, value) {
  cpu.programCounter.lowlight();
  controlBus.lowlight();
  cpu.dataBuffer.lowlight()
  hideControleInfo();
  dataBus.lowlight();
  cpu.bdToAlu.highlight();
  cpu.alu.shiftLeft(value, cpu);
  cpu.alu.highlight();
}

function aslExecute2(cpu) {
  cpu.alu.lowlight();
  cpu.bdToAlu.lowlight();
  cpu.dataBuffer.redrawBuffer();
  cpu.dataBuffer.highlight();
}

function aslExecute3(cpu) {
  cpu.dataBuffer.lowlight();
  addressBus.highlight();
  memory.highlight(cpu.addressBuffer.value);
}

function aslExecute4(cpu) {
  addressBus.lowlight();
  controlBus.highlight();
  dataBus.highlight();
  showControleInfo("Write");
  memory.setData(cpu.addressBuffer.value, cpu.dataBuffer.value);
  memory.redrawMemory();
  memory.highlight(cpu.addressBuffer.value);
  cpu.step = 0;
}

// LSR

function lsrAExecute1(cpu) {
  cpu.decoder.lowlight();
  cpu.irToDecoder.lowlight();
  let accValue = cpu.accumulator.getData();
  cpu.alu.shiftRightA(accValue, cpu);
  cpu.alu.highlight();
}

function lsrAExecute2(cpu) {
  cpu.alu.lowlight();
  cpu.accumulator.redrawRegister();
  cpu.accumulator.highlight();
}

function lsrAExecute3(cpu) {
  cpu.accumulator.lowlight();
  setNZFlag(cpu.accumulator.getData(), cpu);
  cpu.step = 0;
}

function lsrExecute1(cpu, value) {
  cpu.programCounter.lowlight();
  controlBus.lowlight();
  cpu.dataBuffer.lowlight()
  hideControleInfo();
  dataBus.lowlight();
  cpu.bdToAlu.highlight();
  cpu.alu.shiftRight(value, cpu);
  cpu.alu.highlight();
}

function lsrExecute2(cpu) {
  cpu.alu.lowlight();
  cpu.bdToAlu.lowlight();
  cpu.dataBuffer.redrawBuffer();
  cpu.dataBuffer.highlight();
}

function lsrExecute3(cpu) {
  cpu.dataBuffer.lowlight();
  addressBus.highlight();
  memory.highlight(cpu.addressBuffer.value);
}

function lsrExecute4(cpu) {
  addressBus.lowlight();
  controlBus.highlight();
  dataBus.highlight();
  showControleInfo("Write");
  memory.setData(cpu.addressBuffer.value, cpu.dataBuffer.value);
  memory.redrawMemory();
  memory.highlight(cpu.addressBuffer.value);
  cpu.step = 0;
}

// STA

function staExecute1(cpu) {
  cpu.addressBuffer.lowlight();
  controlBus.lowlight();
  cpu.dataBuffer.lowlight()
  hideControleInfo();
  dataBus.lowlight();
  cpu.addressBuffer.lowlight();
  cpu.programCounter.lowlight();
  cpu.accumulator.highlight();
}

function staExecute2(cpu) {
  cpu.accumulator.lowlight();
  cpu.dataBuffer.value = cpu.accumulator.getData();
  cpu.dataBuffer.redrawBuffer();
  cpu.dataBuffer.highlight();
  cpu.bdToA.highlight();
}

function staExecute3(cpu) {
  cpu.dataBuffer.lowlight();
  cpu.bdToA.lowlight();
  addressBus.highlight();
  memory.highlight(cpu.addressBuffer.value);
}

function staExecute4(cpu) {
  addressBus.lowlight();
  controlBus.highlight();
  dataBus.highlight();
  showControleInfo("Write");
  memory.setData(cpu.addressBuffer.value, cpu.dataBuffer.value);
  memory.redrawMemory();
  memory.highlight(cpu.addressBuffer.value);
  cpu.step = 0;
}

// STX

function stxExecute1(cpu) {
  cpu.addressBuffer.lowlight();
  cpu.programCounter.lowlight();
  cpu.addressBuffer.lowlight();
  cpu.indexX.highlight();
}

function stxExecute2(cpu) {
  cpu.indexX.lowlight();
  cpu.dataBuffer.value = cpu.indexX.getData();
  cpu.dataBuffer.redrawBuffer();
  cpu.dataBuffer.highlight();
  cpu.bdToX.highlight();
}

function stxExecute3(cpu) {
  cpu.dataBuffer.lowlight();
  cpu.bdToX.lowlight();
  addressBus.highlight();
  memory.highlight(cpu.addressBuffer.value);
}

function stxExecute4(cpu) {
  addressBus.lowlight();
  controlBus.highlight();
  dataBus.highlight();
  showControleInfo("Write");
  memory.setData(cpu.addressBuffer.value, cpu.dataBuffer.value);
  memory.redrawMemory();
  memory.highlight(cpu.addressBuffer.value);
  cpu.step = 0;
}

// STY

function styExecute1(cpu) {
  cpu.addressBuffer.lowlight();
  cpu.programCounter.lowlight();
  cpu.addressBuffer.lowlight();
  cpu.indexY.highlight();
}

function styExecute2(cpu) {
  cpu.indexY.lowlight();
  cpu.dataBuffer.value = cpu.indexY.getData();
  cpu.dataBuffer.redrawBuffer();
  cpu.dataBuffer.highlight();
  cpu.bdToY.highlight();
}

function styExecute3(cpu) {
  cpu.dataBuffer.lowlight();
  cpu.bdToY.lowlight();
  addressBus.highlight();
  memory.highlight(cpu.addressBuffer.value);
}

function styExecute4(cpu) {
  addressBus.lowlight();
  controlBus.highlight();
  dataBus.highlight();
  showControleInfo("Write");
  memory.setData(cpu.addressBuffer.value, cpu.dataBuffer.value);
  memory.redrawMemory();
  memory.highlight(cpu.addressBuffer.value);
  cpu.step = 0;
}

// CMP

function cmpExecute1(cpu) {
  controlBus.lowlight();
  cpu.dataBuffer.lowlight()
  hideControleInfo();
  dataBus.lowlight();
  cpu.programCounter.lowlight();
  cpu.accumulator.highlight();
  cpu.dataBuffer.highlight();
}

function cmpExecute2(cpu) {
  cpu.dataBuffer.lowlight();
  cpu.accumulator.lowlight();
  cpu.alu.highlight();
}

function cmpExecute3(cpu) {
  cpu.alu.lowlight();
  cpu.alu.cmp(cpu.accumulator.getData(), cpu.dataBuffer.value, cpu);
  cpu.status.redrawRegister();
  cpu.status.highlight();
  cpu.step = 0;
}

// CPX

function cpxExecute1(cpu) {
  cpu.baToPc.lowlight();
  controlBus.lowlight();
  cpu.dataBuffer.lowlight()
  hideControleInfo();
  dataBus.lowlight();
  cpu.programCounter.lowlight();
  cpu.indexX.highlight();
  cpu.dataBuffer.highlight();
}

function cpxExecute2(cpu) {
  cpu.dataBuffer.lowlight();
  cpu.indexX.lowlight();
  cpu.alu.highlight();
}

function cpxExecute3(cpu) {
  cpu.alu.lowlight();
  cpu.alu.cpx(cpu.indexX.getData(), cpu.dataBuffer.value, cpu);
  cpu.status.redrawRegister();
  cpu.status.highlight();
  cpu.step = 0;
}

// CPY

function cpyExecute1(cpu) {
  cpu.baToPc.lowlight();
  controlBus.lowlight();
  cpu.dataBuffer.lowlight()
  hideControleInfo();
  dataBus.lowlight();
  cpu.programCounter.lowlight();
  cpu.indexY.highlight();
  cpu.dataBuffer.highlight();
}

function cpyExecute2(cpu) {
  cpu.dataBuffer.lowlight();
  cpu.indexY.lowlight();
  cpu.alu.highlight();
}

function cpyExecute3(cpu) {
  cpu.alu.lowlight();
  cpu.alu.cpy(cpu.indexY.getData(), cpu.dataBuffer.value, cpu);
  cpu.status.redrawRegister();
  cpu.status.highlight();
  cpu.step = 0;
}

// ROL

function rolAExecute1(cpu) {
  cpu.decoder.lowlight();
  cpu.irToDecoder.lowlight();
  let accValue = cpu.accumulator.getData();
  cpu.alu.rolA(accValue, cpu);
  cpu.alu.highlight();
}

function rolAExecute2(cpu) {
  cpu.alu.lowlight();
  cpu.accumulator.redrawRegister();
  cpu.accumulator.highlight();
}

function rolAExecute3(cpu) {
  cpu.accumulator.lowlight();
  setNZFlag(cpu.accumulator.getData(), cpu);
  cpu.step = 0;
}

function rolExecute1(cpu, value) {
  cpu.programCounter.lowlight();
  controlBus.lowlight();
  cpu.dataBuffer.lowlight()
  hideControleInfo();
  dataBus.lowlight();
  cpu.bdToAlu.highlight();
  cpu.alu.rol(value, cpu);
  cpu.alu.highlight();
}

function rolExecute2(cpu) {
  cpu.alu.lowlight();
  cpu.bdToAlu.lowlight();
  cpu.dataBuffer.redrawBuffer();
  cpu.dataBuffer.highlight();
  setNZFlag(cpu.dataBuffer.value, cpu);
}

function rolExecute3(cpu) {
  cpu.status.lowlight();
  cpu.dataBuffer.lowlight();
  addressBus.highlight();
  memory.highlight(cpu.addressBuffer.value);
}

function rolExecute4(cpu) {
  addressBus.lowlight();
  controlBus.highlight();
  dataBus.highlight();
  showControleInfo("Write");
  memory.setData(cpu.addressBuffer.value, cpu.dataBuffer.value);
  memory.redrawMemory();
  memory.highlight(cpu.addressBuffer.value);
  cpu.step = 0;
}

// ROR

function rorAExecute1(cpu) {
  cpu.decoder.lowlight();
  cpu.irToDecoder.lowlight();
  let accValue = cpu.accumulator.getData();
  cpu.alu.rorA(accValue, cpu);
  cpu.alu.highlight();
}

function rorAExecute2(cpu) {
  cpu.alu.lowlight();
  cpu.accumulator.redrawRegister();
  cpu.accumulator.highlight();
}

function rorAExecute3(cpu) {
  cpu.accumulator.lowlight();
  setNZFlag(cpu.accumulator.getData(), cpu);
  cpu.step = 0;
}

function rorExecute1(cpu, value) {
  cpu.programCounter.lowlight();
  controlBus.lowlight();
  cpu.dataBuffer.lowlight()
  hideControleInfo();
  dataBus.lowlight();
  cpu.bdToAlu.highlight();
  cpu.alu.ror(value, cpu);
  cpu.alu.highlight();
}

function rorExecute2(cpu) {
  cpu.alu.lowlight();
  cpu.bdToAlu.lowlight();
  cpu.dataBuffer.redrawBuffer();
  cpu.dataBuffer.highlight();
  setNZFlag(cpu.dataBuffer.value, cpu);
}

function rorExecute3(cpu) {
  cpu.status.lowlight();
  cpu.dataBuffer.lowlight();
  addressBus.highlight();
  memory.highlight(cpu.addressBuffer.value);
}

function rorExecute4(cpu) {
  addressBus.lowlight();
  controlBus.highlight();
  dataBus.highlight();
  showControleInfo("Write");
  memory.setData(cpu.addressBuffer.value, cpu.dataBuffer.value);
  memory.redrawMemory();
  memory.highlight(cpu.addressBuffer.value);
  cpu.step = 0;
}

// INC

function incExecute1(cpu, value) {
  cpu.programCounter.lowlight();
  controlBus.lowlight();
  cpu.dataBuffer.lowlight()
  hideControleInfo();
  dataBus.lowlight();
  cpu.bdToAlu.highlight();
  cpu.dataBuffer.incrementBy(0x01);
  cpu.alu.highlight();
}

function incExecute2(cpu) {
  cpu.alu.lowlight();
  cpu.bdToAlu.lowlight();
  cpu.dataBuffer.redrawBuffer();
  cpu.dataBuffer.highlight();
  setNZFlag(cpu.dataBuffer.value, cpu);
}

function incExecute3(cpu) {
  cpu.status.lowlight();
  cpu.dataBuffer.lowlight();
  addressBus.highlight();
  memory.highlight(cpu.addressBuffer.value);
}

function incExecute4(cpu) {
  addressBus.lowlight();
  controlBus.highlight();
  dataBus.highlight();
  showControleInfo("Write");
  memory.setData(cpu.addressBuffer.value, cpu.dataBuffer.value);
  memory.redrawMemory();
  memory.highlight(cpu.addressBuffer.value);
  cpu.step = 0;
}

// DEC

function decExecute1(cpu, value) {
  cpu.programCounter.lowlight();
  controlBus.lowlight();
  cpu.dataBuffer.lowlight()
  hideControleInfo();
  dataBus.lowlight();
  cpu.bdToAlu.highlight();
  cpu.dataBuffer.decrementBy(0x01);
  cpu.alu.highlight();
}

function decExecute2(cpu) {
  cpu.alu.lowlight();
  cpu.bdToAlu.lowlight();
  cpu.dataBuffer.redrawBuffer();
  cpu.dataBuffer.highlight();
  setNZFlag(cpu.dataBuffer.value, cpu);
}

function decExecute3(cpu) {
  cpu.status.lowlight();
  cpu.dataBuffer.lowlight();
  addressBus.highlight();
  memory.highlight(cpu.addressBuffer.value);
}

function decExecute4(cpu) {
  addressBus.lowlight();
  controlBus.highlight();
  dataBus.highlight();
  showControleInfo("Write");
  memory.setData(cpu.addressBuffer.value, cpu.dataBuffer.value);
  memory.redrawMemory();
  memory.highlight(cpu.addressBuffer.value);
  cpu.step = 0;
}

// Branch Operations

function branch1(cpu, condition) {
  if (condition == true) {
    cpu.dataBuffer.highlight();
  } else {
    cpu.programCounter.lowlight();
    cpu.step = 0;
  }
}

function branch2(cpu) {
  cpu.dataBuffer.lowlight();
  cpu.programCounter.lowlight();
  cpu.alu.highlight();
}

function branch3(cpu) {
  cpu.alu.addPC(cpu.dataBuffer.value, cpu.programCounter.getData(), cpu);
  cpu.alu.lowlight();
  cpu.programCounter.redrawRegister();
  cpu.programCounter.highlight();
  cpu.step = 0;
}

// Jump

function jump1(cpu) {
  cpu.AD.lowlight();
  cpu.hideAD();
  cpu.programCounter.setData(cpu.AD.getData());
  cpu.programCounter.redrawRegister();
  cpu.programCounter.highlight();
  cpu.step = 0;
}

/******************
* Declaration des instructions
******************/

/******** A *********/

let ADCimm = {
  name       : "ADC #n",
  opCode     : 0x69,
  cycles     : 2,
  bytes      : 2,
  addressing : "Immediate",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: adcExecute1(cpu); break;
      case 13: adcExecute2(cpu); break;
      case 14: adcExecute3(cpu); break;
      case 15: adcExecute4(cpu); break;
    }
  }
};

let ADCabs = {
  name       : "ADC nn",
  opCode     : 0x6D,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absolute7(cpu); break;
      case 19: absolute8(cpu); break;
      case 20: absolute9(cpu); break;
      case 21: adcExecute1(cpu); break;
      case 22: adcExecute2(cpu); break;
      case 23: adcExecute3(cpu); break;
      case 24: adcExecute4(cpu); break;
    }
  }
};

let ADCzerop = {
  name       : "ADC n",
  opCode     : 0x65,
  cycles     : 3,
  bytes      : 2,
  addressing : "Zero page",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: adcExecute1(cpu); break;
      case 17: adcExecute2(cpu); break;
      case 18: adcExecute3(cpu); break;
      case 19: adcExecute4(cpu); break;
    }
  }
};

let ADCindY = {
  name       : "ADC (n),Y",
  opCode     : 0x71,
  cycles     : 5,
  bytes      : 2,
  addressing : "Ind Y",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: absolute1(cpu); break;
      case 17: absoluteInd2(cpu); break;
      case 18: absolute3(cpu); break;
      case 19: absolute4(cpu); break;
      case 20: absolute5(cpu); break;
      case 21: absolute6(cpu); break;
      case 22: ind16Y1(cpu); break;
      case 23: ind16Y2(cpu); break;
      case 24: indY3(cpu); break;
      case 25: indY4(cpu); break;
      case 26: indY5(cpu); break;
      case 27: adcExecute1(cpu); break;
      case 28: adcExecute2(cpu); break;
      case 29: adcExecute3(cpu); break;
      case 30: adcExecute4(cpu); break;
    }
  }
};

let ADCzeropX = {
  name       : "ADC n,X",
  opCode     : 0x75,
  cycles     : 4,
  bytes      : 2,
  addressing : "Zero page X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indX1(cpu); break;
      case 13: indX2(cpu); break;
      case 14: indX3(cpu); break;
      case 15: indX4(cpu); break;
      case 16: indX5(cpu); break;
      case 17: adcExecute1(cpu); break;
      case 18: adcExecute2(cpu); break;
      case 19: adcExecute3(cpu); break;
      case 20: adcExecute4(cpu); break;
    }
  }
};

let ADCindX = {
  name       : "ADC (n,X)",
  opCode     : 0x61,
  cycles     : 6,
  bytes      : 2,
  addressing : "Ind X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indirectIndX1(cpu); break;
      case 13: indirectIndX2(cpu); break;
      case 14: indirectIndX3(cpu); break;
      case 15: indirectIndX4(cpu); break;
      case 16: indirectIndX5(cpu); break;
      case 17: indirectIndX6(cpu); break;
      case 18: absolute1(cpu); break;
      case 19: absoluteInd2(cpu); break;
      case 20: absolute3(cpu); break;
      case 21: absolute4(cpu); break;
      case 22: absolute5(cpu); break;
      case 23: absolute6(cpu); break;
      case 24: immediate2(cpu); break;
      case 25: immediate3(cpu); break;
      case 26: adcExecute1(cpu); break;
      case 27: adcExecute2(cpu); break;
      case 28: adcExecute3(cpu); break;
      case 29: adcExecute4(cpu); break;
    }
  }
};

let ADCabsX = {
  name       : "ADC nn,X",
  opCode     : 0x7D,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absoluteX1(cpu); break;
      case 19: absoluteX2(cpu); break;
      case 20: absoluteX3(cpu); break;
      case 21: absolute7(cpu); break;
      case 22: absolute8(cpu); break;
      case 23: absolute9(cpu); break;
      case 24: adcExecute1(cpu); break;
      case 25: adcExecute2(cpu); break;
      case 26: adcExecute3(cpu); break;
      case 27: adcExecute4(cpu); break;
    }
  }
};

let ADCabsY = {
  name       : "ADC nn,Y",
  opCode     : 0x79,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute Y",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absoluteY1(cpu); break;
      case 19: absoluteY2(cpu); break;
      case 20: absoluteY3(cpu); break;
      case 21: absolute7(cpu); break;
      case 22: absolute8(cpu); break;
      case 23: absolute9(cpu); break;
      case 24: adcExecute1(cpu); break;
      case 25: adcExecute2(cpu); break;
      case 26: adcExecute3(cpu); break;
      case 27: adcExecute4(cpu); break;
    }
  }
};

let ANDimm = {
  name       : "AND #n",
  opCode     : 0x29,
  cycles     : 2,
  bytes      : 2,
  addressing : "Immediate",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: andExecute1(cpu); break;
      case 13: andExecute2(cpu); break;
      case 14: andExecute3(cpu); break;
      case 15: andExecute4(cpu); break;
    }
  }
};

let ANDabs = {
  name       : "AND nn",
  opCode     : 0x2D,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absolute7(cpu); break;
      case 19: absolute8(cpu); break;
      case 20: absolute9(cpu); break;
      case 21: andExecute1(cpu); break;
      case 22: andExecute2(cpu); break;
      case 23: andExecute3(cpu); break;
      case 24: andExecute4(cpu); break;
    }
  }
};

let ANDzerop = {
  name       : "AND n",
  opCode     : 0x25,
  cycles     : 3,
  bytes      : 2,
  addressing : "Zero page",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: andExecute1(cpu); break;
      case 17: andExecute2(cpu); break;
      case 18: andExecute3(cpu); break;
      case 19: andExecute4(cpu); break;
    }
  }
};

let ANDindY = {
  name       : "AND (n),Y",
  opCode     : 0x31,
  cycles     : 5,
  bytes      : 2,
  addressing : "Ind Y",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: absolute1(cpu); break;
      case 17: absoluteInd2(cpu); break;
      case 18: absolute3(cpu); break;
      case 19: absolute4(cpu); break;
      case 20: absolute5(cpu); break;
      case 21: absolute6(cpu); break;
      case 22: ind16Y1(cpu); break;
      case 23: ind16Y2(cpu); break;
      case 24: indY3(cpu); break;
      case 25: indY4(cpu); break;
      case 26: indY5(cpu); break;
      case 27: andExecute1(cpu); break;
      case 28: andExecute2(cpu); break;
      case 29: andExecute3(cpu); break;
      case 30: andExecute4(cpu); break;
    }
  }
};

let ANDzeropX = {
  name       : "AND n,X",
  opCode     : 0x35,
  cycles     : 4,
  bytes      : 2,
  addressing : "Zero page X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indX1(cpu); break;
      case 13: indX2(cpu); break;
      case 14: indX3(cpu); break;
      case 15: indX4(cpu); break;
      case 16: indX5(cpu); break;
      case 17: andExecute1(cpu); break;
      case 18: andExecute2(cpu); break;
      case 19: andExecute3(cpu); break;
      case 20: andExecute4(cpu); break;
    }
  }
};

let ANDindX = {
  name       : "AND (n,X)",
  opCode     : 0x21,
  cycles     : 6,
  bytes      : 2,
  addressing : "Ind X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indirectIndX1(cpu); break;
      case 13: indirectIndX2(cpu); break;
      case 14: indirectIndX3(cpu); break;
      case 15: indirectIndX4(cpu); break;
      case 16: indirectIndX5(cpu); break;
      case 17: indirectIndX6(cpu); break;
      case 18: absolute1(cpu); break;
      case 19: absoluteInd2(cpu); break;
      case 20: absolute3(cpu); break;
      case 21: absolute4(cpu); break;
      case 22: absolute5(cpu); break;
      case 23: absolute6(cpu); break;
      case 24: immediate2(cpu); break;
      case 25: immediate3(cpu); break;
      case 26: andExecute1(cpu); break;
      case 27: andExecute2(cpu); break;
      case 28: andExecute3(cpu); break;
      case 29: andExecute4(cpu); break;
    }
  }
};

let ANDabsX = {
  name       : "AND nn,X",
  opCode     : 0x3D,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absoluteX1(cpu); break;
      case 19: absoluteX2(cpu); break;
      case 20: absoluteX3(cpu); break;
      case 21: absolute7(cpu); break;
      case 22: absolute8(cpu); break;
      case 23: absolute9(cpu); break;
      case 24: andExecute1(cpu); break;
      case 25: andExecute2(cpu); break;
      case 26: andExecute3(cpu); break;
      case 27: andExecute4(cpu); break;
    }
  }
};

let ANDabsY = {
  name       : "AND nn,Y",
  opCode     : 0x39,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute Y",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absoluteY1(cpu); break;
      case 19: absoluteY2(cpu); break;
      case 20: absoluteY3(cpu); break;
      case 21: absolute7(cpu); break;
      case 22: absolute8(cpu); break;
      case 23: absolute9(cpu); break;
      case 24: andExecute1(cpu); break;
      case 25: andExecute2(cpu); break;
      case 26: andExecute3(cpu); break;
      case 27: andExecute4(cpu); break;
    }
  }
};

let ASLacc = {
  name       : "ASL A",
  opCode     : 0x0A,
  cycles     : 2,
  bytes      : 1,
  addressing : "Accumulator",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: aslAExecute1(cpu); break;
      case 9: aslAExecute2(cpu); break;
      case 10: aslAExecute3(cpu); break;
    }
  }
};

let ASLzerop = {
  name       : "ASL n",
  opCode     : 0x06,
  cycles     : 5,
  bytes      : 2,
  addressing : "Zero page",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: aslExecute1(cpu, cpu.dataBuffer.value); break;
      case 17: aslExecute2(cpu); break;
      case 18: aslExecute3(cpu); break;
      case 19: aslExecute4(cpu); break;
    }
  }
};

let ASLzeropX = {
  name       : "ASL n,X",
  opCode     : 0x16,
  cycles     : 6,
  bytes      : 2,
  addressing : "Zero page X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indX1(cpu); break;
      case 13: indX2(cpu); break;
      case 14: indX3(cpu); break;
      case 15: indX4(cpu); break;
      case 16: indX5(cpu); break;
      case 17: aslExecute1(cpu, cpu.dataBuffer.value); break;
      case 18: aslExecute2(cpu); break;
      case 19: aslExecute3(cpu); break;
      case 20: aslExecute4(cpu); break;
    }
  }
};

let ASLabs = {
  name       : "ASL nn",
  opCode     : 0x0E,
  cycles     : 6,
  bytes      : 3,
  addressing : "Absolute",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absolute7(cpu); break;
      case 19: absolute8(cpu); break;
      case 20: absolute9(cpu); break;
      case 21: aslExecute1(cpu, cpu.dataBuffer.value); break;
      case 22: aslExecute2(cpu); break;
      case 23: aslExecute3(cpu); break;
      case 24: aslExecute4(cpu); break;
    }
  }
};

let ASLabsX = {
  name       : "ASL nn,X",
  opCode     : 0x1E,
  cycles     : 7,
  bytes      : 3,
  addressing : "Absolute X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absoluteX1(cpu); break;
      case 19: absoluteX2(cpu); break;
      case 20: absoluteX3(cpu); break;
      case 21: absolute7(cpu); break;
      case 22: absolute8(cpu); break;
      case 23: absolute9(cpu); break;
      case 24: aslExecute1(cpu, cpu.dataBuffer.value); break;
      case 25: aslExecute2(cpu); break;
      case 26: aslExecute3(cpu); break;
      case 27: aslExecute4(cpu); break;
    }
  }
};

/******** B *********/

let BCC = {
  name       : "BCC n",
  opCode     : 0x90,
  cycles     : 2,
  bytes      : 2,
  addressing : "Relative",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: branch1(cpu, cpu.status.status.carry == 0); break;
      case 13: branch2(cpu); break;
      case 14: branch3(cpu); break;
    }
  }
};

let BCS = {
  name       : "BCS n",
  opCode     : 0xB0,
  cycles     : 2,
  bytes      : 2,
  addressing : "Relative",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: branch1(cpu, cpu.status.status.carry == 1); break;
      case 13: branch2(cpu); break;
      case 14: branch3(cpu); break;
    }
  }
};

let BEQ = {
  name       : "BEQ n",
  opCode     : 0xF0,
  cycles     : 2,
  bytes      : 2,
  addressing : "Relative",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: branch1(cpu, cpu.status.status.zeroResult == 1); break;
      case 13: branch2(cpu); break;
      case 14: branch3(cpu); break;
    }
  }
};

let BNE = {
  name       : "BNE n",
  opCode     : 0xD0,
  cycles     : 2,
  bytes      : 2,
  addressing : "Relative",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: branch1(cpu, cpu.status.status.zeroResult == 0); break;
      case 13: branch2(cpu); break;
      case 14: branch3(cpu); break;
    }
  }
};

let BMI = {
  name       : "BMI n",
  opCode     : 0x30,
  cycles     : 2,
  bytes      : 2,
  addressing : "Relative",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: branch1(cpu, cpu.status.status.negativeResult == 1); break;
      case 13: branch2(cpu); break;
      case 14: branch3(cpu); break;
    }
  }
};

let BPL = {
  name       : "BPL n",
  opCode     : 0x10,
  cycles     : 2,
  bytes      : 2,
  addressing : "Relative",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: branch1(cpu, cpu.status.status.negativeResult == 0); break;
      case 13: branch2(cpu); break;
      case 14: branch3(cpu); break;
    }
  }
};

let BVC = {
  name       : "BVC n",
  opCode     : 0x50,
  cycles     : 2,
  bytes      : 2,
  addressing : "Relative",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: branch1(cpu, cpu.status.status.overflow == 0); break;
      case 13: branch2(cpu); break;
      case 14: branch3(cpu); break;
    }
  }
};

let BVS = {
  name       : "BVS n",
  opCode     : 0x70,
  cycles     : 2,
  bytes      : 2,
  addressing : "Relative",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: branch1(cpu, cpu.status.status.overflow == 1); break;
      case 13: branch2(cpu); break;
      case 14: branch3(cpu); break;
    }
  }
};

let BRK = {
  name       : "BRK",
  opCode     : 0x00,
  cycles     : 7,
  bytes      : 1,
  addressing : "None",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: this.execute1(cpu); break;
    }
  },

  execute1: function(cpu) {
    cpu.decoder.lowlight();
    cpu.irToDecoder.lowlight();
    cpu.status.status.break = 1;
    cpu.status.status.irqDisable = 1;
    cpu.status.redrawRegister();
    cpu.status.highlight();
    cpu.decoderToS.highlight();
    cpu.step = 0;
  }
};

let BITabs = {
  name       : "BIT nn",
  opCode     : 0x2C,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absolute7(cpu); break;
      case 19: absolute8(cpu); break;
      case 20: absolute9(cpu); break;
      case 21: bitExecute1(cpu); break;
      case 22: bitExecute2(cpu); break;
      case 23: bitExecute3(cpu); break;
    }
  }
};

let BITzerop = {
  name       : "BIT n",
  opCode     : 0x24,
  cycles     : 3,
  bytes      : 2,
  addressing : "Zero page",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: bitExecute1(cpu); break;
      case 17: bitExecute2(cpu); break;
      case 18: bitExecute3(cpu); break;
    }
  }
};

/******** C *********/

let CLC = {
  name       : "CLC",
  opCode     : 0x18,
  cycles     : 2,
  bytes      : 1,
  addressing : "None",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: this.execute1(cpu); break;
    }
  },

  execute1: function(cpu) {
    cpu.decoder.lowlight();
    cpu.irToDecoder.lowlight();
    cpu.status.status.carry = 0;
    cpu.status.redrawRegister();
    cpu.status.highlight();
    cpu.decoderToS.highlight();
    cpu.step = 0;
  }
};

let CLI = {
  name       : "CLI",
  opCode     : 0x58,
  cycles     : 2,
  bytes      : 1,
  addressing : "None",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: this.execute1(cpu); break;
    }
  },

  execute1: function(cpu) {
    cpu.decoder.lowlight();
    cpu.irToDecoder.lowlight();
    cpu.status.status.irqDisable = 0;
    cpu.status.redrawRegister();
    cpu.status.highlight();
    cpu.decoderToS.highlight();
    cpu.step = 0;
  }
};

let CLV = {
  name       : "CLV",
  opCode     : 0xB8,
  cycles     : 2,
  bytes      : 1,
  addressing : "None",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: this.execute1(cpu); break;
    }
  },

  execute1: function(cpu) {
    cpu.decoder.lowlight();
    cpu.irToDecoder.lowlight();
    cpu.status.status.overflow = 0;
    cpu.status.redrawRegister();
    cpu.status.highlight();
    cpu.decoderToS.highlight();
    cpu.step = 0;
  }
};

let CMPimm = {
  name       : "CMP #n",
  opCode     : 0xC9,
  cycles     : 2,
  bytes      : 2,
  addressing : "Immediate",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: cmpExecute1(cpu); break;
      case 13: cmpExecute2(cpu); break;
      case 14: cmpExecute3(cpu); break;
    }
  }
};

let CMPabs = {
  name       : "CMP nn",
  opCode     : 0xCD,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absolute7(cpu); break;
      case 19: absolute8(cpu); break;
      case 20: absolute9(cpu); break;
      case 21: cmpExecute1(cpu); break;
      case 22: cmpExecute2(cpu); break;
      case 23: cmpExecute3(cpu); break;
    }
  }
};


let CMPzerop = {
  name       : "CMP n",
  opCode     : 0xC5,
  cycles     : 3,
  bytes      : 2,
  addressing : "Zero page",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: cmpExecute1(cpu); break;
      case 17: cmpExecute2(cpu); break;
      case 18: cmpExecute3(cpu); break;
    }
  }
};

let CMPindY = {
  name       : "CMP (n),Y",
  opCode     : 0xD1,
  cycles     : 5,
  bytes      : 2,
  addressing : "Ind Y",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: absolute1(cpu); break;
      case 17: absoluteInd2(cpu); break;
      case 18: absolute3(cpu); break;
      case 19: absolute4(cpu); break;
      case 20: absolute5(cpu); break;
      case 21: absolute6(cpu); break;
      case 22: ind16Y1(cpu); break;
      case 23: ind16Y2(cpu); break;
      case 24: indY3(cpu); break;
      case 25: indY4(cpu); break;
      case 26: indY5(cpu); break;
      case 27: cmpExecute1(cpu); break;
      case 28: cmpExecute2(cpu); break;
      case 29: cmpExecute3(cpu); break;
    }
  }
};

let CMPzeropX = {
  name       : "CMP n,X",
  opCode     : 0xD5,
  cycles     : 4,
  bytes      : 2,
  addressing : "Zero page X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indX1(cpu); break;
      case 13: indX2(cpu); break;
      case 14: indX3(cpu); break;
      case 15: indX4(cpu); break;
      case 16: indX5(cpu); break;
      case 17: cmpExecute1(cpu); break;
      case 18: cmpExecute2(cpu); break;
      case 19: cmpExecute3(cpu); break;
    }
  }
};

let CMPindX = {
  name       : "CMP (n,X)",
  opCode     : 0xC1,
  cycles     : 6,
  bytes      : 2,
  addressing : "Ind X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indirectIndX1(cpu); break;
      case 13: indirectIndX2(cpu); break;
      case 14: indirectIndX3(cpu); break;
      case 15: indirectIndX4(cpu); break;
      case 16: indirectIndX5(cpu); break;
      case 17: indirectIndX6(cpu); break;
      case 18: absolute1(cpu); break;
      case 19: absoluteInd2(cpu); break;
      case 20: absolute3(cpu); break;
      case 21: absolute4(cpu); break;
      case 22: absolute5(cpu); break;
      case 23: absolute6(cpu); break;
      case 24: immediate2(cpu); break;
      case 25: immediate3(cpu); break;
      case 26: cmpExecute1(cpu); break;
      case 27: cmpExecute2(cpu); break;
      case 28: cmpExecute3(cpu); break;
    }
  }
};

let CMPabsX = {
  name       : "CMP nn,X",
  opCode     : 0xDD,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absoluteX1(cpu); break;
      case 19: absoluteX2(cpu); break;
      case 20: absoluteX3(cpu); break;
      case 21: absolute7(cpu); break;
      case 22: absolute8(cpu); break;
      case 23: absolute9(cpu); break;
      case 24: cmpExecute1(cpu); break;
      case 25: cmpExecute2(cpu); break;
      case 26: cmpExecute3(cpu); break;
    }
  }
};

let CMPabsY = {
  name       : "CMP nn,Y",
  opCode     : 0xD9,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute Y",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absoluteY1(cpu); break;
      case 19: absoluteY2(cpu); break;
      case 20: absoluteY3(cpu); break;
      case 21: absolute7(cpu); break;
      case 22: absolute8(cpu); break;
      case 23: absolute9(cpu); break;
      case 24: cmpExecute1(cpu); break;
      case 25: cmpExecute2(cpu); break;
      case 26: cmpExecute3(cpu); break
    }
  }
};

let CPXimm = {
  name       : "CPX #n",
  opCode     : 0xE0,
  cycles     : 2,
  bytes      : 2,
  addressing : "Immediate",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: cpxExecute1(cpu); break;
      case 13: cpxExecute2(cpu); break;
      case 14: cpxExecute3(cpu); break;
    }
  }
};

let CPXabs = {
  name       : "CPX nn",
  opCode     : 0xEC,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absolute7(cpu); break;
      case 19: absolute8(cpu); break;
      case 20: absolute9(cpu); break;
      case 21: cpxExecute1(cpu); break;
      case 22: cpxExecute2(cpu); break;
      case 23: cpxExecute3(cpu); break;
    }
  }
};

let CPXzerop = {
  name       : "CPX n",
  opCode     : 0xE4,
  cycles     : 3,
  bytes      : 2,
  addressing : "Zero page",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: cpxExecute1(cpu); break;
      case 17: cpxExecute2(cpu); break;
      case 18: cpxExecute3(cpu); break;
    }
  }
};

let CPYimm = {
  name       : "CPY #n",
  opCode     : 0xC0,
  cycles     : 2,
  bytes      : 2,
  addressing : "Immediate",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: cpyExecute1(cpu); break;
      case 13: cpyExecute2(cpu); break;
      case 14: cpyExecute3(cpu); break;
    }
  }
};

let CPYabs = {
  name       : "CPY nn",
  opCode     : 0xCC,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absolute7(cpu); break;
      case 19: absolute8(cpu); break;
      case 20: absolute9(cpu); break;
      case 21: cpyExecute1(cpu); break;
      case 22: cpyExecute2(cpu); break;
      case 23: cpyExecute3(cpu); break;
    }
  }
};

let CPYzerop = {
  name       : "CPY n",
  opCode     : 0xC4,
  cycles     : 3,
  bytes      : 2,
  addressing : "Zero page",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: cpyExecute1(cpu); break;
      case 17: cpyExecute2(cpu); break;
      case 18: cpyExecute3(cpu); break;
    }
  }
};

/******** D *********/

let DECzerop = {
  name       : "DEC n",
  opCode     : 0xC6,
  cycles     : 5,
  bytes      : 2,
  addressing : "Zero page",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: decExecute1(cpu, cpu.dataBuffer.value); break;
      case 17: decExecute2(cpu); break;
      case 18: decExecute3(cpu); break;
      case 19: decExecute4(cpu); break;
    }
  }
};

let DECzeropX = {
  name       : "DEC n,X",
  opCode     : 0xD6,
  cycles     : 6,
  bytes      : 2,
  addressing : "Zero page X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indX1(cpu); break;
      case 13: indX2(cpu); break;
      case 14: indX3(cpu); break;
      case 15: indX4(cpu); break;
      case 16: indX5(cpu); break;
      case 17: decExecute1(cpu, cpu.dataBuffer.value); break;
      case 18: decExecute2(cpu); break;
      case 19: decExecute3(cpu); break;
      case 20: decExecute4(cpu); break;
    }
  }
};

let DECabs = {
  name       : "DEC nn",
  opCode     : 0xCE,
  cycles     : 6,
  bytes      : 3,
  addressing : "Absolute",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absolute7(cpu); break;
      case 19: absolute8(cpu); break;
      case 20: absolute9(cpu); break;
      case 21: decExecute1(cpu, cpu.dataBuffer.value); break;
      case 22: decExecute2(cpu); break;
      case 23: decExecute3(cpu); break;
      case 24: decExecute4(cpu); break;
    }
  }
};

let DECabsX = {
  name       : "DEC nn,X",
  opCode     : 0xDE,
  cycles     : 7,
  bytes      : 3,
  addressing : "Absolute X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absoluteX1(cpu); break;
      case 19: absoluteX2(cpu); break;
      case 20: absoluteX3(cpu); break;
      case 21: absolute7(cpu); break;
      case 22: absolute8(cpu); break;
      case 23: absolute9(cpu); break;
      case 24: decExecute1(cpu, cpu.dataBuffer.value); break;
      case 25: decExecute2(cpu); break;
      case 26: decExecute3(cpu); break;
      case 27: decExecute4(cpu); break;
    }
  }
};

let DEX = {
  name       : "DEX",
  opCode     : 0xCA,
  cycles     : 2,
  bytes      : 1,
  addressing : "None",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: this.execute1(cpu); break;
      case 9: this.execute2(cpu); break;
      case 10: this.execute3(cpu); break;
      case 11: this.execute4(cpu); break;
    }
  },

  execute1: function(cpu) {
    cpu.decoder.lowlight();
    cpu.irToDecoder.lowlight();
    cpu.indexX.highlight();
  },

  execute2: function(cpu) {
    cpu.indexX.lowlight();
    cpu.alu.highlight();
  },

  execute3: function(cpu) {
    cpu.alu.lowlight();
    cpu.indexX.decrement();
    cpu.indexX.redrawRegister();
    cpu.indexX.highlight();
  },

  execute4: function(cpu) {
    cpu.indexX.lowlight();
    setNZFlag(cpu.indexX.getData(), cpu);
    cpu.step = 0;
  }
};

let DEY = {
  name       : "DEY",
  opCode     : 0x88,
  cycles     : 2,
  bytes      : 1,
  addressing : "None",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: this.execute1(cpu); break;
      case 9: this.execute2(cpu); break;
      case 10: this.execute3(cpu); break;
      case 11: this.execute4(cpu); break;
    }
  },

  execute1: function(cpu) {
    cpu.decoder.lowlight();
    cpu.irToDecoder.lowlight();
    cpu.indexY.highlight();
  },

  execute2: function(cpu) {
    cpu.indexY.lowlight();
    cpu.alu.highlight();
  },

  execute3: function(cpu) {
    cpu.alu.lowlight();
    cpu.indexY.decrement();
    cpu.indexY.redrawRegister();
    cpu.indexY.highlight();
  },

  execute4: function(cpu) {
    cpu.indexY.lowlight();
    setNZFlag(cpu.indexY.getData(), cpu);
    cpu.step = 0;
  }
};

/******** E *********/

let EORimm = {
  name       : "EOR #n",
  opCode     : 0x49,
  cycles     : 2,
  bytes      : 2,
  addressing : "Immediate",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: eorExecute1(cpu); break;
      case 13: eorExecute2(cpu); break;
      case 14: eorExecute3(cpu); break;
      case 15: eorExecute4(cpu); break;
    }
  }
};

let EORabs = {
  name       : "EOR nn",
  opCode     : 0x4D,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absolute7(cpu); break;
      case 19: absolute8(cpu); break;
      case 20: absolute9(cpu); break;
      case 21: eorExecute1(cpu); break;
      case 22: eorExecute2(cpu); break;
      case 23: eorExecute3(cpu); break;
      case 24: eorExecute4(cpu); break;
    }
  }
};

let EORzerop = {
  name       : "EOR n",
  opCode     : 0x45,
  cycles     : 3,
  bytes      : 2,
  addressing : "Zero page",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: eorExecute1(cpu); break;
      case 17: eorExecute2(cpu); break;
      case 18: eorExecute3(cpu); break;
      case 19: eorExecute4(cpu); break;
    }
  }
};

let EORindY = {
  name       : "EOR (n),Y",
  opCode     : 0x51,
  cycles     : 5,
  bytes      : 2,
  addressing : "Ind Y",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: absolute1(cpu); break;
      case 17: absoluteInd2(cpu); break;
      case 18: absolute3(cpu); break;
      case 19: absolute4(cpu); break;
      case 20: absolute5(cpu); break;
      case 21: absolute6(cpu); break;
      case 22: ind16Y1(cpu); break;
      case 23: ind16Y2(cpu); break;
      case 24: indY3(cpu); break;
      case 25: indY4(cpu); break;
      case 26: indY5(cpu); break;
      case 27: eorExecute1(cpu); break;
      case 28: eorExecute2(cpu); break;
      case 29: eorExecute3(cpu); break;
      case 30: eorExecute4(cpu); break;
    }
  }
};

let EORzeropX = {
  name       : "EOR n,X",
  opCode     : 0x55,
  cycles     : 4,
  bytes      : 2,
  addressing : "Zero page X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indX1(cpu); break;
      case 13: indX2(cpu); break;
      case 14: indX3(cpu); break;
      case 15: indX4(cpu); break;
      case 16: indX5(cpu); break;
      case 17: eorExecute1(cpu); break;
      case 18: eorExecute2(cpu); break;
      case 19: eorExecute3(cpu); break;
      case 20: eorExecute4(cpu); break;
    }
  }
};

let EORindX = {
  name       : "EOR (n,X)",
  opCode     : 0x41,
  cycles     : 6,
  bytes      : 2,
  addressing : "Ind X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indirectIndX1(cpu); break;
      case 13: indirectIndX2(cpu); break;
      case 14: indirectIndX3(cpu); break;
      case 15: indirectIndX4(cpu); break;
      case 16: indirectIndX5(cpu); break;
      case 17: indirectIndX6(cpu); break;
      case 18: absolute1(cpu); break;
      case 19: absoluteInd2(cpu); break;
      case 20: absolute3(cpu); break;
      case 21: absolute4(cpu); break;
      case 22: absolute5(cpu); break;
      case 23: absolute6(cpu); break;
      case 24: immediate2(cpu); break;
      case 25: immediate3(cpu); break;
      case 26: eorExecute1(cpu); break;
      case 27: eorExecute2(cpu); break;
      case 28: eorExecute3(cpu); break;
      case 29: eorExecute4(cpu); break;
    }
  }
};

let EORabsX = {
  name       : "EOR nn,X",
  opCode     : 0x5D,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absoluteX1(cpu); break;
      case 19: absoluteX2(cpu); break;
      case 20: absoluteX3(cpu); break;
      case 21: absolute7(cpu); break;
      case 22: absolute8(cpu); break;
      case 23: absolute9(cpu); break;
      case 24: eorExecute1(cpu); break;
      case 25: eorExecute2(cpu); break;
      case 26: eorExecute3(cpu); break;
      case 27: eorExecute4(cpu); break;
    }
  }
};

let EORabsY = {
  name       : "EOR nn,Y",
  opCode     : 0x59,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute Y",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absoluteY1(cpu); break;
      case 19: absoluteY2(cpu); break;
      case 20: absoluteY3(cpu); break;
      case 21: absolute7(cpu); break;
      case 22: absolute8(cpu); break;
      case 23: absolute9(cpu); break;
      case 24: eorExecute1(cpu); break;
      case 25: eorExecute2(cpu); break;
      case 26: eorExecute3(cpu); break;
      case 27: eorExecute4(cpu); break;
    }
  }
};

/******** I *********/

let INCzerop = {
  name       : "INC n",
  opCode     : 0xE6,
  cycles     : 5,
  bytes      : 2,
  addressing : "Zero page",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: incExecute1(cpu, cpu.dataBuffer.value); break;
      case 17: incExecute2(cpu); break;
      case 18: incExecute3(cpu); break;
      case 19: incExecute4(cpu); break;
    }
  }
};

let INCzeropX = {
  name       : "INC n,X",
  opCode     : 0xF6,
  cycles     : 6,
  bytes      : 2,
  addressing : "Zero page X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indX1(cpu); break;
      case 13: indX2(cpu); break;
      case 14: indX3(cpu); break;
      case 15: indX4(cpu); break;
      case 16: indX5(cpu); break;
      case 17: incExecute1(cpu, cpu.dataBuffer.value); break;
      case 18: incExecute2(cpu); break;
      case 19: incExecute3(cpu); break;
      case 20: incExecute4(cpu); break;
    }
  }
};

let INCabs = {
  name       : "INC nn",
  opCode     : 0xEE,
  cycles     : 6,
  bytes      : 3,
  addressing : "Absolute",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absolute7(cpu); break;
      case 19: absolute8(cpu); break;
      case 20: absolute9(cpu); break;
      case 21: incExecute1(cpu, cpu.dataBuffer.value); break;
      case 22: incExecute2(cpu); break;
      case 23: incExecute3(cpu); break;
      case 24: incExecute4(cpu); break;
    }
  }
};

let INCabsX = {
  name       : "INC nn,X",
  opCode     : 0xFE,
  cycles     : 7,
  bytes      : 3,
  addressing : "Absolute X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absoluteX1(cpu); break;
      case 19: absoluteX2(cpu); break;
      case 20: absoluteX3(cpu); break;
      case 21: absolute7(cpu); break;
      case 22: absolute8(cpu); break;
      case 23: absolute9(cpu); break;
      case 24: incExecute1(cpu, cpu.dataBuffer.value); break;
      case 25: incExecute2(cpu); break;
      case 26: incExecute3(cpu); break;
      case 27: incExecute4(cpu); break;
    }
  }
};

let INX = {
  name       : "INX",
  opCode     : 0xE8,
  cycles     : 2,
  bytes      : 1,
  addressing : "None",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: this.execute1(cpu); break;
      case 9: this.execute2(cpu); break;
      case 10: this.execute3(cpu); break;
      case 11: this.execute4(cpu); break;
    }
  },

  execute1: function(cpu) {
    cpu.decoder.lowlight();
    cpu.irToDecoder.lowlight();
    cpu.indexX.highlight();
  },

  execute2: function(cpu) {
    cpu.indexX.lowlight();
    cpu.alu.highlight();
  },

  execute3: function(cpu) {
    cpu.alu.lowlight();
    cpu.indexX.increment();
    cpu.indexX.redrawRegister();
    cpu.indexX.highlight();
  },

  execute4: function(cpu) {
    cpu.indexX.lowlight();
    setNZFlag(cpu.indexX.getData(), cpu);
    cpu.step = 0;
  }
};

let INY = {
  name       : "INY",
  opCode     : 0xC8,
  cycles     : 2,
  bytes      : 1,
  addressing : "None",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: this.execute1(cpu); break;
      case 9: this.execute2(cpu); break;
      case 10: this.execute3(cpu); break;
      case 11: this.execute4(cpu); break;
    }
  },

  execute1: function(cpu) {
    cpu.decoder.lowlight();
    cpu.irToDecoder.lowlight();
    cpu.indexY.highlight();
  },

  execute2: function(cpu) {
    cpu.indexY.lowlight();
    cpu.alu.highlight();
  },

  execute3: function(cpu) {
    cpu.alu.lowlight();
    cpu.indexY.increment();
    cpu.indexY.redrawRegister();
    cpu.indexY.highlight();
  },

  execute4: function(cpu) {
    cpu.indexY.lowlight();
    setNZFlag(cpu.indexY.getData(), cpu);
    cpu.step = 0;
  }
};

/******** J *********/

let JMPabs = {
  name       : "JMP nn",
  opCode     : 0x4C,
  cycles     : 3,
  bytes      : 3,
  addressing : "Absolute",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: jump1(cpu); break;
    }
  },
};

let JMPind = {
  name       : "JMP (nn)",
  opCode     : 0x6C,
  cycles     : 5,
  bytes      : 3,
  addressing : "Indirect",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absolute7(cpu); break;
      case 19: absolute8(cpu); break;
      case 20: absolute1(cpu); break;
      case 21: absoluteInd1(cpu); break;
      case 22: absolute7(cpu); break;
      case 23: absolute8(cpu); break;
      case 24: absolute5(cpu); break;
      case 25: jump1(cpu); break;
    }
  },
};

let JSR = {
  name       : "JSR nn",
  opCode     : 0x20,
  cycles     : 6,
  bytes      : 3,
  addressing : "Absolute",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: this.execute1(cpu); break;
      case 14: this.execute2(cpu); break;
      case 15: this.execute3(cpu); break;
      case 16: this.execute4(cpu); break;
      case 17: this.execute5(cpu); break;
      case 18: this.execute6(cpu); break;
      case 19: this.execute7(cpu); break;
      case 20: this.execute3(cpu); break;
      case 21: this.execute4(cpu); break;
      case 22: this.execute8(cpu); break;
      case 23: this.execute3(cpu); break;
      case 24: this.execute9(cpu); break;
      case 25: absolute5(cpu); break;
      case 26: this.execute10(cpu); break;
    }
  },

  execute1: function(cpu) {
    cpu.AD.lowlight();
    cpu.programCounter.lowlight();
    cpu.bdToPc.highlight();
    let pch = cpu.programCounter.formatValue().slice(2, 4);
    cpu.dataBuffer.value = pch;
    cpu.dataBuffer.redrawBuffer();
    cpu.dataBuffer.highlight();
  },

  execute2: function(cpu) {
    cpu.dataBuffer.lowlight();
    cpu.baToP.highlight();
    cpu.bdToPc.lowlight();
    cpu.addressBuffer.value = parseInt("01" + cpu.stackPointer.getData().toString(16).padStart(2, "0"), 16);
    cpu.addressBuffer.redrawBuffer();
    cpu.addressBuffer.highlight();
  },

  execute3: function(cpu) {
    cpu.baToP.lowlight();
    cpu.baToPc.lowlight();
    cpu.addressBuffer.lowlight();
    addressBus.highlight();
    memory.highlight(cpu.addressBuffer.value);
  },

  execute4: function(cpu) {
    addressBus.lowlight();
    controlBus.highlight();
    dataBus.highlight();
    showControleInfo("Write");
    memory.setData(cpu.addressBuffer.value, cpu.dataBuffer.value);
    memory.redrawMemory();
    memory.highlight(cpu.addressBuffer.value);
  },

  execute5: function(cpu) {
    controlBus.lowlight();
    dataBus.lowlight();
    hideControleInfo();
    memory.lowlight(cpu.addressBuffer.value);
    let pcl = cpu.programCounter.formatValue().slice(4, 6);
    cpu.dataBuffer.value = pcl;
    cpu.dataBuffer.redrawBuffer();
    cpu.dataBuffer.highlight();
    cpu.bdToPc.highlight();
  },

  execute6: function(cpu) {
    cpu.dataBuffer.lowlight();
    cpu.bdToPc.lowlight();
    cpu.stackPointer.decrement();
    cpu.stackPointer.redrawRegister();
    cpu.stackPointer.highlight();
  },

  execute7: function(cpu) {
    cpu.stackPointer.lowlight();
    cpu.baToP.highlight();
    cpu.baToPc.lowlight();
    cpu.addressBuffer.value = parseInt("01" + cpu.stackPointer.getData().toString(16).padStart(2, "0"), 16);
    cpu.addressBuffer.redrawBuffer();
    cpu.addressBuffer.highlight();
  },

  execute8: function(cpu) {
    controlBus.lowlight();
    dataBus.lowlight();
    hideControleInfo();
    memory.lowlight(cpu.addressBuffer.value);
    cpu.addressBuffer.value = cpu.programCounter.getData();
    cpu.addressBuffer.redrawBuffer();
    cpu.addressBuffer.highlight();
    cpu.baToPc.highlight();
  },

  execute9: function(cpu) {
    addressBus.lowlight();
    controlBus.highlight();
    dataBus.highlight();
    showControleInfo("Read");
    memory.lowlight(cpu.addressBuffer.value);
    cpu.dataBuffer.value = memory.getData(cpu.addressBuffer.value);
    cpu.dataBuffer.redrawBuffer();
    cpu.dataBuffer.highlight();
  },

  execute10: function(cpu) {
    cpu.AD.lowlight();
    cpu.hideAD();
    cpu.programCounter.setData(cpu.AD.getData());
    cpu.programCounter.redrawRegister();
    cpu.programCounter.highlight();
    cpu.step = 0;
  }
};

/******** L *********/

let LDAimm = {
  name       : "LDA #n",
  opCode     : 0xA9,
  cycles     : 2,
  bytes      : 2,
  addressing : "Immediate",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: ldaExecute1(cpu); break;
      case 13: ldaExecute2(cpu); break;
    }
  }
};

let LDAabs = {
  name       : "LDA nn",
  opCode     : 0xAD,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absolute7(cpu); break;
      case 19: absolute8(cpu); break;
      case 20: absolute9(cpu); break;
      case 21: ldaExecute1(cpu); break;
      case 22: ldaExecute2(cpu); break;
    }
  }
};

let LDAzerop = {
  name       : "LDA n",
  opCode     : 0xA5,
  cycles     : 3,
  bytes      : 2,
  addressing : "Zero page",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: ldaExecute1(cpu); break;
      case 17: ldaExecute2(cpu); break;
    }
  }
};

let LDAindY = {
  name       : "LDA (n),Y",
  opCode     : 0xB1,
  cycles     : 5,
  bytes      : 2,
  addressing : "Ind Y",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: absolute1(cpu); break;
      case 17: absoluteInd2(cpu); break;
      case 18: absolute3(cpu); break;
      case 19: absolute4(cpu); break;
      case 20: absolute5(cpu); break;
      case 21: absolute6(cpu); break;
      case 22: ind16Y1(cpu); break;
      case 23: ind16Y2(cpu); break;
      case 24: indY3(cpu); break;
      case 25: indY4(cpu); break;
      case 26: indY5(cpu); break;
      case 27: ldaExecute1(cpu); break;
      case 28: ldaExecute2(cpu); break;
    }
  }
};

let LDAzeropX = {
  name       : "LDA n,X",
  opCode     : 0xB5,
  cycles     : 4,
  bytes      : 2,
  addressing : "Zero page X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indX1(cpu); break;
      case 13: indX2(cpu); break;
      case 14: indX3(cpu); break;
      case 15: indX4(cpu); break;
      case 16: indX5(cpu); break;
      case 17: ldaExecute1(cpu); break;
      case 18: ldaExecute2(cpu); break;
    }
  }
};

let LDAindX = {
  name       : "LDA (n,X)",
  opCode     : 0xA1,
  cycles     : 6,
  bytes      : 2,
  addressing : "Ind X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indirectIndX1(cpu); break;
      case 13: indirectIndX2(cpu); break;
      case 14: indirectIndX3(cpu); break;
      case 15: indirectIndX4(cpu); break;
      case 16: indirectIndX5(cpu); break;
      case 17: indirectIndX6(cpu); break;
      case 18: absolute1(cpu); break;
      case 19: absoluteInd2(cpu); break;
      case 20: absolute3(cpu); break;
      case 21: absolute4(cpu); break;
      case 22: absolute5(cpu); break;
      case 23: absolute6(cpu); break;
      case 24: immediate2(cpu); break;
      case 25: immediate3(cpu); break;
      case 26: ldaExecute1(cpu); break;
      case 27: ldaExecute2(cpu); break;
    }
  }
};

let LDAabsX = {
  name       : "LDA nn,X",
  opCode     : 0xBD,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absoluteX1(cpu); break;
      case 19: absoluteX2(cpu); break;
      case 20: absoluteX3(cpu); break;
      case 21: absolute7(cpu); break;
      case 22: absolute8(cpu); break;
      case 23: absolute9(cpu); break;
      case 24: ldaExecute1(cpu); break;
      case 25: ldaExecute2(cpu); break;
    }
  }
};

let LDAabsY = {
  name       : "LDA nn,Y",
  opCode     : 0xB9,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute Y",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absoluteY1(cpu); break;
      case 19: absoluteY2(cpu); break;
      case 20: absoluteY3(cpu); break;
      case 21: absolute7(cpu); break;
      case 22: absolute8(cpu); break;
      case 23: absolute9(cpu); break;
      case 24: ldaExecute1(cpu); break;
      case 25: ldaExecute2(cpu); break;
    }
  }
};

let LDXimm = {
  name       : "LDX #n",
  opCode     : 0xA2,
  cycles     : 2,
  bytes      : 2,
  addressing : "Immediate",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: ldxExecute1(cpu); break;
      case 13: ldxExecute2(cpu); break;
    }
  }
};

let LDXabs = {
  name       : "LDX nn",
  opCode     : 0xAE,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absolute7(cpu); break;
      case 19: absolute8(cpu); break;
      case 20: absolute9(cpu); break;
      case 21: ldxExecute1(cpu); break;
      case 22: ldxExecute2(cpu); break;
    }
  }
};

let LDXzerop = {
  name       : "LDX n",
  opCode     : 0xA6,
  cycles     : 3,
  bytes      : 2,
  addressing : "Zero page",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: ldxExecute1(cpu); break;
      case 17: ldxExecute2(cpu); break;
    }
  }
};

let LDXabsY = {
  name       : "LDX nn,Y",
  opCode     : 0xBE,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute Y",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absoluteY1(cpu); break;
      case 19: absoluteY2(cpu); break;
      case 20: absoluteY3(cpu); break;
      case 21: absolute7(cpu); break;
      case 22: absolute8(cpu); break;
      case 23: absolute9(cpu); break;
      case 24: ldxExecute1(cpu); break;
      case 25: ldxExecute2(cpu); break;
    }
  }
};

let LDXzeropY = {
  name       : "LDX n,Y",
  opCode     : 0xB6,
  cycles     : 4,
  bytes      : 2,
  addressing : "Zero page Y",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indY1(cpu); break;
      case 13: indY2(cpu); break;
      case 14: indY3(cpu); break;
      case 15: indY4(cpu); break;
      case 16: indY5(cpu); break;
      case 17: ldxExecute1(cpu); break;
      case 18: ldxExecute2(cpu); break;
    }
  }
};

let LDYimm = {
  name       : "LDY #n",
  opCode     : 0xA0,
  cycles     : 2,
  bytes      : 2,
  addressing : "Immediate",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: ldyExecute1(cpu); break;
      case 13: ldyExecute2(cpu); break;
    }
  }
};

let LDYabs = {
  name       : "LDY nn",
  opCode     : 0xAC,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absolute7(cpu); break;
      case 19: absolute8(cpu); break;
      case 20: absolute9(cpu); break;
      case 21: ldyExecute1(cpu); break;
      case 22: ldyExecute2(cpu); break;
    }
  }
};

let LDYzerop = {
  name       : "LDY n",
  opCode     : 0xA4,
  cycles     : 3,
  bytes      : 2,
  addressing : "Zero page",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: ldyExecute1(cpu); break;
      case 17: ldyExecute2(cpu); break;
    }
  }
};

let LDYabsX = {
  name       : "LDY nn,X",
  opCode     : 0xBC,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absoluteX1(cpu); break;
      case 19: absoluteX2(cpu); break;
      case 20: absoluteX3(cpu); break;
      case 21: absolute7(cpu); break;
      case 22: absolute8(cpu); break;
      case 23: absolute9(cpu); break;
      case 24: ldyExecute1(cpu); break;
      case 25: ldyExecute2(cpu); break;
    }
  }
};

let LDYzeropX = {
  name       : "LDY n,X",
  opCode     : 0xB4,
  cycles     : 4,
  bytes      : 2,
  addressing : "Zero page X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indX1(cpu); break;
      case 13: indX2(cpu); break;
      case 14: indX3(cpu); break;
      case 15: indX4(cpu); break;
      case 16: indX5(cpu); break;
      case 17: ldyExecute1(cpu); break;
      case 18: ldyExecute2(cpu); break;
    }
  }
};

let LSR = {
  name       : "LSR A",
  opCode     : 0x4A,
  cycles     : 2,
  bytes      : 1,
  addressing : "Accumulator",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: lsrAExecute1(cpu); break;
      case 9: lsrAExecute2(cpu); break;
      case 10: lsrAExecute3(cpu); break;
    }
  }
};

let LSRzerop = {
  name       : "LSR n",
  opCode     : 0x46,
  cycles     : 5,
  bytes      : 2,
  addressing : "Zero page",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: lsrExecute1(cpu, cpu.dataBuffer.value); break;
      case 17: lsrExecute2(cpu); break;
      case 18: lsrExecute3(cpu); break;
      case 19: lsrExecute4(cpu); break;
    }
  }
};

let LSRzeropX = {
  name       : "LSR n,X",
  opCode     : 0x56,
  cycles     : 6,
  bytes      : 2,
  addressing : "Zero page X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indX1(cpu); break;
      case 13: indX2(cpu); break;
      case 14: indX3(cpu); break;
      case 15: indX4(cpu); break;
      case 16: indX5(cpu); break;
      case 17: lsrExecute1(cpu, cpu.dataBuffer.value); break;
      case 18: lsrExecute2(cpu); break;
      case 19: lsrExecute3(cpu); break;
      case 20: lsrExecute4(cpu); break;
    }
  }
};

let LSRabs = {
  name       : "LSR nn",
  opCode     : 0x4E,
  cycles     : 6,
  bytes      : 3,
  addressing : "Absolute",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absolute7(cpu); break;
      case 19: absolute8(cpu); break;
      case 20: absolute9(cpu); break;
      case 21: lsrExecute1(cpu, cpu.dataBuffer.value); break;
      case 22: lsrExecute2(cpu); break;
      case 23: lsrExecute3(cpu); break;
      case 24: lsrExecute4(cpu); break;
    }
  }
};

let LSRabsX = {
  name       : "LSR nn,X",
  opCode     : 0x5E,
  cycles     : 7,
  bytes      : 3,
  addressing : "Absolute X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absoluteX1(cpu); break;
      case 19: absoluteX2(cpu); break;
      case 20: absoluteX3(cpu); break;
      case 21: absolute7(cpu); break;
      case 22: absolute8(cpu); break;
      case 23: absolute9(cpu); break;
      case 24: lsrExecute1(cpu, cpu.dataBuffer.value); break;
      case 25: lsrExecute2(cpu); break;
      case 26: lsrExecute3(cpu); break;
      case 27: lsrExecute4(cpu); break;
    }
  }
};

/******** N *********/

let NOP = {
  name       : "NOP",
  opCode     : 0xEA,
  cycles     : 2,
  bytes      : 1,
  addressing : "None",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: this.execute1(cpu); break;
    }
  },

  execute1: function(cpu) {
    cpu.step = 0;
  }
};

/******** O *********/

let ORAimm = {
  name       : "ORA #n",
  opCode     : 0x09,
  cycles     : 2,
  bytes      : 2,
  addressing : "Immediate",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: oraExecute1(cpu); break;
      case 13: oraExecute2(cpu); break;
      case 14: oraExecute3(cpu); break;
      case 15: oraExecute4(cpu); break;
    }
  }
};

let ORAabs = {
  name       : "ORA nn",
  opCode     : 0x0D,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absolute7(cpu); break;
      case 19: absolute8(cpu); break;
      case 20: absolute9(cpu); break;
      case 21: oraExecute1(cpu); break;
      case 22: oraExecute2(cpu); break;
      case 23: oraExecute3(cpu); break;
      case 24: oraExecute4(cpu); break;
    }
  }
};

let ORAzerop = {
  name       : "ORA n",
  opCode     : 0x05,
  cycles     : 3,
  bytes      : 2,
  addressing : "Zero page",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: oraExecute1(cpu); break;
      case 17: oraExecute2(cpu); break;
      case 18: oraExecute3(cpu); break;
      case 19: oraExecute4(cpu); break;
    }
  }
};

let ORAindY = {
  name       : "ORA (n),Y",
  opCode     : 0x11,
  cycles     : 5,
  bytes      : 2,
  addressing : "Ind Y",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: absolute1(cpu); break;
      case 17: absoluteInd2(cpu); break;
      case 18: absolute3(cpu); break;
      case 19: absolute4(cpu); break;
      case 20: absolute5(cpu); break;
      case 21: absolute6(cpu); break;
      case 22: ind16Y1(cpu); break;
      case 23: ind16Y2(cpu); break;
      case 24: indY3(cpu); break;
      case 25: indY4(cpu); break;
      case 26: indY5(cpu); break;
      case 27: oraExecute1(cpu); break;
      case 28: oraExecute2(cpu); break;
      case 29: oraExecute3(cpu); break;
      case 30: oraExecute4(cpu); break;
    }
  }
};

let ORAzeropX = {
  name       : "ORA n,X",
  opCode     : 0x15,
  cycles     : 4,
  bytes      : 2,
  addressing : "Zero page X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indX1(cpu); break;
      case 13: indX2(cpu); break;
      case 14: indX3(cpu); break;
      case 15: indX4(cpu); break;
      case 16: indX5(cpu); break;
      case 17: oraExecute1(cpu); break;
      case 18: oraExecute2(cpu); break;
      case 19: oraExecute3(cpu); break;
      case 20: oraExecute4(cpu); break;
    }
  }
};

let ORAindX = {
  name       : "ORA (n,X)",
  opCode     : 0x01,
  cycles     : 6,
  bytes      : 2,
  addressing : "Ind X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indirectIndX1(cpu); break;
      case 13: indirectIndX2(cpu); break;
      case 14: indirectIndX3(cpu); break;
      case 15: indirectIndX4(cpu); break;
      case 16: indirectIndX5(cpu); break;
      case 17: indirectIndX6(cpu); break;
      case 18: absolute1(cpu); break;
      case 19: absoluteInd2(cpu); break;
      case 20: absolute3(cpu); break;
      case 21: absolute4(cpu); break;
      case 22: absolute5(cpu); break;
      case 23: absolute6(cpu); break;
      case 24: immediate2(cpu); break;
      case 25: immediate3(cpu); break;
      case 26: oraExecute1(cpu); break;
      case 27: oraExecute2(cpu); break;
      case 28: oraExecute3(cpu); break;
      case 29: oraExecute4(cpu); break;
    }
  }
};

let ORAabsX = {
  name       : "ORA nn,X",
  opCode     : 0x1D,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absoluteX1(cpu); break;
      case 19: absoluteX2(cpu); break;
      case 20: absoluteX3(cpu); break;
      case 21: absolute7(cpu); break;
      case 22: absolute8(cpu); break;
      case 23: absolute9(cpu); break;
      case 24: oraExecute1(cpu); break;
      case 25: oraExecute2(cpu); break;
      case 26: oraExecute3(cpu); break;
      case 27: oraExecute4(cpu); break;
    }
  }
};

let ORAabsY = {
  name       : "ORA nn,Y",
  opCode     : 0x19,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute Y",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absoluteY1(cpu); break;
      case 19: absoluteY2(cpu); break;
      case 20: absoluteY3(cpu); break;
      case 21: absolute7(cpu); break;
      case 22: absolute8(cpu); break;
      case 23: absolute9(cpu); break;
      case 24: oraExecute1(cpu); break;
      case 25: oraExecute2(cpu); break;
      case 26: oraExecute3(cpu); break;
      case 27: oraExecute4(cpu); break;
    }
  }
};

/******** P *********/

let PHA = {
  name       : "PHA",
  opCode     : 0x48,
  cycles     : 3,
  bytes      : 1,
  addressing : "None",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: this.execute1(cpu); break;
      case 9: this.execute2(cpu); break;
      case 10: this.execute3(cpu); break;
      case 11: this.execute4(cpu); break;
      case 12: this.execute5(cpu); break;
      case 13: this.execute6(cpu); break;
      case 14: this.execute7(cpu); break;
    }
  },

  execute1 : function(cpu) {
    cpu.decoder.lowlight();
    cpu.irToDecoder.lowlight();
    cpu.accumulator.highlight();
    cpu.dataBuffer.value = cpu.accumulator.getData();
  },

  execute2 : function(cpu) {
    cpu.accumulator.lowlight();
    cpu.dataBuffer.redrawBuffer();
    cpu.dataBuffer.highlight();
  },

  execute3 : function(cpu) {
    cpu.dataBuffer.lowlight();
    cpu.stackPointer.highlight();
    cpu.addressBuffer.value = parseInt("01" + cpu.stackPointer.getData().toString(16).padStart(2, "0"), 16);
  },

  execute4 : function(cpu) {
    cpu.stackPointer.lowlight();
    cpu.addressBuffer.redrawBuffer();
    cpu.addressBuffer.highlight();
  },

  execute5: function(cpu) {
    cpu.baToP.lowlight();
    cpu.baToPc.lowlight();
    cpu.addressBuffer.lowlight();
    addressBus.highlight();
    memory.highlight(cpu.addressBuffer.value);
  },

  execute6: function(cpu) {
    addressBus.lowlight();
    controlBus.highlight();
    dataBus.highlight();
    showControleInfo("Write");
    memory.setData(cpu.addressBuffer.value, cpu.dataBuffer.value);
    memory.redrawMemory();
    memory.highlight(cpu.addressBuffer.value);
  },

  execute7: function(cpu) {
    controlBus.lowlight();
    dataBus.lowlight();
    hideControleInfo();
    memory.lowlight(cpu.addressBuffer.value);
    cpu.stackPointer.decrement();
    cpu.stackPointer.redrawRegister();
    cpu.stackPointer.highlight();
    cpu.step = 0;
  },
};

let PHP = {
  name       : "PHP",
  opCode     : 0x08,
  cycles     : 3,
  bytes      : 1,
  addressing : "None",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: this.execute1(cpu); break;
      case 9: this.execute2(cpu); break;
      case 10: this.execute3(cpu); break;
      case 11: this.execute4(cpu); break;
      case 12: this.execute5(cpu); break;
      case 13: this.execute6(cpu); break;
      case 14: this.execute7(cpu); break;
    }
  },

  execute1 : function(cpu) {
    cpu.decoder.lowlight();
    cpu.irToDecoder.lowlight();
    cpu.status.highlight();
    cpu.dataBuffer.value = cpu.status.getData();
  },

  execute2 : function(cpu) {
    cpu.status.lowlight();
    cpu.dataBuffer.redrawBuffer();
    cpu.dataBuffer.highlight();
  },

  execute3 : function(cpu) {
    cpu.dataBuffer.lowlight();
    cpu.stackPointer.highlight();
    cpu.addressBuffer.value = parseInt("01" + cpu.stackPointer.getData().toString(16).padStart(2, "0"), 16);
  },

  execute4 : function(cpu) {
    cpu.stackPointer.lowlight();
    cpu.addressBuffer.redrawBuffer();
    cpu.addressBuffer.highlight();
  },

  execute5: function(cpu) {
    cpu.baToP.lowlight();
    cpu.baToPc.lowlight();
    cpu.addressBuffer.lowlight();
    addressBus.highlight();
    memory.highlight(cpu.addressBuffer.value);
  },

  execute6: function(cpu) {
    addressBus.lowlight();
    controlBus.highlight();
    dataBus.highlight();
    showControleInfo("Write");
    memory.setData(cpu.addressBuffer.value, cpu.dataBuffer.value);
    memory.redrawMemory();
    memory.highlight(cpu.addressBuffer.value);
  },

  execute7: function(cpu) {
    controlBus.lowlight();
    dataBus.lowlight();
    hideControleInfo();
    memory.lowlight(cpu.addressBuffer.value);
    cpu.stackPointer.decrement();
    cpu.stackPointer.redrawRegister();
    cpu.stackPointer.highlight();
    cpu.step = 0;
  },
};

let PLA = {
  name       : "PLA",
  opCode     : 0x68,
  cycles     : 4,
  bytes      : 1,
  addressing : "None",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: this.execute1(cpu); break;
      case 9: this.execute2(cpu); break;
      case 10: this.execute3(cpu); break;
      case 11: this.execute4(cpu); break;
      case 12: this.execute5(cpu); break;
      case 13: this.execute6(cpu); break;
    }
  },

  execute1 : function(cpu) {
    cpu.decoder.lowlight();
    cpu.irToDecoder.lowlight();
    cpu.stackPointer.incrementBy(0x01);
    cpu.stackPointer.redrawRegister();
    cpu.stackPointer.highlight();
    cpu.addressBuffer.value = parseInt("01" + cpu.stackPointer.getData().toString(16).padStart(2, "0"), 16);
  },

  execute2 : function(cpu) {
    cpu.stackPointer.lowlight();
    cpu.addressBuffer.redrawBuffer();
    cpu.addressBuffer.highlight();
  },

  execute3: function(cpu) {
    cpu.baToP.lowlight();
    cpu.baToPc.lowlight();
    cpu.addressBuffer.lowlight();
    addressBus.highlight();
    memory.highlight(cpu.addressBuffer.value);
  },

  execute4: function(cpu) {
    addressBus.lowlight();
    controlBus.highlight();
    dataBus.highlight();
    showControleInfo("Read");
    memory.lowlight(cpu.addressBuffer.value);
    cpu.dataBuffer.value = memory.getData(cpu.addressBuffer.value);
    cpu.dataBuffer.redrawBuffer();
    cpu.dataBuffer.highlight();
  },

  execute5: function(cpu) {
    cpu.dataBuffer.lowlight();
    controlBus.lowlight();
    dataBus.lowlight();
    hideControleInfo();
    cpu.accumulator.setData(cpu.dataBuffer.value);
    cpu.accumulator.redrawRegister();
    cpu.accumulator.highlight();
  },

  execute6: function(cpu) {
    setNZFlag(cpu.accumulator.getData(), cpu);
    cpu.accumulator.lowlight();
    cpu.status.highlight();
    cpu.step = 0;
  },
};

let PLP = {
  name       : "PLP",
  opCode     : 0x28,
  cycles     : 4,
  bytes      : 1,
  addressing : "None",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: this.execute1(cpu); break;
      case 9: this.execute2(cpu); break;
      case 10: this.execute3(cpu); break;
      case 11: this.execute4(cpu); break;
      case 12: this.execute5(cpu); break;
    }
  },

  execute1 : function(cpu) {
    cpu.decoder.lowlight();
    cpu.irToDecoder.lowlight();
    cpu.stackPointer.incrementBy(0x01);
    cpu.stackPointer.redrawRegister();
    cpu.stackPointer.highlight();
    cpu.addressBuffer.value = parseInt("01" + cpu.stackPointer.getData().toString(16).padStart(2, "0"), 16);
  },

  execute2 : function(cpu) {
    cpu.stackPointer.lowlight();
    cpu.addressBuffer.redrawBuffer();
    cpu.addressBuffer.highlight();
  },

  execute3: function(cpu) {
    cpu.baToP.lowlight();
    cpu.baToPc.lowlight();
    cpu.addressBuffer.lowlight();
    addressBus.highlight();
    memory.highlight(cpu.addressBuffer.value);
  },

  execute4: function(cpu) {
    addressBus.lowlight();
    controlBus.highlight();
    dataBus.highlight();
    showControleInfo("Read");
    memory.lowlight(cpu.addressBuffer.value);
    cpu.dataBuffer.value = memory.getData(cpu.addressBuffer.value);
    cpu.dataBuffer.redrawBuffer();
    cpu.dataBuffer.highlight();
  },

  execute5: function(cpu) {
    cpu.dataBuffer.lowlight();
    controlBus.lowlight();
    dataBus.lowlight();
    hideControleInfo();
    cpu.status.setStatus(cpu.dataBuffer.value);
    cpu.status.redrawRegister();
    cpu.status.highlight();
    cpu.step = 0;
  }
};


/******** R *********/

let ROL = {
  name       : "ROL A",
  opCode     : 0x2A,
  cycles     : 2,
  bytes      : 1,
  addressing : "Accumulator",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: rolAExecute1(cpu); break;
      case 9: rolAExecute2(cpu); break;
      case 10: rolAExecute3(cpu); break;
    }
  }
};

let ROLzerop = {
  name       : "ROL n",
  opCode     : 0x26,
  cycles     : 5,
  bytes      : 2,
  addressing : "Zero page",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: rolExecute1(cpu, cpu.dataBuffer.value); break;
      case 17: rolExecute2(cpu); break;
      case 18: rolExecute3(cpu); break;
      case 19: rolExecute4(cpu); break;
    }
  }
};

let ROLzeropX = {
  name       : "ROL n,X",
  opCode     : 0x36,
  cycles     : 6,
  bytes      : 2,
  addressing : "Zero page X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indX1(cpu); break;
      case 13: indX2(cpu); break;
      case 14: indX3(cpu); break;
      case 15: indX4(cpu); break;
      case 16: indX5(cpu); break;
      case 17: rolExecute1(cpu, cpu.dataBuffer.value); break;
      case 18: rolExecute2(cpu); break;
      case 19: rolExecute3(cpu); break;
      case 20: rolExecute4(cpu); break;
    }
  }
};

let ROLabs = {
  name       : "ROL nn",
  opCode     : 0x2E,
  cycles     : 6,
  bytes      : 3,
  addressing : "Absolute",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absolute7(cpu); break;
      case 19: absolute8(cpu); break;
      case 20: absolute9(cpu); break;
      case 21: rolExecute1(cpu, cpu.dataBuffer.value); break;
      case 22: rolExecute2(cpu); break;
      case 23: rolExecute3(cpu); break;
      case 24: rolExecute4(cpu); break;
    }
  }
};

let ROLabsX = {
  name       : "ROL nn,X",
  opCode     : 0x3E,
  cycles     : 7,
  bytes      : 3,
  addressing : "Absolute X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absoluteX1(cpu); break;
      case 19: absoluteX2(cpu); break;
      case 20: absoluteX3(cpu); break;
      case 21: absolute7(cpu); break;
      case 22: absolute8(cpu); break;
      case 23: absolute9(cpu); break;
      case 24: rolExecute1(cpu, cpu.dataBuffer.value); break;
      case 25: rolExecute2(cpu); break;
      case 26: rolExecute3(cpu); break;
      case 27: rolExecute4(cpu); break;
    }
  }
};

let ROR = {
  name       : "ROR A",
  opCode     : 0x6A,
  cycles     : 2,
  bytes      : 1,
  addressing : "Accumulator",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: rorAExecute1(cpu); break;
      case 9: rorAExecute2(cpu); break;
      case 10: rorAExecute3(cpu); break;
    }
  }
};

let RORzerop = {
  name       : "ROR n",
  opCode     : 0x66,
  cycles     : 5,
  bytes      : 2,
  addressing : "Zero page",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: rorExecute1(cpu, cpu.dataBuffer.value); break;
      case 17: rorExecute2(cpu); break;
      case 18: rorExecute3(cpu); break;
      case 19: rorExecute4(cpu); break;
    }
  }
};

let RORzeropX = {
  name       : "ROR n,X",
  opCode     : 0x76,
  cycles     : 6,
  bytes      : 2,
  addressing : "Zero page X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indX1(cpu); break;
      case 13: indX2(cpu); break;
      case 14: indX3(cpu); break;
      case 15: indX4(cpu); break;
      case 16: indX5(cpu); break;
      case 17: rorExecute1(cpu, cpu.dataBuffer.value); break;
      case 18: rorExecute2(cpu); break;
      case 19: rorExecute3(cpu); break;
      case 20: rorExecute4(cpu); break;
    }
  }
};

let RORabs = {
  name       : "ROR nn",
  opCode     : 0x6E,
  cycles     : 6,
  bytes      : 3,
  addressing : "Absolute",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absolute7(cpu); break;
      case 19: absolute8(cpu); break;
      case 20: absolute9(cpu); break;
      case 21: rorExecute1(cpu, cpu.dataBuffer.value); break;
      case 22: rorExecute2(cpu); break;
      case 23: rorExecute3(cpu); break;
      case 24: rorExecute4(cpu); break;
    }
  }
};

let RORabsX = {
  name       : "ROR nn,X",
  opCode     : 0x7E,
  cycles     : 7,
  bytes      : 3,
  addressing : "Absolute X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absoluteX1(cpu); break;
      case 19: absoluteX2(cpu); break;
      case 20: absoluteX3(cpu); break;
      case 21: absolute7(cpu); break;
      case 22: absolute8(cpu); break;
      case 23: absolute9(cpu); break;
      case 24: rorExecute1(cpu, cpu.dataBuffer.value); break;
      case 25: rorExecute2(cpu); break;
      case 26: rorExecute3(cpu); break;
      case 27: rorExecute4(cpu); break;
    }
  }
};

let RTS = {
  name       : "RTS",
  opCode     : 0x60,
  cycles     : 6,
  bytes      : 1,
  addressing : "None",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: this.execute1(cpu); break;
      case 9: this.execute2(cpu); break;
      case 10: this.execute3(cpu); break;
      case 11: this.execute4(cpu); break;
      case 12: this.execute5(cpu); break;
      case 13: this.execute6(cpu); break;
      case 14: this.execute2(cpu); break;
      case 15: this.execute3(cpu); break;
      case 16: this.execute4(cpu); break;
      case 17: this.execute7(cpu); break;
      case 18: this.execute8(cpu); break;
    }
  },

  execute1: function(cpu) {
    cpu.decoder.lowlight();
    cpu.irToDecoder.lowlight();
    cpu.stackPointer.highlight();
  },

  execute2: function(cpu) {
    cpu.stackPointer.lowlight();
    cpu.addressBuffer.value = parseInt("01" + cpu.stackPointer.getData().toString(16).padStart(2, "0"), 16);
    cpu.addressBuffer.redrawBuffer();
    cpu.addressBuffer.highlight();
  },

  execute3: function(cpu) {
    cpu.baToP.lowlight();
    cpu.baToPc.lowlight();
    cpu.addressBuffer.lowlight();
    addressBus.highlight();
    memory.highlight(cpu.addressBuffer.value);
  },

  execute4: function(cpu) {
    addressBus.lowlight();
    controlBus.highlight();
    dataBus.highlight();
    showControleInfo("READ");
    memory.lowlight(cpu.addressBuffer.value);
    cpu.dataBuffer.value = memory.getData(cpu.addressBuffer.value);
    cpu.dataBuffer.redrawBuffer();
    cpu.dataBuffer.highlight();
  },

  execute5: function(cpu) {
    cpu.dataBuffer.lowlight();
    controlBus.lowlight();
    dataBus.lowlight();
    hideControleInfo();
    let pch = cpu.programCounter.getData().toString(16).slice(2);
    cpu.programCounter.setData(parseInt(pch + cpu.dataBuffer.value.toString(16).padStart(2, "0"), 16));
    cpu.programCounter.redrawRegister();
    cpu.programCounter.highlight();
  },

  execute6: function(cpu) {
    cpu.programCounter.lowlight();
    cpu.stackPointer.incrementBy(0x01);
    cpu.stackPointer.redrawRegister();
    cpu.stackPointer.highlight();
  },

  execute7: function(cpu) {
    cpu.dataBuffer.lowlight();
    controlBus.lowlight();
    dataBus.lowlight();
    hideControleInfo();
    let pcl = cpu.programCounter.getData().toString(16).slice(2, 4);
    cpu.programCounter.setData(parseInt(cpu.dataBuffer.value.toString(16).padStart(2, "0") + pcl, 16));
    cpu.programCounter.redrawRegister();
    cpu.programCounter.highlight();
  },

  execute8: function(cpu) {
    cpu.programCounter.incrementBy(0x01);
    cpu.programCounter.redrawRegister();
    cpu.programCounter.highlight();
    cpu.step = 0;
  },
};

/******** S *********/

let SBCimm = {
  name       : "SBC #n",
  opCode     : 0xE9,
  cycles     : 2,
  bytes      : 2,
  addressing : "Immediate",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: sbcExecute1(cpu); break;
      case 13: sbcExecute2(cpu); break;
      case 14: sbcExecute3(cpu); break;
      case 15: sbcExecute4(cpu); break;
    }
  }
};

let SBCabs = {
  name       : "SBC nn",
  opCode     : 0xED,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absolute7(cpu); break;
      case 19: absolute8(cpu); break;
      case 20: absolute9(cpu); break;
      case 21: sbcExecute1(cpu); break;
      case 22: sbcExecute2(cpu); break;
      case 23: sbcExecute3(cpu); break;
      case 24: sbcExecute4(cpu); break;
    }
  }
};

let SBCzerop = {
  name       : "SBC n",
  opCode     : 0xE5,
  cycles     : 3,
  bytes      : 2,
  addressing : "Zero page",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: sbcExecute1(cpu); break;
      case 17: sbcExecute2(cpu); break;
      case 18: sbcExecute3(cpu); break;
      case 19: sbcExecute4(cpu); break;
    }
  }
};

let SBCindY = {
  name       : "SBC (n),Y",
  opCode     : 0xF1,
  cycles     : 5,
  bytes      : 2,
  addressing : "Ind Y",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: absolute1(cpu); break;
      case 17: absoluteInd2(cpu); break;
      case 18: absolute3(cpu); break;
      case 19: absolute4(cpu); break;
      case 20: absolute5(cpu); break;
      case 21: absolute6(cpu); break;
      case 22: ind16Y1(cpu); break;
      case 23: ind16Y2(cpu); break;
      case 24: indY3(cpu); break;
      case 25: indY4(cpu); break;
      case 26: indY5(cpu); break;
      case 27: sbcExecute1(cpu); break;
      case 28: sbcExecute2(cpu); break;
      case 29: sbcExecute3(cpu); break;
      case 30: sbcExecute4(cpu); break;
    }
  }
};

let SBCzeropX = {
  name       : "SBC n,X",
  opCode     : 0xF5,
  cycles     : 4,
  bytes      : 2,
  addressing : "Zero page X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indX1(cpu); break;
      case 13: indX2(cpu); break;
      case 14: indX3(cpu); break;
      case 15: indX4(cpu); break;
      case 16: indX5(cpu); break;
      case 17: sbcExecute1(cpu); break;
      case 18: sbcExecute2(cpu); break;
      case 19: sbcExecute3(cpu); break;
      case 20: sbcExecute4(cpu); break;
    }
  }
};

let SBCindX = {
  name       : "SBC (n,X)",
  opCode     : 0xE1,
  cycles     : 6,
  bytes      : 2,
  addressing : "Ind X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indirectIndX1(cpu); break;
      case 13: indirectIndX2(cpu); break;
      case 14: indirectIndX3(cpu); break;
      case 15: indirectIndX4(cpu); break;
      case 16: indirectIndX5(cpu); break;
      case 17: indirectIndX6(cpu); break;
      case 18: absolute1(cpu); break;
      case 19: absoluteInd2(cpu); break;
      case 20: absolute3(cpu); break;
      case 21: absolute4(cpu); break;
      case 22: absolute5(cpu); break;
      case 23: absolute6(cpu); break;
      case 24: immediate2(cpu); break;
      case 25: immediate3(cpu); break;
      case 26: sbcExecute1(cpu); break;
      case 27: sbcExecute2(cpu); break;
      case 28: sbcExecute3(cpu); break;
      case 29: sbcExecute4(cpu); break;
    }
  }
};

let SBCabsX = {
  name       : "ADC nn,X",
  opCode     : 0xFD,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absoluteX1(cpu); break;
      case 19: absoluteX2(cpu); break;
      case 20: absoluteX3(cpu); break;
      case 21: absolute7(cpu); break;
      case 22: absolute8(cpu); break;
      case 23: absolute9(cpu); break;
      case 24: sbcExecute1(cpu); break;
      case 25: sbcExecute2(cpu); break;
      case 26: sbcExecute3(cpu); break;
      case 27: sbcExecute4(cpu); break;
    }
  }
};

let SBCabsY = {
  name       : "SBC nn,Y",
  opCode     : 0xF9,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute Y",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absoluteY1(cpu); break;
      case 19: absoluteY2(cpu); break;
      case 20: absoluteY3(cpu); break;
      case 21: absolute7(cpu); break;
      case 22: absolute8(cpu); break;
      case 23: absolute9(cpu); break;
      case 24: sbcExecute1(cpu); break;
      case 25: sbcExecute2(cpu); break;
      case 26: sbcExecute3(cpu); break;
      case 27: sbcExecute4(cpu); break;
    }
  }
};

let SEC = {
  name       : "SEC",
  opCode     : 0x38,
  cycles     : 2,
  bytes      : 1,
  addressing : "None",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: this.execute1(cpu); break;
    }
  },

  execute1: function(cpu) {
    cpu.decoder.lowlight();
    cpu.irToDecoder.lowlight();
    cpu.status.status.carry = 1;
    cpu.status.redrawRegister();
    cpu.status.highlight();
    cpu.decoderToS.highlight();
    cpu.step = 0;
  }
};

let SEI = {
  name       : "SEI",
  opCode     : 0x78,
  cycles     : 2,
  bytes      : 1,
  addressing : "None",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: this.execute1(cpu); break;
    }
  },

  execute1: function(cpu) {
    cpu.decoder.lowlight();
    cpu.irToDecoder.lowlight();
    cpu.status.status.irqDisable = 1;
    cpu.status.redrawRegister();
    cpu.status.highlight();
    cpu.decoderToS.highlight();
    cpu.step = 0;
  }
};

let STAabs = {
  name       : "STA nn",
  opCode     : 0x8D,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absolute9(cpu); break;
      case 19: staExecute1(cpu); break;
      case 20: staExecute2(cpu); break;
      case 21: staExecute3(cpu); break;
      case 22: staExecute4(cpu); break;
    }
  }
};

let STAzerop = {
  name       : "STA n",
  opCode     : 0x85,
  cycles     : 3,
  bytes      : 2,
  addressing : "Zero page",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: staExecute1(cpu); break;
      case 15: staExecute2(cpu); break;
      case 16: staExecute3(cpu); break;
      case 17: staExecute4(cpu); break;
    }
  }
};

let STAindY = {
  name       : "STA (n),Y",
  opCode     : 0x91,
  cycles     : 6,
  bytes      : 2,
  addressing : "Ind Y",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: zerop7(cpu); break;
      case 15: zerop8(cpu); break;
      case 16: absolute1(cpu); break;
      case 17: absoluteInd2(cpu); break;
      case 18: absolute3(cpu); break;
      case 19: absolute4(cpu); break;
      case 20: absolute5(cpu); break;
      case 21: absolute6(cpu); break;
      case 22: ind16Y1(cpu); break;
      case 23: ind16Y2(cpu); break;
      case 24: indY3(cpu); break;
      case 25: staExecute1(cpu); break;
      case 26: staExecute2(cpu); break;
      case 27: staExecute3(cpu); break;
      case 28: staExecute4(cpu); break;
    }
  }
};

let STAzeropX = {
  name       : "STA n,X",
  opCode     : 0x95,
  cycles     : 4,
  bytes      : 2,
  addressing : "Zero page X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indX1(cpu); break;
      case 13: indX2(cpu); break;
      case 14: indX3(cpu); break;
      case 15: staExecute1(cpu); break;
      case 16: staExecute2(cpu); break;
      case 17: staExecute3(cpu); break;
      case 18: staExecute4(cpu); break;
    }
  }
};

let STAindX = {
  name       : "STA (n,X)",
  opCode     : 0x81,
  cycles     : 6,
  bytes      : 2,
  addressing : "Ind X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indirectIndX1(cpu); break;
      case 13: indirectIndX2(cpu); break;
      case 14: indirectIndX3(cpu); break;
      case 15: indirectIndX4(cpu); break;
      case 16: indirectIndX5(cpu); break;
      case 17: indirectIndX6(cpu); break;
      case 18: absolute1(cpu); break;
      case 19: absoluteInd2(cpu); break;
      case 20: absolute3(cpu); break;
      case 21: absolute4(cpu); break;
      case 22: absolute5(cpu); break;
      case 23: absolute6(cpu); break;
      case 24: staExecute1(cpu); break;
      case 25: staExecute2(cpu); break;
      case 26: staExecute3(cpu); break;
      case 27: staExecute4(cpu); break;
    }
  }
};

let STAabsX = {
  name       : "STA nn,X",
  opCode     : 0x9D,
  cycles     : 5,
  bytes      : 3,
  addressing : "Absolute X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absoluteX1(cpu); break;
      case 19: absoluteX2(cpu); break;
      case 20: absoluteX3(cpu); break;
      case 21: absolute9(cpu); break;
      case 22: staExecute1(cpu); break;
      case 23: staExecute2(cpu); break;
      case 24: staExecute3(cpu); break;
      case 25: staExecute4(cpu); break;
    }
  }
};

let STAabsY = {
  name       : "STA nn,Y",
  opCode     : 0x99,
  cycles     : 5,
  bytes      : 3,
  addressing : "Absolute Y",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absoluteY1(cpu); break;
      case 19: absoluteY2(cpu); break;
      case 20: absoluteY3(cpu); break;
      case 21: absolute9(cpu); break;
      case 22: staExecute1(cpu); break;
      case 23: staExecute2(cpu); break;
      case 24: staExecute3(cpu); break;
      case 25: staExecute4(cpu); break;
    }
  }
};


let STXabs = {
  name       : "STX nn",
  opCode     : 0x8E,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absolute9(cpu); break;
      case 19: stxExecute1(cpu); break;
      case 20: stxExecute2(cpu); break;
      case 21: stxExecute3(cpu); break;
      case 22: stxExecute4(cpu); break;
    }
  }
};

let STXzerop = {
  name       : "STX n",
  opCode     : 0x86,
  cycles     : 3,
  bytes      : 2,
  addressing : "Zero page",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: stxExecute1(cpu); break;
      case 15: stxExecute2(cpu); break;
      case 16: stxExecute3(cpu); break;
      case 17: stxExecute4(cpu); break;
    }
  }
};

let STXzeropY = {
  name       : "STX n,Y",
  opCode     : 0x96,
  cycles     : 4,
  bytes      : 2,
  addressing : "Zero page Y",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indY1(cpu); break;
      case 13: indY2(cpu); break;
      case 14: indY3(cpu); break;
      case 15: stxExecute1(cpu); break;
      case 16: stxExecute2(cpu); break;
      case 17: stxExecute3(cpu); break;
      case 18: stxExecute4(cpu); break;
    }
  }
};

let STYabs = {
  name       : "STY nn",
  opCode     : 0x8C,
  cycles     : 4,
  bytes      : 3,
  addressing : "Absolute",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: absolute1(cpu); break;
      case 13: absolute2(cpu); break;
      case 14: absolute3(cpu); break;
      case 15: absolute4(cpu); break;
      case 16: absolute5(cpu); break;
      case 17: absolute6(cpu); break;
      case 18: absolute9(cpu); break;
      case 19: styExecute1(cpu); break;
      case 20: styExecute2(cpu); break;
      case 21: styExecute3(cpu); break;
      case 22: styExecute4(cpu); break;
    }
  }
};

let STYzerop = {
  name       : "STY n",
  opCode     : 0x84,
  cycles     : 3,
  bytes      : 2,
  addressing : "zero page",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: zerop5(cpu); break;
      case 13: zerop6(cpu); break;
      case 14: styExecute1(cpu); break;
      case 15: styExecute2(cpu); break;
      case 16: styExecute3(cpu); break;
      case 17: styExecute4(cpu); break;
    }
  }
};

let STYzeropX = {
  name       : "STY n,X",
  opCode     : 0x94,
  cycles     : 4,
  bytes      : 2,
  addressing : "Zero page X",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: immediate1(cpu); break;
      case 9: immediate2(cpu); break;
      case 10: immediate3(cpu); break;
      case 11: immediate4(cpu); break;
      case 12: indX1(cpu); break;
      case 13: indX2(cpu); break;
      case 14: indX3(cpu); break;
      case 15: styExecute1(cpu); break;
      case 16: styExecute2(cpu); break;
      case 17: styExecute3(cpu); break;
      case 18: styExecute4(cpu); break;
    }
  }
};

/******** T *********/

let TAX = {
  name       : "TAX",
  opCode     : 0xAA,
  cycles     : 2,
  bytes      : 1,
  addressing : "None",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: this.execute1(cpu); break;
      case 9: this.execute2(cpu); break;
      case 10: this.execute3(cpu); break;
    }
  },

  execute1: function(cpu) {
    cpu.decoder.lowlight();
    cpu.irToDecoder.lowlight();
    cpu.accumulator.highlight();
  },

  execute2: function(cpu) {
    cpu.accumulator.lowlight();
    cpu.indexX.setData(cpu.accumulator.getData());
    cpu.indexX.redrawRegister();
    cpu.indexX.highlight();
  },

  execute3: function(cpu) {
    cpu.indexX.lowlight();
    setNZFlag(cpu.indexX.getData(), cpu);
    cpu.status.redrawRegister();
    cpu.status.highlight();
    cpu.step = 0;
  }
};

let TAY = {
  name       : "TAY",
  opCode     : 0xA8,
  cycles     : 2,
  bytes      : 1,
  addressing : "None",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: this.execute1(cpu); break;
      case 9: this.execute2(cpu); break;
      case 10: this.execute3(cpu); break;
    }
  },

  execute1: function(cpu) {
    cpu.decoder.lowlight();
    cpu.irToDecoder.lowlight();
    cpu.accumulator.highlight();
  },

  execute2: function(cpu) {
    cpu.accumulator.lowlight();
    cpu.indexY.setData(cpu.accumulator.getData());
    cpu.indexY.redrawRegister();
    cpu.indexY.highlight();
  },

  execute3: function(cpu) {
    cpu.indexY.lowlight();
    setNZFlag(cpu.indexY.getData(), cpu);
    cpu.status.redrawRegister();
    cpu.status.highlight();
    cpu.step = 0;
  }
};

let TSX = {
  name       : "TSX",
  opCode     : 0xBA,
  cycles     : 2,
  bytes      : 1,
  addressing : "None",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: this.execute1(cpu); break;
      case 9: this.execute2(cpu); break;
      case 10: this.execute3(cpu); break;
    }
  },

  execute1: function(cpu) {
    cpu.decoder.lowlight();
    cpu.irToDecoder.lowlight();
    cpu.stackPointer.highlight();
  },

  execute2: function(cpu) {
    cpu.stackPointer.lowlight();
    cpu.indexX.setData(cpu.stackPointer.getData());
    cpu.indexX.redrawRegister();
    cpu.indexX.highlight();
  },

  execute3: function(cpu) {
    cpu.indexX.lowlight();
    setNZFlag(cpu.indexX.getData(), cpu);
    cpu.status.redrawRegister();
    cpu.status.highlight();
    cpu.step = 0;
  }
};

let TXA = {
  name       : "TXA",
  opCode     : 0x8A,
  cycles     : 2,
  bytes      : 1,
  addressing : "None",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: this.execute1(cpu); break;
      case 9: this.execute2(cpu); break;
      case 10: this.execute3(cpu); break;
    }
  },

  execute1: function(cpu) {
    cpu.decoder.lowlight();
    cpu.irToDecoder.lowlight();
    cpu.indexX.highlight();
  },

  execute2: function(cpu) {
    cpu.indexX.lowlight();
    cpu.accumulator.setData(cpu.indexX.getData());
    cpu.accumulator.redrawRegister();
    cpu.accumulator.highlight();
  },

  execute3: function(cpu) {
    cpu.accumulator.lowlight();
    setNZFlag(cpu.accumulator.getData(), cpu);
    cpu.status.redrawRegister();
    cpu.status.highlight();
    cpu.step = 0;
  }
};

let TXS = {
  name       : "TXS",
  opCode     : 0x9A,
  cycles     : 2,
  bytes      : 1,
  addressing : "None",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: this.execute1(cpu); break;
      case 9: this.execute2(cpu); break;
    }
  },

  execute1: function(cpu) {
    cpu.decoder.lowlight();
    cpu.irToDecoder.lowlight();
    cpu.indexX.highlight();
  },

  execute2: function(cpu) {
    cpu.indexX.lowlight();
    cpu.stackPointer.setData(cpu.indexX.getData())
    cpu.stackPointer.redrawRegister();
    cpu.stackPointer.highlight();
    cpu.step = 0;
  },
};

let TYA = {
  name       : "TYA",
  opCode     : 0x98,
  cycles     : 2,
  bytes      : 1,
  addressing : "None",

  cycle: function(cpu) {
    switch (cpu.step) {
      case 8: this.execute1(cpu); break;
      case 9: this.execute2(cpu); break;
      case 10: this.execute3(cpu); break;
    }
  },

  execute1: function(cpu) {
    cpu.decoder.lowlight();
    cpu.irToDecoder.lowlight();
    cpu.indexY.highlight();
  },

  execute2: function(cpu) {
    cpu.indexY.lowlight();
    cpu.accumulator.setData(cpu.indexY.getData());
    cpu.accumulator.redrawRegister();
    cpu.accumulator.highlight();
  },

  execute3: function(cpu) {
    cpu.accumulator.lowlight();
    setNZFlag(cpu.accumulator.getData(), cpu);
    cpu.status.redrawRegister();
    cpu.status.highlight();
    cpu.step = 0;
  }
};
