CORE	=	{
	dropDown:{}
}


CORE.dropDown	=	 new Searcher({
	input:document.getElementById('instantInput'),
	dropDown:doucment.getElementById('')
});








/*
*	Searcher Contrutor, makes a searcher object
*	@param {Object} options
*		@param{Node} input
*		@param{Node} dropDown
*	@return {Searcher Object} this	
*/


function Searcher(options){
	var lastValue	=	'';
	input.addEventListener('keypress',function(e){
		//Incase a non textual key is pressed
		if(input.value	==	lastValue)
			return;
		
		lastValue	=	input.value;
		
		//We really don't want to waste time with void inputs
		if(input.value	==	'')
			return;
		console.log(input.value);
		
	});
	
}