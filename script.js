document.addEventListener('DOMContentLoaded', () => {
    // --- PERSONNALISATION ---
    // Remplacez les noms ci-dessous par votre liste de 15 élèves
    const eleves = [
        "Léa", "Hugo", "Chloé", "Lucas", "Manon", "Louis", "Jade", "Gabriel",
        "Emma", "Adam", "Louise", "Raphaël", "Inès", "Jules", "Camille"
    ];

    // --- ÉLÉMENTS DE LA PAGE ---
    const listeElevesEl = document.getElementById('liste-eleves-interactive');
    const resultatContenuEl = document.getElementById('resultat-contenu');

    // Contrôles du tirage simple
    const btnTirageSimple = document.getElementById('btn-tirage-simple');
    const nombreGagnantsInput = document.getElementById('nombre-gagnants');

    // Contrôles de la création de groupes
    const btnCreerGroupes = document.getElementById('btn-creer-groupes');
    const valeurGroupeInput = document.getElementById('valeur-groupe');

    // --- FONCTIONS ---

    /**
     * Récupère la liste des élèves cochés (présents).
     * @returns {string[]} Un tableau contenant les noms des élèves présents.
     */
    function getElevesPresents() {
        const presents = [];
        const checkboxes = document.querySelectorAll('#liste-eleves-interactive input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            presents.push(checkbox.value);
        });
        return presents;
    }

    /**
     * Mélange un tableau en utilisant l'algorithme de Fisher-Yates.
     * @param {any[]} array Le tableau à mélanger.
     * @returns {any[]} Un nouveau tableau mélangé.
     */
    function melangerArray(array) {
        const newArray = [...array]; // Crée une copie pour ne pas modifier l'original
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap
        }
        return newArray;
    }

    /**
     * Crée la liste interactive avec des cases à cocher.
     */
    function creerListeInteractive() {
        listeElevesEl.innerHTML = '';
        eleves.forEach((nom, index) => {
            const li = document.createElement('li');
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `eleve-${index}`;
            checkbox.value = nom;
            checkbox.checked = true; // Tous les élèves sont présents par défaut

            const label = document.createElement('label');
            label.htmlFor = `eleve-${index}`;
            label.textContent = nom;

            li.appendChild(checkbox);
            li.appendChild(label);
            listeElevesEl.appendChild(li);
        });
    }

    /**
     * Lance le tirage au sort simple sur les élèves présents.
     */
    function lancerTirageSimple() {
        const elevesPresents = getElevesPresents(); // Utilise la liste des présents
        const nombreGagnants = parseInt(nombreGagnantsInput.value, 10);

        if (elevesPresents.length === 0) {
            alert("Aucun élève n'est sélectionné !");
            return;
        }
        if (nombreGagnants <= 0 || nombreGagnants > elevesPresents.length) {
            alert(`Veuillez entrer un nombre de gagnants valide (entre 1 et ${elevesPresents.length}).`);
            return;
        }

        const elevesMelanges = melangerArray(elevesPresents);
        const gagnants = elevesMelanges.slice(0, nombreGagnants);

        resultatContenuEl.innerHTML = `<h3>🏆 Gagnant(s) :</h3><ul>${gagnants.map(nom => `<li>${nom}</li>`).join('')}</ul>`;
    }

    /**
     * Forme des groupes à partir des élèves présents.
     */
    function formerLesGroupes() {
        const elevesPresents = getElevesPresents(); // Utilise la liste des présents
        const mode = document.querySelector('input[name="mode-groupe"]:checked').value;
        const valeur = parseInt(valeurGroupeInput.value, 10);

        if (elevesPresents.length === 0) {
            alert("Aucun élève n'est sélectionné pour former des groupes !");
            return;
        }
        if (valeur <= 0) {
            alert("Veuillez entrer une valeur positive.");
            return;
        }

        const elevesMelanges = melangerArray(elevesPresents);
        let groupes = [];

        if (mode === 'parTaille') {
            if (valeur > elevesPresents.length) {
                alert("La taille des groupes ne peut pas être supérieure au nombre d'élèves présents.");
                return;
            }
            for (let i = 0; i < elevesMelanges.length; i += valeur) {
                groupes.push(elevesMelanges.slice(i, i + valeur));
            }
        } else { // mode === 'parNombre'
            if (valeur > elevesPresents.length) {
                alert("Le nombre de groupes ne peut pas être supérieur au nombre d'élèves présents.");
                return;
            }
            // Réinitialiser les groupes
            groupes = Array.from({ length: valeur }, () => []);
            // Distribuer les élèves dans les groupes
            elevesMelanges.forEach((eleve, index) => {
                groupes[index % valeur].push(eleve);
            });
        }
        
        afficherGroupes(groupes);
    }

    /**
     * Affiche les groupes formatés dans la zone de résultat.
     * @param {string[][]} groupes Un tableau de tableaux contenant les membres de chaque groupe.
     */
    function afficherGroupes(groupes) {
        let html = '';
        groupes.forEach((groupe, index) => {
            html += `<div class="groupe"><h3>Groupe ${index + 1}</h3><ul>`;
            groupe.forEach(membre => {
                html += `<li>${membre}</li>`;
            });
            html += `</ul></div>`;
        });
        resultatContenuEl.innerHTML = html;
    }

    // --- ÉCOUTEURS D'ÉVÉNEMENTS ---
    btnTirageSimple.addEventListener('click', lancerTirageSimple);
    btnCreerGroupes.addEventListener('click', formerLesGroupes);

    // --- INITIALISATION ---
    // Crée la liste interactive des élèves au chargement de la page.
    creerListeInteractive();
});