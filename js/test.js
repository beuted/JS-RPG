var smiley = new Image();
smiley.src = "http://www.siteduzero.com/Templates/images/smilies/heureux.png";

window.onload = function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    
    //fait des carres
    ctx.fillStyle = 'blue';
    ctx.fillRect(10, 10, 100, 50);
    
    ctx.strokeStyle = 'red';
    ctx.strokeRect(75, 75, 50, 50);

    //dessine le smilet de 3 facons differentes
    ctx.drawImage(smiley, 200, 10);  
    ctx.drawImage(smiley, 200, 30, 100, 50); 
    ctx.drawImage(smiley, 0, 0, 10, 19, 200, 100, 10, 19);
}