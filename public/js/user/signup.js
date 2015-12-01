var SignupMod   =   {
    usernameInput:document.getElementById('u-username'),
    passwordInput:document.getElementById('u-password'),
    studentNumberInput:document.getElementById('u-studentNumber'),
    submit:document.getElementById('u-signSubmit'),
    getValues:function(){
        var _this    =   SignupMod;
        
        var username   =   _this.usernameInput.value,
            password   =   _this.passwordInput.value,
            studentNumber   =   _this.studentNumberInput.value,
            accountType =   accountType.getValue();
        
        return {
            u   :   username,
            p   :   password,
            s   :   studentNumber,
            aT  :   accountType
        };
    },
    go:function(){
        var _this    =   SignupMod;
        var originalSubmit  =   _this.submit.value;
        _this.submit.value  =   "";
        _this.submit.style.background   =   "url(/images/loginAjax.gif) #3498db center center / 25px no-repeat";
        
        $.post({
            url:'/signupAuth',
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
        
        _this.studentNumberInput.addEventListener("keydown", function(e) {
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
            case    'USERNAME_EXISTS':     
                _this.show('Sorry dude, that username is already taken.');
            break;
            case    'STUDENT_EXISTS':     
                _this.show('That student number already has an account registered to it.');
            break;
            case    'INVALID_USERNAME':     
                _this.show('Whoa, your username is invalid. Usernames can only contain alphanumeric characters and dashes.');
            break;
            case    'LONG_PASSWORD':     
                _this.show('Holy Moley, your password is way too long. Keep it under 200 characters.');
            break;
            case    'INVALID_STUDENT':     
                _this.show('Oh no. Your student number must be a 9 digit number, please double check it.');
            break;
            case    'SUCCESS':
                _this.show('Alright! Your account has been created! Please check your student email to activate it.')    
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

var accountType =   {
    active:document.getElementsByClassName('aT-selectionCircle')[0],
    getValue:function(){
        return accountType.active.getAttribute('data-accountType');
    },
    onClick:function(e){
        var currentActive=document.getElementById('active-aT-selectionCircle');
        //Return if clicked element and active element are the same
        if(e.target==currentActive)
            return;
        //Remove the id from active element
        currentActive.id='';
        //Make clicked element active
        e.target.id='active-aT-selectionCircle';
        accountType.active   =   e.target;

    }
};
//Go through all the selection possibilities and add a click listener
[].forEach.call(document.getElementsByClassName('aT-selectionCircle'),function(v,i,a){
    v.addEventListener('click',accountType.onClick);
});