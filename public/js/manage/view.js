


CORE.render	=	(function(CORE){
	var SECTION_SET	=	{
		C	:	'Lec',
		L	:	'Lab',
		T	:	'Tut'
	}
	
	
	return {
		box:function(){
			CORE.schedules.forEach(function(v,i,a){
				var box	=	document.getElementById('boxPossibleTemplate').cloneNode(true);
				var sched	=	box.getElementsByClassName('box-image')[0];
				var _queryCode	=	[];
				box.id='';
				v.crn.forEach(function(g,n,l){
					
					_queryCode.push(CORE.uniqMap[g].title);
					var label	=	CORE.helper.element.create('div',{
						class:'box-courseTab',
						html:[CORE.uniqMap[g].title,SECTION_SET[CORE.uniqMap[g].type]].join(' ')
					});
					
					CORE.helper.element.editStyle(label,{
						backgroundColor:randomColor({luminosity:"bright",format:"hex",seed:parseInt(CORE.uniqMap[g].title,36)})
					});
					box.getElementsByClassName('box-infoContainer')[0].appendChild(label);
					
					CORE.render.thumb(CORE.uniqMap[g],sched);
				});
				
				box.setAttribute('data-queryCode',CORE.helper.array.uniq(_queryCode).join('|'));
				box.setAttribute('data-term',v.data.term);
				box.setAttribute('data-year',v.data.year);
				
				box.getElementsByClassName('box-infoTitle')[0].innerHTML	=	v.data.name;
				box.getElementsByClassName('box-createTime')[0].innerHTML	=	(new Date(v.data.timestamp*1000)).toDateString();
				document.getElementById('box-container').appendChild(box);
				
				var _buttonBox	=	box.getElementsByClassName('killIcon')[0].parentNode;
				
				ToolTip.add(box.getElementsByClassName('bookIcon')[0]);
				ToolTip.add(box.getElementsByClassName('killIcon')[0]);
				ToolTip.add(box.getElementsByClassName('numberIcon')[0]);
				
				_buttonBox.setAttribute('data-shortid',v.data.shortid);
				box.getElementsByClassName('killIcon')[0].addEventListener('click',CORE.render.kill);
				box.getElementsByClassName('bookIcon')[0].addEventListener('click',CORE.render.books);
				box.getElementsByClassName('bookIcon')[0].addEventListener('click',CORE.render.uniqs);
				
			});
			CORE.gear.off();
		},
		thumb:function(section,thumb){
			var ctx	=	thumb.getContext('2d');
			var color	=	randomColor({luminosity:"bright",format:"hex",seed:parseInt(section.title,36)});
			section.times.forEach(function(v,i,a){
				v.days.forEach(function(g,n,l){
					ctx.fillStyle	=	color;
					ctx.strokeStyle	=	color;
					ctx.roundRect(g*26+g+28,(v.start-480)/5,26,(v.end-v.start)/6,5).fill();
				});
			});			
		},
		books:function(event){
			var _box	=	event.target.parentNode.parentNode.parentNode;
			
			window.open([
				"/books?t="+_box.getAttribute('data-term'),
				"y="+_box.getAttribute('data-year'),
				"c="+_box.getAttribute('data-queryCode')
			].join('&'),'_blank');
		},
		kill:function(event){
			var _buttonBox = event.target.parentNode;
			var _box	=	_buttonBox.parentNode.parentNode;
			var _id	=	_buttonBox.getAttribute('data-shortid');
			console.log(_box);
			$.get({
				url:'/m/kill?shortid='+_id,
				done:function(e){
					if(!e||!e[0]||e[0]!=="SUCCESS")
						return;
					console.log('deleting');
					_box.parentNode.removeChild(_box);
				}
			})
		}
	};
	
})(CORE);





CORE.gear	=	(function(){
	return	{
		gear:document.getElementById('main-loadingGear'),
		on:function(){
			this.gear.style.display	=	'block';
		},
		off:function(){
			this.gear.style.display	=	'none';
		}
	}
})(CORE);




