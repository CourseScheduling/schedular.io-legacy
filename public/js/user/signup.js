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
        if(email.split('@')[0].match(/[a-zA-Z]/g)==null)
            return [false,'NUMBER_EMAIL'];
        
        return [true];
    };
    
})(CORE);

CORE.notif  =   (function(CORE){
        
    return {
        container:document.getElementById('notificationContainer'),
        display:function(data){
            switch(data){
							case 'NUMBER_EMAIL':
								this.show('Hey, we know student numbers can be used as emails but please use your firstname.lastname@university.com email')	
							break;
							case	'USERNAME_EXISTS':     
								this.show('Sorry dude, that username is already taken.');
							break;
							case	'EMAIL_EXISTS':     
								this.show('Yo, that student email already has an account registered to it.');
							break;
							case	'INVALID_USERNAME':     
								this.show('Whoa, your username is invalid. Usernames can only contain alphanumeric characters and dashes.');
							break;
							case	'LONG_PASSWORD':     
								this.show('Holy Moley, your password is way too long. Keep it under 200 characters.');
							break;
							case	'BAD_EMAIL':     
								this.show("Well. this email is inherently invalid. Please check it again and make sure it's your student email");
							break;
							case	'SUCCESS':
								this.show('Alright! Your account has been created! Please check your student email to activate it.')    
							break;
							case	'NO_USERNAME':
								this.show('Please enter an awesome username to signup');
							break;
							case	'NO_PASSWORD':
								this.show('Please enter a good password to signup');
							break;
							case	'BAD_DOMAIN':
							case	'NO_EMAIL':
								this.show('Please enter a valid student email to signup');
							break;
							case	'SUCCESS':
								this.show('Awesome!  Your account has been registered, please check your student email to activate it.');
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
                //if inputs are valid, send to server for double checking and registration
                $.post({
                    url:'/signupAuth',
                    data:inputValues,
                    done:function(a){
											//if bad, show the error
											console.log(a[0]);
											CORE.notif.display(a[0]);
                    }
                });
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
            this.submitValue    =   CORE.elements.signupButton.value||this.submitValue;
            CORE.elements.signupButton.value    =   '';
        },
        hide:function(){
            CORE.elements.signupButton.style.background =   '';
            CORE.elements.signupButton.value    =   this.submitValue;
        }
    }
})(CORE);


CORE.signup.init();