var TYPE_MAP	=	{
	'L':'Lab',
	'T':'Tutorial',
	'C':'Lecture'
}

CORE.coursePop	=	(function(CORE){
	var _Loader	=	document.getElementById('instantLoader');
	
	var _fetchCourse	=	function(courseName,done){
		$.get({
			url:'/g/courses?c='+courseName,
			done:done
		});
	}
	
	var _showDescription	=	function(element){
		var wrap	=	element.getElementsByClassName('r-instant-infoWrap')[0];
		console.log(wrap);
		Velocity(wrap,'slideDown',100);
	}
	
	var _showLoading	=	function(element){
		var loading	=	element.getAttribute('data-loading');
		element.style.backgroundColor	=	'FFF';
		if(loading)	return;
		
		
		element.setAttribute('data-loading',1);
		var _loader	=	_Loader.cloneNode(true);
		_loader.id	=	'';
		var wrap	=	element.getElementsByClassName('r-instant-infoWrap')[0];
		element.insertBefore(_loader,wrap);
		Velocity(_loader,'slideDown',100);
	}
	
	var _hideLoading	=	function(element){
		var _loader	=	element.getElementsByClassName('r-loading')[0];
		Velocity(_loader,'slideUp',100);	
	}
	
	return {
		show:function(el){
			var courseCode	=	el.getElementsByClassName('r-instantName')[0].innerHTML;
			var _description	=	el.getElementsByClassName('r-instant-description')[0];
			var _infoWrap	=	el.getElementsByClassName('r-instant-infoWrap')[0];
			
			var $make	=	CORE.helper.element.create;
			if(el.getAttribute('data-loaded')){
				return _showDescription(el);
			}
			
			_showLoading(el);
			_fetchCourse(courseCode,function(courseData){
				console.log(courseData);
				courseData	=	courseData[0];
				
				_hideLoading(el);
				
				if(courseData.description){
					_description.innerHTML	=	courseData.description;
				}else{
					_description.innerHTML	=	"";
				}
				
				for(var type in courseData.sections){
					console.log(type);
					if(courseData.sections[type].length){
						var title	=	$make('div',{class:'r-instant-uniqDescriptor',html:TYPE_MAP[type]});
						_infoWrap.appendChild(title);
						courseData.sections[type].forEach(function(section){
							console.log(section);
							var cover	=	$make('div',{class:'r-instant-uniqCover',html:section.uniq});
							_infoWrap.appendChild(cover);
							cover.addEventListener('mouseover',function(){
								CORE.build.show(section,'temp');
							});
							cover.addEventListener('mouseout',function(){
								CORE.build.flush();
							});
						});
					}
				}
				el.setAttribute('data-loaded','1');
				_showDescription(el);	
			});
		}
	};
	
})(CORE);