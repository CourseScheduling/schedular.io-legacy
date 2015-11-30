var string  = "";
function getRandom(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

for(var i = 1;i<301;i++){
    var kitchen=getRandom(0,2);
    var bedType=["TWIN","KING","QUEEN"][getRandom(0,3)];
    var beds=["THREE","TWO","ONE"][getRandom(0,3)];
    var view=getRandom(0,2);
    var price=getRandom(2,7)*50;
    string+=[i,(kitchen?"Yes":"No"),bedType,beds,(view?"Yes":"No"),price,0,'\n'].join('|');
}

