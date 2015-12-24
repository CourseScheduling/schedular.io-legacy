CORE	=	{
	helper:{},
	main:{
		input:{},
		dropDown:{},
	}
}




CORE.main.input	=	(function(CORE){
	var input =	document.getElementById('courseInput');
	input.addEventListener('keydown',function(e){
		//when someone types into the input ajax and get all the possible course codes
		if(e.target.value=="")
			return;
		$.get({
			url:'/g/course?q='+e.target.value,
			done:function(a){
				//Activate the dropdown and add all the possible courses
				a.forEach(function(v,i,a){
					console.log(v);
				});

			}
		});
		
	});
	
	
	
	return	{
		bar:input
	};
	
})(CORE);