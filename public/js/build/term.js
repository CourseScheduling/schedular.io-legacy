CORE.term	=	(function(CORE){
	$.get({
		url:'/g/currentTerms',
		done:function(e){
			term	=	e[0];
			CORE.term	=	{
				term:term.term,
				year:term.year
			};
		}
	});
	
	return {};
})(CORE);