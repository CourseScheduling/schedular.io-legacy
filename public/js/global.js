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
	add:function(el){
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










/* Allow iteration over a collection of nodes */

HTMLCollection.prototype.forEach	=	function(callback){
	
	for(var i = 0, node;node = this[i];i++){
		callback(node,i,this);
	}
	
};




















//Random cool coloor










(function(t,p){if("function"===typeof define&&define.amd)define([],p);else if("object"===typeof exports){var l=p();"object"===typeof module&&module&&module.exports&&(exports=module.exports=l);exports.randomColor=l}else t.randomColor=p()})(this,function(){function t(a,b){switch(b.format){case "hsvArray":return a;case "hslArray":return r(a);case "hsl":var c=r(a);return"hsl("+c[0]+", "+c[1]+"%, "+c[2]+"%)";case "hsla":return c=r(a),"hsla("+c[0]+", "+c[1]+"%, "+c[2]+"%, "+Math.random()+")";case "rgbArray":return m(a);
case "rgb":return"rgb("+m(a).join(", ")+")";case "rgba":return"rgba("+m(a).join(", ")+", "+Math.random()+")";default:return v(a)}}function p(a){334<=a&&360>=a&&(a-=360);for(var b in q){var c=q[b];if(c.hueRange&&a>=c.hueRange[0]&&a<=c.hueRange[1])return q[b]}return"Color not found"}function l(a){if(null===n)return Math.floor(a[0]+Math.random()*(a[1]+1-a[0]));var b=a[1]||1;a=a[0]||0;n=(9301*n+49297)%233280;return Math.floor(a+n/233280*(b-a))}function v(a){function b(a){a=a.toString(16);return 1==a.length?
"0"+a:a}a=m(a);return"#"+b(a[0])+b(a[1])+b(a[2])}function k(a,b,c){q[a]={hueRange:b,lowerBounds:c,saturationRange:[c[0][0],c[c.length-1][0]],brightnessRange:[c[c.length-1][1],c[0][1]]}}function m(a){var b=a[0];0===b&&(b=1);360===b&&(b=359);var b=b/360,c=a[1]/100;a=a[2]/100;var e=Math.floor(6*b),d=6*b-e,b=a*(1-c),h=a*(1-d*c),c=a*(1-(1-d)*c),g=d=256,f=256;switch(e){case 0:d=a;g=c;f=b;break;case 1:d=h;g=a;f=b;break;case 2:d=b;g=a;f=c;break;case 3:d=b;g=h;f=a;break;case 4:d=c;g=b;f=a;break;case 5:d=a,
g=b,f=h}return[Math.floor(255*d),Math.floor(255*g),Math.floor(255*f)]}function r(a){var b=a[1]/100,c=a[2]/100,e=(2-b)*c;return[a[0],Math.round(b*c/(1>e?e:2-e)*1E4)/100,e/2*100]}var n=null,q={};k("monochrome",null,[[0,0],[100,0]]);k("red",[-26,18],[[20,100],[30,92],[40,89],[50,85],[60,78],[70,70],[80,60],[90,55],[100,50]]);k("orange",[19,46],[[20,100],[30,93],[40,88],[50,86],[60,85],[70,70],[100,70]]);k("yellow",[47,62],[[25,100],[40,94],[50,89],[60,86],[70,84],[80,82],[90,80],[100,75]]);k("green",
[63,178],[[30,100],[40,90],[50,85],[60,81],[70,74],[80,64],[90,50],[100,40]]);k("blue",[179,257],[[20,100],[30,86],[40,80],[50,74],[60,60],[70,52],[80,44],[90,39],[100,35]]);k("purple",[258,282],[[20,100],[30,87],[40,79],[50,70],[60,65],[70,59],[80,52],[90,45],[100,42]]);k("pink",[283,334],[[20,100],[30,90],[40,86],[60,84],[80,80],[90,75],[100,73]]);var u=function(a){a=a||{};if(a.seed&&a.seed===parseInt(a.seed,10))n=a.seed;else{if(void 0!==a.seed&&null!==a.seed)throw new TypeError("The seed value must be an integer");
n=null}var b,c,e;if(null!==a.count&&void 0!==a.count){b=a.count;c=[];for(a.count=null;b>c.length;)n&&a.seed&&(a.seed+=1),c.push(u(a));a.count=b;return c}a:{b=a.hue;if("number"===typeof parseInt(b)&&(c=parseInt(b),360>c&&0<c)){b=[c,c];break a}if("string"===typeof b&&q[b]&&(b=q[b],b.hueRange)){b=b.hueRange;break a}b=[0,360]}b=l(b);0>b&&(b=360+b);c=a;if("random"===c.luminosity)c=l([0,100]);else if("monochrome"===c.hue)c=0;else{var d=p(b).saturationRange;e=d[0];d=d[1];switch(c.luminosity){case "bright":e=
55;break;case "dark":e=d-10;break;case "light":d=55}c=l([e,d])}e=a;a:{for(var d=c,h=p(b).lowerBounds,g=0;g<h.length-1;g++){var f=h[g][0],k=h[g][1],m=h[g+1][0],r=h[g+1][1];if(d>=f&&d<=m){h=(r-k)/(m-f);d=h*d+(k-h*f);break a}}d=0}f=100;switch(e.luminosity){case "dark":f=d+20;break;case "light":d=(f+d)/2;break;case "random":d=0,f=100}e=l([d,f]);return t([b,c,e],a)};return u});



//Say hello.
console.log("%c Yo","font-size:50px;color:#3498db;font-weight:100;font-family:Open Sans")
console.log("%c wanna help out with schedular?","font-size:12px;color:#3498db;font-weight:100;font-family:Open Sans")
console.log("%c email me at joseph.thomas@student.ufv.ca","font-size:12px;color:#3498db;font-weight:100;font-family:Open Sans")