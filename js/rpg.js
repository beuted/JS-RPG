/* ******** fonctions utilitaires *********** */ 
function getCoords(el,event) {
    var ox = -el.offsetLeft,
    oy = -el.offsetTop;
    while(el=el.offsetParent){
	ox += el.scrollLeft - el.offsetLeft;
	oy += el.scrollTop - el.offsetTop;
    }
    return {x:event.clientX + ox , y:event.clientY + oy};
}
/* ******************************************* */

/* ********* alertes en tt genre ************* */

if (navigator.cookieEnabled) {
    // Cookies acceptés
} else {
    alert("Activez vos cookies pour pouvoir sauvegarder.");
}

/* ******************************************* */
var map = new Map("0,0,0", "objets");
var inventaire = new Inventaire("items32.png", map);
var msg = new Messages("items32.png");
var joueur = new Personnage("link-anime.png",1, 0,0,0,7,7,DIRECTION.BAS, ALIGNEMENT.NEUTRE,12,100,0,5,5,5);
map.addPersonnage(joueur);

// création des ennemis
var GestEnnemis = new GestionPersonnages("ennemis",joueur);

map.chargerEnnemis(GestEnnemis.ennemis);

//creation de la sauvegarde
var save = new Sauvegarde();

window.onload = function() {

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    
    canvas.width  = map.getLargeur() * 16 + 250;
    canvas.height = map.getHauteur() * 16 + 57;
    
    setInterval(function() {
	map.dessinerMap(ctx,joueur);
    }, 40);
    // affichage de l'inventaire
    inventaire.dessinerInventaire(ctx, joueur);

    // affiche la boite de message
    msg.dessinerBoiteMsg(ctx);

    // Gestion du clavier
    window.onkeydown = function(event) { 

	// On récupère le code de la touche
	var e = event || window.event;
	var key = e.which || e.keyCode;
	
	switch(key) {
	case 38 : case 122 : case 119 : case 90 : case 87 :
	    // Flèche haut, z, w, Z, W
	    joueur.deplacer(DIRECTION.HAUT, map, GestEnnemis.ennemis, joueur);
	    break;
	case 40 : case 115 : case 83 : // Flèche bas, s, S
	    joueur.deplacer(DIRECTION.BAS, map, GestEnnemis.ennemis, joueur);
	    break;
	case 37 : case 113 : case 97 : case 81 : case 65 :
	    // Flèche gauche, q, a, Q, A
	    joueur.deplacer(DIRECTION.GAUCHE, map, GestEnnemis.ennemis, joueur);
	    break;
	case 39 : case 100 : case 68 : // Flèche droite, d, D
	    joueur.deplacer(DIRECTION.DROITE, map, GestEnnemis.ennemis, joueur);
	    break;
	case 73 : // i pour sauvegarder
	    save.sauvegarder(joueur, GestEnnemis.ennemis);
	    break;
	case 79 : // o pour charger
	    save.charger(joueur, GestEnnemis.ennemis);
	    break;
	case 32 : // espace pour ramasser objets
	    inventaire.ramasserObjet(joueur,map,msg,ctx);
	    break;
	default : 
	    //alert(key);
	    // Si la touche ne nous sert pas, nous n'avons aucune raison de bloquer son comportement normal.
	    return true;
	}	 

	// Gestion de la sourie

	canvas.onclick = function(e) {
	    var coords = getCoords(this,e);
	    inventaire.clickInv(coords,msg,map,joueur,ctx);
	    //alert("Clic -> X:"+coords.x+" -> Y:"+coords.y);
	};
	
	
	//Deplacement ennemis
	GestEnnemis.deplacerEnnemis(map,joueur);

	// affichage de l'inventaire
        inventaire.dessinerInventaire(ctx, joueur);

	// Gestion de la mort (pour le moment)
	if(joueur.sante <=0) {
	    alert("vous mourrez... x_x");
	    location.reload() ;
	}
	return false;
    }

}
