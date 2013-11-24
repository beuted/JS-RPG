function GestionPersonnages(nom, joueur) {

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
        // recuperation des donnee d'emplacement initiale du joueur
        joueur.xMap = mapData.departjoueur[0];
        joueur.yMap = mapData.departjoueur[1];
        joueur.etage = mapData.departjoueur[2];
        joueur.x = mapData.departjoueur[3];
        joueur.y = mapData.departjoueur[4];

        // recuperation des ennemis
        this.ennemis = [];
        for (var i = 0; i < mapData.ennemis.length; i++) {
	    var persoTemp = new Personnage(mapData.ennemis[i][0],mapData.ennemis[i][1],mapData.ennemis[i][2],mapData.ennemis[i][3],mapData.ennemis[i][4],mapData.ennemis[i][5],mapData.ennemis[i][6],mapData.ennemis[i][7],mapData.ennemis[i][8],mapData.ennemis[i][9],mapData.ennemis[i][10],mapData.ennemis[i][11],mapData.ennemis[i][12],mapData.ennemis[i][13],mapData.ennemis[i][14]);
	    this.ennemis.push(persoTemp);
        }
}

//Deplacement ennemis
GestionPersonnages.prototype.deplacerEnnemis = function(map, joueur) {
    for (var i = 0 ; i < this.ennemis.length ;  i++) {
	if (this.ennemis[i].sante > 0) {
            this.ennemis[i].deplacerIA(map, joueur, this.ennemis, joueur);
	} else {
	    map.supprPersonnage(this.ennemis[i].x,this.ennemis[i].y); 
	    this.ennemis.splice(i,1);
	}
    }
}

