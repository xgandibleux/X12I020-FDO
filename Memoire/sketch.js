
const policeSize = 16;

let memory;
let addressBuffer;
let dataBuffer;
let controlBuffer;
let infoTable;

let addressInput = "00";
let dataInput = "00";
let controlInput = "0";

function setup() {
	createCanvas(windowWidth, windowHeight);

	memory = new Memory(0x7f);
	memory.drawMemory(170, 50);

	addressBuffer = new Buffer(2, typeOfBuffer.ADDRESS);
	addressBuffer.drawBuffer(180, 600);
	drawInputAddressBuffer(180, 650);

	dataBuffer = new Buffer(2, typeOfBuffer.DATA);
	dataBuffer.drawBuffer(320, 600);
	drawInputDataBuffer(320, 650);

	controlBuffer = new Buffer(1, typeOfBuffer.CONTROL);
	controlBuffer.drawBuffer(460, 600);
	drawInputControlBuffer(460, 650);

	stroke(0);
	strokeWeight(1);
	line(255, 476, 255, 600); // Memoire vers buffer d'adresses
	line(395, 476, 395, 600); // Memoire vers buffer de données
	line(525, 476, 525, 600); // Memoire vers buffer de controle

	let goButton = createButton("Go");
	goButton.position(650, 600);
	goButton.mouseClicked(goButtonClicked);

	strokeWeight(0);
	let info = "Pour le buffer de controle les valeurs à utiliser sont : 0x0 -> Write \n0x1 -> Read\n0x2 -> Reset"
	text(info, 650, 350, 200, 300);

	infoTable = new InformationTable("0");
	infoTable.drawTable("Data buffer information", 650, 50, 240, 200);
	infoTable.redraw();
}

function draw() {

}

function drawInputAddressBuffer(x, y) {
	const height = 20;
	const textWidth = 30;

	let input = createInput(addressBuffer.value.toString(16));
	input.position(x, y);
	input.size(130, height);
	input.input(updateAddressInput);
}

function updateAddressInput() {
	addressInput = this.value();
}

function drawInputDataBuffer(x, y) {
	const height = 20;
	const textWidth = 30;

	let input = createInput(dataBuffer.value.toString(16));
	input.position(x, y);
	input.size(130, height);
	input.input(updateDataInput);
}

function updateDataInput() {
	dataInput = this.value();
}

function drawInputControlBuffer(x, y) {
	const height = 20;
	const textWidth = 30;

	let input = createInput(controlBuffer.value.toString(16));
	input.position(x, y);
	input.size(130, height);
	input.input(updateControlInput);
}

function updateControlInput() {
	controlInput = this.value();
}

function goButtonClicked() {
	// On regarde le buffer de controle. Si la valeur correspond à une des 3 connues
	// alors on realise l'action demandé
	let intControl = parseInt(controlInput, 16);

	if (checkInput()) {

		addressBuffer.value = addressInput;
		addressBuffer.changeText();

		dataBuffer.value = dataInput;
		dataBuffer.changeText();

		controlBuffer.value = controlInput;
		controlBuffer.changeText();

		infoTable.value = dataInput;
		infoTable.redraw();

		if (intControl == controlValue.WRITE) {
			memory.setData(parseInt(addressInput, 16), parseInt(dataInput, 16));
			memory.redrawMemory();

		} else if (intControl == controlValue.READ) {
			let data = memory.getData(parseInt(addressInput, 16));
			dataBuffer.value = data;
			dataBuffer.changeText();

		} else if (intControl == controlValue.RESET) {
			memory.reset();
			memory.redrawMemory();
		}

	}

}

function checkInput() {

	let isAddressCorrect = true;
	if (addressBuffer.isValidValue(addressInput) == false) {
		drawCross(250, 690);
		isAddressCorrect = false;
	} else {
		hideCross(250, 690);
	}

	let isDataCorrect = true;
	if (dataBuffer.isValidValue(dataInput) == false) {
		drawCross(390, 690);
		isDataCorrect = false;
	} else {
		hideCross(390, 690);
	}

	let isControlCorrect = true;
	if (controlBuffer.isValidValue(controlInput) == false) {
		drawCross(520, 690);
		isControlCorrect = false;
	} else {
		hideCross(520, 690);
	}

	return isAddressCorrect && isControlCorrect && isDataCorrect

}

function hideCross(x, y) {
	fill(255);
	noStroke();
	rect(x - 1, y - 1, 12, 12);
	stroke(0);
}

function drawCross(x, y) {
	stroke(255, 0, 0);
	strokeWeight(2);
	line(x, y, x + 10, y + 10);
	line(x, y + 10, x + 10, y);
	stroke(0);
	strokeWeight(1);
}
