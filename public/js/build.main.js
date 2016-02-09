CORE	=	{
	helper:{},
	main:{
		sort:{},
		input:{},
		dropDown:{},
	},
	chosen:{
		add:{}
	}
};






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
				
CORE.main.sort	=	(function(CORE){
	return function(array,query){
		function occurrences(c, a, d) {
			c += "";
			a += "";
			if (0 >= a.length) return c.length + 1;
			var e = 0,
					b = 0;
			for (d = d ? 1 : a.length;;)
					if (b = c.indexOf(a, b), 0 <= b) ++e, b += d;
					else break;
			return e
		};
		array.sort(function(a,b){
			var aSum	=	0,bSum	=	0;
			var qA	=	query.split(' ')
			for(var i = qA.length;i--;){
				aSum+=occurrences(a.tags,qA[i]);
				bSum+=occurrences(b.tags,qA[i]);
			}
			
			return aSum-bSum;
		});
		return array;
	}
})(CORE);


CORE.main.input	=	(function(CORE){
	var input =	document.getElementById('instantInput');
	var instantContainer	=	document.getElementById('instantDrop');
	input.addEventListener('keyup',function(e){

		//when someone types into the input ajax and get all the possible course codes
		if(e.target.value=="")
			return Velocity(instantContainer,'slideUp',50);
		
		
		var term	=	CORE.main.term.currentTerm;
		var year	=	CORE.main.term.currentYear;
		$.get({
			url:'/g/course?term='+term+'&year='+year+'&q='+e.target.value,
			done:function(a){
				//Activate the dropdown and add all the possible courses
				if(a.length==0){
					Velocity(instantContainer,'slideUp',50);
					return;
				}
				var a = CORE.main.sort(a,e.target.value);
				var make	=	CORE.helper.element.create;
				while(instantContainer.children.length)
					instantContainer.removeChild(instantContainer.children[0]);
				
				a.every(function(v,i,a){
					if(i>=5)
						return false;
					var instant	=	make('div',{style:'font-family:Raleway;font-size:11px;font-weight:600;padding:7px;'});
					instant.appendChild(make('div',{style:'width:100px;text-align:right;font-weight:400;font-size:10px;color:#999;float:right;',html:v.code}));
					instant.appendChild(make('div',{html:v.name}));
					instantContainer.appendChild(instant);
					instant.addEventListener('click',function(){
						CORE.main.chosen.add(v.code);
						input.value	=	"";
					});
					return true;
				});
				if(instantContainer.style.display=='none'&&a.length>0)
					Velocity(instantContainer,'slideDown',50);

			}
		});
		
	});
	
	return {
		flush:function(){
			//Remove all the courses in the dropdown and hide the dropdown
			var instantContainer	=	document.getElementById('instantDrop');
			Velocity(instantContainer,'slideUp',50);
		}
	};
	
})(CORE);
	
CORE.main.chosen	=	(function(CORE){
	var list	=	[];
	return {
		list:list,
		add:function(a){
			//put the course in the list (if already not there)
			// display it on the screen.
			//hide the dropdown
			if(list.indexOf(a)>-1)
				return CORE.main.input.flush();
			list.push(a);
			CORE.main.input.flush();
			CORE.main.chosen.addButton(a);
			//Update coursecahe
			localStorage['courseCache']	=	CORE.main.chosen.genQuery();
		},
		
		addButton:function(a){
			var make	=	CORE.helper.element.create;
			var container	=	make('li',{class:'courseChoice-wrap','data-code':a});
				var name	=	make('div',{class:'courseChoice',html:a});
					var kill	=	make('div',{class:'courseKill'});
			CORE.helper.element.changeStyle(name,{
				backgroundColor:randomColor({luminosity:"bright",format:"hex",seed:parseInt(a,36)}),
			})
			kill.addEventListener('click',function(){
				CORE.main.chosen.killButton(a);
			});
			
			name.appendChild(kill);
			container.appendChild(name)
			
			document.getElementById('courseChoiceContainer').appendChild(container);
		},
		killButton:function(b){
			var button	=	document.querySelectorAll('[data-code="'+b+'"]')[0];
			button.parentNode.removeChild(button);
			list.splice(list.indexOf(b),1);
			//Update coursecahe
			localStorage['courseCache']	=	CORE.main.chosen.genQuery();
		},
		genQuery:function(){
			return list.join('|');
		}
	};
})(CORE);



CORE.main.term	=	(function(CORE){
	$.get({
		url:'/g/currentTerms',
		json:true,
		done:function(result){
			result	=	result.filter(function(a){return a.available==true});
			CORE.main.term.currentTerm	=	result[0].term;
			CORE.main.term.currentYear	=	result[0].year;
			[].forEach.call(document.getElementsByClassName('seasonIcon'),function(a){
				if(parseInt(a.getAttribute('data-termid'))==result[0].term){
					a.classList.add('activeTermIcon');
				}
			});
		}
	});
	return {
		currentTerm:0,
		currentYear:0
	}
})(CORE);







