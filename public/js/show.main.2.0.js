CORE	=	{
	raw	:	RAW_COURSE_DATA,
	main	:	{
		search	:	{}
	}
}

CORE.main.search	=	function(){
	possibleCourse	=	{};
	CORE.raw.forEach(function(course,i,a){
		createArr(course.sections);
	})
}