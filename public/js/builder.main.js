

CORE    =   {
    ajax:$,
    currentCRNs:[],
    raw_data:localStorage["RAW_COURSE_DATA"],
    main:{
        fixUrl:{},
        fetch:{},
        parse:{},
    },
    schedule:{
        generate:{}
    },
    crnMap:{},
    helper:{
        time:{},
        color:{},
        element:{}
    },
    view:{
        crnInput:{}
    }
};


CORE.main.fetch =   (function(CORE){
        //Fetches the data that is needed
    return function(CRNarray,cb){
        console.log('f');
        CORE.ajax.get({
            url:'/s/fetch?crns='+JSON.stringify(CRNarray.map(Number)),
            done:function(data){
                //put this data as the "raw data"
                localStorage["RAW_COURSE_DATA"]=JSON.stringify(data);
                CORE.raw_data=localStorage["RAW_COURSE_DATA"];
                //make this the new localstorage stuff
                localStorage["currentSchedule"] =   CRNarray.map(Number).join('.');
                
                cb&&cb();
            }
        });
    };
})(CORE);

CORE.main.parse =   (function(CORE){
    return {
        start:function(){
        
            document.location.hash.substr(1).split('.').forEach(function(v,i,a){
                CORE.currentCRNs.push(v);
            });
            CORE.raw_data   =   JSON.parse(CORE.raw_data);  
            CORE.raw_data.forEach(function(timeSection,index,raw_data){
            
                timeSection.instructor  =   timeSection.instructor.slice(0,-1);
                timeSection.endTime =   CORE.helper.time.getMinutes(timeSection.endTime);
                timeSection.startTime =   CORE.helper.time.getMinutes(timeSection.startTime);
                
                    var timeSectionJSON =   {
                        startTime   :   timeSection.startTime,
                        endTime     :   timeSection.endTime,
                        day         :   timeSection.days,
                        instructor  :   timeSection.instructor
                    };

                if(timeSectionJSON.day=='-1') //If this is an online course
                    timeSectionJSON.day    =   [-1];
                else
                    timeSectionJSON.day    =   timeSectionJSON.day.split('').map(Number);  //split into days convert to Ints and store

                if(CORE.crnMap[timeSection.CRN]===undefined){
                    CORE.crnMap[timeSection.CRN]    =   {
                        courseName:timeSection.subject+timeSection.code,
                        lab:(timeSection.section.indexOf('#')!==-1),
                        crn:timeSection.CRN,
                        courseId:timeSection.id,
                        section:timeSection.section,
                        campus:timeSection.campus,
                        times:[timeSectionJSON],
                        students:{
                            enrolled:0,
                            waitlisted:0,
                            max:0
                        }
                    }
                }else{
                    CORE.crnMap[timeSection.CRN].times.push(timeSectionJSON);
                }
            });
        }
    };
})(CORE);

/* 

    Helper Functions
    - Same as show.main helper functions
    
*/


CORE.helper.time    =   (function(CORE){
    return {
        getTime:function(minutes){
            var hour    =   parseInt(minutes/60);
            var minutes =   minutes%60;
            if(hour>12)
                return [(hour-12),':',minutes,' pm'].join('');
            else
                return [hour,':',minutes,' am'].join('');

        },
        getMinutes:function(time){
            var time = time.split(':');
            return parseInt(time[0])*60+parseInt(time[1])*1;
        },
        inTime:function(start,end,start2,end2){
            if(isNaN(start)||isNaN(start2))
                return false;
            if ((((start2>=start)&&(start2<end))||((end2>start)&&(end2<end)))||(((start>=start2)&&(start<end2))||((end>start2)&&(end<end2))))
                return true;
            return false;
        },
        sameDay:function(day1,day2){
            if(day1[0]===-1||day2[0]===-1)
                    return false;
            for (var i = 0; i < day1.length; i++) {
                if (day2.indexOf(day1[i]) > -1) {
                    return true;
                }
            }
            return false;
        }
    }
})(CORE);

CORE.helper.color   =   (function(CORE){
    return {
        changeTint:function(color,amount){
            var num = parseInt(color,16);
            var newColor = ((num & 0x0000FF) + amount) | 
                ((((num >> 8) & 0x00FF) + amount) << 8) |
                (((num >> 16) + amount) << 16);
            return newColor.toString(16);
        },
        getTextColor:function(code){
            code    =   code.substr(1);
            var r = parseInt(code.substr(0,2),16);
            var g = parseInt(code.substr(2,2),16);
            var b = parseInt(code.substr(4,2),16);

           var nThreshold = 105;
           var bgDelta = (r * 0.299) + (g * 0.587) + (b * 0.114);

           return ((255 - bgDelta) < nThreshold) ? "#222222" : "#ffffff";   
        },
        getBackgroundColor:function(code){
            return "#"+this.changeTint(
                ('000000'+(
                    parseInt(
                        parseInt(code, 36)
                        .toExponential()
                        .slice(2,-5), 10) & 0xFFFFFF)
                 .toString(16)
                 .toUpperCase())
                .slice(-6),5);
        }
    };
})(CORE);

CORE.helper.element =  (function(CORE){
    return {
        changeStyle:function(element,styles){
            for(var attributes in styles)
                element.style[attributes]=styles[attributes];
        },
        createDiv:function(attributes){
            var element =   document.createElement('div');
            for(var attributeName in attributes)
                element.setAttribute(attributeName,attributes[attributeName]);
            return element;
        }
    }
})(CORE)


/*


    Schedule module
    - Anything related to how the schedule should look


*/


CORE.schedule   =   (function(CORE){
    return {
        makeBlock:function(section,time,day){
            if(day==-1)
                return document.createElement('div');
            //Make a timeblock element
            var timeBlock   =   CORE.helper.element.createDiv({class:'b-timeBlock'});
            
            //Adjust its styles.
            CORE.helper.element.changeStyle(timeBlock,{
                top     :   [(time.startTime-480)*(560/840),'px'].join(''),
                left    :   [(day+1)*86,'px'].join(''),
                height  :   [(time.endTime-time.startTime)*(560/840),'px'].join(''),
                lineHeight  :   [(time.endTime-time.startTime-4)*(560/840),'px'].join(''),
                color   :   CORE.helper.color.getTextColor(CORE.helper.color.getBackgroundColor(section.courseName)),
                backgroundColor :   CORE.helper.color.getBackgroundColor(section.courseName)
            });
            timeBlock.innerHTML=section.courseName
            //return the timeblock
            return timeBlock;
        },
        generate:function(){
            var builderWrap =   document.getElementsByClassName('b-timeBlockWrap')[0];
            CORE.currentCRNs.forEach(function(crn,index,array){
                console.log(crn);
                CORE.crnMap[crn].times.forEach(function(time,index,array){
                    time.day.forEach(function(day,index,array){
                        var a = CORE.schedule.makeBlock(CORE.crnMap[crn],time,day);
                        builderWrap.appendChild(a);
                    });
                });
            });
        }
    };
})(CORE);

CORE.view.crnInput  =   (function(CORE){
    document.getElementById('b-crnAddButton').addEventListener('click',function(e){
        //When that Add+ button is clicked toggle the crnInput
        if(e.target.getAttribute('data-active')=='true'){
            Velocity(document.getElementById('b-crnInput'),'fadeOut',300)
            e.target.setAttribute('data-active','false');
        }else{
            Velocity(document.getElementById('b-crnInput'),'fadeIn',300)
            e.target.setAttribute('data-active','true');
        }
    });
    
    document.getElementById('b-crnInput').addEventListener('keydown',function(e){
        //execute if the enter key is pressed on the crn input thing
        console.log(e.keyCode);
        if (!e) { var e = window.event; }
        if (e.keyCode == 13) { 
            //Make an array of all the crns
            var crnArray    =   e.target.value.match(/(\d\d\d\d\d)/g);
            document.location.hash.substr(1).split('.').forEach(function(crn,index,array){
                //remove any crns already in hash
                if(crnArray.indexOf(crn)!==-1)
                crnArray.splice(crnArray.indexOf(crn),1);
            });
            
            //UnToggle the crnInput
            Velocity(document.getElementById('b-crnInput'),'fadeOut',300)
            document.getElementById('b-crnAddButton').setAttribute('data-active','false');
            //Refresh the page with new crns appended to hash if there are any crns left
            if(crnArray.length>0){
                document.location.hash=document.location.hash+'.'+crnArray.join('.');
                location.reload();
            }
        }
    });
    
})(CORE);



var josephisAwesome=true;

//Some real change



(function main(){

    function rawExists(){
        CORE.main.parse.start();
        CORE.schedule.generate();
        
        document.location.hash.substr(1).split('.').forEach(function(v,i,a){
            CORE.currentCRNs.push(v);
            var crnLabel    =   document.createElement('li');
            crnLabel.className  =   'crnLabel';
            crnLabel.innerHTML=v;
            crnLabel.style.color  =   CORE.helper.color.getBackgroundColor(CORE.crnMap[v].courseName);
            document.getElementById('crnBar').appendChild(crnLabel);
        });
    }
    //Fix the Url
    document.location.hash='#'+document.location.hash.match(/(\d\d\d\d\d)/g).join('.');
    //Check Course Schedule Integrity
    if(document.location.hash.substr(1)==localStorage["currentSchedule"]){
        console.log('Raw Data is Good');
        rawExists();
    }else{
        //Get the data from the server
        console.log('Raw Data is Corrupt');
        CORE.main.fetch(document.location.hash.substr(1).split('.'),function(){
            rawExists();
        });
    }
})();

