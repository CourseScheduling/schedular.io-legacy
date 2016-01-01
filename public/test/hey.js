var paapi = require('apac').OperationHelper;

var Searcher = new paapi({
    awsId:     "AKIAIH5J5OH2K7O5VGAQ",
    awsSecret: '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',
    assocId:    "schedular07-20", 
});

Searcher.execute('ItemSearch', {
    'SearchIndex': 'Books',
    'Keywords': 'Physics 14',
    'ResponseGroup': 'ItemAttributes,Offers,Images'
}, function(error, results) {
    if (error) { console.log('Error: ' + error + "\n"); }
    alert(results.ItemSearchResponse.Items[0].Item[0].ImageSets[0].ImageSet[0].MediumImage[0].URL[0]);
});