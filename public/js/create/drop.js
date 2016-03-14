CORE.drop	=	(function(CORE){
		

	var input =	document.getElementById('courseInput');
	var instantContainer	=	document.getElementById('instantDropDown');
	input.addEventListener('keyup',function(e){

		//when someone types into the input ajax and get all the possible course codes
		if(e.target.value=="")
			return Velocity(instantContainer,'slideUp',50);
		
		
		var term	=	CORE.term.current.term;
		var year	=	CORE.term.current.year;
		$.get({
			url:'/g/course?term='+term+'&year='+year+'&q='+e.target.value,
			done:function(a){
				//Activate the dropdown and add all the possible courses
				if(a.length==0){
					Velocity(instantContainer,'slideUp',50);
					return;
				}
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
						CORE.block.add(v.code);
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
			Velocity(instantContainer,'slideUp',50);
		}
	};
	
	
	
})(CORE);
