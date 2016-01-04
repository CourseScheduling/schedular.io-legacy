


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
						while(!found){
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
			options	=	this.flatten(options);
			options.forEach(function(section){
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
				//		color   :   CORE.helper.color.getTextColor(CORE.helper.color.getBackgroundColor(section.courseName)),
				//	backgroundColor :   CORE.helper.color.getBackgroundColor(section.courseName)
				});
				timeBlock.innerHTML=section.title
            //return the timeblock
				days.push(timeBlock);
			});
			return days;
		}
	}
})(CORE);





















var d = new Date();
CORE.schedules.all	=	CORE.schedules.all.map(function(schedule){
	return CORE.views.schedule.flatten(schedule);
});
console.log('Flattening took: '+((new Date())-d)+'ms');