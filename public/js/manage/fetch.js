CORE.fetch	=	(function(CORE){

	

	$.get({
		url:'/m/get',
		done:function(a){

			//Add the schedules
			CORE.schedules	=	a.map(function(a){
				return {
					data:a,
					crn:a.sections.split('&').map(function(b){
						return parseInt(b.slice(0,-1),10);
					})
				}
			});


			//Create a map to send
			var tempMap	=	{C:{},L:{},T:{}};
			a.forEach(function(save){
				save.sections.split('&').forEach(function(uniq){
					tempMap[uniq.substr(-1)][uniq.slice(0,-1)]=1;
				});
			});

			//Prepossess and send the map
			CORE.fetch.courses(tempMap);

		}
	});
	
	
	
	
	return {
		courses	:	function(uniqMap){
		
			//Stringify the map
			var JSONpacket	=	{};
			var crnMap	=	{};
			for(var type in uniqMap){
				JSONpacket[type]	=	Object.keys(uniqMap[type]);
			}
			
			
			//Send the map to the server, get the result
			$.get({
				url:'/g/byUniq?uniq='+JSON.stringify(JSONpacket),
				done:function(e){
					//save the results to a cache
					CORE.courseCache	=	e;

					//create a map of the crns to easily get them
					e.map(function(a){	
						for(var type in a.sections){
							a.sections[type].map(function(b){
								CORE.uniqMap[b.uniq]	=	b;
							});
						}
					});
					CORE.render.box();
					//show the boxes to the user;
				}
			});
			
		}

	}


})(CORE);