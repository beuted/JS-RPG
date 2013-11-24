var MATERIAUX = {
        "RIEN"    : 0,
	"BOIS"    : 1,
        "FER"     : 2,
	"ACIER"   : 3,
        "DIAMANT" : 4,
        "OR"      : 5
}

var ARMURE = {
        "CASQUE"     : 0,
	"TORSE"      : 1,
        "JAMBIERES"  : 2,
	"CHAUSSURES" : 3,
        "ARME"       : 4
}

var OBJET = {
    "RIEN"             : 0,
    "CASQUECUIR"       : 11,
    "CASQUEFER"        : 12,
    "CASQUEACIER"      : 13,
    "CASQUEDIAMANT"    : 14,
    "CASQUEOR"         : 15,
    "ARMURECUIR"       : 20,
    "ARMUREFER"        : 21,
    "ARMUREACIER"      : 22,
    "ARMUREDIAMANT"    : 23,
    "ARMUREOR"         : 24,
    "JAMBIERESCUIR"    : 30,
    "JAMBIERESFER"     : 31,
    "JAMBIERESACIER"   : 32,
    "JAMBIERESDIAMANT" : 33,
    "JAMBIERESOR"      : 34,
    "CHAUSSURESCUIR"   : 40,
    "CHAUSSURESFER"    : 41,
    "CHAUSSURESACIER"  : 42,
    "CHAUSSURESDIAMANT": 43,
    "CHAUSSURESOR"     : 44,
    "EPEEBOIS"         : 50,
    "EPEEFER"          : 51,
    "EPEEACIER"        : 52,
    "EPEEDIAMANT"      : 53,
    "EPEEOR"           : 54,
    "ARC"              : 60,
    "POTION"           : 70,
    "PARCHEMIN"        : 80
}

function Inventaire(url2, carte) {



    // Chargement de l'image pour l'inventaire ///////////////////////////
    this.imginventaire = new Image();
    this.imginventaire.referenceItem = this;
    this.imginventaire.onload = function() {
	if(!this.complete) 
	    throw "Erreur de chargement du sprite nommé \"" + url + "\".";
	
	// Taille du personnage
	//this.referenceItem.largeur = this.width /6;
	//this.referenceItem.hauteur = this.height /5;
    }
    this.imginventaire.src = "sprites/" + url2;
    //////////////////////////////////////////////////////////////////////
    var objetvide = new Objet(0,0,0,0,0,-1,0,0,0,0,0);
    this.armure = [objetvide, objetvide, objetvide, objetvide, objetvide];

    // liste des objets dans l'inventaire
    var objettest2 = new Objet(0,0,0,5,5,76,1,0,2,0,0);
    this.sac = new Array(25);
    for (var i = 0 ; i < this.sac.length ;  i++) {
	this.sac[i] = objetvide;
    } //PB a cause des pointeurs ?
    this.sac[1] = objettest2;

    // objet selectionné
    this.numObjetSelect = -1;

}

Inventaire.prototype.ajouterObjetInv = function(objet,msg) {
    for (var i = 0 ; i < this.sac.length ;  i++) {
	if (this.sac[i].skin == -1) {
	    this.sac[i] = objet;
	    return true;
	}	
    }
    msg.afficherPhrase("Votre sac est plein"); 
    return false;
}

Inventaire.prototype.retirerObjetInv = function(indObjet) {
    if (indObjet < 0 || indObjet > this.sac.length) {
	throw new Error("Erreur : tentative de déposer un objet inexistant");
    } else {
	this.sac[indObjet] = new Objet(0,0,0,0,0,-1,0,0);
	
    }
}

// Porter une armure
Inventaire.prototype.porterArmure = function(type,indObjet,msg,personnage,ctx) {
    if (this.armure[type].skin == -1) {
	this.armure[type] = this.sac[indObjet];
	personnage.porterObjet(this.sac[indObjet]);
	this.retirerObjetInv(indObjet);
	// On réaffiche l'inventaire
	this.dessinerInventaire(ctx, personnage);
	msg.afficherPhrase("Vous portez desormais " + this.armure[type].nom ,ctx);
    } else {
	msg.afficherPhrase("Vous portez deja ce type d'armure",ctx);
    }
}

// Retirer une armure
Inventaire.prototype.retirerArmure = function(i, msg, personnage, ctx) {
    // On ajoute l'objet dans l'inventaire
    if (this.ajouterObjetInv(this.armure[i],msg) && this.armure[i].skin >= 0) {
	// On indique qu'on desequipe
	msg.afficherPhrase("Vous desequipe " + this.armure[i].nom,ctx);
	// On le retire des armures
	personnage.retirerObjet(this.armure[i]);
	this.armure[i] = new Objet(0,0,0,0,0,-1,0,0);
	// On réaffiche l'inventaire
	this.dessinerInventaire(ctx, personnage);
    }
}


// Ramasser un objet sur la carte
Inventaire.prototype.ramasserObjet = function(personnage, map, msg, ctx) {
    var indiceobj = map.presenceObjet(map.etage,map.x,map.y,personnage.x,personnage.y);
    if (indiceobj == -1) {
	msg.afficherPhrase("Il n'y a rien a ramasser la ou vous vous trouvez", ctx);
    } else {
	// On ajoute l'objet dans l'inventaire
	if (this.ajouterObjetInv(map.objets_etage[map.etage][indiceobj])) {
	    // On affiche les ppte de l'objet
	    msg.infoObjet(map.objets_etage[map.etage][indiceobj],ctx);
	    // On le retire de la map
	    map.objets_etage[map.etage].splice(indiceobj,1);
	}
    }
}

Inventaire.prototype.poserObjet = function(personnage, map, i, msg, ctx) {
    var indiceobj = map.presenceObjet(map.etage,map.x,map.y,personnage.x,personnage.y);
    if (indiceobj != -1) {
	msg.afficherPhrase("Il y a deja un objet au sol la ou vous vous trouvez", ctx);
    } else {

	// On le met au bonne endroit
	this.sac[i].etage = personnage.etage
	this.sac[i].mapx = personnage.xMap
	this.sac[i].mapy = personnage.yMap
	this.sac[i].x = personnage.x
	this.sac[i].y = personnage.y
	// On l'ajoute a la map
	map.objets_etage[personnage.etage].push(this.sac[i]);
	// On retire l'objet dans l'inventaire
	this.retirerObjetInv(i);
	// On réaffiche l'inventaire
	this.dessinerInventaire(ctx, personnage);
	// message de confirmation
	msg.afficherPhrase("Vous deposez un objet", ctx);
    }
}

Inventaire.prototype.dessinerInventaire = function(context, personnage) {

    // fond de l'inventaire
    context.drawImage(
	this.imginventaire, 
	16*32, 1*32, // Point d'origine du rectangle source à prendre dans notre image
	250, 250, // Taille du rectangle source
	map.getLargeur() * 16 , 0, // Point de destination 
	250, 250  // Taille du rectangle destination (c'est la taille du personnage)
    );
    
    // vie, force ...
    context.strokeText("vie : " + personnage.sante, map.getLargeur()*16 + 16, 210);
    context.strokeText("def : " + personnage.armure, map.getLargeur()*16 + 16, 230);
    context.strokeText("frc : " + personnage.force, map.getLargeur()*16 + 72, 210);
    context.strokeText("int : " + personnage.intel, map.getLargeur()*16 + 72, 230);
    context.strokeText("dex : " + personnage.dex, map.getLargeur()*16 + 116, 210);


    // Affichage des armures et armes en main //////////////////////////////
    for (var i = 0 ; i < 5 ;  i++) { 
	
	// si rien equipe on affiche l'image par defaut
	if (this.armure[i].skin == -1) {
	    context.drawImage(
		this.imginventaire, 
		15*32, (i+1)*32, // Point d'origine du rectangle source à prendre dans notre image
		32, 32, // Taille du rectangle source
		map.getLargeur() * 16 + 14, i*32 +8, // Point de destination 
		32, 32 // Taille du rectangle destination (c'est la taille du personnage)
	    );
	} else {

	    var xtemp = this.armure[i].skin % 19;
	    if(xtemp == -1) xtemp = 19;
	    var ytemp = Math.floor(this.armure[i].skin / 19)+1;
	    //alert(xtemp + " , " + ytemp);
	    context.drawImage(
		this.imginventaire, 
		xtemp*32, ytemp*32, // Point d'origine du rectangle source à prendre dans notre image
		32, 32, // Taille du rectangle source
		map.getLargeur() * 16 + 14, i*32 +8, // Point de destination 
		32, 32 // Taille du rectangle destination (c'est la taille du personnage)
	    );
	}
    }

    // Affichage de l'inventaire ///////////////////////////////////////////

    for (var i = 0 ; i < 5 ;  i++) {
	for (var j = 0 ; j < 5 ;  j++) {
	    xtemp = this.sac[i*5+j].skin % 19;
	    if(xtemp == -1) xtemp = 19;
	    ytemp = Math.floor(this.sac[i*5+j].skin / 19)+1;

	    context.drawImage(
		this.imginventaire, 
		xtemp*32, ytemp*32, // Point d'origine du rectangle source à prendre dans notre image
		32, 32, // Taille du rectangle source
		map.getLargeur() * 16 + 58 +j*36, i*36 +16, // Point de destination 
		32, 32 // Taille du rectangle destination (c'est la taille du personnage)
	    );
	}	
    }
}

Inventaire.prototype.clickInv = function(coords,msg,map,personnage,context) {
    for (var i = 0 ; i < 5 ;  i++) {
	for (var j = 0 ; j < 5 ;  j++) {
	    if(coords.x >= map.getLargeur()*16+58+j*36 &&
	       coords.x <= map.getLargeur()*16+58+j*36 + 32 &&
	       coords.y >= i*36 +16 && coords.y <= i*36 +16 + 32) {
		msg.infoObjet(this.sac[i*5+j],context);
		msg.dessinerBoutons(context,1,1);
		// On retient l'emplacement dans le sac de l'objet selectionné
		this.numObjetSelect = i*5+j;
		return false;x
	    }
	}
    }

    for (var i = 0 ; i < 5 ;  i++) {
	if(coords.x >= map.getLargeur()*16+14 && coords.x <= map.getLargeur()*16+14+32
	   && coords.y >= i*32+8 && coords.y <= i*32+8+32) {
	    this.retirerArmure(i, msg, personnage, context);
	    this.numObjetSelect = -1; //deselection
	}
    }
	
    
    if(this.numObjetSelect >=0 && this.numObjetSelect <=this.sac.length ) {
	
	// Si on click sur le bouton deposer
	if(coords.x >= 425 && coords.x <= 425 + 57 &&
	   coords.y >= 15*16+8 && coords.y <=  15*16+8+19) {
	    this.poserObjet(personnage,map,this.numObjetSelect, msg, context);
	    
	    this.numObjetSelect = -1; //deselection
	    return false;
	}

	// Si on click sur le bouton utiliser
	if(coords.x >= 425 && coords.x <= 425 + 57 &&
	   coords.y >= 15*16+8+19+2 && coords.y <=  15*16+8+19+19+2) {
	    
	    if (this.sac[this.numObjetSelect].type >= TYPE.CASQUE && this.sac[this.numObjetSelect].type <= TYPE.EPEE) {
		this.porterArmure(this.sac[this.numObjetSelect].type, this.numObjetSelect, msg, personnage, context);
		this.numObjetSelect = -1; //deselection
		return false;
	    } 	
	}
    }
}