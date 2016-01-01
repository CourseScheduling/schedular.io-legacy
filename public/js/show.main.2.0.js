CORE	=	{
	raw	:	RAW_COURSE_DATA,
	main	:	{
		search	:	{}
	}
}

CORE.main.search	=	(function(){
	CORE.raw.forEach(function(course){
		posCombos.push(course.sections);
	});
	return {
		check:function(mangle1,mangle2){
			var m1C	= mangle1.times.length;
			var m2C	=	mangle2.times.length;
			for(m1C;m1C--;){
				for(m2C;m2C--;){
					if(!inDays(mangle1.times[m1C].days,mangle2.times[m2C].days)){
						
					}
				}
			}
			return true;
		},
		mangle:function(sectionArray){
			
			var checkTime	=	CORE.helper.time.sectionGet;
			
			var mangledCombos	=	[];
			
			var	sortedArray	=	[
				sectionArray.C
				,sectionArray.T
				,sectionArray.L
			].sort(function(a,b){
				return b.length-a.length;
			}).filter(function(e){
				return e.length>0;
			});
			// Sort the course, tutorial, and labs by which is bigger
			// Also remove the type if it has no sections
			if(sortedArray.length<=1){
				return sortedArray[0];
			}
			
			var s1	=	sortedArray[0].length;
			var s2	=	sortedArray[1].length;
			var s3	=	sortedArray[2].length;
			for(s1;s1--;){
				for(s2;s2--;){
					if(checkTime(sortedArray[0][s1],sortedArray[1][s2]));
						mangledCombos.push(
							{
								0:sortedArray[0][s1],
								1:sortedArray[1][s2],
								length:2,
								times:sortedArray[1][s2].times.concat(sortedArray[0][s1].times);
							}
						);
				}
			}
			if(sortedArray.length==3){
				var sa1	=	mangledCombos.length;
				for(s3;s3--;){
					for(sa1;sa1--;){
						if(
								checkTime(mangledCombos[sa1][0],sortedArray[1][s3])
								&&
								checkTime(mangledCombos[sa1][1],sortedArray[1][s3])
							){
							mangledCombos[sa1][2]	=	sortedArray[1][s3];
							mangledCombos[sa1].length=3;
							mangledCombos[sa1].times	=	mangledCombos[sa1].times.concat(sortedArray[1][s3].times);
						}
					}
				}
			}
			return mangledCombos;
		}
	};
})(CORE);


