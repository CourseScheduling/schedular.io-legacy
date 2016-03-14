CORE.term	=	(function(CORE){
	
	
	//Declare some variables
	var CACHE_TTL			=	86400E3 //this is 1 day in ms
	var $localStorage	=	CORE.helper.localStorage;
	var currentTerm		=	{};
	var TERM_SET	=	{
		0	:	'Winter',
		1	:	'Summer',
		2	:	'Fall'
	}
	
	//Function used to grab the terms
	var grabTerms	=	function(){
	
		$.get({
			url	:	'/g/currentTerms',
			done:function(terms){
				//Set the cache
				CORE.term.cache	=	terms;
				//The last term pushed in is the current one, right?
				CORE.term.current	=	terms[terms.length-1];
				//Update the cache
				$localStorage.set('user-currentTerm',CORE.term.current,CACHE_TTL);
				$localStorage.set('user-termCache',CORE.term.cache,CACHE_TTL);
				
				
				//Now update the client
				updateClient(terms,CORE.term.current);
			}
		});					 
						 
	}
	
	var updateClient	=	function(termArray,current){
		//Remove all the available
		var a;
		while((a = document.getElementsByClassName('termIcon-available')).length){
			a.children[0].classList.remove('termIcon-available');
		}
		
		//Make all the active terms online
		termArray.slice(-1).forEach(function(term){
			
			[].forEach.call(document.getElementsByClassName('seasonIcon'),function(icon){
			
				if(parseInt(icon.getAttribute('data-termId'))!==term.term)
					return;
				
				//if the term matches to the one that's currently active set it up
				icon.classList.add('termIcon-available');
				
				//if ther term is ther current term, activate it
				if(parseInt(icon.getAttribute('data-termId'))==current.term){
					icon.id	=	'termIcon-active';
					icon.setAttribute('data-gttlbl',[TERM_SET[term.term],term.year,'(current)'].join(' '));
				}
			});
		});
		
	}
	

	
	//Select the actual term
	if((currentTerm	=	$localStorage.get('user-currentTerm'))){
		var termCache	=	$localStorage.get('user-termCache');
		updateClient(termCache,currentTerm);	
		
 	}else{
		grabTerms();		
	}
	
	
	
	return {
		current	:	currentTerm,
		cache		:	termCache,
		fetch		:	grabTerms
	};
	
})(CORE);