CORE	=	{
	helper:{},
	main:{
		input:{},
		dropDown:{},
	}
}




CORE.main.input	=	(function(CORE){
	var input =	document.getElementById('courseInput');
	input.addEventListener('keypress',function(e){
		//when someone types into the input ajax and get all the possible course codes
		$.get({
			url:'/s/get?courseInput='+e.target.value,
			done:function(a){
				//Activate the dropdown and add all the possible courses
				a.forEach(function(
			}
		});
		
	});
	
	
	
	return	{
		bar:input
	};
	
})(CORE);