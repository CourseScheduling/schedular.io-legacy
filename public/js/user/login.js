var SignupMod   =   {
    usernameInput:document.getElementById('u-username'),
    passwordInput:document.getElementById('u-password'),
    submit:document.getElementById('u-signSubmit'),
    getValues:function(){
        var _this    =   SignupMod;
        
        var username   =   _this.usernameInput.value,
            password   =   _this.passwordInput.value;
        
        return {
            u   :   username,
            p   :   password
        };
    },
    go:function(){
        var _this    =   SignupMod;
        var originalSubmit  =   _this.submit.value;
        _this.submit.value  =   "";
        _this.submit.style.background   =   "url(/images/loginAjax.gif) #3498db center center / 25px no-repeat";
        
        $.post({
            url:'/loginAuth',
            data:_this.getValues(),
            done:function(data){
                NotificationMod.display(data[0]);
                _this.submit.value  =   originalSubmit;
                _this.submit.style.background   =   "";
            }
        })
        
        
    },
    init:function(){
        var _this   =   this;
        this.submit.addEventListener('click',function(){
            _this.go();
            NotificationMod.hide();            
        });
        
        _this.passwordInput.addEventListener("keydown", function(e) {
            if (!e) { var e = window.event; }
            if (e.keyCode == 13) { 

                _this.go();
                NotificationMod.hide();               
            }
        });
    }
}
SignupMod.init();

var NotificationMod =   {
    container:document.getElementById('notificationContainer'),
    display:function(data){
        var _this   =   NotificationMod;
        switch(data){
            case    'BAD_USERNAME':
                _this.show('Sorry, that username does not exist');
            break;
            case    'WRONG_PASSWORD':
                _this.show('Sorry, that password is incorrect');
            break;
            case    'SUCCESS':
                _this.show('Correcto!');
                setTimeout(function(){
                    document.location='/';
                },1000);
            break;
        }
    },
    show:function(data){
        var _this   =   NotificationMod;
        _this.container.innerHTML=data;
        Velocity(_this.container,'slideDown',300);
        Velocity(_this.container,'fadeIn',300);
    },
    hide:function(){   
        var _this   =   NotificationMod;
        Velocity(_this.container,'slideUp',300);
        Velocity(_this.container,'fadeOut',300);
    }
}