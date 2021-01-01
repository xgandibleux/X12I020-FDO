# Inside 6502 

## Exemple

Soit le programme suivant composé de 3 instructions :

    A9 0E 85 40 00

### Charger en mémoire le programme :

1. entrer le programme dans la zone de saisie de données (cadre au sud-ouest de la fenêtre)
2. entrer l'adresse à laquelle le programme doit être chargé en mémoire dans la zone "start address" 
3. cliquer sur "load memory"
4. le programme est à présent chargé en mémoire

### Préparer le processeur pour l'exécution du cycle fetch-decode-execute :

1. entrer l'adresse à laquelle le programme se trouve en mémoire dans la zone "PC"
2. cliquer sur le bouton "set" situé sous le "PC"
3. le compteur de programme est à présent initialisé

### Démarrer l'exécution du cycle fetch-decode-execute :

1. cliquer sur le bouton "Step"
2. le processeur exécute à présent la première activité du premier cycle fetch-decode-execute, le témoin d'activité s'illumine vert
3. cliquer sur le bouton "Step" autant que nécessaire pour suivre les opérations réalisées par le processeur jusqu'à l'extinction du témoin d'activité
4. l'exécution du programme est à présent terminée
