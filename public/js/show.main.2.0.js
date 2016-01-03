CORE	=	{
	raw	:	RAW_COURSE_DATA,
	courses	:	[],
	helper	:	{},
	main	:	{
		search	:	{}
	}
}
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
						while(!found&&i<3){
							found	=	CORE.helper.array.returnByField(typeArray[i++],'uniq',uniq);
						}
						mJ[i]	=found;
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
			
			var possible	=	[];

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
	CORE.main.search.start();
console.log('Scheduling took: '+((new Date())-d)+'ms');
