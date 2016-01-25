CORE	=	{
	dropDown:{}
}


CORE.dropDown	=	 new Searcher({
	input:document.getElementById('instantInput'),
	dropDown:doucment.getElementById('')
});








/*
*	Searcher Construtor, makes a searcher object
*	@param {Object} options
*		@param{Node} input
*		@param{Node} dropDown
*	@return {Searcher Object} this	
*/


function Searcher(options){
	var $this	=	this;
	var lastValue	=	'';
	input.addEventListener('keypress',function(e){
		//Incase a non textual key is pressed
		if(input.value	==	lastValue)
			return;
		
		lastValue	=	input.value;
		
		//We really don't want to waste time with void inputs
		if(input.value	==	'')
			return;
		
		//Show the user what we are.
		$this.display($this.find(input.value));
	});
	return this;
}


Searcher.prototype.find	=	function(query){
	$.get({
		url:'/g/course?term='+TERM+'&year='+YEAR+'&q='+e.target.value,
	})
}
