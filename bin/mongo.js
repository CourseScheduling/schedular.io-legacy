var mongo	=	require('monk')('mongodb://jo:jo@ds033915.mongolab.com:33915/schedular');
module.exports = mongo;