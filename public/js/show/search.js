/*
*	Core Main Search
*
*	@method prep	->	Converts all the premangled info into manglable section data
*										Stores it in CORE.courses.
*	@method	start	->	Starts the process of checking and scheduling manglable course data
*	
*/



CORE.main.search	=	(function(CORE){
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
							found	=	CORE.helper.array.hasFieldValue(typeArray[i],'uniq',uniq);
							i++;
						}
						mJ[i-1]	=found;
						mJ.times	=	mJ.times.concat(found.times);
						mJ.length = i;
					});
					if(mJ.times.length)
						mangla.push(mJ);
				
				});
			
				mangledArray.push(mangla);
			
			});
			
			mangledArray.sort(function(a,b){return b.length-a.length;});
			return (CORE.courses	=	mangledArray);
		},
		start:function(){
			//Yea....
			CORE.courses[CORE.courses.length-1].forEach(function(section,index){
				depth([section],CORE.courses.length-2);
			});

			function depth(pos,index){
				//So the index is wayy too small, success! This is a good schedule
				if(index<0)
					return CORE.schedules.all.push(pos);
				
				//Defining some stuff for ease of reading
				var course = CORE.courses[index];
				var layerI	=	CORE.courses[index].length;
				
				//Okay, so if something doesn't work out, we can just break this loop
				up:
				while(layerI--){
					var posI	=	pos.length;
					//kk, if this is an online we might as well skip this
					if(!course[layerI].times[0]||course[layerI].times[0].days[0]==-1)
						posI=0;
					
					while(posI--){
						var timeP	=	pos[posI].times.length;
						while(timeP--){
							var timeL	=	course[layerI].times.length;
							while(timeL--){
									
								var tP	=	pos[posI].times[timeP];
								var tL	=	course[layerI].times[timeL];
								
								//So, if nothing works out, this is a bad combo, might as well break up.
								if(CORE.helper.time.inTime(tP.start,tP.end,tL.start,tL.end)&&CORE.helper.time.sameDay(tP.days,tL.days))
									continue up;
								
							}
						}
						
					}
					//Woohoo! We made it
					if(index==0)
						//It's a good schedule
						CORE.schedules.all.push(pos.concat(course[layerI]));
					else
						//We're not done yet, try another layer of courses.
						depth(pos.concat(course[layerI]),index-1);
				}
			}
			
			CORE.schedules.current	=	CORE.schedules.all;
		},
		flatten:function(schedule){
			var sections	=	[];
			for(var i = 0;i<schedule.length;i++){
				for(var g = 0;g<schedule[i].length;g++){
					sections.push(schedule[i][g]);
				}
			}
			return sections;
		}
	};
})(CORE);
