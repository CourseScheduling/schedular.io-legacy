/*
*	CORE build	-	anything related to the building board
*/


CORE.build	=	(function(CORE){
	var _Board	=	document.getElementById('b-timeBlockWrap');
	
	var _makeBlock	=	function(section,time,temp){
		var $make	=	CORE.helper.element.create;
		var days	=	[];
		time.days.forEach(function(day){
			if(day==-1)	
				return document.createElement('div');
			//Make a timeblock element
			var timeBlock   =   $make('div',{class:'b-timeBlock '+(temp?'b-tempBlock':'')});
			//Adjust its styles.
			CORE.helper.element.editStyle(timeBlock,{
				top     :   [(time.start-480)/2,'px'].join(''),
				left    :   [((day+1)%7)*(613/7),'px'].join(''),
				height  :   [(time.end-time.start)/2,'px'].join(''),
				lineHeight  :   [(time.end-time.start-4)/2,'px'].join(''),
				color   :  '#FFF',
				backgroundColor :   CORE.helper.color.bgColor(section.title)
			});
			timeBlock.innerHTML=section.title;
					//return the timeblock
			days.push(timeBlock);
		});
		return days;
	}
	
	
	return {
		show:function(section,temp){
			section.times.forEach(function(time){
				_makeBlock(section,time,temp).forEach(function(block){
					_Board.appendChild(block);
				});
			});
		},
		flush:function(){
			var a = _Board.getElementsByClassName('b-tempBlock');
			while(a.length)
				_Board.removeChild(a[0]);
		}
	}
})(CORE);