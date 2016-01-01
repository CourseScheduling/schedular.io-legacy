$   =   {
    get:function(e){
        var request = new XMLHttpRequest();
        request.open('GET',e.url, true);
        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
              e.done(JSON.parse(request.responseText));
          } else {

          }
        };
        request.onerror = function() {};
        request.send();
    },
    post:function(e){
        var tempData    =   '';
        for(var index in e.data){
            tempData+=[index,'=',e.data[index],'&'].join('')
        }
        tempData=tempData.slice(0,-1);
        e.data  =   tempData;
        
        var request = new XMLHttpRequest();
        request.open('POST',e.url, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
              e.done&&e.done(JSON.parse(request.responseText));
          }
        };
        request.onerror = function() {};
        request.send(e.data);
    },
    isChild:function(element,parent){
        while(element.parentNode){
            if(element===parent){
                return true;    
            }
            element =   element.parentNode;
        }
        return false;
    }
}
var navbarMenu  =   {
    isDown:false,
    drop:function(){
        if(!_NMthis.isDown){
            _NMthis.initiateButton.classList.add('menuDrop-active');
            Velocity(_NMthis.dropDown,'fadeIn',{complete:function(e){
                e[0].display    =   'block';
                _NMthis.isDown  =   true;
            }},50);
            return;
        }
        if(_NMthis.isDown){
            _NMthis.initiateButton.classList.remove('menuDrop-active');
            Velocity(_NMthis.dropDown,'fadeOut',{complete:function(e){
                e[0].display    =   'none';
                _NMthis.isDown =   false;
            }},50);
            return;
        }
    },
    close:function(){
        if(_NMthis.isDown){
            _NMthis.initiateButton.classList.remove('menuDrop-active');
            Velocity(_NMthis.dropDown,'fadeOut',{complete:function(e){
                e[0].display    =   'none';
                _NMthis.isDown =   false;
            }},50);
            return;
        }
    },
    init:function(){
        _NMthis   =   this;
        this.initiateButton =   document.getElementById('menuDrop'),
        this.dropDown   =   document.getElementById('menuContainer'),
        navbarMenu.initiateButton.addEventListener('mouseup',_NMthis.drop);
        document.addEventListener('click',function(e){
            if($.isChild(e.target,_NMthis.dropDown)||$.isChild(e.target,_NMthis.initiateButton))
                return;
            _NMthis.close();
        });
    }
}

try{
function googleAna(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments);
    }; i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
}
googleAna(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

  ga('create', 'UA-43692440-2', 'auto');
  ga('send', 'pageview');
}catch(e){

}





var ToolTip	=	{
	HOOK_CLASS:'gTT-act',
	HOOK_LABEL:'data-gTTLbl',
	TIP_CLASS:'gTT-pop',
	hook:function(element){
	
	},
	add:function(element){
		
	},
	init:function(){
		$this	=	this;
		document.addEventListener('DOMContentLoaded',function(){
			[].forEach.call(
				document.getElementsByClassName($this.HOOK_CLASS),
				function(el){
					el.addEventListener('mouseover',function(){
						var top =   (el.getBoundingClientRect().top-35)+'px';
						var toolTip =   document.createElement('div');
						document.body.appendChild(toolTip);
						toolTip.className   =   $this.TIP_CLASS;
						toolTip.innerHTML=el.getAttribute($this.HOOK_LABEL);
						var left    =   (el.getBoundingClientRect().left-(toolTip.getBoundingClientRect().width-el.getBoundingClientRect().width)/2)+'px';
						toolTip.style.top   =   top;
						toolTip.style.left =   left;
					});
					el.addEventListener('mouseout',function(){
						var a = document.getElementsByClassName($this.TIP_CLASS);
						while(a.length){
							a[0].parentNode.removeChild(a[0]);
						}
					});
				}
			);
			
		});
	}
}
ToolTip.init();
