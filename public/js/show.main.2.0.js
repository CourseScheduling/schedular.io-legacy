


CORE	=	{
	raw	:	RAW_COURSE_DATA,
	schedules	:	{
		all:[],
		current:[]
	},
	courses	:	[],
	helper	:	{},
	main	:	{
		search	:	{}
	},
	views	:	{
		schedule:{},
	}
}




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
									return '#FFFFFF'
                    code    =   code.substr(1);
                    var r = parseInt(code.substr(0,2),16);
                    var g = parseInt(code.substr(2,2),16);
                    var b = parseInt(code.substr(4,2),16);

                   var nThreshold = 105;
                   var bgDelta = (r * 0.299) + (g * 0.587) + (b * 0.114);

                   return ((255 - bgDelta) < nThreshold) ? "#222222" : "#ffffff";   
                },
                getBackgroundColor:function(code){
									return randomColor({luminosity:"bright",format:"hex",seed:parseInt(code,36)});           
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
CORE.helper.time	=	(function(CORE){
	return {
		inTime:function(start,end,start2,end2){
				if(start==0||start2==0)
						return false;
				if((((start2>=start)&&(start2<end))||((end2>start)&&(end2<end)))||(((start>=start2)&&(start<end2))||((end>start2)&&(end<end2))))
						return true;
				return false;
		},
		sameArr:function(day1,day2){
				if(day1[0]==-1||day2[0]==-1)
								return false;
				for (var i = 0; i < day1.length; i++) {
						if (day2.indexOf(day1[i]) > -1) {
								return true;
						}
				}
				return false;
		}
	};
})(CORE.helper);

CORE.helper.array	=(function(HELPER){
	return {
		returnByField:function(array,field,value){
			for(var i = 0;i<array.length;i++){
				if(array[i][field]==value)
					return array[i];
			}
			return false;
		}
		
		
	};
})(CORE.helper);

CORE.main.search	=	(function(CORE){
	var possible	=	[];
	return {
		prep:function(){
			var mangledArray	=	[];
			CORE.raw.forEach(function(course){
				var typeArray	=	[];
				for(var type in course.sections){
					typeArray.push(course.sections[type]);
				}
				typeArray.sort(function(a,b){return b.length-a.length;});

				var mangla	=	[];
				course.mangled.forEach(function(v,i,a){
					var mJ	=	{times:[]};
					v.forEach(function(uniq,i){
						var i = 0;
						var found = false;
						while(!found&&i<4){
							found	=	CORE.helper.array.returnByField(typeArray[i],'uniq',uniq);
							i++;
						}
						mJ[i-1]	=found;
						mJ.times	=	mJ.times.concat(found.times);
						mJ.length = i;
					});
					if(mJ.times.length)
						mangla.push(mJ);
				});
				mangledArray.push(mangla);
			});
			mangledArray.sort(function(a,b){return b.length-a.length;});
			return mangledArray;
		},
		start:function(){
			CORE.courses[CORE.courses.length-1].forEach(function(section,index){
				depth([section],CORE.courses.length-2);
			});

			function depth(pos,index){
				if(index<0)
					return CORE.schedules.all.push(pos);
				var course = CORE.courses[index];
				var layerI	=	CORE.courses[index].length;
				up:
				while(layerI--){
					var posI	=	pos.length;
					if(course[layerI].times[0].days[0]==-1)
						posI=0;
					while(posI--){
						var timeP	=	pos[posI].times.length;
						
						while(timeP--){
							var timeL	=	course[layerI].times.length;
							while(timeL--){
									
								var tP	=	pos[posI].times[timeP];
								var tL	=	course[layerI].times[timeL];
								if(CORE.helper.time.inTime(tP.start,tP.end,tL.start,tL.end)&&CORE.helper.time.sameArr(tP.days,tL.days)){
									continue up;
								}
								
							}
						}
						
					}
					if(index==0)
						CORE.schedules.all.push(pos.concat(course[layerI]));
					else
						depth(pos.concat(course[layerI]),index-1);
				}
			}
		},
			
		check:function(mangle1,mangle2){
				
		}
	};
})(CORE);


var d = new Date();
CORE.courses	=	CORE.main.search.prep();
console.log('Prep took: '+((new Date())-d)+'ms');


var d = new Date();
CORE.main.search.start();
console.log('Scheduling took: '+((new Date())-d)+'ms');





















CORE.views.schedule  =   (function(CORE){
	return {
		flatten:function(schedule){
			var sections	=	[];
			for(var i = 0;i<schedule.length;i++){
				for(var g = 0;g<schedule[i].length;g++){
					sections.push(schedule[i][g]);
				}
			}
			return sections;
		},
		gen:function(options){
			var Schedule	=	document.getElementById('scheduleWrapTemplate').cloneNode(true);
			Schedule.id	='';
			avgRating	=	[0,0];
			var sections	=	[];
			if(options==undefined)
				return;
			options.forEach(function(section){
				if(section==undefined)
					return;
				
				sections.push(section.uniq+section.type);
				if(CORE.main.teachers.map[section.times[0].instructor.substr(0,section.times[0].instructor.indexOf('(')-1)]==undefined)
					rating	=	('unrated')
				else{
					rating	=	(CORE.main.teachers.map[section.times[0].instructor.substr(0,section.times[0].instructor.indexOf('(')-1)].rating)
					avgRating[0]+=rating;
					avgRating[1]++;
				}
				Schedule.getElementsByClassName('r-ratingContainer')[0].innerHTML	=	
					'<li style="margin:0;padding:0;font-family:Open Sans;font-weight:100;"><label style="font-weight:400;color:#FFF;background-color:'+CORE.helper.color.getBackgroundColor(section.title)+';font-family:Open Sans;font-size:10px;padding:0px 5px; 0px 5px;">'+section.title+'</label> '+section.section+' - '+section.times[0].instructor.substr(0,section.times[0].instructor.indexOf('('))+' ('+rating+')</li>'+Schedule.getElementsByClassName('r-ratingContainer')[0].innerHTML;
				section.times.forEach(function(time){
					Schedule.getElementsByClassName('r-ratingContainer')[0].innerHTML;
					CORE.views.schedule.makeBlocks(time,section).map(function(a){
						Schedule.getElementsByClassName('s-timeBlockWrap')[0].appendChild(a);
					});
				});
			});	
			Schedule.getElementsByClassName('s-modifyIcon')[0].setAttribute('data-queryCode',sections.sort().join('.'));
			Schedule.getElementsByClassName('s-saveIcon')[0].setAttribute('data-queryCode',sections.sort().join('.'));
			Schedule.getElementsByClassName('r-averageRatingTitle')[0].innerHTML+='<label style="margin-left:10px;color:#333;font-weight:300;">'+(avgRating[0]/avgRating[1]).toFixed(2)+'</label>'	;
			return Schedule;
		},
		makeBlocks:function(time,section){
			var days	=	[];
			time.days.forEach(function(day){
				if(day==-1)
					return document.createElement('div');
            //Make a timeblock element
				var timeBlock   =   CORE.helper.element.createDiv({class:'s-timeBlock'});
            
            //Adjust its styles.
				CORE.helper.element.changeStyle(timeBlock,{
					top     :   [(time.start-480)/2,'px'].join(''),
					left    :   [((day+1)%7)*71,'px'].join(''),
					height  :   [(time.end-time.start)/2,'px'].join(''),
					lineHeight  :   [(time.end-time.start-4)/2,'px'].join(''),
					color   :   CORE.helper.color.getTextColor(CORE.helper.color.getBackgroundColor(section.title)),
					backgroundColor :   CORE.helper.color.getBackgroundColor(section.title)
				});
				timeBlock.innerHTML=section.title
            //return the timeblock
				days.push(timeBlock);
			});
			return days;
		}
	}
})(CORE);






                CORE.views.checkBoxes    =   (function(CORE){
                    
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








CORE.views.lowerControlPanel	=	(function(CORE){
	return {
		container:document.getElementById('lowerControls'),
		on:function(){
			Velocity(document.getElementById('lowerControls'),'slideDown',300);
		},
		off:function(){
			console.log(this.container);
			Velocity(document.getElementById('lowerControls'),'slideUp',300);
		},
		toggle:function(on,off){
			if(this.container.style.display	==	'none'){
				this.on();
				on&&on()
			}else{
				this.off();
				off&&off()
			}
		}
	}
})(CORE);



CORE.views.advanced	=	(function(CORE){
	var container = document.getElementById('advancedButton')
	container.addEventListener('click',function(){
		CORE.views.lowerControlPanel.toggle(function(){
		
		},function(){
		
		});
	});
})(CORE);
















CORE.views.save	=	(function(CORE){
	return function(el){
		var code	=	el.getAttribute('data-queryCode').split('.').sort().join('.');
		if(el.getAttribute('data-state')=='active')
			return;
		$.get({
			url:'/m/save?codes='+code,
			done:function(a){
				console.log(a);
				CORE.views.save.setSaved(el);
			}
		});
	};
})(CORE);


CORE.views.save.setSaved	=	function(el){	
	el.setAttribute('data-state','active');
	el.style.backgroundImage	=	'url("/images/check.png")';
	el.style.backgroundColor	=	'#2ecc71';
	el.innerHTML	=	'Saved';
}


CORE.main.save	=	(function(CORE){
	return {
		map:[],
		fetch:function(){
			$.get({
				url:'/m/get',
				done:function(a){
					CORE.main.save.map	=	a;
					CORE.main.save.render();
				}
			});
		},
		render:function(){
			CORE.main.save.map.forEach(function(v,i,a){
				[].forEach.call(document.querySelectorAll('.s-saveIcon[data-queryCode="'+v.sections+'"]'),function(a){
					CORE.views.save.setSaved(a);
				});
			});
		}
	}
})(CORE);








CORE.main.teachers	=	(function(CORE){
	
	return {
		map:{},
		addTemplate:function(section,Schedule){
			//Schedule.
			
		},
		fetch:function(cb){
			var instructors	=	[];
			this.map['none']	=	{teacherName:'No Instructor',rating:'None'};
			CORE.raw.map(function(i){
				return instructors=instructors.concat(i.instructors);
			});
			$.get({
				url:'/g/instructors?names='+JSON.stringify(instructors),
				json:true,
				done:function(e){
					
					e.map(function(a){
						CORE.main.teachers.map[a.teacherName]	=	a;
					});
					
					cb&&cb();
				}
			})
		}
	}
	
})(CORE);

























var d = new Date();
CORE.schedules.all	=	CORE.schedules.all.map(function(schedule){
	return CORE.views.schedule.flatten(schedule);
}).filter(function(a,i){
	return a.every(function(a){
		return !(a==undefined||a.status=='Closed');
	});
});

CORE.schedules.current	=	CORE.schedules.all;
console.log('Flattening took: '+((new Date())-d)+'ms');


CORE.views.gear	=	(function(){
	return	{
		gear:document.getElementById('main-loadingGear'),
		on:function(){
			this.gear.style.display	=	'block';
		},
		off:function(){
			this.gear.style.display	=	'none';
		}
	}
})(CORE);




CORE.main.show	=	(function(){

	
	window.onscroll = function(ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight-100) {
			CORE.main.show.render();
			CORE.main.save.render();
			console.log('bottom');
    }
	};
	return {
		container:document.getElementById('main-scheduleContainer'),
		counter:0,
		render:function(){
			var increment	=	(CORE.schedules.current.length-this.counter<10?CORE.schedules.current.length-this.counter:10);
			console.log(increment);
			for(var i = this.counter;i<this.counter+increment;i++){
				this.container.appendChild(CORE.views.schedule.gen(CORE.schedules.current[i]));
			}
			this.counter+=increment;
			CORE.views.gear.off();
		}
	}
})(CORE);







            CORE.sort   =   (function(CORE){
                return  {
                    type:'Starting Time',
                    time:{
                        mornings:function(a,b){
                            var aSum=0,bSum=0,aCount=0,bCount=0;
                            for(var section=a.length;section--;){
                                for(var time=a[section].times.length;time--;){
                                    if(a[section].times[time].days[0]==-1){
                                        break;
                                    }
                                    //Add the time to the start 
                                    aSum+=((a[section].times[time].start)*a[section].times[time].days.length);
                                    aCount+=a[section].times[time].days.length;
                                }
                            }
                            for(var section=b.length;section--;){
                                for(var time=b[section].times.length;time--;){
                                    if(b[section].times[time].days[0]==-1){
                                        break;
                                    }
                                    //Add the time to the start 
                                    bSum+=((b[section].times[time].start)*b[section].times[time].days.length);
                                    bCount+=b[section].times[time].days.length;
                                }
                            }
                            
                            
                            
                            return (aSum/aCount)-(bSum/bCount);
                        },
                        noon:function(a,b){
                            var aSum=0,bSum=0,aCount=0,bCount=0;
                            //Iterate through each a schedule time
                            for(var section=a.length;section--;){
                                for(var time=a[section].times.length;time--;){
                                    if(a[section].times[time].days[0]==-1){
                                        break;
                                    }
                                    //Add the difference between the middle of the timeblock to aSum
                                    aSum+=(Math.abs(720-(a[section].times[time].start-a[section].times[time].end)/2));
                                    aCount++
                                }
                            }
                            //Iterate through each b schedule time
                            for(var section=b.length;section--;){
                                for(var time=b[section].times.length;time--;){
                                    if(b[section].times[time].days[0]==-1){
                                        break;
                                    }
                                    //Add the difference between the middle of the timeblock to bSum
                                    bSum+=(Math.abs(720-(b[section].times[time].start-b[section].times[time].end)/2));
                                    bCount++
                                }
                            }
                            return  (aSum/aCount-bSum/bCount);
                        },
                        evenings:function(a,b){
                            var aSum=0,bSum=0,aCount=0,bCount=0;
                            for(var section=a.length;section--;){
                                for(var time=a[section].times.length;time--;){
																	if(a[section].times[time].days[0]==-1){
																		break;
																	}
                                    //Add the time to the start 
																	try{
                                    aSum+=((a[section].times[time].start)*a[section].times[time].days.length);
																	}catch(e){
																		console.log(a[section].times[time]);
																	} aCount+=a[section].times[time].days.length;
                                }
                            }
                            for(var section=b.length;section--;){
                                for(var time=b[section].times.length;time--;){
                                    if(b[section].times[time].days[0]==-1){
                                        break;
                                    }
                                    //Add the time to the start 
                                    bSum+=((b[section].times[time].start)*b[section].times[time].days.length);
                                    bCount+=b[section].times[time].days.length;
                                }
                            }
                            
                            return (bSum/bCount)-(aSum/aCount);
                        },
                        timeOfDay:'mornings'
                    },
                    teacherRating:function(a,b) {
                        var aSum=0,bSum=0,aCount=0,bCount=0;
                        for(var i=a.length;i--;){
                            aSum+=CORE.main.teachers.map[a[i].times[0].instructor];
                            aCount++;
                        }
                            
                        for(var i=b.length;i--;){
                            bSum+=CORE.main.teachers.map[b[i].times[0].instructor];
                            bCount++;
                        }
                        
                        return (bSum/bCount)-(aSum/aCount);
                            
                    },
                    availability:function(a,b){
                        var aSum=0,bSum=0;
                        for(var i = a.length;i--;){
                            var aSeats  =   CORE.socket.seatMap[a[i].crn];
                            var d = (aSeats.m-aSeats.e);
                            aSum+=((d>0)*1000)-(aSeats.w*10)+d*(d>0);

                        }
                        for(var i = b.length;i--;){
                            var bSeats  =   CORE.socket.seatMap[b[i].crn];
                            var d = (bSeats.m-bSeats.e);
                            bSum+=((d>0)*1000)-(bSeats.w*10)+d*(d>0);
                        }
                        return bSum-aSum;
                    },
                    blockAmount:function(a,b){
                        return b.times.length-a.times.length;
                    }
                }
            })(CORE);




CORE.schedules.all.sort(CORE.sort.time.evenings);
CORE.main.teachers.fetch(function(){
	CORE.main.show.render();
	CORE.main.save.fetch();
});














CORE.main.filter	=	(function(CORE){
	return	{
		enabled:[]
	}
})(CORE);

CORE.main.filter.campus	=	(function(CORE){
	DBKey   =   {
		ABBY:"Abbotsford",
		CHIL:"Chilliwack",
		HOPE:"Hope",
		MIS:"Mission",
		ONL:"Online",
		CLEAR:"Clearbrook"
	}
	
	
})(CORE);








var tempMap = {};
CORE.schedules.all.map(function(a){
	var key	=	a.map(function(b){return b.uniq;}).sort().join('.');
	tempMap[key]=a;
});