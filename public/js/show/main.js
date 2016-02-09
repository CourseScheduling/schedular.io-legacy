//	I AM THE MASTER MAIN FUNCTION!

(function main(){
	
	
	//	Attach all the handlers
	CORE.view.menus.attach();
	CORE.view.sort.attach();
	CORE.view.filter.attach();
	
	//	Prepare the courses for scheduling
	CORE.main.search.prep();
	//	Schedule the courses
	CORE.main.search.start();
	//	Flatten em
	CORE.schedules.current	=	CORE.schedules.current.map(function(schedule){
		return CORE.main.search.flatten(schedule);
	}).filter(function(a,i){
		return a.every(function(a){
			return !(a==undefined||a.status=='Closed');
		});
	});
	//	Render everything
	if(CORE.schedules.current.length>0)
		CORE.render();

})();

// I RUN THIS SHIT

/*
* COMPILATION Steps
*		1.) Compile each module individually
*		2.)	Concatenate to A.full.min.js
*		3.) Wrap in closure
*		4.) Attach CORE Object to Window
*		5.)	Recompile everything
*/