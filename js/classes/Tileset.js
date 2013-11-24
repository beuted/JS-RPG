function Tileset(url) {
	// Chargement de l'image dans l'attribut image
	this.image = new Image();
	this.image.referenceDuTileset = this;
	this.image.onload = function() {
		if(!this.complete) 
			throw new Error("Erreur de chargement du tileset nommé \"" + url + "\".");
		
		// Largeur du tileset en tiles
	    this.referenceDuTileset.largeur = 19;//this.width / 16;
	}
	this.image.src = "tilesets/" + url;
}

// Méthode de dessin du tile numéro "numero" dans le contexte 2D "context" aux coordonnées xDestination et yDestination
Tileset.prototype.dessinerTile = function(numero, context, xDestination, yDestination) {
	var xSourceEnTiles = numero % this.largeur;
	if(xSourceEnTiles == -1) xSourceEnTiles = this.largeur;
	var ySourceEnTiles = Math.floor(numero / this.largeur) +1;
	
	var xSource = (xSourceEnTiles) * 17;
	var ySource = (ySourceEnTiles - 1) * 17;
	
	context.drawImage(this.image, xSource, ySource, 16, 16, xDestination, yDestination, 16, 16);
}
