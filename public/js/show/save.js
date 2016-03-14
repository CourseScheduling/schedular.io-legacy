CORE.save	=	(function(CORE){
	
	$.get({
		url	:	'/m/get',
		done	:	function(schedules){
			CORE.save.schedules	=	schedules;
			CORE.save.reRender();
		}
	});
	
	
	
	
	return	{
		schedules:[],
		reRender:function(){
			CORE.save.schedules.forEach(function(schedule){
				
				var button	=	document.querySelectorAll('[data-queryCode="'+schedule.sections+'"]')[1];
				if(!button) return;
				
				button.setAttribute('data-state','active');

				button.style.backgroundImage	=	'url("/images/check.png")';
				button.style.backgroundColor	=	'#2ecc71';
				button.innerHTML	=	'Saved';
				
				
				
			});
		},
		set:function(element){


			element.setAttribute('data-state','active');

			element.style.backgroundImage	=	'url("/images/check.png")';
			element.style.backgroundColor	=	'#2ecc71';
			element.innerHTML	=	'Saved';


		},
		send:function(element){
			var code	=	element.getAttribute('data-queryCode').split('&').sort().join('.');
			if(element.getAttribute('data-state')=='active')
				return;
			element.setAttribute('data-state','active');
			$.get({
				url:[
					'/m/save?codes='+code,
					'term='+CORE.term.current.term,
					'year='+CORE.term.current.year
					].join('&'),
				done:function(a){
					CORE.save.set(element);
				}
			});
		}
		
	};
	
})(CORE);