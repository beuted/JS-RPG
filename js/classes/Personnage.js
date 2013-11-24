var DIRECTION = {
	"HAUT"   : 0,
	"DROITE" : 1,
	"GAUCHE" : 2,
	"BAS"    : 3
}

var ALIGNEMENT = {
        "NEUTRE"    : 0,
        "CHAOTIQUE" : 1
}

var DUREE_ANIMATION = 2;
var DUREE_DEPLACEMENT = 8;

function Personnage(url, focusCamera, xMap, yMap, etage, x, y, direction, alignement, degat, sante, armure, force, intel, dex) {
        this.focusCamera = focusCamera;
	this.x = x; // (en cases)
	this.y = y; // (en cases)
	this.xMap = xMap; // (en maps)
	this.yMap = yMap; // (en maps)
        this.etage = etage;
	this.direction = direction;
	this.etatAnimation = -1;
        this.alignement = alignement;
        this.degat = degat;
        this.sante = sante;
        this.armure = armure;
        this.force = force;
        this.intel = intel;
        this.dex = dex;
	
	// Chargement de l'image dans l'attribut image
	this.image = new Image();
	this.image.referenceDuPerso = this;
	this.image.onload = function() {
		if(!this.complete) 
			throw "Erreur de chargement du sprite nommé \"" + url + "\".";
		
		// Taille du personnage
		this.referenceDuPerso.largeur = this.width / 8;
		this.referenceDuPerso.hauteur = this.height;
	}
	this.image.src = "sprites/" + url;
}

Personnage.prototype.porterObjet = function(objet) {
    this.degat += objet.degat;
    this.armure += objet.armure;
    this.force += objet.force;
    this.intel += objet.intel;
    this.dex += objet.dex;
}

Personnage.prototype.retirerObjet = function(objet) {
    this.degat -= objet.degat;
    this.armure -= objet.armure;
    this.force -= objet.force;
    this.intel -= objet.intel;
    this.dex -= objet.dex;  
}

Personnage.prototype.dessinerPersonnage = function(context) {

	var frame = 0; // Numéro de l'image à prendre pour l'animation
	var decalageX = 0, decalageY = 0; // Décalage à appliquer à la position du personnage
	if(this.etatAnimation >= DUREE_DEPLACEMENT) {
		// Si le déplacement a atteint ou dépassé le temps nécéssaire pour s'effectuer, on le termine
		this.etatAnimation = -1;
	} else if(this.etatAnimation >= 0) {
		// On calcule l'image (frame) de l'animation à afficher
		frame = Math.floor(this.etatAnimation / DUREE_ANIMATION);
		if(frame > 1) {
			frame = 0;
		}
		
		// Nombre de pixels restant à parcourir entre les deux cases
		var pixelsAParcourir = 16 - (16 * (this.etatAnimation / DUREE_DEPLACEMENT));
		
		// À partir de ce nombre, on définit le décalage en x et y.
		if(this.direction == DIRECTION.HAUT) {
			decalageY = pixelsAParcourir;
		} else if(this.direction == DIRECTION.BAS) {
			decalageY = -pixelsAParcourir;
		} else if(this.direction == DIRECTION.GAUCHE) {
			decalageX = pixelsAParcourir;
		} else if(this.direction == DIRECTION.DROITE) {
			decalageX = -pixelsAParcourir;
		}
		
		// On incrémente d'une frame
		this.etatAnimation++;
	}
	        
	/*
	 * Si aucune des conditions n'est vraie, c'est qu'on est immobile, 
	 * donc il nous suffit de garder les valeurs 0 pour les variables 
	 * frame, decalageX et decalageY
	 */
	
	context.drawImage(
		this.image, 
	        this.largeur * (frame + this.direction*2), 0, // Point d'origine du rectangle source à prendre dans notre image
		this.largeur, this.hauteur, // Taille du rectangle source (c'est la taille du personnage)
		// Point de destination (dépend de la taille du personnage)
		(this.x * 16) + decalageX, (this.y * 16) + decalageY,
		this.largeur, this.hauteur // Taille du rectangle destination (c'est la taille du personnage)
	);
}

Personnage.prototype.getCoordonneesAdjacentes = function(direction) {
	var coord = {'x' : this.x, 'y' : this.y};
	switch(direction) {
		case DIRECTION.BAS : 
			coord.y++;
			break;
		case DIRECTION.GAUCHE : 
			coord.x--;
			break;
		case DIRECTION.DROITE : 
			coord.x++;
			break;
		case DIRECTION.HAUT : 
			coord.y--;
			break;
	}
	return coord;
}

Personnage.prototype.deplacer = function(direction, map, ennemis, personnage) {
	// On ne peut pas se déplacer si un mouvement est déjà en cours !
	if(this.etatAnimation >= 0) {
		return false;
	}

	// On change la direction du personnage
	this.direction = direction;
		
	// changement de map
	var prochaineCase = this.getCoordonneesAdjacentes(direction);
	if(prochaineCase.x < 0 || prochaineCase.y < 0 || prochaineCase.x >= map.getLargeur() || prochaineCase.y >= map.getHauteur()) {
	    if(this.focusCamera ==1) {
		if(prochaineCase.x < 0) {
		    this.x = map.getLargeur()-1;
		    map.changerMapAdjacente(ASCENSION.RIEN,DIRECTION.GAUCHE, ennemis, this);
		} else if(prochaineCase.y < 0) {
		    this.y = map.getHauteur()-1;
		    map.changerMapAdjacente(ASCENSION.RIEN,DIRECTION.HAUT, ennemis, this);
		} else if(prochaineCase.x >= map.getLargeur()) {
		    this.x = 0;
		    map.changerMapAdjacente(ASCENSION.RIEN,DIRECTION.DROITE, ennemis, this);
		} else if(prochaineCase.y >= map.getHauteur()) {
		    this.y = 0;
		    map.changerMapAdjacente(ASCENSION.RIEN,DIRECTION.BAS, ennemis, this);
		}
		return false;
	    } else {
		return false;
	    }
	   

	// Changement d'etage
	} else if(map.terrain[prochaineCase.y][prochaineCase.x] == 2) {
	    if(this.focusCamera ==1) {
		map.changerMapAdjacente(ASCENSION.BAS,DIRECTION.RIEN, ennemis, this);
	    }
	} else if(map.terrain[prochaineCase.y][prochaineCase.x] == 1) {
	    if(this.focusCamera ==1) {
		map.changerMapAdjacente(ASCENSION.HAUT,DIRECTION.RIEN, ennemis, this);
	    }
	// Collisions avec la map
	} else if(map.terrain[prochaineCase.y][prochaineCase.x] == 5) {
	   	return false;     
	} else {
	    for (var i = 0 ; i < map.personnages.length ;  i++) {  
		if(map.personnages[i].x == prochaineCase.x && map.personnages[i].y == prochaineCase.y) {
		    //degats si collision
		    if (this.alignement != map.personnages[i].alignement)
			map.personnages[i].sante -=  Math.floor((this.degat+this.force)*(40-personnage.armure)/40);
		        if (map.personnages[i].sante < 0) map.personnages[i].sante = 0;
		    return false;
		}
	    }
	    if(personnage.x == prochaineCase.x && personnage.y == prochaineCase.y && this.alignement != personnage.alignement) {
		//degats si collision
		if (this.alignement != personnage.alignement)
		    personnage.sante -= (this.degat+this.force)*(40-personnage.armure)/40;
		if (personnage.sante < 0) personnage.sante = 0;
		return false;
	    }
	}

        // On commence l'animation
        this.etatAnimation = 1;
		
	// On effectue le déplacement
	this.x = prochaineCase.x;
	this.y = prochaineCase.y;
		
	return true;
}

Personnage.prototype.deplacerIA = function(map, focus, ennemis, personnage) {
    if(Math.abs(focus.y-this.y) > Math.abs(focus.x-this.x)) {
        if(focus.y-this.y > 0) {
            this.deplacer(DIRECTION.BAS, map, ennemis, personnage);
	} else if(focus.y-this.y < 0) {
            this.deplacer(DIRECTION.HAUT, map, ennemis, personnage);
	}
    } else {
        if(focus.x-this.x > 0) {
            this.deplacer(DIRECTION.DROITE, map, ennemis, personnage);
	} else if(focus.x-this.x < 0) {
            this.deplacer(DIRECTION.GAUCHE, map, ennemis, personnage);
	}
    }
}