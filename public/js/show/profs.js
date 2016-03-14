CORE.profs	=	(function(CORE){
	var _Queue	=	[];
	
	
	return	{
		map:{},
		stitch:function(schedule,section,cb){	
			if(!Object.keys(CORE.profs.map).length){
				_Queue.push([schedule,section,cb]);
			}else{
				cb&&cb(schedule,section,CORE.profs.map);
			}
			
		},
		init:function(){
			
			var profs	=	[];
			//It's easy to get all the profs from the raw
			CORE.raw.forEach(function(Course){
				for(var sectionType in Course.sections){
					Course.sections[sectionType].forEach(function(Section){
						profs	=	profs.concat(Section.profs);
					});
				}
			});
			//Remove any duplicates
			profs	=	CORE.helper.array.uniq(profs);
			
			$.get({
				url:'/g/profs?names='+JSON.stringify(profs),
				json:true,
				done:function(e){
					
						console.log(e);
					e.map(function(a){
						CORE.profs.map[a.name]	=	a;
					});
					
					while(_Queue.length){
						var stitch	=	_Queue.pop();
						//#2 is the callback #1 is the section #0 is the element
						stitch[2](stitch[0],stitch[1],CORE.profs.map);	
					}
				}
			});
			
		}

	};

})(CORE);