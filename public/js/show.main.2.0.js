CORE	=	{
	raw	:	RAW_COURSE_DATA,
	helper	:	{},
	main	:	{
		search	:	{}
	}
}

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
			CORE.raw.forEach(function(course){
				var typeArray	=	[];
				for(var type in course.sections){
					typeArray.push(course.sections[type]);
				}
				typeArray.sort(function(a,b){return b.length-a.length;});
				
				course.mangled.forEach(function(v,i,a){
					a[i]	=	v.map(function(uniq){
						var i = 0;
						var found = false;
						while(!found&&i<3){
							found	=	CORE.helper.array.returnByField(typeArray[i++],'uniq',uniq);
						}
						return found;
					});
					
				});
			});
		},
		check:function(mangle1,mangle2){
			
		},
		mangle:function(sectionArray){
		}
	};
})(CORE);


