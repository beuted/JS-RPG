function Messages(url1) {
    // Chargement de l'image pr la boite de msg ///////////////////////////
    this.imgmsg = new Image();
    this.imgmsg.referenceItem = this;
    this.imgmsg.onload = function() {
	if(!this.complete) 
	    throw "Erreur de chargement du sprite nommé \"" + url1 + "\".";

	this.referenceItem.largeur = this.width /6;
	this.referenceItem.hauteur = this.height /5;
    }
    this.imgmsg.src = "sprites/" + url1;

}

Messages.prototype.dessinerBoiteMsg = function(context) {

context.drawImage(
	    this.imgmsg, 
	    0, 456, // Point d'origine du rectangle source à prendre dans notre image
	    492, 57, // Taille du rectangle source
	    0, 15 * 16, // Point de destination 
            492, 57);
}

Messages.prototype.infoObjet = function(objet,context) {
    
    this.dessinerBoiteMsg(context);

    context.strokeText(objet.nom, 12, map.getHauteur()*16 + 20);
    context.strokeText("deg : +" + objet.degat, 112, map.getHauteur()*16 + 20);
    context.strokeText("def : +" + objet.armure, 112, map.getHauteur()*16 + 40);
    context.strokeText("frc : +" + objet.force, 162, map.getHauteur()*16 + 20);
    context.strokeText("int : +" + objet.intel, 162, map.getHauteur()*16 + 40);
    context.strokeText("dex : +" + objet.dex, 212, map.getHauteur()*16 + 20);

}

Messages.prototype.dessinerBoutons = function(context, poser, utiliser) {
    if(poser != 0) {
	context.drawImage(
	    this.imgmsg, 
	    512, 456, // Point d'origine du rectangle source à prendre dans notre image
	    57, 19, // Taille du rectangle source
	    425, 15*16+8, // Point de destination 
            57, 19);

	context.strokeText("poser", 433, 15*16+21);
    }
    if(utiliser != 0) {
	context.drawImage(
	    this.imgmsg, 
	    512, 456, // Point d'origine du rectangle source à prendre dans notre image
	    57, 19, // Taille du rectangle source
	    425, 15*16+8+19+2, // Point de destination 
            57, 19);

	context.strokeText("utiliser", 433, 15*16+21+21);
    }
}

Messages.prototype.afficherPhrase = function(phrase,context) {
    
    this.dessinerBoiteMsg(context);
    context.strokeText(phrase, 12, map.getHauteur()*16 + 20);
}