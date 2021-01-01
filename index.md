<a id="appEntiers"></a>
# Opérations sur des entiers (*)

Application web de représentations et de calculs sur des entiers :

- Exprimer un entier non-signé en binaire, octal, décimal et hexadécimal. 
- Représenter des entiers signés selon la convention _complément à 2_ ou _bit de signe & valeur absolue_. 
- Additionner en binaire des entiers non-signés ou signés.

[Aller à l'application (v1.0.0-01/01/2021)](https://xgandibleux.github.io/FctOrdinateurs/Converter/index.html)

***

<a id="appMemoire"></a>
# Opérations sur une mémoire 8 bits (*)

Application web de lecture et d'écriture dans une mémoire 8 bits, ayant pour plage d'adresse `0x00` à `0x7F` :

- Présentation des données en hexadécimal.
- Interaction avec la memoire se fait via les buffers d'adresses, de données et de contrôle.
- Interprétation de l'information présente dans le buffer de données lors de l'écriture en mémoire.

[Aller à l'application (v1.0.0-01/01/2021)](https://xgandibleux.github.io/FctOrdinateurs/Memoire/index.html)

***

<a id="appInsight6502"></a>
# Insight 6502 : opérations Fetch-Decode-Execute (*)

Application web qui matérialise graphiquement l'ensemble des opérations du cycle fetch-decode-execute du processeur 6502.

- Chargement de la mémoire sur `0x0000` à `0xFFFF` avec des données en hexadécimal et un programme en langage machine.
- Affectation de valeurs hexadécimales aux registres A, X, Y et PC.
- Exécution d'un programme en mémoire pas à pas ou par cycle déterminant l'instruction en exécution.

[Aller à l'application (v1.0.0-01/01/2021)](https://xgandibleux.github.io/FctOrdinateurs/Insight6502/index.html)

Notes :
- 95% des instructions du 6502 implémentées (seules les instructions relatives aux interruptions ne sont pas implémentées).
- Tous les modes d'adressages du processeur sont implémentés.

***

<a id="appVisual6502"></a>
# Visual 6502 : simulateur, assembleur, desassembleur

Application web qui propose un simulateur, un assembleur, un desassembleur 6502 ainsi qu'une description de l'ensemble des instructions du processeur.

- Chargement de la mémoire avec un programme donné en langage machine.
- Affectation des valeurs hexadécimales aux registres A, X, Y et PC.
- Assemblage/desassemblage d'un programme en langage machine depuis le langage assembleur.

[Aller à l'application (ver. 2016)](https://www.masswerk.at/6502/)

[Vidéo de présentation (ver. 2020)](https://mediaserver.univ-nantes.fr/videos/l1-cm-x12i020-video-11/)

***
***

## Avertissements 

### Concernant les applications marquées par (*) : 

- Réalisées par [MaelRB](https://github.com/MaelRB) dans le cadre d'un stage d'été de licence 1 encadré par [XavierG](https://github.com/xgandibleux).
- Codées en langage JavaScript, la partie graphique utilise la librairie p5.js.
- Distribuées sous [licence CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

Notes : 
- Première diffusion publique le 1er janvier 2021.
- Mises à disposition gratuitement et telles quelles, sans aucune forme de garantie. 
- Merci de nous rapporter bugs ou erreurs qui seraient rencontrés. 
- Toute suggestion d'amélioration ainsi que toute contribution sont bienvenues.

### Concernant l'application visual6502 :

- Réalisée par Norbert Landsteiner (2005, 2016).
- Distribué sous [licence GPL](https://en.wikipedia.org/wiki/GNU_General_Public_License).
- Hébergée par l'auteur à l'URL suivante : [https://www.masswerk.at/6502/](https://www.masswerk.at/6502/)

