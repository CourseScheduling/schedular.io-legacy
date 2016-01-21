CORE	=	{
	schedules:[],
	helper:{},
	courseCache:[],
	crnMap:{},
	box:{},
	gear:{}
}



CORE.helper.section	=	(function(CORE){
	return {
		typeName:function(section){
			switch(section.type){
				case 'C': return'Lec'; break; 
				case 'L': return'Lab'; break; 
				case 'T': return'Tut'; break; 
			}
		}
	};
})(CORE);
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
		render:function(){
			CORE.schedules.forEach(function(v,i,a){
				var box	=	document.getElementById('boxPossibleTemplate').cloneNode(true);
				box.id='';
				var sched	=	box.getElementsByClassName('box-image')[0];
				v.crn.forEach(function(g,n,l){
					
					var label	=	CORE.helper.element.create('div',{
						class:'box-courseTab',
						html:CORE.crnMap[g].title+' '+CORE.helper.section.typeName(CORE.crnMap[g])
					});
					
					CORE.helper.element.changeStyle(label,{
						backgroundColor:randomColor({luminosity:"bright",format:"hex",seed:parseInt(CORE.crnMap[g].title,36)})
					});
					box.getElementsByClassName('box-infoContainer')[0].appendChild(label);
					
					CORE.box.gen(CORE.crnMap[g],sched);
				});
				box.getElementsByClassName('box-infoTitle')[0].innerHTML	=	v.data.name;
				box.getElementsByClassName('box-createTime')[0].innerHTML	=	(new Date(v.data.timestamp*1000)).toDateString();
				document.getElementById('box-container').appendChild(box);
			});
			CORE.gear.off();
		},
		gen:function(section,thumb){
			var ctx	=	thumb.getContext('2d');
			var color	=	randomColor({luminosity:"bright",format:"hex",seed:parseInt(section.title,36)});
			console.log(section);
			section.times.forEach(function(v,i,a){
				v.days.forEach(function(g,n,l){
					ctx.fillStyle	=	color;
					ctx.strokeStyle	=	color;
					ctx.roundRect(g*26+g+28,(v.start-480)/5,26,(v.end-v.start)/6,5).fill();
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




CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
  this.closePath();
  return this;
}