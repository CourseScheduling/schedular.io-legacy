
var amazon = require('amazon-product-api');
var DB      =   require('../../bin/db');

var Searcher = amazon.createClient({
    awsId:     "AKIAIH5J5OH2K7O5VGAQ",
    awsSecret: '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',
    awsTag:    "schedular07-20", 
});


Searcher.itemLookup({
	IdType: 'ISBN',
	ItemId: '9780545010221,0439708184'
}, function(error, results,response) {
		if (error) {
			//DB.query('DELETE FROM course.ufv_books_local WHERE id=?',isbn.id);
			return console.log(JSON.stringify(error));
		}
		console.log(results);
});

