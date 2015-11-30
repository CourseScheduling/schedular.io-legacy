var SignupMod   =   {
    studentInput:document.getElementById('u-student'),
    submit:document.getElementById('u-signSubmit'),
    getValues:function(){
        var _this    =   SignupMod;
        
        var student   =   _this.studentInput.value;
        
        return {
            s   :   student
        };
    },
    go:function(){
        var _this    =   SignupMod;
        var originalSubmit  =   _this.submit.value;
        _this.submit.value  =   "";
        _this.submit.style.background   =   "url(/images/loginAjax.gif) #3498db center center / 25px no-repeat";
        $.post({
            url:'/forgotAuth?part=1',
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
        
        _this.studentInput.addEventListener("keydown", function(e) {
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
            case    'INVALID_STUDENT':
                _this.show('Um... Your student number must be a 9 digit number.');
            break;
            case    'NO_STUDENT':
                _this.show('Sorry, we cannot find an account associated with this student number');
            break;
            case    'SUCCESS':
                _this.show('Cool! We\'ve sent you an email with a link to reset your password!');
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
