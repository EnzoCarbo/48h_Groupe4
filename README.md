<img src="https://foundations.projectpythia.org/_images/GitHub-logo.png" style=justify-content:center;>
 
# Projet 48H
 
## Description
Au sein d'Ynox Aix Campus, nous avons eu un challenge demandant aux élèves de développer en 48h une application permettant de résoudre une série de puzzle interactif.
Dans notre cas nous avons mit en place un site web dans un thème rétro contenant différents mini-jeux dont le joueur devra sortir vainqueur afin d'obtenir les différentes lettres d'un mot de passe afin de compléter le puzzle.
 
 
## Installation et lancement
### Prérequis
1. [Node.js](https://nodejs.org/).
 
 
### Cloner le projet
 
    git clone https://github.com/EnzoCarbo/48h_Groupe4.git
 
 
### Installation des dépendances
 
    npm install
 
 
### Lancement de l'application
Avoir un terminal dans votre IDE et faites :
 
    npm start
 
 
## Fonctionnalités principales
 
- **Mini-jeu du Morpion** : Face à une IA que vous affronterez, votre objectif sera d'obtenir la victoire au jeu du morpion afin d'obtenir la première lettre du code final.
- **Mini-jeu du casse briques** : Dans ce mini-jeu, votre objectif sera de briser un total de 10 briques afin d'obtenir la seconde lettres du code final.
- **Mini-jeu du Snake** : Dans ce mini-jeu, votre objectif sera de dévorer sans rentrer en collision avec les pommes empoisonnées, ou les murs, un total de 15 pommes mûres afin de de débloquer la troisièmes lettres du code final.
- **Mini-jeu du Pong** : Ici vous affronterez de nouveau une IA face à laquelle vous devrez marquer un total de 5 points au jeu du pong. Cette victoire vous octroiera la 4 ème lettres du code final.
- **Mini-jeu du tape taupe** : Dans un mini-jeu de réflexe et de dextérité, vous devrez enchaîner sans erreurs des cliques sur des points lorsque ceux-ci passeront de couleurs blanches. L'objectif étant de survivre durant 15s, vous permettant d'obtenir la cinquièmes et dernière lettres du puzzle.
 
### Modalités de réalisation
Le projet a été réalisé en équipes de 6 personnes, composé de **Oumnia El Morketar** **Enzo Carbonara** et **Victor Uzodimma** **Clément Barjolle** **Leo Velazquez** et **Valentin Tanfin**.
 
### Modalité de rendu
Le projet est hébergé sur **GitHub**
 
## Organisation des fichiers
 
 
Dossier game : Contiens les fichiers jsx des jeux 
 
App.jsx : Le composant principal de l'application. Il importe et affiche les jeux disponibles.
 
index.js : Point d'entrée de l'application React. Il rend l'application dans le DOM.
 
reportWebVitals.js : Utilisé pour mesurer les performances de l'application.
 
setupTests.js : Configure les tests avec Jest et Testing Library.
 
App.css : Contient les styles spécifiques au composant App.
 
index.css : Contient les styles globaux pour l'application.
 
.gitignore : Spécifie les fichiers et dossiers à ignorer par Git.
 
package.json : Gère les dépendances et scripts du projet.
 
Cette organisation permet une séparation claire entre les jeux, les styles, et les fichiers de configuration.
 
 
## Choix technologiques
- React Vite : Typescript, permet d'avoir un Front-End typé, pour une meilleur organisation et qualité/fiabilité du code et de l'utilisation des variables
 
 
 
## Documentations
### Outils
 
    ChatGPT
    Claude
    DeepSeek