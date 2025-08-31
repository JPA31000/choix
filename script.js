document.addEventListener('DOMContentLoaded', () => {
    // --- PERSONNALISATION ---
    // Données des élèves, organisées par classes et groupes.
    const classes = {
        "2EMNB": {
            "Groupe 1": [
                "ABDELMAJID Khadija", "BABI Nour", "BELHADI Mélissa", "BOUKHIAR Fatima",
                "CHARLES Glory", "DESLONG Rayane Bamba", "DEVILLE Chloé", "EGLELA Orlane",
                "EL ASRI Ayman", "HASSANI Killyann", "INSELIN Enzo"
            ],
            "Groupe 2": [
                "JILAVU Maria-Teodora", "JOJUA Giorgi", "KHACHATRIAN Angelina", "LUNIMBU Fernanda",
                "MUNIER Kelly", "OUERFELLI Samia", "POUGIN Pharel", "QACHRI Adam",
                "ROUQUETTE Noa", "TAYEB PACHA Romayssa", "YANG Danny"
            ]
        },
        "1AA": {
            "Groupe 1": [
                "AJENGUI Adam", "BORIN Edith", "CHACHUAT-BRENAS Flora", "DAOUDA Ortence",
                "FALL SEYE Dame", "JIMENEZ TABORDA Luis", "KORDZADZE Lizi", "MALUNDA Débora",
                "RIGOUSTE Noemy", "ROCHE Emma", "TALON Heather", "TAZABAEV Tamirlan",
                "WADE Diadie", "ZINGILA Andréas"
            ]
        }
    };

    // --- ÉLÉMENTS DE LA PAGE ---
    const classSelector = document.getElementById('class-selector');
    const groupSelector = document.getElementById('group-selector');
    const listeElevesEl = document.getElementById('liste-eleves-interactive');
    const resultatContenuEl = document.getElementById('resultat-contenu');
    const btnTirageSimple = document.getElementById('btn-tirage-simple');
    const nombreGagnantsInput = document.getElementById('nombre-gagnants');
    const btnCreerGroupes = document.getElementById('btn-creer-groupes');
    const valeurGroupeInput = document.getElementById('valeur-groupe');

    // --- FONCTIONS ---

    /**
     * Crée la liste interactive d'élèves avec des cases à cocher.
     * @param {string[]} eleves Le tableau des noms d'élèves à afficher.
     */
    function creerListeInteractive(eleves) {
        listeElevesEl.innerHTML = '';
        eleves.forEach((nom, index) => {
            const li = document.createElement('li');
            const checkboxId = `eleve-${index}`;
            
            li.innerHTML = `
                <input type="checkbox" id="${checkboxId}" value="${nom}" checked>
                <label for="${checkboxId}">${nom}</label>
            `;
            listeElevesEl.appendChild(li);
        });
    }

    /**
     * Met à jour l'affichage en fonction du groupe sélectionné.
     */
    function mettreAJourAffichage() {
        const selectedClass = classSelector.value;
        const selectedGroup = groupSelector.value;
        let elevesAAfficher = [];

        if (selectedGroup === "Tous") {
            elevesAAfficher = Object.values(classes[selectedClass]).flat();
        } else {
            elevesAAfficher = classes[selectedClass][selectedGroup];
        }

        creerListeInteractive(elevesAAfficher.sort());
        resultatContenuEl.innerHTML = '<p>Les résultats s\'afficheront ici...</p>';
    }

    function initialiserSelecteurClasses() {
        classSelector.innerHTML = '';
        Object.keys(classes).forEach(nomClasse => {
            const option = document.createElement('option');
            option.value = nomClasse;
            option.textContent = nomClasse;
            classSelector.appendChild(option);
        });
    }

    function mettreAJourSelecteurGroupes() {
        const selectedClass = classSelector.value;
        groupSelector.innerHTML = '<option value="Tous">Tous les groupes</option>';
        Object.keys(classes[selectedClass]).forEach(nomGroupe => {
            const option = document.createElement('option');
            option.value = nomGroupe;
            option.textContent = nomGroupe;
            groupSelector.appendChild(option);
        });
    }

    function getElevesPresents() {
        return Array.from(document.querySelectorAll('#liste-eleves-interactive input:checked')).map(cb => cb.value);
    }
    
    function melangerArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    function lancerTirageSimple() {
        const elevesPresents = getElevesPresents();
        const nombreGagnants = parseInt(nombreGagnantsInput.value, 10);

        if (elevesPresents.length === 0) return alert("Aucun élève n'est sélectionné !");
        if (nombreGagnants <= 0 || nombreGagnants > elevesPresents.length) {
            return alert(`Veuillez entrer un nombre de gagnants valide (entre 1 et ${elevesPresents.length}).`);
        }

        const gagnants = melangerArray(elevesPresents).slice(0, nombreGagnants);
        resultatContenuEl.innerHTML = `<h3>🏆 Gagnant(s) :</h3><ul>${gagnants.map(nom => `<li>${nom}</li>`).join('')}</ul>`;
    }

    function formerLesGroupes() {
        const elevesPresents = getElevesPresents();
        const mode = document.querySelector('input[name="mode-groupe"]:checked').value;
        const valeur = parseInt(valeurGroupeInput.value, 10);

        if (elevesPresents.length === 0) return alert("Aucun élève pour former des groupes !");
        if (valeur <= 0) return alert("Veuillez entrer une valeur positive.");

        const elevesMelanges = melangerArray(elevesPresents);
        let groupesResultat = [];

        if (mode === 'parTaille') {
            if (valeur > elevesPresents.length) return alert("La taille des groupes est trop grande.");
            for (let i = 0; i < elevesMelanges.length; i += valeur) {
                groupesResultat.push(elevesMelanges.slice(i, i + valeur));
            }
        } else { // parNombre
            if (valeur > elevesPresents.length) return alert("Le nombre de groupes est trop grand.");
            groupesResultat = Array.from({ length: valeur }, () => []);
            elevesMelanges.forEach((eleve, index) => groupesResultat[index % valeur].push(eleve));
        }
        
        afficherGroupes(groupesResultat);
    }

    function afficherGroupes(groupesResultat) {
        let html = groupesResultat.map((groupe, index) => `
            <div class="groupe">
                <h3>Groupe ${index + 1}</h3>
                <ul>${groupe.map(membre => `<li>${membre}</li>`).join('')}</ul>
            </div>
        `).join('');
        resultatContenuEl.innerHTML = html;
    }

    // --- ÉCOUTEURS D'ÉVÉNEMENTS ---
    classSelector.addEventListener('change', () => {
        mettreAJourSelecteurGroupes();
        mettreAJourAffichage();
    });
    groupSelector.addEventListener('change', mettreAJourAffichage);
    btnTirageSimple.addEventListener('click', lancerTirageSimple);
    btnCreerGroupes.addEventListener('click', formerLesGroupes);

    // --- INITIALISATION ---
    initialiserSelecteurClasses();
    mettreAJourSelecteurGroupes();
    mettreAJourAffichage();
});