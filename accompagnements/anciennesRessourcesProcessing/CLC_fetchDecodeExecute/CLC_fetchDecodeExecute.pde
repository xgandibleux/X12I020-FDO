// =====================================================================================
// Cours "Fonctionnement des ordinateurs" L1-MIP
// Animation présentant le cycle Fetch-Decode-Execute pour l'instruction CLC
// X. Gandibleux -- Janvier 2020

boolean init     = true; // permet d'activer l'initialisation une seule fois
int     step     = 0; // permet d'animer les differentes etapes

// =====================================================================================
void setup() {
  size(580,420);
  background(150);
  surface.setTitle("CLC : Fetch - Decode - Execute");
}

// =====================================================================================
void draw() {

  if (init==true) {
    initialisation(); // trace l'architecture
    init=false;
    prog1(); // charge le programme et ses donnees
  }
  
  // Fetch 
  if (step == 0){
    fetch1(); 
    step++;
  }
  if (step == 2){
    fetch2(); 
    step++;
  }  
  if (step == 4){
    fetch3(); 
    step++;
  }    
  if (step == 6){
    fetch4(); 
    step++;
  }  
  if (step == 8){
    fetch5(); 
    step++;
  }    
  if (step == 10){
    fetch6(); 
    step++;
  } 
  
  // Decode
  if (step == 12){
    decode1(); 
    step++;
  } 
  
  // Execute
  if (step == 14){
    execute1(); 
    step++;
  }   
  if (step == 16){
    execute2(); 
    step++;
  }   
  println(step);
}

// =====================================================================================
void initialisation() {
  int i;
  
  line(30,30,540,30); // bus de données
  line(30,45,540,45); // bus d'adresses
  line(30,60,540,60); // bus de contrôle 

  fill(255);
  textSize(8);
  text("bus de données",480,27);
  text("bus d'adresses",480,42);  
  text("bus de contrôle",480,57); 
  
  line(90,45,90,105);    // bus d'adresses <-> adresses
  line(165,30,165,105);  // bus de données <-> données  
  line(225,60,225,105);  // bus de contrôle <-> contrôle
  line(225,105,216,105); // bus de contrôle <-> contrôle  
  fill(0);
  text("•",88,48);  // adr
  text("•",163,33); // data
  text("•",223,63);  
  fill(255);
  
  // mémoire
  text("adresses",50,102);
  text("données",170,102);
  noFill();
  rect(39,90, 177, 255);
  line(126,105,126,336);
  for(i=0;i<11;i++)
    rect(48,105+i*21, 156, 21);  

  // processeur
  rect(246,90, 216, 255); 
  rect(285,105, 66, 21);   // buffer donnees
  rect(384,105, 66, 21);   // buffer d'adresses  
  text("DB",287,115);
  text("AB",387,115);  
  
  rect(257,162, 66, 21);   // registre X  
  rect(257,192, 66, 21);   // registre Y  
  rect(257,222, 66, 21);   // registre A   
  
  text("X",260,172);
  text("Y",260,202);
  text("A",260,232);  

  rect(354,153, 66, 21);   // registre PC  
  rect(354,186, 66, 21);   // registre S  
  rect(354,222, 66, 21);   // registre IR  
  text("PC",357,163);
  text("S",357,196);
  text("IR",357,232);
  
  rect(360,261, 54, 33);   // seq et dec instr    
  rect(354,309, 66, 21);   // registre P  
  text("SEQ",363,271);  
  text("P",357,319);
  
  beginShape();       // ALU
    vertex(261, 279);
    vertex(279, 279);
    vertex(291,300);
    vertex(300, 279);
    vertex(318, 279);
    vertex(298, 318);
    vertex(284, 318);
    vertex(261, 279);    
  endShape(CLOSE);  
  text("ALU",284,312);  
  
  line(318,30,318,105); // bus de données <-> buffer données  
  line(418,45,418,105); // bus d'adresses <-> adresses  
  fill(0);
  text("•",316,33); // connexion data
  text("•",416,48); // connexion adr
  text("•",481,63);
  fill(255);  
  
  line(339,127,339,330); // bus de données interne
  line(324,172,339,172); // bus de données interne <> X
  line(324,202,339,202); // bus de données interne <> Y
  line(324,232,339,232); // bus de données interne <> A  
  line(339,164,354,164); // bus de données interne <> PC 
  line(339,196,354,196); // bus de données interne <> S   
  line(339,232,354,232); // bus de données interne <> IR
  line(339,320,354,320); // bus de données interne <> P  
  line(309,300,339,300); // bus de données interne <> ALU    
  
  line(438,127,438,242); // bus d'adresses interne
  line(420,164,438,164); // bus d'adresses interne <> PC  
  line(420,196,438,196); // bus d'adresses interne <> S 
  line(420,232,438,232); // bus d'adresses interne <> IR   

  line(483,60,483,270); // bus de controle interne
  line(414,270,483,270); // bus de controle interne   
  line(414,285,483,285); // bus horloge
  line(483,285,483,300); // bus horloge  
  text("clock",475,314);  
  
  line(387,244, 387, 261);  // IR <> seq
  line(387,294, 387, 308);  // seq <> P
  
  line(354,345, 354, 365);  // proc <> in/out 
  text("IN//OUT",340,379);
} 

void prog1(){
  fill(0);
  textSize(12);
  textAlign(CENTER);
  text("0051",90,98+2*21);
  text("0052",90,98+3*21);
  text("0053",90,98+4*21);  
  text("03",165,98+2*21);
  text("05",165,98+3*21);  
  
  text("0100",90,98+6*21);  
  text("0101",90,98+7*21); 
  text("0102",90,98+8*21); 
  text("0103",90,98+9*21); 
  text("0104",90,98+10*21);   
  text("CLC",165,98+6*21);
  text("LDA $51",165,98+7*21);
  text("ADC $52",165,98+8*21);
  text("STA $53",165,98+9*21);
  text("BRK",165,98+10*21);  
}

void fetch1(){
  fill(0,255,0);
  textSize(12);
  textAlign(CENTER);  
  text("0100",388,168); 
}
void fetch2(){
  stroke(0,255,0);
  line(438,127,438,242); // bus d'adresses interne
  line(420,164,438,164); // bus d'adresses interne <> PC   
  line(414,285,483,285); // bus horloge
  line(483,285,483,300); // bus horloge    
  fill(0,255,0);
  textSize(8);
  textAlign(LEFT); 
  text("clock",475,314); 
  textSize(12); 
  textAlign(CENTER);   
  text("0100",420,120); 
}
void fetch3(){
  stroke(0,255,0);
  line(30,45,540,45); // bus d'adresses  
  line(418,45,418,105); // bus d'adresses <-> adresses  
  textSize(8);
  text("•",418,48); // connexion adr
  line(90,45,90,105);    // bus d'adresses <-> adresses  
  text("•",90,48);  // adr 
  noFill();
  rect(48,105+5*21, 156, 21); 
}
void fetch4(){
  line(483,60,483,270); // bus de controle interne
  line(414,270,483,270); // bus de controle interne 
  line(30,60,540,60); // bus de contrôle   
  textSize(12);
  text("Read",500,180);   
  text("CLC",165,98+6*21);  
  textSize(8);
  text("•",225,63);   
  text("•",483,63);  
  line(225,60,225,105);  // bus de contrôle <-> contrôle
  line(225,105,216,105); // bus de contrôle <-> contrôle   
}
void fetch5(){
  line(165,30,165,105);  // bus de données <-> données  
  line(30,30,540,30); // bus de données
  line(318,30,318,105); // bus de données <-> buffer données  
  text("•",318,33); // connexion data
  text("•",165,33); // data
  textSize(12);  
  text("CLC",318,120);  
  textSize(8);
}
void fetch6(){
  line(339,127,339,330); // bus de données interne  
  line(339,232,354,232); // bus de données interne <> IR 
  textSize(12);  
  text("CLC",387,236); 
  textSize(8);  
}
void decode1(){
  stroke(0);
  fill(0);  
  textSize(12);     
  text("CLC",318,120);   
  text("0100",420,120); 
  text("0100",388,168);  
  fill(150);    
  text("Read",500,180); 
  fill(0);  
  text("CLC",165,98+6*21);   
  fill(0,0,255);    
  text("CLC",387,236); 
  textSize(8);  
  textAlign(LEFT);
  initialisation();

  stroke(0,255,0);  
  line(414,285,483,285); // bus horloge
  line(483,285,483,300); // bus horloge    
  fill(0,255,0);
  textSize(8);
  textAlign(LEFT); 
  text("clock",475,314);   
}
void execute1(){
  fill(0);   
  textSize(12);  
  textAlign(CENTER);    
  text("CLC",387,236);   
  fill(255,0,0);   
  stroke(255,0,0);  
  line(387,294, 387, 308);  // seq <> P  
  textSize(12);  
  text("0",388,324); 
  text("C",388,342); 
  noFill();
  rect(380,309, 15, 21);  
}
void execute2(){
  fill(150);  
  stroke(0);
  rect(354,153, 66, 21);   // registre PC 
  textSize(8);  
  textAlign(LEFT);
  fill(255);   
  text("PC",357,163);  
  fill(255,0,0);
  textSize(12);
  textAlign(CENTER);  
  text("0101",388,168); 
}

void mousePressed() {
  step++;
}
