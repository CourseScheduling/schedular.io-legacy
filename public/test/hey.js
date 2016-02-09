
var amazon = require('amazon-product-api');
var DB      =   require('../../bin/db');

var Searcher = amazon.createClient({
    awsId:     "AKIAIH5J5OH2K7O5VGAQ",
    awsSecret: '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',
    awsTag:    "schedular07-20", 
});

DB.query('SELECT * FROM course.ufv_books_local',function(e,d){
	if(e)
		throw (e)
	
	var counter	=	0;
	var k = setInterval(function(){
		var isbn	=	d[counter++];
		
		Searcher.itemLookup({
			IdType: 'ISBN',
			ItemId: isbn.isbn
		}, function(error, results,response) {
				if (error) {
					//DB.query('DELETE FROM course.ufv_books_local WHERE id=?',isbn.id);
					return console.log(JSON.stringify(error),isbn);
				}
				console.log(results);
		});
		
		
		if(counter==d.length)
			clearInterval(k);
	},1000);
});	