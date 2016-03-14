//	I AM THE MASTER MAIN FUNCTION!

(function main(){
	
	
	//	Fetch the profs
	CORE.profs.init();
	//	Attach all the handlers
	CORE.view.menus.attach();
	CORE.view.sort.attach();
	CORE.view.filter.attach();
	//	Prepare the courses for scheduling
	CORE.main.search.prep();
	//	Schedule the courses
	CORE.main.search.start();
	if(!CORE.schedules.all.length){
		return;
	}
	//	Flatten em
	CORE.schedules.current	=	CORE.schedules.all.map(function(schedule){
		return CORE.main.search.flatten(schedule);
	}).filter(function(a,i){
		return a&&a.every(function(a){
			return !(a==undefined||a.status=='Closed');
		});
	});
	
	CORE.sort.go();
	//	Render everything
	if(CORE.schedules.current.length>0)
		CORE.render();
	//	Attach infinite scrolling
	
	CORE.view.scroll.init();

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