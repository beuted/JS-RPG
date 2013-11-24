/* Fonction de clonage
 
function clone(srcInstance)
{
	if(typeof(srcInstance) != 'object' || srcInstance == null)
	{
		return srcInstance;
	}
	var newInstance = srcInstance.constructor();
	for(var i in srcInstance)
	{
		newInstance[i] = clone(srcInstance[i]);
	}
	return newInstance;
}
 ****************************************************************  */

/* *************** fonction manipulant les cookies ************** */
function setCookie(sName, sValue) {
        var today = new Date(), expires = new Date();
        expires.setTime(today.getTime() + (365*24*60*60*1000));
        document.cookie = sName + "=" + encodeURIComponent(sValue) + ";expires=" + expires.toGMTString();
}

function getCookie(sName) {
        var cookContent = document.cookie, cookEnd, i, j;
        var sName = sName + "=";
 
        for (i=0, c=cookContent.length; i<c; i++) {
                j = i + sName.length;
                if (cookContent.substring(i, j) == sName) {
                        cookEnd = cookContent.indexOf(";", j);
                        if (cookEnd == -1) {
                                cookEnd = cookContent.length;
                        }
                        return decodeURIComponent(cookContent.substring(j, cookEnd));
                }
        }       
        return null;
}
/* ****************************************************************  */

function Sauvegarde() {
}

Sauvegarde.prototype.sauvegarder = function(personnage, ennemis) {
    var temp = personnage.x + "," + personnage.y + "," + personnage.alignement + "," + personnage.sante + "," + personnage.force + ",";
    for (var i = 0 ; i < ennemis.length ;  i++) {  
	temp = temp + ennemis[i].x + "," + ennemis[i].y + "," + ennemis[i].alignement + "," + ennemis[i].sante + "," + ennemis[i].force + ",";
    }
    setCookie("minirpg", temp);
}

Sauvegarde.prototype.charger = function(personnage, ennemis) {
    var temp = getCookie("minirpg");
    var coord = temp.split(',');
    personnage.x = coord[0]; personnage.y = coord[1]; personnage.alignement = coord[2]; personnage.sante = coord[3]; personnage.force = coord[4];
    for (var i = 0 ; i < ennemis.length ;  i++) {  
	ennemis[i].x = coord[5+ 5*i]; ennemis[i].y = coord[5+ 5*i+1]; ennemis[i].alignement = coord[5+ 5*i+2]; ennemis[i].sante = coord[5+ 5*i+3]; ennemis[i].force = coord[5+ 5*i+4];
    }
}