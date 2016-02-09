//var mongo	=	require('monk')('mongodb://jo:jo@ds033915.mongolab.com:33915/schedular');
var mongo	=	require('monk')('localhost/schedular');

module.exports = mongo;