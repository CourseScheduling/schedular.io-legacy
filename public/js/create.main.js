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




(function(t,p){if("function"===typeof define&&define.amd)define([],p);else if("object"===typeof exports){var l=p();"object"===typeof module&&module&&module.exports&&(exports=module.exports=l);exports.randomColor=l}else t.randomColor=p()})(this,function(){function t(a,b){switch(b.format){case "hsvArray":return a;case "hslArray":return r(a);case "hsl":var c=r(a);return"hsl("+c[0]+", "+c[1]+"%, "+c[2]+"%)";case "hsla":return c=r(a),"hsla("+c[0]+", "+c[1]+"%, "+c[2]+"%, "+Math.random()+")";case "rgbArray":return m(a);
case "rgb":return"rgb("+m(a).join(", ")+")";case "rgba":return"rgba("+m(a).join(", ")+", "+Math.random()+")";default:return v(a)}}function p(a){334<=a&&360>=a&&(a-=360);for(var b in q){var c=q[b];if(c.hueRange&&a>=c.hueRange[0]&&a<=c.hueRange[1])return q[b]}return"Color not found"}function l(a){if(null===n)return Math.floor(a[0]+Math.random()*(a[1]+1-a[0]));var b=a[1]||1;a=a[0]||0;n=(9301*n+49297)%233280;return Math.floor(a+n/233280*(b-a))}function v(a){function b(a){a=a.toString(16);return 1==a.length?
"0"+a:a}a=m(a);return"#"+b(a[0])+b(a[1])+b(a[2])}function k(a,b,c){q[a]={hueRange:b,lowerBounds:c,saturationRange:[c[0][0],c[c.length-1][0]],brightnessRange:[c[c.length-1][1],c[0][1]]}}function m(a){var b=a[0];0===b&&(b=1);360===b&&(b=359);var b=b/360,c=a[1]/100;a=a[2]/100;var e=Math.floor(6*b),d=6*b-e,b=a*(1-c),h=a*(1-d*c),c=a*(1-(1-d)*c),g=d=256,f=256;switch(e){case 0:d=a;g=c;f=b;break;case 1:d=h;g=a;f=b;break;case 2:d=b;g=a;f=c;break;case 3:d=b;g=h;f=a;break;case 4:d=c;g=b;f=a;break;case 5:d=a,
g=b,f=h}return[Math.floor(255*d),Math.floor(255*g),Math.floor(255*f)]}function r(a){var b=a[1]/100,c=a[2]/100,e=(2-b)*c;return[a[0],Math.round(b*c/(1>e?e:2-e)*1E4)/100,e/2*100]}var n=null,q={};k("monochrome",null,[[0,0],[100,0]]);k("red",[-26,18],[[20,100],[30,92],[40,89],[50,85],[60,78],[70,70],[80,60],[90,55],[100,50]]);k("orange",[19,46],[[20,100],[30,93],[40,88],[50,86],[60,85],[70,70],[100,70]]);k("yellow",[47,62],[[25,100],[40,94],[50,89],[60,86],[70,84],[80,82],[90,80],[100,75]]);k("green",
[63,178],[[30,100],[40,90],[50,85],[60,81],[70,74],[80,64],[90,50],[100,40]]);k("blue",[179,257],[[20,100],[30,86],[40,80],[50,74],[60,60],[70,52],[80,44],[90,39],[100,35]]);k("purple",[258,282],[[20,100],[30,87],[40,79],[50,70],[60,65],[70,59],[80,52],[90,45],[100,42]]);k("pink",[283,334],[[20,100],[30,90],[40,86],[60,84],[80,80],[90,75],[100,73]]);var u=function(a){a=a||{};if(a.seed&&a.seed===parseInt(a.seed,10))n=a.seed;else{if(void 0!==a.seed&&null!==a.seed)throw new TypeError("The seed value must be an integer");
n=null}var b,c,e;if(null!==a.count&&void 0!==a.count){b=a.count;c=[];for(a.count=null;b>c.length;)n&&a.seed&&(a.seed+=1),c.push(u(a));a.count=b;return c}a:{b=a.hue;if("number"===typeof parseInt(b)&&(c=parseInt(b),360>c&&0<c)){b=[c,c];break a}if("string"===typeof b&&q[b]&&(b=q[b],b.hueRange)){b=b.hueRange;break a}b=[0,360]}b=l(b);0>b&&(b=360+b);c=a;if("random"===c.luminosity)c=l([0,100]);else if("monochrome"===c.hue)c=0;else{var d=p(b).saturationRange;e=d[0];d=d[1];switch(c.luminosity){case "bright":e=
55;break;case "dark":e=d-10;break;case "light":d=55}c=l([e,d])}e=a;a:{for(var d=c,h=p(b).lowerBounds,g=0;g<h.length-1;g++){var f=h[g][0],k=h[g][1],m=h[g+1][0],r=h[g+1][1];if(d>=f&&d<=m){h=(r-k)/(m-f);d=h*d+(k-h*f);break a}}d=0}f=100;switch(e.luminosity){case "dark":f=d+20;break;case "light":d=(f+d)/2;break;case "random":d=0,f=100}e=l([d,f]);return t([b,c,e],a)};return u});





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
	var input =	document.getElementById('courseInput');
	var instantContainer	=	document.getElementById('instantDropDown');
	input.addEventListener('keyup',function(e){

		//when someone types into the input ajax and get all the possible course codes
		if(e.target.value=="")
			return Velocity(instantContainer,'slideUp',50);
		$.get({
			url:'/g/course?q='+e.target.value,
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
					var instant	=	make('div',{class:'instant-resultContainer'});
					instant.appendChild(make('strong',{class:'instant-resultCourseName',html:v.name}));
					instant.appendChild(make('span',{class:'instant-resultCourseCode',html:v.code}));
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
			var instantContainer	=	document.getElementById('instantDropDown');
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
	

CORE.main.init	=	(function(CORE){
	var button	=	document.getElementById('scheduleCreate')
	button.addEventListener('click',function(){	
		localStorage['courseCache']	=	CORE.main.chosen.genQuery();
		document.location	=	"/s/show?c="+CORE.main.chosen.genQuery();
	});
	
	if(!(localStorage.courseCache==undefined||localStorage.courseCache.split('|')[0]=="")){
		localStorage.courseCache.split('|').map(function(course){
			CORE.main.chosen.add(course);
		});
	}
		
})(CORE);

















