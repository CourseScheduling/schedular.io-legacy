CORE	=	{
	schedules:[],
	helper:{}
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

$.get({
	url:'/m/get',
	done:function(a){
		
		//Add the schedules
		CORE.schedules	=	a.map(function(a){
			return a.sections.split('.').map(function(b){
				return parseInt(b.slice(0,-1),10);
			});
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
				//send the result to 
				console.log(e);
			}
		});
	}
});
