var DIRECTION = {
    	"RIEN"   : 0,
	"HAUT"   : 1,
	"DROITE" : 2,
	"GAUCHE" : 3,
        "BAS"    : 4
}

var ASCENSION = {
        "RIEN"   : 0,
	"HAUT"   : 1,
	"BAS"    : 2,
}

function Map(nom, nomObjets) {
        this.nom = nom;
        this.x = 0;
        this.y = 0;
        this.etage = 0;

	// ========= Lecture de la premiere map dans fichier json =============
	var xhr = getXMLHttpRequest();
		
	// Chargement du fichier
	xhr.open("GET", './maps/' + nom + '.json', false);
	xhr.send(null);
	if(xhr.readyState != 4 || (xhr.status != 200 && xhr.status != 0)) // Code == 0 en local
		throw new Error("Impossible de charger la carte nommée \"" + nom + "\" (code HTTP : " + xhr.status + ").");
	var mapJsonData = xhr.responseText;
	
	// Analyse des données
	var mapData = JSON.parse(mapJsonData);
        this.tileset = new Tileset(mapData.tileset);
	this.terrain = mapData.terrain;
        xhr.abort()//On ferme la connection   

	// =========== Liste des personnages présents sur le terrain. =========
	this.personnages = new Array();

        // ================= Lecture des objets sur le terrain ================
    
        // Chargement du fichier
        xhr.open("GET", './maps/' + nomObjets + '.json', false);
        xhr.send(null);
        if(xhr.readyState != 4 || (xhr.status != 200 && xhr.status != 0)) // Code == 0 en local
    	    throw new Error("Impossible de charger la carte nommée \"" + nom + "\" (code HTTP : " + xhr.status + ").");
        var mapJsonData = xhr.responseText;
    
        // Analyse des données
        var mapData = JSON.parse(mapJsonData);
        this.objets_etage = [];
        for (var i =0; i < mapData.objets.length; i++) {
	    this.objets_etage.push([]);
	    for (var j =0; j < (mapData.objets[i]).length; j++) {
		objetTemp = new Objet(mapData.objets[i][j][0],mapData.objets[i][j][1],mapData.objets[i][j][2],mapData.objets[i][j][3],mapData.objets[i][j][4],mapData.objets[i][j][5],mapData.objets[i][j][6],mapData.objets[i][j][7],mapData.objets[i][j][8],mapData.objets[i][j][9],mapData.objets[i][j][10]);
		this.objets_etage[i].push(objetTemp);
	    }
        }
    
        xhr.abort()//On ferme la connection

}

// Pour récupérer la taille (en tiles) de la carte
Map.prototype.getHauteur = function() {
	return this.terrain.length;
}
Map.prototype.getLargeur = function() {
	return this.terrain[0].length;
}

// Pour ajouter un personnage sur la carte (affichage)
Map.prototype.addPersonnage = function(perso) {
	this.personnages.push(perso);
}

// Pour retirer un personnage de la carte (affichage)
Map.prototype.supprPersonnage = function(x,y) {
        for(var i = 0, l = this.personnages.length ; i < l ; i++) {
	    if(this.personnages[i].x == x && this.personnages[i].y == y) {
		this.personnages.splice(i,1);
		break;
	    }
	}
}

// Pour modifier un objet sur la carte 
Map.prototype.presenceObjet = function(etage,xmap,ymap,x,y) {
    for(var i = 0, l = this.objets_etage[etage].length ; i < l ; i++) {
	if (this.objets_etage[etage][i].mapx == xmap  && this.objets_etage[etage][i].mapy == ymap 
	    && this.objets_etage[etage][i].x == x  && this.objets_etage[etage][i].y == y) {
	    return i;
	}
    }
    return -1;
}

//Charger les ennemis de la carte courante
Map.prototype.chargerEnnemis = function(ennemis) {
    //On efface tout sauf le joueur
    this.personnages.splice(1,this.personnages.length-1);
    for(var i = 0, l = ennemis.length ; i < l ; i++) {
	if(ennemis[i].xMap == this.x && ennemis[i].yMap == this.y && ennemis[i].etage == this.etage) {
	    this.personnages.push(ennemis[i]);
	}
    }
}

// Changer de map
Map.prototype.changerMap = function(nom) {
    this.nom = nom;

    // Création de l'objet XmlHttpRequest
    var xhr = getXMLHttpRequest();

    // Chargement du fichier
    xhr.open("GET", './maps/' + nom + '.json', false);
    xhr.send(null);
    if(xhr.readyState != 4 || (xhr.status != 200 && xhr.status != 0)) // Code == 0 en local
	throw new Error("Impossible de charger la carte nommée \"" + nom + "\" (code HTTP : " + xhr.status + ").");
    var mapJsonData = xhr.responseText;
    
    // Analyse des données
    var mapData = JSON.parse(mapJsonData);
    this.tileset = new Tileset(mapData.tileset);
    this.terrain = mapData.terrain;
}

// Changer de map en fonction de directions
Map.prototype.changerMapAdjacente = function(ascension, direction, ennemis, personnage) {
    //modif de l'etage
    if (ascension == ASCENSION.BAS) {
	this.etage = this.etage -1;
	personnage.etage = personnage.etage -1;
    } else if (ascension == ASCENSION.HAUT) {
	this.etage = this.etage +1;
	personnage.etage = personnage.etage +1;
    } else if (ascension != ASCENSION.RIEN) {
	throw new Error("valeur incorrecte pour ascension");
    }
    //modif des coordonnees
    if (direction == DIRECTION.HAUT) {
	this.y = this.y -1;
	personnage.yMap = personnage.yMap -1;
    } else if (direction == DIRECTION.BAS) {
	this.y = this.y +1;
	personnage.yMap = personnage.yMap +1;
    } else if (direction == DIRECTION.DROITE) {
	this.x = this.x +1;
	personnage.xMap = personnage.xMap +1;
    } else if (direction == DIRECTION.GAUCHE) {
	this.x = this.x -1;
	personnage.xMap = personnage.xMap -1;
    } else if (direction != DIRECTION.RIEN) {
	throw new Error("valeur incorrecte pour direction");
    }
    //chargement de la bonne map
    this.changerMap(this.etage + "," + this.x + "," + this.y);
    this.chargerEnnemis(ennemis);
}

Map.prototype.caseVisible = function(joueur,y,x) {
    /* ALGO DE BRESENHAM
       http://fr.wikipedia.org/wiki/Algorithme_de_trac%C3%A9_de_segment_de_Bresenham */
    

    var dx = joueur.y - x;
    var dy = joueur.x - y;

    if (dx != 0) {
	if (dx > 0) {
	    if (dy != 0) {
		if (dy > 0) {
		    // vecteur oblique dans le 1er quadran
		    if (dx >= dy) {
			var e = dx; // e est positif
			dx *= 2;
			dy *= 2;
			while (true) {
			    if (this.terrain[x][y] == 5)
				return false;
			    x++;
			    if (x == joueur.y)
				break;
			    e -= dy;
			    if (e < 0) {
				y++; //deplacement diagonal
				e +=dx;
			    }
			}
		    } else {
			var e = dy;
			dy *= 2;
			dx *= 2;
			while (true) {
			    if (this.terrain[x][y] == 5)
				return false;
			    y++;
			    if (y == joueur.x)
				break;
			    e -= dx;
			    if (e < 0) {
				x++; //deplacement diagonal
				e +=dy;
			    }
			}
		    }

		} else { // dy < 0 (et dx > 0)
		    if (dx >= -dy) {
			var e = dx;
			dy *= 2;
			dx *= 2;
			while (true) {
			    if (this.terrain[x][y] == 5)
				return false;
			    x++;
			    if (x == joueur.y)
				break;
			    e += dy;
			    if (e < 0) {
				y--; //deplacement diagonal
				e +=dx;
			    }
			}
		    } else {
			var e = dy;
			dy *= 2;
			dx *= 2;
			while (true) {
			    if (this.terrain[x][y] == 5)
				return false;
			    y--;
			    if (y == joueur.x)
				break;
			    e += dx;
			    if (e > 0) {
				x++; //deplacement diagonal
				e +=dy;
			    }
			}
		    }
		}
	    } else {
		do {
		    if (this.terrain[x][y] == 5)
			return false;
		    x++;
		}
		while(x != joueur.y);
	    }
	} else {
	    dy = joueur.x - y;
	    if (dy != 0) {
		if (dy > 0) {
		    if (-dx >=dy) {
			var e = dx;
			dy *= 2;
			dx *= 2;
			while (true) {
			    if (this.terrain[x][y] == 5)
				return false;
			    x--;
			    if (x == joueur.y)
				break;
			    e += dy;
			    if (e >= 0) {
				y++; //deplacement diagonal
				e += dx;
			    }
			}
		    } else {
			var e = dy;
			dy *= 2;
			dx *= 2;
			while (true) {
			    if (this.terrain[x][y] == 5)
				return false;
			    y++;
			    if (y == joueur.x)
				break;
			    e += dx;
			    if (e <= 0) {
				x--; //deplacement diagonal
				e += dy;
			    }
			}
		    }
		} else {
		    if (dx <= dy) {
			var e = dx;
			dy *= 2;
			dx *= 2;
			while (true) {
			    if (this.terrain[x][y] == 5)
				return false;
			    x--;
			    if (x == joueur.y)
				break;
			    e -= dy;
			    if (e >= 0) {
				y--; //deplacement diagonal
				e += dx;
			    }
			}
		    } else {
			var e = dy;
			dy *= 2;
			dx *= 2;
			while (true) {
			    if (this.terrain[x][y] == 5)
				return false;
			    y--;
			    if (y == joueur.x)
				break;
			    e -= dx;
			    if (e >= 0) {
				x--; //deplacement diagonal
				e += dy;
			    }
			}
		    }
		}
	    } else {
		do {
		    if (this.terrain[x][y] == 5)
			return false;
		    x--;
		}
		while(x != joueur.y);
	    }
	}
    } else {
	dy = joueur.x - y;
	if (dy != 0) {
	    if (dy > 0) {
		do {
		    if (this.terrain[x][y] == 5)
			return false;
		    y++;
		}
		while(y != joueur.x);
	    } else {
		do {
		    if (this.terrain[x][y] == 5)
			return false;
		    y--;
		}
		while(y != joueur.x);
	    }
	}
    }
    return true;
}		     


// Pour dessiner la map
Map.prototype.dessinerMap = function(context,joueur) {
	for(var i = 0, l = this.terrain.length ; i < l ; i++) {
		var ligne = this.terrain[i];
		var y = i * 16;
		for(var j = 0, k = ligne.length ; j < k ; j++) {
		    this.tileset.dessinerTile(ligne[j], context, j * 16, y);
		    if (!this.caseVisible(joueur,j,i)) {
		  	    this.tileset.dessinerTile(11, context, j * 16, y);
		        }
		}
	}
	
        // Dessin des objets
        for(var i = 0, l = this.objets_etage[this.etage].length ; i < l ; i++) {
    	    if (this.objets_etage[this.etage][i].mapx == this.x  && this.objets_etage[this.etage][i].mapy == this.y && this.caseVisible(joueur,this.objets_etage[this.etage][i].y,this.objets_etage[this.etage][i].x)) {
	        var xtemp = this.objets_etage[this.etage][i].x * 16;
	        var ytemp = this.objets_etage[this.etage][i].y * 16;
	        for(var j = 0, k = ligne.length ; j < k ; j++) {
	 	    this.tileset.dessinerTile(this.objets_etage[this.etage][i].skin+9*19, context, xtemp, ytemp);
	        }
	    }
        }

	// Dessin des personnages
        this.personnages[0].dessinerPersonnage(context);//dessine tjrs le joueur
	for(var i = 1, l = this.personnages.length ; i < l ; i++) {
	     if (this.caseVisible(joueur,this.personnages[i].x,this.personnages[i].y))
		this.personnages[i].dessinerPersonnage(context);
	}
}















