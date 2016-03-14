(function main(){
	var buttons	=	[
		{
			page:'s/show',
			element:document.getElementById('scheduleCreate')
		},{
			page:'books',
			element:document.getElementById('booksGrab')
		}
	];
	buttons.forEach(function(button){
		button.element.addEventListener('click',function(){	
			localStorage['courseCache']	=	CORE.block.genQuery();
			document.location	=	[
				"/",
				button.page,
				"?t=",CORE.term.current.term,
				"&y=",CORE.term.current.year,
				"&c=",CORE.block.genQuery()
			].join('');
		});
	});
	
	if(!(localStorage.courseCache==undefined||localStorage.courseCache.split('|')[0]=="")){
		localStorage.courseCache.split('|').map(function(course){
			CORE.block.add(course);
		});
	}
		
})();
//Runs this shit.