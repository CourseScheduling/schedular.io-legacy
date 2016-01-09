CORE	=	{
	schedules:[],
	helper:{},
	courseCache:[],
	crnMap:{},
	box:{},
	gear:{}
}




CORE.helper.element =  (function(CORE){
		return {
				changeStyle:function(element,styles){
						for(var attributes in styles)
								element.style[attributes]=styles[attributes];
				},
				create:function(type,attributes){
						var element =   document.createElement(type);
						if(attributes.html!==undefined){
							element.innerHTML	=	attributes.html;
							delete attributes.html;
						}
						for(var attributeName in attributes)
								element.setAttribute(attributeName,attributes[attributeName]);
						return element;
				}
		}
})(CORE);


CORE.box	=	(function(CORE){
	
	return {
		setToolbar:function(el){
			
			el.addEventListener('mouseover',function(){
				
			});
		},
		render:function(){
			CORE.schedules.forEach(function(v,i,a){
				var box	=	CORE.helper.element.create('div',{class:'box'});
				var sched	=	CORE.helper.element.create('canvas',{class:'m-schedule-thumb',height:'200px',width:'200px'});
				v.crn.forEach(function(g,n,l){
					CORE.box.gen(CORE.crnMap[g],sched);
				});
				
				box.appendChild(sched);
				box.appendChild(CORE.helper.element.create('div',{class:'box-title',html:v.data.name}));
				document.getElementById('box-container').appendChild(box);
			});
			CORE.gear.off();
		},
		gen:function(section,thumb){
			var ctx	=	thumb.getContext('2d');
			var color	=	randomColor({luminosity:"bright",format:"hex",seed:parseInt(section.title,36)});
			ctx.fillStyle	=	color;
			console.log(section);
			section.times.forEach(function(v,i,a){
				v.days.forEach(function(g,n,l){
					ctx.fillRect(g*26+g+28,(v.start-480)/5,26,(v.end-v.start)/6);
				});
			});			
		}
	};
	
})(CORE);

$.get({
	url:'/m/get',
	done:function(a){
		
		//Add the schedules
		CORE.schedules	=	a.map(function(a){
			return {
				data:a,
				crn:a.sections.split('.').map(function(b){
					return parseInt(b.slice(0,-1),10);
				})
			}
		});
		
		//Create a map to send
		tempMap	=	{C:{},L:{},T:{}};
		a.forEach(function(save){
			save.sections.split('.').forEach(function(uniq){
				tempMap[uniq.substr(-1) ][uniq.slice(0,-1)]=1;
			});
		});
		//Stringify the map
		var crns	=	JSON.stringify({
			C:Object.keys(tempMap.C),
			L:Object.keys(tempMap.L),
			T:Object.keys(tempMap.T)
		});
		//Send the map to the server, get the result
		$.get({
			url:'/g/byUniq?uniq='+crns,
			done:function(e){
				//save the results to a cache
				CORE.courseCache	=	e;
				
				//create a map of the crns to easily get them
				e.map(function(a){
					a.sections.C.map(function(b){
						CORE.crnMap[b.uniq]	=	b;
					});
					a.sections.L.map(function(b){
						CORE.crnMap[b.uniq]	=	b;
					});
					a.sections.T.map(function(b){
						CORE.crnMap[b.uniq]	=	b;
					});
				});
				CORE.box.render();
				//show the boxes to the user;
			}
		});
	}
});


CORE.gear	=	(function(){
	return	{
		gear:document.getElementById('main-loadingGear'),
		on:function(){
			this.gear.style.display	=	'block';
		},
		off:function(){
			this.gear.style.display	=	'none';
		}
	}
})(CORE);




