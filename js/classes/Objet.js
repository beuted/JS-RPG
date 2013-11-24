// IMPORTANT : Lorsque "skin" d'un objet vaut 0 il est considéré comme inexistant.

var TYPE = {
    	"CASQUE"     : 0,
	"ARMURE"     : 1,
	"JAMBIERES"  : 2,
        "CHAUSSURES" : 3,
        "EPEE"       : 4,
        "AUTRE"      : 5
}  

function Objet(etage,mapx,mapy,x,y,skin,degat,armure,force,intel,dex) {
    // Position de l'objet sur la carte
        this.etage = etage;
        this.mapx = mapx;
        this.mapy = mapy;
        this.x = x;
        this.y = y;
    
        this.skin = skin;
    // Bonus que l'objet confere
        this.degat = degat;
        this.armure = armure;
        this.force = force;
        this.intel = intel;
        this.dex = dex;

    // Type d'objet
    if ( this.skin >=0 && this.skin <=4)
        this.type = TYPE.CASQUE;
    else if ( this.skin >=19 && this.skin <=23)
	this.type = TYPE.ARMURE;
    else if ( this.skin >=38 && this.skin <=42)
	this.type = TYPE.JAMBIERES;
    else if ( this.skin >=57 && this.skin <=61)
	this.type = TYPE.CHAUSSURES;
    else if ( this.skin >=76 && this.skin <=80)
	this.type = TYPE.EPEE;
    else
	this.type = TYPE.AUTRE;

    // Nom de l'objet
    if (this.type == TYPE.CASQUE)
	this.nom = "un casque";
    if (this.type == TYPE.ARMURE)
	this.nom = "une cuirasse";
    if (this.type == TYPE.JAMBIERES)
	this.nom = "des jambieres";
    if (this.type == TYPE.CHAUSSURES)
	this.nom = "des bottes";
    if (this.type == TYPE.EPEE)
	this.nom = "une epee";
}