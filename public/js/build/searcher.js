/*
*	CORE seacher	- anything related to that searcher thing
*/
CORE.searcher	=	(function(CORE){
	var _SearchInput	=	document.getElementById('instantInput');
	var	_ResultContainer	=	document.getElementById('instantDrop');
	var _ResultTemplate		=	document.getElementById('instantTemplate');
	
	var _lastValue	=	"";
	_SearchInput.addEventListener('keyup',function(e){
		var $this	=	e.target;
		
		//user clicked non letter key
		if($this.value==_lastValue)
			return;
		
		_lastValue	=	$this.value;
		
		if(!($this.value))
			return CORE.searcher.hide();
			
		$.get({
			url:[
				'/g/course?',
				'year=',CORE.term.year,
				'&term=',CORE.term.term,
				'&q=',
				$this.value
			].join(''),
			done:function(data){
				CORE.searcher.populate($this.value,data);
			}
		});
		
		
		
		
	});
	
	return {
		populate:function(query,data){
			$this	=	CORE.searcher;
			var wraps	=	[];
			
			if(data.length==0)
				return $this.hide();
			else
			
			data.forEach(function(packet,index){
				if(index>5)
					return;
				var _Wrap	=	_ResultTemplate.cloneNode(true);
				_Wrap.id	=	'';
				
				_Wrap.getElementsByClassName('r-instantCourse')[0].innerHTML	=	packet.name;
				_Wrap.getElementsByClassName('r-instantName')[0].innerHTML	=	packet.code;
				
				wraps.push(_Wrap);
			});

			$this.flush(wraps);
		},
		flush:function(wraps){
			$this	=	CORE.searcher;
			
			//Fastest clearing thing
			while(_ResultContainer.children.length)
				_ResultContainer.removeChild(_ResultContainer.children[0]);
			
			//Fill the container
					
			wraps.forEach(function(wrap){
				_ResultContainer.appendChild(wrap);
			});
			console.log(wraps);

			//Of they're invisible show em
			(_ResultContainer.style.display	!==	"block")&&$this.show();

		},
		hide:function(){
			Velocity(_ResultContainer,'slideUp',100);
		},
		show:function(){
			Velocity(_ResultContainer,'slideDown',100);
		
		}
	};
})(CORE);