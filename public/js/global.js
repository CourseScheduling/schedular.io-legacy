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
    }
}
var navbarMenu  =   {
    isDown:false,
    drop:function(){
        console.log('e');
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
    init:function(){
        _NMthis   =   this;
        this.initiateButton =   document.getElementById('menuDrop'),
        this.dropDown   =   document.getElementById('menuContainer'),
        navbarMenu.initiateButton.addEventListener('mouseup',_NMthis.drop);
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

