CORE.block	=	(function(CORE){
	var list	=	[];
	
	var addButton	=	function(a){
		var make	=	CORE.helper.element.create;
		var container	=	make('li',{class:'courseChoice-wrap','data-code':a});
		var name	=	make('div',{class:'courseChoice',html:a});
		var kill	=	make('div',{class:'courseKill'});
		CORE.helper.element.editStyle(name,{
			backgroundColor:CORE.helper.color.bgColor(a),
		})
		kill.addEventListener('click',function(){
			killButton(a);
		});

		name.appendChild(kill);
		container.appendChild(name)

		document.getElementById('courseChoiceContainer').appendChild(container);
	};
	
	var	killButton	=	function(b){
		var button	=	document.querySelectorAll('[data-code="'+b+'"]')[0];
		button.parentNode.removeChild(button);
		list.splice(list.indexOf(b),1);
		//Update coursecahe
		localStorage['courseCache']	=	CORE.block.genQuery();
	};
	
	return {
		list:list,
		add:function(a){
			//put the course in the list (if already not there)
			// display it on the screen.
			//hide the dropdown
			if(list.indexOf(a)>-1)
				return CORE.drop.flush();
			list.push(a);
			CORE.drop.flush();
			addButton(a);
			//Update coursecahe
			localStorage['courseCache']	=	CORE.block.genQuery();
		},
		genQuery:function(){
			return list.join('|');
		}
	};
})(CORE);
	