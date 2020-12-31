
// Utilier pour les nombres
const numberSize = 16;
// Utiliser pour les textes
const titleSize = 14;

// Dimension por les registres et buffers
const regBufWidth = 90;
const regBufHeight = numberSize + 10;
const textRegBufWidth = 30;

let memory;
let cpu;
let clock;

let addressBus;
let dataBus;
let controlBus;

let textArea;
let memoryInput;

let pcInput;
let aInput;
let xInput;
let yInput;

let checkboxModeAvance;

let isClockButton = true;

let isProgrammeOver = false;

// Permet d'ameliorer legerement les performances en supprimant certaines verification
p5.disableFriendlyErrors = true;

function setup() {
	createCanvas(windowWidth, windowHeight);

	memory = new Memory();
	memory.drawMemory(30, 150, 0x0000);

	cpu = new CPU();
	cpu.drawCPU(500, 150);

	// Bus entre la memoire et le cpu
	// Bus de données
	let lines = () => {
		line(645, 175, 645, 125);
		line(645, 125, 300, 125);
		line(300, 125, 300, 150);
	};
	dataBus = new Bus(lines);
	dataBus.draw();
	strokeWeight(0);
	textSize(titleSize);
	text("Data bus", 540, 110, 150, titleSize);

	// Bus d'adresses
	lines = () => {
		line(824, 175, 824, 90);
		line(824, 90, 250, 90);
		line(250, 90, 250, 150);
	};
	addressBus = new Bus(lines);
	addressBus.draw();
	strokeWeight(0);
	textSize(titleSize);
	text("Address bus", 700, 75, 150, titleSize);

	// Bus de controle
	lines = () => {
		line(844, 415, 930, 415);
		line(930, 415, 930, 55);
		line(930, 55, 200, 55);
		line(200, 55, 200, 150);
		textSize(titleSize);
	};
	controlBus = new Bus(lines);
	controlBus.draw();
	strokeWeight(0);
	text("Control bus", 825, 40, 150, titleSize);

	// Clock
	drawClock("Step");
	strokeWeight(1);
	line(865, 575, 865, 435);
	line(865, 435, 844, 435);

	setCyclesText();

	drawMemoryInput();
	drawCpuInput();

	drawModeAvance();

	let resetButton = createButton("Reset");
	resetButton.position(560, 640);
	resetButton.mouseClicked(resetButtonClicked);

	drawInfoBox();

	drawIndicatorOff();
}

function resetButtonClicked() {
	cpu.reset();
	memory.reset();
	hideControleInfo();
	dataBus.lowlight();
	addressBus.lowlight();
	controlBus.lowlight();
	cycles = 0;
	updateCyclesCount();
	hideSkipAnim();
	isProgrammeOver = false;
	drawInfoBox();
	drawIndicatorOff();
}

function draw() {
	//console.log(frameRate());

}

function clockClicked() {

	if (cpu.step == 0) {
		drawIndicator();
	}

	cpu.cycleFDE();

	if (isClockButton) {
		updateCyclesCount();
	}

	hideSkipAnim();
}

function hideSkipAnim() {
	// Modification du titre du bouton Clock / Go
	if (cpu.shouldSkipFD == false) {
		if (cpu.step == 0 || cpu.step == 7) {
			checkboxModeAvance.show();
			isClockButton = true;

		} else {
			checkboxModeAvance.hide();
			isClockButton = false;
		}
	} else {
		if (cpu.step <= 1) {
			checkboxModeAvance.show();
			isClockButton = true;

		} else {
			isClockButton = false;
		}
	}
}

function updateCyclesCount() {
	// Cache le precedent text
	fill(255);
	strokeWeight(0);
	rect(825, 625, 100, titleSize + 1);

	setCyclesText();
}

function drawClock(title) {
	clock = createButton(title);
	clock.position(825, 575);
	clock.size(75, 25);
	clock.mousePressed(clockClicked);
}

function drawIndicator() {
	if (isProgrammeOver) {
		fill(255);
	} else {
		fill(46, 204, 113);
	}
	strokeWeight(1);
	stroke(0);
	ellipse(910, 587, 10, 10);
}

function drawIndicatorOff() {
	fill(255);
	strokeWeight(1);
	stroke(0);
	ellipse(910, 587, 10, 10);
}

function setCyclesText() {
	strokeWeight(0);
	fill(0);
	textSize(titleSize);
	text("Cycles : " + cpu.cycles, 830, 625, 150, titleSize);
}

// Affiche quel controle est envoyé via le bus de controle
function showControleInfo(control) {
	strokeWeight(0);
	fill(255, 0, 0);
	textSize(titleSize);
	text(control, 940, 200, 50, titleSize);
	fill(255);
}

function hideControleInfo() {
	fill(255);
	noStroke();
	rect(940, 200, 50, titleSize);
	stroke(0);
}

/************ Saisie de la memoire ***********/

function drawMemoryInput() {
	textArea = createElement('textarea').size(307, 200).position(104, 580);

	// Start address input
	textSize(titleSize);
	text("Start address", 420, 590, 100, titleSize);

	memoryInput = createInput("".padStart(cpu.programCounter.numberOfBits / 4, "0"));
	memoryInput.position(420, 610);
	memoryInput.size(100, titleSize);

	// Load memory button
	let loadButton = createButton("Load memory");
	loadButton.position(420, 640);
	loadButton.mouseClicked(loadMemoryClicked);

	// Show memory button
	let showButton = createButton("Show memory");
	showButton.position(420, 665);
	showButton.mouseClicked(showMemoryClicked);
}

function showMemoryClicked() {
	let address = parseInt(memoryInput.value(), 16);
	memory.startAddress = address;
	memory.redrawMemory();
}

function loadMemoryClicked() {

	// verification de memoryInput
	let input = memoryInput.value();
	if (input.length > cpu.programCounter.numberOfBits / 4) {
		alert("Invalid input");
		return
	}
	if (!isValid(input, "Invalid input")) { return }

	// verification de textArea
	input = textArea.value();
	// Retire les esapces
	input = input.replaceAll(" ", "");
	if (!isValid(input, "Invalid input")) { return }

	// Recuperation des données saisies
	let dataArray = [];
	let count = 0;
	let tempData = "";
	for (let i = 0; i < input.length; i++) {
		tempData += input[i];
		if (count == 1) {
			dataArray.push(tempData);
			count = 0;
			tempData = "";
		} else {
			count += 1;
		}
	}

	// Si input est impaire alors il reste un charactere seul, il faut le rajouter
	if (count == 1) {
		tempData = "0" + tempData;
		dataArray.push(tempData);
	}

	let address = parseInt(memoryInput.value(), 16);
	for (let i = 0; i < dataArray.length; i++) {
		let data = parseInt(dataArray[i], 16);
		if (address > memory.maxAdress) {
			break;
		} else {
			memory.setData(address, data);
			address += 1;
		}
	}

	memory.redrawMemory();
}

function isValid(input, message) {
	let hexaCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
	for (let i = 0; i < input.length; i++) {
		let result = hexaCharacters.filter(char => input[i].toUpperCase() == char);
		if (result.length == 0) {
			alert(message);
			return false
		}
	}
	return true
}

/************ Saisie du cpu ***********/

function drawCpuInput() {
	// PC
	textSize(titleSize);
	text("PC", 420, 700, 30, titleSize);
	pcInput = createInput("".padStart(cpu.programCounter.numberOfBits / 4, "0"));
	pcInput.position(420, 720);
	pcInput.size(35, titleSize);
	let pcCheckButton = createButton("Set");
	pcCheckButton.position(420, 750);
	pcCheckButton.mouseClicked(pcButtonClicked);

	// A
	textSize(titleSize);
	text("A", 490, 700, 30, titleSize);
	aInput = createInput("".padStart(cpu.accumulator.numberOfBits / 4, "0"));
	aInput.position(490, 720);
	aInput.size(35, titleSize);
	let aCheckButton = createButton("Set");
	aCheckButton.position(490, 750);
	aCheckButton.mouseClicked(aButtonClicked);

	// X
	textSize(titleSize);
	text("X", 560, 700, 30, titleSize);
	xInput = createInput("".padStart(cpu.indexX.numberOfBits / 4, "0"));
	xInput.position(560, 720);
	xInput.size(35, titleSize);
	let xCheckButton = createButton("Set");
	xCheckButton.position(560, 750);
	xCheckButton.mouseClicked(xButtonClicked);

	// Y
	textSize(titleSize);
	text("Y", 630, 700, 30, titleSize);
	yInput = createInput("".padStart(cpu.indexY.numberOfBits / 4, "0"));
	yInput.position(630, 720);
	yInput.size(35, titleSize);
	let yCheckButton = createButton("Set");
	yCheckButton.position(630, 750);
	yCheckButton.mouseClicked(yButtonClicked);

}

function isValidCpuInput(input, message, length) {
	if (input.length > length) {
		alert(message);
		return false
	}
	return isValid(input, message)
}

function pcButtonClicked() {
	let input = pcInput.value();
	if (!isValidCpuInput(input, "PC invalid", cpu.programCounter.numberOfBits / 4)) { return }

	input = input.padStart(cpu.programCounter.numberOfBits / 4, "0");

	cpu.programCounter.setData(parseInt(input, 16));
	cpu.programCounter.redrawRegister();
}

function aButtonClicked() {
	let input = aInput.value();
	if (!isValidCpuInput(input, "A invalid", cpu.accumulator.numberOfBits / 4)) { return }

	input = input.padStart(cpu.accumulator.numberOfBits / 4, "0");

	cpu.accumulator.setData(parseInt(input, 16));
	cpu.accumulator.redrawRegister();
}

function xButtonClicked() {
	let input = xInput.value();
	if (!isValidCpuInput(input, "X invalid", cpu.indexX.numberOfBits / 4)) { return }

	input = input.padStart(cpu.indexX.numberOfBits / 4, "0");

	cpu.indexX.setData(parseInt(input, 16));
	cpu.indexX.redrawRegister();
}

function yButtonClicked() {
	let input = yInput.value();
	if (!isValidCpuInput(input, "Y invalid", cpu.indexY.numberOfBits / 4)) { return }

	input = input.padStart(cpu.indexY.numberOfBits / 4, "0");

	cpu.indexY.setData(parseInt(input, 16));
	cpu.indexY.redrawRegister();
}

function drawModeAvance() {
	textSize(titleSize);
	checkboxModeAvance = createCheckbox("Skip Fetch-Decode animation", false);
	checkboxModeAvance.position(700, 720);
	checkboxModeAvance.changed(myCheckedEvent);
}

function myCheckedEvent() {
  cpu.shouldSkipFD = this.checked();
}

/************ Info box ***********/

function drawInfoBox() {
	fill(255);
	stroke(0);
	strokeWeight(1);
	rect(950, 580, 200, 150);

  if (cpu.instruction == false && cpu.cycles != 0) {
		textSize(titleSize);
		fill(0);
		noStroke();
		text("ERROR", 960, 590, 130, 20);
	} else if (cpu.cycles != 0) {
		textSize(titleSize);
		fill(0);
		noStroke();
		text(cpu.instruction.name, 960, 590, 130, 20);
		text("Operation code : " + cpu.instruction.opCode.toString(16).toUpperCase(), 960, 630, 190, 20);
		text("Cycles : " + cpu.instruction.cycles.toString(16), 960, 655, 190, 20);
		text("Bytes : " + cpu.instruction.bytes.toString(16), 960, 680, 190, 20);
		text("Addressing : " + cpu.instruction.addressing, 960, 705, 190, 20);
	}

}
