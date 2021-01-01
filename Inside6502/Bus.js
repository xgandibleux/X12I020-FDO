class Bus {

  constructor(lines) {
    this.lines = lines
  }

  draw() {
    stroke(0);
    strokeWeight(1);
    this.lines();
  }

  highlight() {
    stroke(255, 0, 0);
    strokeWeight(1);
    this.lines();
    stroke(0);
  }

  lowlight() {
    stroke(0);
    strokeWeight(1);
    this.lines();
  }

}
