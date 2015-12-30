var paapi = require('apac').OperationHelper;

var Searcher = new paapi({
    awsId:     "AKIAIH5J5OH2K7O5VGAQ",
    awsSecret: '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',
    assocId:    "schedular07-20", 
});

Searcher.execute('ItemSearch', {
    'SearchIndex': 'Books',
    'Keywords': 'Physics 14',
    'ResponseGroup': 'ItemAttributes,Offers'
}, function(error, results) {
    if (error) { console.log('Error: ' + error + "\n"); }
    console.log(results.ItemSearchResponse.Items[0].Item[0].OfferSummary[0]);
});