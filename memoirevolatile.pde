// =====================================================================================
// Cours "Fonctionnement des ordinateurs" L1-MIP
// Animation présentant le fonctionnement d'une mémoire volatile
// X. Gandibleux -- Décembre 2019

boolean init     = true; // permet d'activer l'initialisation une seule fois
String  digits   = "0123456789ABCDEF";
String  tadresse = "??"; // texte de l'adresse
String  tdonnee  = "????"; // texte de la donnee

boolean gaucheActif  = false; // buffer d'adresses
boolean centreActifR = false; // buffer de controles R
boolean centreActifW = false; // buffer de controles W
boolean centreActifZ = false; // buffer de controles Z
boolean droiteActif  = false; // buffer de donnees

String[] adresses = {"00", "01", "02", "", "FD", "FE", "FF"};
String[] donnees  = {"????", "????", "????", "????", "????", "????", "????"};

// =====================================================================================
void setup() {
  size(500, 500);
  background(150);
  surface.setTitle("Mémoire volatile");
}

// =====================================================================================
void draw() {
  int posx=150, posy=50, longueur=200, hauteur=50;
  int i;

  if (init==true) {
    initialisation(200, 50, 150, 50); //longueur, hauteur, posx, posy
    init=false;
  }

  stroke(0);
  noFill(); // rectangle non rempli
  for (i=0; i<7; i++) {
    rect(posx, posy+i*hauteur, longueur, hauteur);
  } 
  fill(255);
  if  (tadresse.equals("00")) {
    i=0; 
    stroke(255, 0, 0);
    noFill(); // rectangle non rempli
    rect(posx, posy+i*hauteur, longueur, hauteur);
    fill(255);
  } 
  else if (tadresse.equals("01")) {
    i=1;
    stroke(255, 0, 0);
    noFill(); // rectangle non rempli
    rect(posx, posy+i*hauteur, longueur, hauteur);
    fill(255);
  } 
  else if (tadresse.equals("02")) {
    i=2;
    stroke(255, 0, 0);
    noFill(); // rectangle non rempli
    rect(posx, posy+i*hauteur, longueur, hauteur);
    fill(255);
  } 
  else if (tadresse.equals("FD")) { 
    i=4;
    stroke(255, 0, 0);
    noFill(); // rectangle non rempli
    rect(posx, posy+i*hauteur, longueur, hauteur);
    fill(255);
  } 
  else if (tadresse.equals("FE")) {
    i=5;
    stroke(255, 0, 0);
    noFill(); // rectangle non rempli
    rect(posx, posy+i*hauteur, longueur, hauteur);
    fill(255);
  } 
  else if (tadresse.equals("FF")) {
    i=6;
    stroke(255, 0, 0);
    noFill(); // rectangle non rempli
    rect(posx, posy+i*hauteur, longueur, hauteur);
    fill(255);
  }
}

// =====================================================================================
void initialisation(int longueur, int hauteur, int posx, int posy) {
  int i;
  char c;

  // trace les cases memoire
  textAlign(CENTER);
  for (i=0; i<7; i++) {
    rect(posx, posy+i*hauteur, longueur, hauteur);
    fill(0);
    text(adresses[i], posx-15, posy+i*hauteur+hauteur/2);
    donnees[i]="";
    for (c=0; c<4; c++) {
      donnees[i]=donnees[i]+digits.charAt(int(random(0, digits.length())));
    }
    text(donnees[i], posx+longueur/2, posy+i*hauteur+hauteur/2);
    fill(255);
  }  

  // trace liens entre memoire et buffers
  strokeWeight(2);
  arrow(posx-50, int(posy+hauteur*3.5), posx, int(posy+hauteur*3.5));
  arrow(posx+longueur+50, int(posy+hauteur*3.5), posx+longueur, int(posy+hauteur*3.5));   
  arrow(posx+longueur+50, int(posy+hauteur*3.5), posx+longueur+50, posy+375);    
  fill(255);
  line(posx-50, posy+hauteur*3.5, posx-50, posy+375);   
  arrow(posx+longueur/2, posy+375, posx+longueur/2, posy+hauteur*7);   

  // trace les buffers d'adresse + controle + donnees
  strokeWeight(1);
  rect(posx-90, posy+375, 80, 25); // gauche
  rect(posx+longueur+10, posy+375, 80, 25);  // droite
  rect(posx+longueur/2-40, posy+375, 80, 25); // centre 
  rect(posx+longueur/2-40+3, posy+375+2, 26-4, 25-4); // centre R
  rect(posx+longueur/2-40+26+3, posy+375+2, 26-4, 25-4); // centre W   
  rect(posx+longueur/2-40+26+26+3, posy+375+2, 26-4, 25-4); // centre Z    

  // trace les valeurs initiales dans les buffers
  fill(0);
  textAlign(CENTER);

  tadresse = "";
  tadresse = tadresse + digits.charAt(int(random(0, digits.length())));
  tadresse = tadresse + digits.charAt(int(random(0, digits.length())));  
  text(tadresse, posx-50, posy+375+15);

  text("R", posx+longueur/2-25, posy+375+15);
  text("W", posx+longueur/2, posy+375+15); 
  text("Z", posx+longueur/2+25, posy+375+15);    

  tdonnee = "";
  tdonnee = tdonnee + digits.charAt(int(random(0, digits.length())));
  tdonnee = tdonnee + digits.charAt(int(random(0, digits.length())));  
  tdonnee = tdonnee + digits.charAt(int(random(0, digits.length())));  
  tdonnee = tdonnee + digits.charAt(int(random(0, digits.length())));    
  text(tdonnee, posx+longueur+50, posy+375+15);

  text("Buffer d'adresses", posx-50, posy+375+40);
  text("Buffer de contrôle", posx+longueur/2, posy+375+40); 
  text("Buffer de données", posx+longueur+50, posy+375+40); 
  
  fill(255);
}

// =====================================================================================
void keyPressed() {
  int posx=150, posy=50, longueur=200, hauteur=50;
  int i;

  // saisie adresse
  if (gaucheActif == true) {
    if (key >= 32 && key < 127) {
      tadresse = tadresse + key;
    }
    if (keyCode == BACKSPACE) {
      tadresse = tadresse.substring(0, tadresse.length() -1);
    }
    if (tadresse.length() > 2) {
      tadresse = tadresse.substring(1, tadresse.length());
    }  
    println("adresse :", tadresse);

    stroke(255, 0, 0);
    rect(posx-90, posy+375, 80, 25); // gauche      
    fill(0);
    textAlign(CENTER);
    text(tadresse, posx-50, posy+375+15);
    fill(255);
  }

  // saisie commande R
  if (centreActifR == true) {
  }  

  // saisie commande W
  if (centreActifW == true) {
  }   

  // saisie donnee
  if (droiteActif == true) {
    if (key >= 32 && key < 127) {
      tdonnee = tdonnee + key;
    }
    if (keyCode == BACKSPACE) {
      tdonnee = tdonnee.substring(0, tdonnee.length() -1);
    }
    if (tdonnee.length() > 4) {
      tdonnee = tdonnee.substring(1, tdonnee.length());
    }  
    println("donnee :", tdonnee);

    stroke(255, 0, 0);    
    rect(posx+longueur+10, posy+375, 80, 25); // droite      
    fill(0);
    textAlign(CENTER);
    text(tdonnee, posx+longueur+50, posy+375+15);
    fill(255);
  }
}

// =====================================================================================
void mousePressed() {
  int posx=150, posy=50, longueur=200, hauteur=50;
  int i;
  println(mouseX, mouseY);

  strokeWeight(1); // fin
  noFill(); // rectangle non rempli
  stroke(#000000); // noir
  rect(posx-90, posy+375, 80, 25); // gauche
  rect(posx+longueur+10, posy+375, 80, 25);  // droite
  //rect(posx+longueur/2-40, posy+375, 80, 25); // centre
  //rect(posx+longueur/2-40+2, posy+375+2, 40-4, 25-4); // centre R
  //rect(posx+longueur/2+2, posy+375+2, 40-4, 25-4); // centre W 
  
  rect(posx+longueur/2-40+3, posy+375+2, 26-4, 25-4); // centre R
  rect(posx+longueur/2-40+26+3, posy+375+2, 26-4, 25-4); // centre W   
  rect(posx+longueur/2-40+26+26+3, posy+375+2, 26-4, 25-4); // centre Z  

  gaucheActif=false; 
  centreActifR=false;
  centreActifW=false;
  centreActifZ=false;  
  droiteActif=false;

  // zone buffer adresse ?
  if    ((mouseX >= posx-90)  && (mouseX <= posx-90+80) 
    &&  (mouseY >= posy+375) && (mouseY <= posy+375+25)) {
    println("buffer adresse actif");
    gaucheActif = true;
    noFill();
    stroke(255, 0, 0);
    rect(posx-90, posy+375, 80, 25);       
    stroke(#000000);
  }

  // zone buffer donnee 
  else if   ((mouseX >= posx+longueur+10)  && (mouseX <= posx+longueur+10+80) 
    &&  (mouseY >= posy+375) && (mouseY <= posy+375+25)) {
    println("buffer donnee actif");
    droiteActif = true;
    noFill();
    stroke(255, 0, 0);
    rect(posx+longueur+10, posy+375, 80, 25);  
    stroke(#000000);
  }

  // zone buffer controle R
  else if   ((mouseX >= posx+longueur/2-40+3)  && (mouseX <= posx+longueur/2-40+26-4+3) 
    && (mouseY >= posy+375+2) && (mouseY <= posy+375+2+25-4)) {
    println("buffer controle actif R");
    centreActifR = true;
    noFill();
    stroke(255, 0, 0);
    rect(posx+longueur/2-40+3, posy+375+2, 26-4, 25-4); // centre R      
    stroke(#000000);
    
    if  (tadresse.equals("00")) {
      tdonnee=donnees[0];
    } 
    else if (tadresse.equals("01")) {
      tdonnee=donnees[1];
    } 
    else if (tadresse.equals("02")) {
      tdonnee=donnees[2];
    } 
    else if (tadresse.equals("FD")) { 
      tdonnee=donnees[4];
    } 
    else if (tadresse.equals("FE")) {
      tdonnee=donnees[5];
    } 
    else if (tadresse.equals("FF")) {
      tdonnee=donnees[6];
    }
    fill(255);
    rect(posx+longueur+10, posy+375, 80, 25);  // droite
    fill(0);
    textAlign(CENTER);
    text(tdonnee, posx+longueur+50, posy+375+15);
    fill(255);

  }  

  // zone buffer controle W
  else if   ((mouseX >= posx+longueur/2-40+26+3)  && (mouseX <= posx+longueur/2-40+26-4+26+3) 
    && (mouseY >= posy+375+2) && (mouseY <= posy+375+2+25-4)) {
    println("buffer controle actif W");
    centreActifW = true;
    noFill();
    stroke(255, 0, 0);
    rect(posx+longueur/2-40+26+3, posy+375+2, 26-4, 25-4); // centre W        
    stroke(#000000);
    
    if  (tadresse.equals("00")) {
      fill(255);
      i=0;
      rect(posx, posy+i*hauteur, longueur, hauteur);
      fill(0);
      donnees[i]=tdonnee;
      text(donnees[i], posx+longueur/2, posy+i*hauteur+hauteur/2);
      fill(255);      
    } 
    else if (tadresse.equals("01")) {
      fill(255);
      i=1;
      rect(posx, posy+i*hauteur, longueur, hauteur);
      fill(0);
      donnees[i]=tdonnee;
      text(donnees[i], posx+longueur/2, posy+i*hauteur+hauteur/2);
      fill(255);      
    } 
    else if (tadresse.equals("02")) {
      fill(255);
      i=2;
      rect(posx, posy+i*hauteur, longueur, hauteur);
      fill(0);
      donnees[i]=tdonnee;
      text(donnees[i], posx+longueur/2, posy+i*hauteur+hauteur/2);
      fill(255);      
    } 
    else if (tadresse.equals("FD")) { 
      fill(255);
      i=4;
      rect(posx, posy+i*hauteur, longueur, hauteur);
      fill(0);
      donnees[i]=tdonnee;
      text(donnees[i], posx+longueur/2, posy+i*hauteur+hauteur/2);
      fill(255);      
    }  
    else if (tadresse.equals("FE")) {
      fill(255);
      i=5;
      rect(posx, posy+i*hauteur, longueur, hauteur);
      fill(0);
      donnees[i]=tdonnee;
      text(donnees[i], posx+longueur/2, posy+i*hauteur+hauteur/2);
      fill(255);      
    }  
    else if (tadresse.equals("FF")) {
      fill(255);
      i=6;
      rect(posx, posy+i*hauteur, longueur, hauteur);
      fill(0);
      donnees[i]=tdonnee;
      text(donnees[i], posx+longueur/2, posy+i*hauteur+hauteur/2);
      fill(255);      
    } 
    
  }
  
  // zone buffer controle Z
  else if   ((mouseX >= posx+longueur/2-40+26+26+3)  && (mouseX <= posx+longueur/2-40+26-4+26+26+3) 
    && (mouseY >= posy+375+2) && (mouseY <= posy+375+2+25-4)) {
    println("buffer controle actif Z");
    centreActifZ = true;
    noFill();
    stroke(255, 0, 0);
    rect(posx+longueur/2-40+26+26+3, posy+375+2, 26-4, 25-4); // centre Z        
    stroke(#000000);
    
    // trace les cases memoire
    textAlign(CENTER);
    fill(255);
    for (i=0; i<7; i++) {
      rect(posx, posy+i*hauteur, longueur, hauteur);
      fill(0);
      donnees[i]="0000";
      text(donnees[i], posx+longueur/2, posy+i*hauteur+hauteur/2);
      fill(255);
    } 
  }  
}

// =====================================================================================
// https://processing.org/discourse/beta/num_1219607845.html
void arrow(int x1, int y1, int x2, int y2) {
  line(x1, y1, x2, y2);
  pushMatrix();
  translate(x2, y2);
  float a = atan2(x1-x2, y2-y1);
  rotate(a);
  line(0, 0, -10, -10);
  line(0, 0, 10, -10);
  popMatrix();
} 
