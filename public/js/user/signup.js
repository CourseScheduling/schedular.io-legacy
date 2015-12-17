CORE    =   {
    elements:{
        signupButton:document.getElementById('u-signSubmit'),
        usernameInput:document.getElementById('u-username'),
        passwordInput:document.getElementById('u-password'),
        studentEmailInput:document.getElementById('u-studentEmail')
    },
    signup:{
        go:{}
    },
    notif:{},    //notif == notifications
    validate:{},
    helper:{
        enterPress:{}
    }
}

CORE.validate   =   (function(CORE){
    
    return function(inputs){
        var username    =   inputs.username;
        var password    =   inputs.password;
        var email    =   inputs.email;
        
        var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
        var _this   =   this;
        
        if(username.match(/[^a-zA-Z\d_-]/g)!==null)
            return [false,'INVALID_USERNAME'];
        if(username.length>40)
            return [false,'LONG_USERNAME'];
        if(password.length>200)
            return [false,'LONG_PASSWORD'];
        if(email.length==0||email.length>200||!emailRegex.test(email))
            return [false,'BAD_EMAIL'];
        
        return [true];
    };
    
})(CORE);

CORE.notif  =   (function(CORE){
        
    return {
        container:document.getElementById('notificationContainer'),
        display:function(data){
            switch(data){
                case    'USERNAME_EXISTS':     
                    this.show('Sorry dude, that username is already taken.');
                break;
                case    'STUDENT_EXISTS':     
                    this.show('That student number already has an account registered to it.');
                break;
                case    'INVALID_USERNAME':     
                    this.show('Whoa, your username is invalid. Usernames can only contain alphanumeric characters and dashes.');
                break;
                case    'LONG_PASSWORD':     
                    this.show('Holy Moley, your password is way too long. Keep it under 200 characters.');
                break;
                case    'BAD_EMAIL':     
                    this.show("Well. this email is inherently invalid. Please check it again and make sure it's your student email");
                break;
                case    'SUCCESS':
                    this.show('Alright! Your account has been created! Please check your student email to activate it.')    
                break;
            }
        },
        show:function(data){
            this.container.innerHTML=data;
            Velocity(this.container,'slideDown',300);
            Velocity(this.container,'fadeIn',300);
        },
        hide:function(){   
            Velocity(this.container,'slideUp',300);
            Velocity(this.container,'fadeOut',300);
        }
    }
})(CORE);



CORE.helper =   (function(CORE){
    
    
    
    return {
        enterPress:function(el,cb){
            el.addEventListener('keypress',function(e){
                if (!e) { var e = window.event; }
                if (e.keyCode == 13) { 
                    cb&&cb();
                }
            });
        },
        getIdValues:function(el){
            return el.map(function(a){
                return document.getElementById(a).value;
            });
        },
        genJSON:function(keys,values){
            var json   =   {};
            values.forEach(function(v,i,a){
                json[keys[i]]=v;
            });
            return json;
        }
        
    };
})(CORE);






CORE.signup =   (function(CORE){
    return {
        load:{},
        go:function(){
            CORE.notif.hide();//Hide the notifcation thing
            CORE.signup.load.show();
            var inputValues =   CORE.helper.genJSON(
                ['username','password','email'],
                CORE.helper.getIdValues(['u-username','u-password','u-studentEmail'])
            );
            //get the input values in json format, i.e. username:"joe",password:"nothing"
            if(!CORE.validate(inputValues)[0]){//Validate the inputs
                CORE.notif.display(CORE.validate(inputValues)[1]);  //Show the error if there is one
                CORE.signup.load.hide();
            }else{
            
            }
        },
        init:function(){
            CORE.elements.signupButton.addEventListener('click',CORE.signup.go);
            CORE.helper.enterPress(
                CORE.elements.studentEmailInput,
                CORE.signup.go
            );
        }
    };
})(CORE);


CORE.signup.load    =   (function(CORE){
    return  {
        submitValue:'',
        show:function(){
            CORE.elements.signupButton.style.background   =   "url(/images/loginAjax.gif) #3498db center center / 25px no-repeat";
            this.submitValue    =   CORE.elements.signupButton.innerHTML;
            CORE.elements.signupButton.innerHTML    =   '';
        },
        hide:function(){
            CORE.elements.signupButton.style.background =   '';
            CORE.elements.signupButton.innerHTML    =   this.submitValue;
        }
    }
})(CORE);


CORE.signup.init();




/*


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
            accountType =   AccountType.getValue();
        
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
            case    'INVALID_ACCOUNT':     
                _this.show('Nice try :P, the only accepted account types are Student, and Faculty. Please choose one from below.');
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
*/