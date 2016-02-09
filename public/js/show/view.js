/*
*	CORE menus	-	the handler for anything menu related i.e. lower drop
*		
*		@key	{Array} menus	-> object containing nodes of all menus and triggers	
*		@method	attach	->	attaches all the proper eventlisteners to the DOM
*		@method	outside	->	slides the menu up on a click outside the menu
*/

CORE.view.menus	=	(function(CORE){
	var menus	=	[
		{
			menu		:	document.getElementById('sort-dropDownList'),
			trigger	:	document.getElementById('sort-dropDownButton')
		},
		{
			menu		:	document.getElementById('lowerControls'),
			trigger	:	document.getElementById('advancedButton'),
			manual	:	true
		}
	];
	
	
	
	
	return {
		menus:menus,
		attach:function(){
			var _this	=	this;
			menus.forEach(function(menu,i,a){
				menu.trigger.addEventListener('click',function(){
					if(menu.menu.style.display!=='block'){
						Velocity(menu.menu,'slideDown',100);
						if(!menu.manual)
							_this.outSlide(menu.menu,menu.trigger);
					}else{
						Velocity(menu.menu,'slideUp',100);
					}
				});
			});
		},
		outSlide:function(menu,trigger){
			var clicker	=	function(e){
				if(menu.contains(e.target)||e.target==menu)
					return;
				
				if(trigger.contains(e.target)||e.target==trigger)
					return;
				
				Velocity(menu,'slideUp',100);
				document.removeEventListener('click',clicker);
			};
			document.addEventListener('click',clicker);
		}
	}
	
})(CORE);


/*
*	CORE sort	-	the handler for sort related
*		
*		@key	{Array} menus	-> object containing nodes of all menus and triggers	
*		@method	attach	->	attaches all the proper eventlisteners to the DOM
*
*/

CORE.view.sort	=	(function(CORE){
	var menus	=	[
		{
			menu		:	document.getElementById('sort-dropDownButton'),
			trigger	:	document.getElementById('sort-dropDownList'),
		}
	];
	
	
	
	
	return {
		menus:menus,
		attach:function(){
			//Grab the labels and menus
			var _menu				=	document.getElementById('sort-dropDownList');	
			var _sortLabel	=	document.getElementById('sort-dropDownLabel');
			
			//Go through each button
			[].forEach.call(document.getElementsByClassName('sort-dropDownItem'),function(el){
					el.addEventListener('click',function(){
						//Grab the currently active sort
						var _currentActive	=	document.getElementsByClassName('sort-dropDownItem-active')[0];
						//Make it unactive now
						_currentActive.classList.remove('sort-dropDownItem-active');
						//Change the active to the current one
						el.classList.add('sort-dropDownItem-active');
						//Show the user
						_sortLabel.innerHTML	=	el.getAttribute('data-value');
						//Hide the menu.
						Velocity(_menu,'slideUp',100);
						//Regenerate the scheduls
						CORE.render(-1);
					});
			});
		}
	}
	
})(CORE);


/*
*	CORE filter	-	the handler for sort related
*		
*		@key	{Array} menus	-> object containing nodes of all menus and triggers	
*		@method	attach	->	attaches all the proper eventlisteners to the DOM
*
*/

CORE.view.filter	=	(function(CORE){
	var menus	=	[
		{
			menu		:	document.getElementById('sort-dropDownButton'),
			trigger	:	document.getElementById('sort-dropDownList'),
		}
	];
	
	
	
	
	return {
		menus:menus,
		attach:function(){
		
		}
	}
	
})(CORE);


/*
*	CORE render	->	Renders the schedules for the students
*
*		@param {Integer} start	|		place to start putting out schedules
*		@param {Integer}	num		|		number of schedules to put out, default is 10
*/

CORE.render	=	(function(CORE){
	
	var _schCounter	=	0;
	var	_container	=	document.getElementById('main-scheduleContainer');
	
	var _gen	=	{
		gen:function(options){
			var _this	=	this;
			var Schedule	=	document.getElementById('scheduleWrapTemplate').cloneNode(true);
			var _container	=	Schedule.getElementsByClassName('s-timeBlockWrap')[0];
			
			//We don't want this showing
			Schedule.id	='';
			
			console.log(options);
			options.forEach(function(section){
				section.times.forEach(function(timeBlock){
					var blocks	=	[];
					blocks	=	_this.makeBlocks(timeBlock,section);
					blocks.forEach(function(block){
						console.log(_container);
						_container.appendChild(block)});
					
				});
			});	
			
			return Schedule;
		},
		makeBlocks:function(time,section){
			var days	=	[];
			time.days.forEach(function(day){
				if(day==-1)	
					return document.createElement('div');
            //Make a timeblock element
				var timeBlock   =   CORE.helper.element.create('div',{class:'s-timeBlock'});
            //Adjust its styles.
				CORE.helper.element.editStyle(timeBlock,{
					top     :   [(time.start-480)/2,'px'].join(''),
					left    :   [((day+1)%7)*71,'px'].join(''),
					height  :   [(time.end-time.start)/2,'px'].join(''),
					lineHeight  :   [(time.end-time.start-4)/2,'px'].join(''),
					color   :   '#FFFFFF',
					backgroundColor :   CORE.helper.color.bgColor(section.title)
				});
				timeBlock.innerHTML=section.title;
            //return the timeblock
				days.push(timeBlock);
			});
			return days;
		}
	}
	
	
	
	return function(start,num){
		//Initialize variables
		start	=	start||_schCounter;
		num		=	num||10;
		
		//If the counter is restarting, clear the innerHTML
		if(start===-1){
			//Remove all the children
			while(_container.children[0])
				_container.removeChild(_container.children[0]);
			//Set start to 0
			start++;
		}
		
		
		//Output the schedules
		for(var i = start;i<(start+num);i++){
			_container.appendChild(
				_gen.gen(CORE.schedules.current[i])
			);
		}
		
		//Set the schedulecCounter to new starting place
		_schCounter	=	start+num;
	}
	
})(CORE);
