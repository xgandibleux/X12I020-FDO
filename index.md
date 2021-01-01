# Opérations sur des entiers (*)

Application web de représentations et de calculs sur des entiers :

- Exprimer un entier non-signé en binaire, octal, décimal et hexadécimal. 
- Représenter des entiers signés selon la convention _complément à 2_ ou la convention _valeur absolue_. 
- Additionner en binaire des entiers non-signés ou signés.

[Démarrer application](https://xgandibleux.github.io/FctOrdinateurs/Converter/index.html)

***

# Opérations sur une mémoire 8 bits (*)

Application web de lecture et d'écriture dans une mémoire 8 bits, ayant pour plage d'adresse `0x00` à `0x7F` :

- Informations exprimées en hexadécimal.
- Interaction avec la memoire se fait via les buffers d'adresses, de données et de contrôle.
- Interprétation de l'information présente dans le buffer de données lors de l'écriture en mémoire.

[Démarrer application](https://xgandibleux.github.io/FctOrdinateurs/Memoire/index.html)

***

# Insight 6502 : opérations Fetch-Decode-Execute (*)

Application web qui matérialise graphiquement l'ensemble des opérations du cycle fetch-decode-execute du processeur 6502.

- Chargement de la mémoire sur la plage d'adresse `0x00` à `0x7F` avec un programme donné en langage machine 6502.
- Affectation des valeurs hexadécimales aux registres A, X, Y et PC.
- Exécution d'un programme en mémoire pas à pas ou par cycle déterminant l'instruction en exécution.

[Démarrer application](https://xgandibleux.github.io/FctOrdinateurs/Insight6502/index.html)

Notes :
- 95% des instructions du 6502 implémentées (seules les instructions relatives aux interruptions ne sont pas implémentées).
- Tous les modes d'adressages du processeur sont implémentés.

***

# Visual 6502 : simulateur, assembleur, desassembleur

Application web qui propose un simulateur, un assembleur, un desassembleur 6502 ainsi qu'une description de l'ensemble des instructions du processeur.

- Chargement de la mémoire avec un programme donné en op-code 6502.
- Affectation des valeurs hexadécimales aux registres A, X, Y et PC.
- Assemblage/desassemblage d'un programme en langage machine depuis le langage assembleur.

[Démarrer application](https://www.masswerk.at/6502/)

***
***

## Avertissement 

### Concernant les applications marquées par (*) : 

- Productions réalisées par [MaelRB](https://github.com/MaelRB) en stage d'été de licence 1 en 2020 et encadré par [XavierG](https://github.com/xgandibleux). 
- Le langage utilisé est JavaScript, la partie graphique est réalisée avec la librairie p5.js.
- L'ensemble est réalisé sous [licence MIT](https://en.wikipedia.org/wiki/MIT_License).

- Première mise en production des applications le 1er janvier 2021. 
- Merci de nous rapporter bugs ou erreurs qui seraient rencontrés. 
- Toute suggestion d'amélioration ainsi que toute contribution sont bienvenues.

### Concernant l'application visual6502 :

- Production disponible à l'adresse [https://www.masswerk.at/6502/](https://www.masswerk.at/6502/)
