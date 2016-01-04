


CORE	=	{
	raw	:	RAW_COURSE_DATA,
	schedules	:	{
		all:[],
		current:[]
	},
	courses	:	[],
	helper	:	{},
	main	:	{
		search	:	{}
	},
	views	:	{
		schedule:{},
	}
}




        CORE.helper.color   =   (function(CORE){
            return {
                changeTint:function(hex, lum) {
                    // validate hex string
                    hex = String(hex).replace(/[^0-9a-f]/gi, '');
                    if (hex.length < 6) {
                        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
                    }
                    lum = lum || 0;

                    // convert to decimal and change luminosity
                    var rgb = "", c, i;
                    for (i = 0; i < 3; i++) {
                        c = parseInt(hex.substr(i*2,2), 16);
                        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
                        rgb += ("00"+c).substr(c.length);
                    }

                    return rgb;
                },
                getTextColor:function(code){
									return '#FFFFFF'
                    code    =   code.substr(1);
                    var r = parseInt(code.substr(0,2),16);
                    var g = parseInt(code.substr(2,2),16);
                    var b = parseInt(code.substr(4,2),16);

                   var nThreshold = 105;
                   var bgDelta = (r * 0.299) + (g * 0.587) + (b * 0.114);

                   return ((255 - bgDelta) < nThreshold) ? "#222222" : "#ffffff";   
                },
                getBackgroundColor:function(code){
									return randomColor({luminosity:"bright",format:"hex",seed:parseInt(code,36)});           
                    return "#"+this.changeTint(
                        ('000000'+(
                            parseInt(
                                parseInt(code, 36)
                                .toExponential()
                                .slice(2,-5), 10) & 0xFFFFFF)
                         .toString(16)
                         .toUpperCase())
                        .slice(-6),0.1);
                }
            };
        })(CORE);



        CORE.helper.element =  (function(CORE){
            return {
                changeStyle:function(element,styles){
                    for(var attributes in styles)
                        element.style[attributes]=styles[attributes];
                },
                createDiv:function(attributes){
                    var element =   document.createElement('div');
                    for(var attributeName in attributes)
                        element.setAttribute(attributeName,attributes[attributeName]);
                    return element;
                }
            }
        })(CORE)
CORE.helper.time	=	(function(CORE){
	return {
		inTime:function(start,end,start2,end2){
				if(start==0||start2==0)
						return false;
				if((((start2>=start)&&(start2<end))||((end2>start)&&(end2<end)))||(((start>=start2)&&(start<end2))||((end>start2)&&(end<end2))))
						return true;
				return false;
		},
		sameArr:function(day1,day2){
				if(day1[0]==-1||day2[0]==-1)
								return false;
				for (var i = 0; i < day1.length; i++) {
						if (day2.indexOf(day1[i]) > -1) {
								return true;
						}
				}
				return false;
		}
	};
})(CORE.helper);

CORE.helper.array	=(function(HELPER){
	return {
		returnByField:function(array,field,value){
			for(var i = 0;i<array.length;i++){
				if(array[i][field]==value)
					return array[i];
			}
			return false;
		}
		
		
	};
})(CORE.helper);

CORE.main.search	=	(function(CORE){
	var possible	=	[];
	return {
		prep:function(){
			var mangledArray	=	[];
			CORE.raw.forEach(function(course){
				var typeArray	=	[];
				for(var type in course.sections){
					typeArray.push(course.sections[type]);
				}
				typeArray.sort(function(a,b){return b.length-a.length;});

				var mangla	=	[];
				course.mangled.forEach(function(v,i,a){
					var mJ	=	{times:[]};
					v.forEach(function(uniq,i){
						var i = 0;
						var found = false;
						while(!found&&i<4){
							found	=	CORE.helper.array.returnByField(typeArray[i],'uniq',uniq);
							i++;
						}
						mJ[i-1]	=found;
						mJ.times	=	mJ.times.concat(found.times);
						mJ.length = i;
					});
					mangla.push(mJ);
				});
				mangledArray.push(mangla);
			});
			mangledArray.sort(function(a,b){return b.length-a.length;});
			return mangledArray;
		},
		start:function(){
			CORE.courses[CORE.courses.length-1].forEach(function(section,index){
				depth([section],CORE.courses.length-2);
			});

			
			function depth(pos,index){
				if(index<0)
					return possible.push(pos);
				var course = CORE.courses[index];
				var layerI	=	CORE.courses[index].length;
				up:
				while(layerI--){
					var posI	=	pos.length;
					if(course[layerI].times[0].days[0]==-1)
						posI=0;
					while(posI--){
						var timeP	=	pos[posI].times.length;
						
						while(timeP--){
							var timeL	=	course[layerI].times.length;
							while(timeL--){
									
								var tP	=	pos[posI].times[timeP];
								var tL	=	course[layerI].times[timeL];
								if(CORE.helper.time.inTime(tP.start,tP.end,tL.start,tL.end)&&CORE.helper.time.sameArr(tP.days,tL.days)){
									continue up;
								}
								
							}
						}
						
					}
					if(index==0)
						possible.push(pos.concat(course[layerI]));
					else
						depth(pos.concat(course[layerI]),index-1);
				}
			}
			
			return possible;
		},
			
		check:function(mangle1,mangle2){
				
		}
	};
})(CORE);


var d = new Date();
CORE.courses	=	CORE.main.search.prep();
console.log('Prep took: '+((new Date())-d)+'ms');


var d = new Date();
CORE.schedules.all	=	CORE.main.search.start();
console.log('Scheduling took: '+((new Date())-d)+'ms');





















CORE.views.schedule  =   (function(CORE){
	return {
		flatten:function(schedule){
			var sections	=	[];
			for(var i = 0;i<schedule.length;i++){
				for(var g = 0;g<schedule[i].length;g++){
					sections.push(schedule[i][g]);
				}
			}
			return sections;
		},
		gen:function(options){
			var Schedule	=	document.getElementById('scheduleWrapTemplate').cloneNode(true);
			Schedule.id	='';
			options.forEach(function(section){
				if(section==undefined)
					return;
				section.times.forEach(function(time){
					CORE.views.schedule.makeBlocks(time,section).map(function(a){
						Schedule.getElementsByClassName('s-timeBlockWrap')[0].appendChild(a);
					});
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
				var timeBlock   =   CORE.helper.element.createDiv({class:'s-timeBlock'});
            
            //Adjust its styles.
				CORE.helper.element.changeStyle(timeBlock,{
					top     :   [(time.start-480)/2,'px'].join(''),
					left    :   [((day+1)%7)*71,'px'].join(''),
					height  :   [(time.end-time.start)/2,'px'].join(''),
					lineHeight  :   [(time.end-time.start-4)/2,'px'].join(''),
					color   :   CORE.helper.color.getTextColor(CORE.helper.color.getBackgroundColor(section.title)),
					backgroundColor :   CORE.helper.color.getBackgroundColor(section.title)
				});
				timeBlock.innerHTML=section.title
            //return the timeblock
				days.push(timeBlock);
			});
			return days;
		}
	}
})(CORE);






                CORE.views.checkBoxes    =   (function(CORE){
                    
                    var publicVars  =   {
                        onClick:function(e){
                            var checked     =    e.target.getAttribute('checked');  //See if this box is checked
                            if(checked=="false"){
                                e.target.setAttribute('checked',true);
                                e.target.classList.add('customCheckbox-checked');
                                
                            }else{
                                e.target.setAttribute('checked',false);
                                e.target.classList.remove('customCheckbox-checked');
                            }
                            
                            publicVars.globalExt(e);
                        },
                        globalExt:function(e){
                            
                        },
                        addExt:function(uniq,cb){
                            var a = [].slice.call(document.querySelectorAll('[data-uniqID="'+uniq+'"]')); // get checkboxes with unique and convert to array
                            a.forEach(function(v,i,a){
                                v.addEventListener('mousedown',function(e){
                                    if(e.shiftKey)
                                        return;
                                    cb&&cb(e)
                                });
                            });
                        }
                    }
                    var oldCheckBoxes   =   [].slice.call(document.getElementsByClassName('customCheck'));  // Get all the checkboxes with the class and store into an array
                    oldCheckBoxes.forEach(function(box,index,a){
                        
                        var keepAttrs   =   box.getAttribute('data-keep')   // Get the attribute names that are going to be kept from the old element
                        var attrJSON    =   {checked:false,class:''}  //  JSON element to store these attr values in;

                        keepAttrs&&keepAttrs.split(' ').forEach(function(attr,index,a){
                            attrJSON[attr]  =   box.getAttribute(attr); // Grab the attribute from the element and put it into the json
                        });
                        
                        attrJSON.class  +=   ' customCheckBox';
                        var newCheck    =   CORE.helper.element.createDiv(attrJSON); //Create a new "checkbox" with the attributes
                        newCheck.addEventListener('mousedown',publicVars.onClick);
                        box.parentNode.replaceChild(newCheck,box);    //Replace the old checkbox with the new one
                    });
                    return publicVars;
                })(CORE);
















var d = new Date();
CORE.schedules.all	=	CORE.schedules.all.map(function(schedule){
	return CORE.views.schedule.flatten(schedule);
}).filter(function(a,i){
	return a.every(function(a){
		return !(a==undefined||a.status=='Closed');
	});
});
console.log('Flattening took: '+((new Date())-d)+'ms');






















(function(t,p){if("function"===typeof define&&define.amd)define([],p);else if("object"===typeof exports){var l=p();"object"===typeof module&&module&&module.exports&&(exports=module.exports=l);exports.randomColor=l}else t.randomColor=p()})(this,function(){function t(a,b){switch(b.format){case "hsvArray":return a;case "hslArray":return r(a);case "hsl":var c=r(a);return"hsl("+c[0]+", "+c[1]+"%, "+c[2]+"%)";case "hsla":return c=r(a),"hsla("+c[0]+", "+c[1]+"%, "+c[2]+"%, "+Math.random()+")";case "rgbArray":return m(a);
case "rgb":return"rgb("+m(a).join(", ")+")";case "rgba":return"rgba("+m(a).join(", ")+", "+Math.random()+")";default:return v(a)}}function p(a){334<=a&&360>=a&&(a-=360);for(var b in q){var c=q[b];if(c.hueRange&&a>=c.hueRange[0]&&a<=c.hueRange[1])return q[b]}return"Color not found"}function l(a){if(null===n)return Math.floor(a[0]+Math.random()*(a[1]+1-a[0]));var b=a[1]||1;a=a[0]||0;n=(9301*n+49297)%233280;return Math.floor(a+n/233280*(b-a))}function v(a){function b(a){a=a.toString(16);return 1==a.length?
"0"+a:a}a=m(a);return"#"+b(a[0])+b(a[1])+b(a[2])}function k(a,b,c){q[a]={hueRange:b,lowerBounds:c,saturationRange:[c[0][0],c[c.length-1][0]],brightnessRange:[c[c.length-1][1],c[0][1]]}}function m(a){var b=a[0];0===b&&(b=1);360===b&&(b=359);var b=b/360,c=a[1]/100;a=a[2]/100;var e=Math.floor(6*b),d=6*b-e,b=a*(1-c),h=a*(1-d*c),c=a*(1-(1-d)*c),g=d=256,f=256;switch(e){case 0:d=a;g=c;f=b;break;case 1:d=h;g=a;f=b;break;case 2:d=b;g=a;f=c;break;case 3:d=b;g=h;f=a;break;case 4:d=c;g=b;f=a;break;case 5:d=a,
g=b,f=h}return[Math.floor(255*d),Math.floor(255*g),Math.floor(255*f)]}function r(a){var b=a[1]/100,c=a[2]/100,e=(2-b)*c;return[a[0],Math.round(b*c/(1>e?e:2-e)*1E4)/100,e/2*100]}var n=null,q={};k("monochrome",null,[[0,0],[100,0]]);k("red",[-26,18],[[20,100],[30,92],[40,89],[50,85],[60,78],[70,70],[80,60],[90,55],[100,50]]);k("orange",[19,46],[[20,100],[30,93],[40,88],[50,86],[60,85],[70,70],[100,70]]);k("yellow",[47,62],[[25,100],[40,94],[50,89],[60,86],[70,84],[80,82],[90,80],[100,75]]);k("green",
[63,178],[[30,100],[40,90],[50,85],[60,81],[70,74],[80,64],[90,50],[100,40]]);k("blue",[179,257],[[20,100],[30,86],[40,80],[50,74],[60,60],[70,52],[80,44],[90,39],[100,35]]);k("purple",[258,282],[[20,100],[30,87],[40,79],[50,70],[60,65],[70,59],[80,52],[90,45],[100,42]]);k("pink",[283,334],[[20,100],[30,90],[40,86],[60,84],[80,80],[90,75],[100,73]]);var u=function(a){a=a||{};if(a.seed&&a.seed===parseInt(a.seed,10))n=a.seed;else{if(void 0!==a.seed&&null!==a.seed)throw new TypeError("The seed value must be an integer");
n=null}var b,c,e;if(null!==a.count&&void 0!==a.count){b=a.count;c=[];for(a.count=null;b>c.length;)n&&a.seed&&(a.seed+=1),c.push(u(a));a.count=b;return c}a:{b=a.hue;if("number"===typeof parseInt(b)&&(c=parseInt(b),360>c&&0<c)){b=[c,c];break a}if("string"===typeof b&&q[b]&&(b=q[b],b.hueRange)){b=b.hueRange;break a}b=[0,360]}b=l(b);0>b&&(b=360+b);c=a;if("random"===c.luminosity)c=l([0,100]);else if("monochrome"===c.hue)c=0;else{var d=p(b).saturationRange;e=d[0];d=d[1];switch(c.luminosity){case "bright":e=
55;break;case "dark":e=d-10;break;case "light":d=55}c=l([e,d])}e=a;a:{for(var d=c,h=p(b).lowerBounds,g=0;g<h.length-1;g++){var f=h[g][0],k=h[g][1],m=h[g+1][0],r=h[g+1][1];if(d>=f&&d<=m){h=(r-k)/(m-f);d=h*d+(k-h*f);break a}}d=0}f=100;switch(e.luminosity){case "dark":f=d+20;break;case "light":d=(f+d)/2;break;case "random":d=0,f=100}e=l([d,f]);return t([b,c,e],a)};return u});



