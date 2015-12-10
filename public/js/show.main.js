/*
    Show Page Script.
    Author: joe
    Date:   Nov 24,2015
    
    New Course Schema
    --any starred values are not used.
    COURSE  =   {
        courseName:String,
        lab:bool,
        preReqs*:[
            [courseCode,courseCode]
        ],
        sections{
            crn:Int,
            courseId:Int,
            section:String,
            campus:String,
            times:[{
                startTime:Int,
                endTime:Int,
                day:[Int,Int],
                building*:String,
                instructor:Teacher Object,
                room*:String,
            }],
            students:{
                enrolled:Int,
                waitlisted:Int,
                max:Int,
            }
        }
    }
    
    New Teacher Schema
    [
        {
            teacherName:String,
            rating:Float,
            votes:Int,
            newRating
        }
    ]
    
    


*/

var TEACHER_RATING_AVERAGE  =   3.6679156419657004;
var STANDARD_DEVIATION  =   1.0229023978801683;
//Store the raw data into the local storage. Help the builder

localStorage['RAW_COURSE_DATA']=JSON.stringify(RAW_COURSE_DATA);


/* 

THE MAIN SKELETON/STRUCTURE FOR THE Scheduling App

*/
    CORE    =   {
        raw_data:RAW_COURSE_DATA,
        scheduleOptions:{
            all:[],
            current:[]
        },
        courseData:{
            map:{},
            array:[]
        },
        main:{
            teacher:{
                ratings:{
                    map:{}
                }
            },
            parse:{},
            search:{
                depther:{}
            },
            schedule:{}
        },
        helper:{
            time:{},
            hook:{}
        },
        sort:{
            functions:{
                type:'Starting Time',
                time:{
                    mornings:null,
                    noon:null,
                    evenings:null,
                    timeOfDay:'mornings'
                },
                blockAmount:null
            },
            type:''

        },
        view:{
            schedule:{},
            toolTip:{},
            customElements:{},
            controlPanel:{
                timeSort:{}
            },
            show:{}
        },
        socket:{
            seatMap:{}
        }
    }

/* 
    Extra classes for functions that help. These usually do nothing in private
*/
        CORE.helper.hook    =   (function(CORE){
            
        });
            
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
                changeTint:function(hex, lum) {
                    // validate hex string
                    hex = String(hex).replace(/[^0-9a-f]/gi, '');
                    if (hex.length < 6) {
                        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
                    }
                    lum = lum || 0;

                    // convert to decimal and change luminosity
                    var rgb = "", c, i;
                    for (i = 0; i < 3; i++) {
                        c = parseInt(hex.substr(i*2,2), 16);
                        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
                        rgb += ("00"+c).substr(c.length);
                    }

                    return rgb;
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
                        .slice(-6),0.1);
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
    Main module for parsing the JSON data:
*/

CORE.main.parse =   (function(CORE){
    
    //Go through each time section and add it to the courseMap:
    CORE.raw_data.forEach(function(timeSection,index,raw_data){
        timeSection.instructor  =   timeSection.instructor.slice(0,-1)
        CORE.main.teacher.ratings.map[timeSection.instructor]=-0.001;
        //Make a key for courses from the name, code, and whether or not it's a lab e.g. PHYS112|LAB
        courseKey   =   [
            timeSection.subject
            ,timeSection.code
            ,'|'
            ,(timeSection.section.indexOf('#')===-1?'':'LAB')
        ].join('');
        
        //Prep the timeSection for insertion
        //Concat subject and code to make a course code
        timeSection.courseCode  =   timeSection.subject +   timeSection.code;   
        //Convert start and endtime to minute value
        timeSection.endTime =   CORE.helper.time.getMinutes(timeSection.endTime);
        timeSection.startTime =   CORE.helper.time.getMinutes(timeSection.startTime);
        
            //Make TimeSectionJSON
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
        
        

        //Check for existence in the coursemap
        var course =   CORE.courseData.map[courseKey];
        if(course!==undefined){
            //If exists in the coursemap
            //Iterate the sections and find the location of the section
            var index   = 0;
            var sectionExists   =   false;
            for(index =  course.sections.length;index--;){
                if(course.sections[index].crn===timeSection.CRN){
                    sectionExists   =   true;
                    break;
                }
            }
            
            if(sectionExists){
            
                //If the section exists add this as a new time
                //check if array already contains time. Return if it's true
                if(course.sections[index].times.every(function(a){
                   return JSON.stringify(a)!==JSON.stringify(timeSectionJSON)
                }))
                     course.sections[index].times.push(timeSectionJSON);
                
                
                
            }else{
                //If the section does not exist insert a new section
                course.sections.push({
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
                });
            }
            
        }else{
            
            //If it doesn't exist add as a new course
            CORE.courseData.map[courseKey]={
                courseName:timeSection.subject+timeSection.code,
                sections:[{
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
                }]
            };
            
        }
        
        
    });
    
    //push course documents into an array for ease of use
    for(var key in CORE.courseData.map){
        CORE.courseData.array.push(CORE.courseData.map[key]);//push course document reference into array
    }
    
    
})(CORE);


/*
    Somewhat efficient sorting algorithms
    
    Morning and Evening are optimized;
    Noon is now optimized;
    Teacher rating is optimized
*/


            CORE.sort.functions   =   (function(CORE){
                return  {
                    type:'Starting Time',
                    time:{
                        mornings:function(a,b){
                            var aSum=0,bSum=0,aCount=0,bCount=0;
                            for(var section=a.length;section--;){
                                for(var time=a[section].times.length;time--;){
                                    if(a[section].times[time].day[0]==-1){
                                        break;
                                    }
                                    //Add the time to the start 
                                    aSum+=((a[section].times[time].startTime)*a[section].times[time].day.length);
                                    aCount+=a[section].times[time].day.length;
                                }
                            }
                            for(var section=b.length;section--;){
                                for(var time=b[section].times.length;time--;){
                                    if(b[section].times[time].day[0]==-1){
                                        break;
                                    }
                                    //Add the time to the start 
                                    bSum+=((b[section].times[time].startTime)*b[section].times[time].day.length);
                                    bCount+=b[section].times[time].day.length;
                                }
                            }
                            
                            
                            
                            return (aSum/aCount)-(bSum/bCount);
                        },
                        noon:function(a,b){
                            var aSum=0,bSum=0,aCount=0,bCount=0;
                            //Iterate through each a schedule time
                            for(var section=a.length;section--;){
                                for(var time=a[section].times.length;time--;){
                                    if(a[section].times[time].day[0]==-1){
                                        break;
                                    }
                                    //Add the difference between the middle of the timeblock to aSum
                                    aSum+=(Math.abs((a[section].times[time].startTime-a[section].times[time].endTime)/2-720)*a[section].times[time].day.length);
                                    aCount+=a[section].times[time].day.length
                                }
                            }
                            //Iterate through each b schedule time
                            for(var section=b.length;section--;){
                                for(var time=b[section].times.length;time--;){
                                    if(b[section].times[time].day[0]==-1){
                                        break;
                                    }
                                    //Add the difference between the middle of the timeblock to bSum
                                    bSum+=(Math.abs((b[section].times[time].startTime-b[section].times[time].endTime)/2-720)*b[section].times[time].day.length);
                                    bCount+=b[section].times[time].day.length;
                                }
                            }
                            return  (bSum/bCount-aSum/aCount);
                        },
                        evenings:function(a,b){
                            var aSum=0,bSum=0,aCount=0,bCount=0;
                            for(var section=a.length;section--;){
                                for(var time=a[section].times.length;time--;){
                                    if(a[section].times[time].day[0]==-1){
                                        break;
                                    }
                                    //Add the time to the start 
                                    aSum+=((a[section].times[time].startTime)*a[section].times[time].day.length);
                                    aCount+=a[section].times[time].day.length;
                                }
                            }
                            for(var section=b.length;section--;){
                                for(var time=b[section].times.length;time--;){
                                    if(b[section].times[time].day[0]==-1){
                                        break;
                                    }
                                    //Add the time to the start 
                                    bSum+=((b[section].times[time].startTime)*b[section].times[time].day.length);
                                    bCount+=b[section].times[time].day.length;
                                }
                            }
                            
                            return (bSum/bCount)-(aSum/aCount);
                        },
                        timeOfDay:'mornings'
                    },
                    teacherRating:function(a,b) {
                        var aSum=0,bSum=0,aCount=0,bCount=0;
                        for(var i=a.length;i--;){
                            aSum+=CORE.main.teacher.ratings.map[a[i].times[0].instructor];
                            aCount++;
                        }
                            
                        for(var i=b.length;i--;){
                            bSum+=CORE.main.teacher.ratings.map[b[i].times[0].instructor];
                            bCount++;
                        }
                        
                        return (bSum/bCount)-(aSum/aCount);
                            
                    },
                    availability:function(a,b){
                        var aSum=0,bSum=0;
                        for(var i = a.length;i--;){
                            var aSeats  =   CORE.socket.seatMap[a[i].crn];
                            var d = (aSeats.m-aSeats.e);
                            aSum+=((d>0)*100000)-(aSeats.w*100)+d*(d>0);

                        }
                        for(var i = b.length;i--;){
                            var bSeats  =   CORE.socket.seatMap[b[i].crn];
                            var d = (bSeats.m-bSeats.e);
                            bSum+=((d>0)*100000)-(bSeats.w*100)+d*(d>0);
                        }
                        return bSum-aSum;
                    },
                    blockAmount:function(a,b){
                        return b.times.length-a.times.length;
                    }
                }
            })(CORE);

        /*
            Simple function that starts the sorting.

        */
            CORE.sort.functions.start  =   (function(CORE){
                return function(){
                    document.getElementById('main-loadingGear').style.display='block';
                    document.getElementById('main-scheduleContainer').innerHTML='';
                    setTimeout(function(){
                        //Start the timer
                        CORE.main.show.current=0;
                        //find out which sort function to use;
                        switch(CORE.sort.functions.type){
                            case 'Starting Time':
                                var start = new Date().getTime();   
                                CORE.scheduleOptions.current.sort(CORE.sort.functions.time[CORE.sort.functions.time.timeOfDay]);
                            break;
                            case  'Teacher Rating':
                                var start = new Date().getTime();   
                                CORE.scheduleOptions.current.sort(CORE.sort.functions.teacherRating);
                            break;
                            case  'Availability':
                                var start = new Date().getTime();   
                                CORE.scheduleOptions.current.sort(CORE.sort.functions.availability);
                            break;
                        }
                        //Display timer results
                        console.log('Sorting Took: '+(Date.now()-start)+'ms');
                        
                        document.getElementById('main-loadingGear').style.display='none';
                        CORE.main.show.go(0);
                        
                    },10);
                }
            })(CORE);



/* 
    Filters, Much like sort, this is the controller part for
    the filter options in the control panel 
*/

    CORE.filter  =   (function(CORE){
        DBKey   =   {
            ABBY:"Abbotsford",
            CHIL:"Chilliwack",
            HOPE:"Hope",
            MIS:"Mission",
            ONL:"Online",
            CLEAR:"Clearbrook"
        }
        return {
            campus:function(){
                var killList    =   [];
                var campusStates    =   CORE.view.controlPanel.campusFilter.campusOn;
                for(var key in campusStates){
                    if(!campusStates[key]){
                        killList.push(DBKey[key]);
                    }
                }
                var start=Date.now();
                CORE.scheduleOptions.current =   CORE.scheduleOptions.all.filter(function(a){
                    for(var i=a.length;i--;)
                        if(killList.indexOf(a[i].campus)>-1)
                            return false;
                            
                    return true;
                });
                console.log('Filtering Took: '+(Date.now()-start)+'ms');
            }
        }
        
        
    })(CORE);






/*
    Module for handling the display

*/

        CORE.main.show  =   (function(CORE){
            
            var publicVar   =   {
                current:0,
                go:function(a){
                    var current=this.current||a;
                    var up = 10;
                    if(current>=CORE.scheduleOptions.current.length-10)
                        up=CORE.scheduleOptions.current.length-current;
                    for(var i = current;i<current+up;i++){
                        var schedule    =   CORE.view.schedule.generate(CORE.scheduleOptions.current[i]);
                        document.getElementById('main-scheduleContainer').appendChild(schedule);
                    }
                    this.current+=10;
                    //Update how full sections are
                    CORE.socket.updateSeats();
                    return current;
                },
                init:function(){
                    
                    window.onscroll = function(ev) {
                        var current =   CORE.main.show.current;
                        var body = document.body,
                            html = document.documentElement;

                        var height = Math.max( body.scrollHeight, body.offsetHeight, 
                                               html.clientHeight, html.scrollHeight, html.offsetHeight );
                        if (document.documentElement.scrollTop)
                        { currentScroll = parseInt(document.documentElement.scrollTop); }
                        else
                        { currentScroll = parseInt(document.body.scrollTop); }

                        if(parseInt(currentScroll)>=(CORE.main.show.current *400)){
                         CORE.main.show.go();
                        }
                    };
                
                }
            }
            
            return publicVar;
        })(CORE);



/* 

    Main module for handling anything teacher related
    
*/
CORE.main.teacher.functions   =   (function(CORE){
    
    var globalVars  =   {
        generate:function(block,data){
            var teacherNames    =   {};
            var ratingContainer =   block.getElementsByClassName('r-ratingContainer')[0];
            //Get teacherNames
            var tSum=0,tCount=0;
            data.forEach(function(v,i,a){
                    var courseLabel =   document.createElement('div');                                                
                    courseLabel.innerHTML+=[
                    '<div class="crn_',
                    v.crn,
                    '"style="float:left;border:1px solid #DDD;box-sizing:border-box;height:28px;margin-top:1px;padding-left:5px;padding-right:5px;line-height:28px;margin-right:10px;">',
                    '<strong style="text-shadow:0 0px 1px #999" data-seatsCRN="',
                        v.crn,
                        '">',
                        '</strong>',
                    ' seats left</div>',
                    '<strong style="color:'+CORE.helper.color.getBackgroundColor(v.courseName)+'">',
                    v.courseName,
                    '</strong> ',
                    v.section,
                    ' ',
                    v.times[0].instructor,
                    ' <strong>',
                    (CORE.main.teacher.ratings.map[v.times[0].instructor]>0?CORE.main.teacher.ratings.map[v.times[0].instructor]:''),
                    '<strong><br>'
                ].join('');
                
                ratingContainer.appendChild(courseLabel);
                if(CORE.main.teacher.ratings.map[v.times[0].instructor]>0){
                    tSum+=CORE.main.teacher.ratings.map[v.times[0].instructor];
                    tCount++;
                }
            });
            var avgRating   =   document.createElement('div');
            avgRating.className='r-averageRating';
            avgRating.innerHTML=(tSum/tCount).toFixed(3)
            ratingContainer.parentNode.insertBefore(avgRating,ratingContainer);
            return 
        },
        fetch:function(cb){
            var teacherArray    =   Object.keys(CORE.main.teacher.ratings.map);
            $.get({
                url:['/s/getTeacher?teachers=',JSON.stringify(teacherArray)].join(''),
                done:function(data){
                    try{
                        data.forEach(function(v,i,a){
                           CORE.main.teacher.ratings.map[v.teacherName]  =   v.teacherRating;
                        });
                        cb&&cb();
                        
                    }catch(e){
                        console.log(e);
                    }
                }
            });
        
        },
        onFetched:function(){
            
        }
    };
    
    return globalVars;
})(CORE);


var counter=0;
CORE.main.search    =   (function(CORE){
    
    //Define the main recursion function
    return{
        depther:function(currentSchedule,index){
            //Add the schedule as an option if the index is less than 0. This is for 1 course schedules.
            if(index<0){
                CORE.scheduleOptions.all.push(currentSchedule);
                return;
            }
            //Create a reference to the array with all the courses.
            var courseArray =   CORE.courseData.array;
            var courseI =   courseArray[index].sections.length;
            up:
            while(courseI--){
                var works=true;
                var schedulI = currentSchedule.length;
                while(schedulI--){
                    //Should be comparing individual sections now.


                    //Check if the lab and course are on the same campus
                    //Exit if not true.

                    if(currentSchedule[schedulI].courseName===courseArray[index].sections[courseI].courseName){
                        if(currentSchedule[schedulI].campus!==courseArray[index].sections[courseI].campus&&currentSchedule[schedulI].campus!=='Online'){
                            continue up;
                        }
                    }

                        var timeSI =   currentSchedule[schedulI].times.length;  
                        while(timeSI--){
                            var timeCI  =   courseArray[index].sections[courseI].times.length;
                            while(timeCI--){

                                var sSTime =   currentSchedule[schedulI].times[timeSI];
                                var cSTime =   courseArray[index].sections[courseI].times[timeCI];

                                //If any intersects exists between the times of sSTime or cSTime exit.
                                if(CORE.helper.time.sameDay(sSTime.day,cSTime.day)&&CORE.helper.time.inTime(sSTime.startTime,sSTime.endTime,cSTime.startTime,cSTime.endTime))
                                    continue up;
                            }
                        }
                }
                if(works)
                    if(index==0)
                        //If the index is zero just push it
                        CORE.scheduleOptions.all.push(currentSchedule.concat([courseArray[index].sections[courseI]]));
                    else
                        //Otherwise try to depth search again.
                        CORE.main.search.depther(currentSchedule.concat([courseArray[index].sections[courseI]]),index-1);

            }

        },
        init:function(cb){
            setTimeout(function(){
            var start = new Date().getTime();
                CORE.courseData.array[CORE.courseData.array.length-1].sections.forEach(function(v,i,a){
                    CORE.main.search.depther([v],CORE.courseData.array.length-2);
                });
                console.log('Scheduling Took: '+(Date.now()- start)+'ms');
                CORE.scheduleOptions.current=CORE.scheduleOptions.all;
                cb&&cb();
            },50);

        }
    }
})(CORE);







/*

    CORE view functions: Functions that change anything view related

*/function firstToUpperCase( str ) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}



CORE.view.schedule  =   (function(CORE){
    return {
        makeBlock:function(section,time,day){
            if(day==-1)
                return document.createElement('div');
            //Make a timeblock element
            var timeBlock   =   CORE.helper.element.createDiv({class:'s-timeBlock'});
            
            //Adjust its styles.
            CORE.helper.element.changeStyle(timeBlock,{
                top     :   [(time.startTime-480)/2,'px'].join(''),
                left    :   [((day+1)%7)*71,'px'].join(''),
                height  :   [(time.endTime-time.startTime)/2,'px'].join(''),
                lineHeight  :   [(time.endTime-time.startTime-4)/2,'px'].join(''),
                color   :   CORE.helper.color.getTextColor(CORE.helper.color.getBackgroundColor(section.courseName)),
                backgroundColor :   CORE.helper.color.getBackgroundColor(section.courseName)
            });
            timeBlock.innerHTML=section.courseName
            //return the timeblock
            return timeBlock;
        },
        generate:function(schedule){
            //Create a Copy of the schedule template
            var ScheduleBlock   =   document.getElementById('scheduleWrapTemplate').cloneNode(true);
            var sectionCRNs =   [];
            //Remove the id
            ScheduleBlock.id='';
            //iterate through all the courses in the schedule parameter
            schedule.forEach(function(section,index,schedule){
                //iterate through every possible time
                sectionCRNs.push(section.crn);
                section.times.forEach(function(time,timeIndex,array){
                    //itereate through all the days
                    time.day.forEach(function(day,index,sectionDays){
                        //get the makeblock function
                        var timeBlock   =   CORE.view.schedule.makeBlock(section,time,day);
                        //Add a location attribute for the tooltip. Makes it easier to find which time this is.
                        timeBlock.setAttribute('data-timeIndex',timeIndex);
                        CORE.view.toolTip.add(timeBlock,section);
                        
                        ScheduleBlock.getElementsByClassName('s-timeBlockWrap')[0].appendChild(timeBlock);
                        
                    });
                });
            });
            //Create the button to link to builder
            var builderButton   =   ScheduleBlock.getElementsByClassName('s-useMeButton')[0];

            builderButton.onclick  =  function(){
                //Tell the localStorage that it has the right course data.
                localStorage["currentSchedule"] =   sectionCRNs.join('.')
                //Redirect the page
                document.location   =   "/s/builder#"+sectionCRNs.join('.');
            };
            
            CORE.main.teacher.functions.generate(ScheduleBlock,schedule);
            document.getElementById('main-scheduleContainer').appendChild(ScheduleBlock);
            return ScheduleBlock;
        }
    }
})(CORE);

            CORE.view.controlPanel.timeSort =   (function(CORE){
                var TIMEBALL_WIDTH  =   20;
                var TIMEBALL_CONNECTOR_WIDTH  =   50;
                var CONTAINER   =   document.getElementById('timeSort-wrap');
                
                var labelArray  =   [
                    "Mornings"
                    ,"Noon"
                    ,"Evenings"
                ];  //  Make an array of all the labels that are going to be used;
                
                (function(labels){
                    labels.forEach(function(label,index,array){
                        var labelContainer  =   document.getElementById('timeSort-upper');
                        var labelElement    =   document.createElement('span'); // Make the label
                        
                        labelContainer.appendChild(labelElement);   // Add label to DOM
                        labelElement.innerHTML  =   label;
                        labelElement.className  =   'timeSort-label';   
                        labelElement.setAttribute('data-labelValue',label); //  Give the label a unique attribute 
                        
                        var labelWidth  =   labelElement.offsetWidth;   // Get the label width
                        
                        index+=1;
                        labelElement.style.marginLeft   =   ((index-1)*TIMEBALL_WIDTH)+(TIMEBALL_WIDTH/2)+((index-1)*TIMEBALL_CONNECTOR_WIDTH)-(labelWidth/2)+'px';    // Make the label center over it's ball
                        labelElement.style.display  =   'none'; // Make the label Invisible3
                    });
                })(labelArray); // Function takes the label Array Values, wraps them, and appends them to DOM
                
                var timeBalls   =   [].slice.call(document.getElementsByClassName('timeSort-ball'));    // Grab all the timeballs
                    timeBalls.forEach(function(ball,index,array){
                        ball.addEventListener('click',function(){
                            if(ball===activeBall||CORE.view.controlPanel.timeSort.disabled)   //  Exit function if ball already selected or disabled
                                return;
                            
                            var activeBall =   document.getElementById('timeSort-ball-active');     // Get the ball that is currently active
                            var activeBallValue =   activeBall&&activeBall.getAttribute('data-value');     //  Get active balls unique value
                            
                            activeBall&&(
                                activeBall.id='',
                                (document.querySelectorAll('[data-labelValue="'+activeBallValue+'"]')[0].style.display =   'none')
                            );  //  Remove the active id from the currently active ball and hide its label
                            
                            
                            var ballValue   =   ball.getAttribute('data-value');
                            ball.id =   'timeSort-ball-active'; // Make the current ball active
                            
                            document.querySelectorAll('[data-labelValue="'+ballValue+'"]')[0].style.display =   ''; //  Remove the display:none attribute from the selected ball
                            
                            CORE.sort.functions.time.timeOfDay=(ballValue.toLowerCase()); // set sort variable timeofday
                            CORE.sort.functions.time.type="Starting Time"; // set sort variable timeofday
                            CORE.sort.functions.start() // Start the sort function
                        });
                    }); // For every ball, when clicked, make it active, and display associative label
                return {
                    disabled:false,
                    activate:function(ball){
                            var activeBall =   document.getElementById('timeSort-ball-active');     // Get the ball that is currently active
                            var activeBallValue =   activeBall&&activeBall.getAttribute('data-value');     //  Get active balls unique value
                            
                            activeBall&&(
                                activeBall.id='',
                                (document.querySelectorAll('[data-labelValue="'+activeBallValue+'"]')[0].style.display =   'none')
                            );  //  Remove the active id from the currently active ball and hide its label
                            
                            var ballValue   =   ball.getAttribute('data-value');
                            ball.id =   'timeSort-ball-active'; // Make the current ball active
                            
                            document.querySelectorAll('[data-labelValue="'+ballValue+'"]')[0].style.display =   ''; //  Remove the display:none attribute from the selected ball
                            
                            CORE.sort.functions.time.timeOfDay=(ballValue.toLowerCase()); // set sort variable timeofday
                            CORE.sort.functions.time.type="Starting Time"; // set sort variable timeofday
                            CORE.sort.functions.start()
                    },
                    disable:function(){
                        CONTAINER.style.opacity='0.4';
                        CORE.view.controlPanel.timeSort.disabled=true;
                    },
                    enable:function(){
                        CONTAINER.style.opacity='1';
                        CORE.view.controlPanel.timeSort.disabled=false;
                        CORE.sort.functions.type    =   'Starting Time';
                    }
                }
            })(CORE);









                CORE.view.customElements.checkBoxes    =   (function(CORE){
                    
                    var publicVars  =   {
                        onClick:function(e){
                            var checked     =    e.target.getAttribute('checked');  //See if this box is checked
                            if(checked=="false"){
                                e.target.setAttribute('checked',true);
                                e.target.classList.add('customCheckbox-checked');
                                
                            }else{
                                e.target.setAttribute('checked',false);
                                e.target.classList.remove('customCheckbox-checked');
                            }
                            
                            publicVars.globalExt(e);
                        },
                        globalExt:function(e){
                            
                        },
                        addExt:function(uniq,cb){
                            var a = [].slice.call(document.querySelectorAll('[data-uniqID="'+uniq+'"]')); // get checkboxes with unique and convert to array
                            a.forEach(function(v,i,a){
                                v.addEventListener('mousedown',function(e){
                                    if(e.shiftKey)
                                        return;
                                    cb&&cb(e)
                                });
                            });
                        }
                    }
                    var oldCheckBoxes   =   [].slice.call(document.getElementsByClassName('customCheck'));  // Get all the checkboxes with the class and store into an array
                    oldCheckBoxes.forEach(function(box,index,a){
                        
                        var keepAttrs   =   box.getAttribute('data-keep')   // Get the attribute names that are going to be kept from the old element
                        var attrJSON    =   {checked:false,class:''}  //  JSON element to store these attr values in;

                        keepAttrs&&keepAttrs.split(' ').forEach(function(attr,index,a){
                            attrJSON[attr]  =   box.getAttribute(attr); // Grab the attribute from the element and put it into the json
                        });
                        
                        attrJSON.class  +=   ' customCheckBox';
                        var newCheck    =   CORE.helper.element.createDiv(attrJSON); //Create a new "checkbox" with the attributes
                        newCheck.addEventListener('mousedown',publicVars.onClick);
                        box.parentNode.replaceChild(newCheck,box);    //Replace the old checkbox with the new one
                    });
                    return publicVars;
                })(CORE);
        



            CORE.view.controlPanel.campusFilter =   (function(CORE){
                var publicVars  =   {
                    campusOn:{
                        ABBY:true,
                        CHIL:true,
                        HOPE:true,
                        MIS:true,
                        ONL:true,
                        CLEAR:true
                    }
                }
                var Campuses    =   [
                    {name:'Abbotsford',uniq:'ABBY',check:null},
                    {name:'Chilliwack',uniq:'CHIL',check:null},
                    {name:'Hope',uniq:'HOPE',check:null},
                    {name:'Mission',uniq:'MIS',check:null},
                    {name:'Clearbrook',uniq:'CLEAR',check:null},
                    {name:'Online',uniq:'ONL',check:null}
                ];

                Campuses.forEach(function(v,i,a){
                    CORE.view.customElements.checkBoxes.addExt(v.uniq,function(e){
                        if(e.target.getAttribute('checked')=="true"){
                            CORE.view.controlPanel.campusFilter.campusOn[v.uniq]    =   true;
                        }else{
                            CORE.view.controlPanel.campusFilter.campusOn[v.uniq]    =   false;
                        }
                        CORE.filter.campus(v.uniq);
                        CORE.sort.functions.start();
                    });
                });
                
                return publicVars;
            })(CORE);

   
            CORE.view.controlPanel.sortDrop   =   (function(CORE){
                var dropDown    =   document.getElementById('sort-dropDownList');
                var dropDownButton  =   document.getElementById('sort-dropDownButton');
                document.addEventListener('click',function(e){
                    if(CORE.view.controlPanel.sortDrop.down&&!e.target.classList.contains('sort-dropDownItem'))
                        CORE.view.controlPanel.sortDrop.move.up();
                    else if(e.target.classList.contains('sort-dropDownItem')){
                        document.querySelectorAll('[data-value="'+CORE.view.controlPanel.sortDrop.currentValue+'"]')[0].style.display='block';
                        e.target.style.display  =   'none';
                        CORE.view.controlPanel.sortDrop.move.up();
                        CORE.view.controlPanel.sortDrop.setWords(e.target.getAttribute('data-value'));
                        switch(e.target.getAttribute('data-value')){
                            case 'Teacher Rating':
                                CORE.sort.functions.type='Teacher Rating';
                                CORE.view.controlPanel.timeSort.disable();
                                CORE.sort.functions.start();
                            break;
                            case 'Starting Time':
                                CORE.sort.functions.type='Starting Time';
                                CORE.view.controlPanel.timeSort.enable();
                                CORE.sort.functions.start();
                            break;
                            case 'Availability':
                                CORE.sort.functions.type='Availability';
                                CORE.view.controlPanel.timeSort.disable();
                                CORE.sort.functions.start();
                            break;
                        }
                    }else
                        return;
                });
                dropDownButton.addEventListener('click',function(e){
                    e.stopPropagation();
                    var down    =   CORE.view.controlPanel.sortDrop.down;
                    if(down){
                        dropDownButton.style.backgroundImage  =   '';
                        CORE.view.controlPanel.sortDrop.down  =   false;
                        Velocity(dropDown,'slideUp',100);
                    }else{
                        dropDownButton.style.backgroundImage  =   'url(/images/upArrow.png)';
                        CORE.view.controlPanel.sortDrop.down  =   true;
                        Velocity(dropDown,'slideDown',100);
                    }
                });
                return {
                    setWords:function(words){
                        dropDownButton.innerHTML    =   'Sort By <label style="font-weight:100">|</label><label style="font-weight:300;"> '+words+'</label>';
                        CORE.view.controlPanel.sortDrop.currentValue=words;
                    },
                    down:false,
                    currentValue:"Starting Time",
                    move:{
                        down:function(){
                            dropDownButton.style.backgroundImage  =   'url(../images/upArrow.png)';
                            CORE.view.controlPanel.sortDrop.down  =   true;
                            Velocity(dropDown,'slideDown',100);
                        },
                        up:function(){
                            dropDownButton.style.backgroundImage  =   '';
                            CORE.view.controlPanel.sortDrop.down  =   false;
                            Velocity(dropDown,'slideUp',100);
                        }
                    }
                }
            })(CORE);








        CORE.view.toolTip  =   (function(CORE){
            
            return {   
                setUp:function(event){
                    var tt  =   document.getElementById('t-toolTipWrap');
                    tt.style.display    =   'block';
                    var bodyRect = document.body.getBoundingClientRect(),
                        elemRect = event.target.getBoundingClientRect(),
                        offset   = elemRect.top - bodyRect.top,
                        offsetleft   = elemRect.left - bodyRect.left;
                    tt.style.top    =   offset+80+elemRect.height+'px';
                    tt.style.left    =   offsetleft-150+'px';
                    document.getElementById('t-toolTipTimes').innerHTML ='';
                },
                onHover:function(event,data){
                    var timeLocation    =   event.target.getAttribute('data-timeIndex');


                    var toolTip =    CORE.view.toolTip.setUp(event);
                    var dayMap  =   {
                        0:'Monday',
                        1:'Tuesday',
                        2:'Wednesday',
                        3:'Thursday',
                        4:'Friday',
                        5:'Saturday',
                        6:'Sunday'
                    }

                    var name =   document.getElementById('t-toolTipCourseName');

                    name.innerHTML  =   [data.courseName,
                                         (data.lab?' - LAB':''),
                                         '<label style="float:right;">',
                                         data.section,
                                         '</label>'
                                         ].join('');
                    name.style.color    =   CORE.helper.color.getBackgroundColor(data.courseName);


                    var crn =   document.getElementById('t-toolTipCRN');
                    var teacher  =   document.getElementById('t-toolTipInstructor');
                    var rating  =   document.getElementById('t-toolTipRating');
                    var imagea   =   document.getElementById('t-toolTipImage');

                    crn.innerHTML   = "CRN: "+data.crn;
                    teacher.innerHTML   =   data.times[timeLocation].instructor;

                    if (CORE.main.teacher.ratings.map[data.times[timeLocation].instructor]>0)
                    {
                        imagea.style.background="";
                        var numRating   =   CORE.main.teacher.ratings.map[data.times[timeLocation].instructor];
                        rating.innerHTML  =  numRating.toFixed(3);
                        if(numRating>=TEACHER_RATING_AVERAGE+(STANDARD_DEVIATION/2)){
                            imagea.style.backgroundColor='#2ecc71';
                        }
                        else if(numRating<TEACHER_RATING_AVERAGE+(STANDARD_DEVIATION/2)&&numRating>=TEACHER_RATING_AVERAGE-(STANDARD_DEVIATION/2)){
                            imagea.style.backgroundPosition="-100px 0px"
                            imagea.style.backgroundColor='#f1c40f';
                        }
                        else if(TEACHER_RATING_AVERAGE-(STANDARD_DEVIATION/2)){
                        
                            imagea.style.backgroundPosition="-200px 0px"
                            imagea.style.backgroundColor='#e74c3c';
                        }
                    }else{
                        rating.innerHTML  =   'N/A';
                        imagea.style.background='#DDD';
                    }



                    for(var g=0;g<data.times.length;g++){
                        for(var i=0;i<data.times[g].day.length;i++){
                            if(data.times[timeLocation].day[i]===-1)
                                break;
                            document.getElementById('t-toolTipTimes').innerHTML   +=   [
                                '<strong>',
                                dayMap[data.times[g].day[i]],
                                ': </strong>',
                                CORE.helper.time.getTime(data.times[g].startTime),
                                ' - ',
                                CORE.helper.time.getTime(data.times[g].endTime),
                                '<br>'

                            ].join('')
                        }
                    }


                },
                onMove:function(event,data){
                    var tt  =   document.getElementById('t-toolTipWrap');
                    tt.style.display    =   'none';
                },
                add:function(element,data){
                    var _this   =   this;

                    element.addEventListener('mouseover',function(event){
                        _this.onHover(event,data);
                    });
                    element.addEventListener('mouseout',function(event){
                        _this.onMove(event,data)
                    });
                }
            }
        })(CORE);
        
        
        
        
        
CORE.socket =   (function(CORE){
    var socket = io('http://localhost:8080');
    socket.on('crnData', function (data) {
        data.forEach(function(section,index,array){
            CORE.socket.seatMap[section[0]]=JSON.parse(section[1]);
            [].forEach.call(document.getElementsByClassName('crn_'+section[0]),function(v,i,a){
                var sectionFullness =   (CORE.socket.seatMap[section[0]].m-CORE.socket.seatMap[section[0]].e);
                    if(sectionFullness<=0){
                        v.innerHTML=CORE.socket.seatMap[section[0]].w+' waitlisted';
                    }else{
                        v.innerHTML=sectionFullness+' spot'+(sectionFullness>1?'s':'');
                    }
            });
        });
    });
    return {
        seatMap:{},
        socket:socket,
        updateSeats:function(){
            for(var crn in CORE.socket.seatMap){
                var data =   CORE.socket.seatMap[crn];
                [].forEach.call(document.getElementsByClassName('crn_'+crn),function(v,i,a){
                    var sectionFullness = data.m-data.e;
                    if(sectionFullness<=0){
                        v.innerHTML=data.w+' waitlisted';
                    }else{
                        v.innerHTML=sectionFullness+' spot'+(sectionFullness>1?'s':'');
                    }
                });
            }
        }
    }
})(CORE);



























(function main(){
    //Start scheduling
    
    CORE.main.search.init(function(){
        //Grab the teacher ratings.
        CORE.main.teacher.functions.fetch(function(){
            //Once the teacher ratings are recieved, show the scehdules.
            CORE.sort.functions.type='Starting Time';
            CORE.view.controlPanel.timeSort.activate(document.getElementsByClassName('timeSort-ball')[0]); 
        });
        CORE.main.show.init();
    });
})();