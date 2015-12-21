
CORE    =   {
helper:{
element:{

}
}
}

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
})(CORE);

var courseInput =   {
element:document.getElementById('courseInput'),
pastValue:'',
currentInstance:0,
getValue:function(){
return this.element.value
},
keypress:function(e){
var currentValue    =   _CIthis.getValue();    
if(currentValue==_CIthis.pastValue){
return;
}
_CIthis.pastValue  =   currentValue;
_CIthis.currentInstance++;

$.get({
url:'/s/get?courseInput='+currentValue,
done:function(e){
if(e.length==0){
dropDown.up();
return;
}

dropDown.load(e);
dropDown.drop();
}
});
},
init:function(){
_CIthis   =   this;
this.element.addEventListener('keyup',this.keypress);
}
}
courseInput.init();

var dropDown    =   {
isDown:false,
mainInput:courseInput,
dropDown:document.getElementById('instantDropDown'),
drop:function(){
console.log(this.mainInput.getValue()=='')
if(this.mainInput.getValue()!=''&&!this.isDown){
Velocity(this.dropDown,'slideDown',50);
this.isDown =   true;
return;
}
if(this.mainInput.getValue()==''&&this.isDown){
Velocity(this.dropDown,'slideUp',50);
this.isDown =   false;
return;
}
},
up:function(){
Velocity(this.dropDown,'slideUp',50);
this.isDown =   false;
},
load:function(courses){
var _this   =   this;

//Remove all nodes in the dropdown

while(_this.dropDown.firstChild)
_this.dropDown.removeChild(_this.dropDown.firstChild);
courses.forEach(function(v,i,a){
var instantContainer    =  CORE.helper.element.createDiv({class:'instant-resultContainer'});
var courseName  =   CORE.helper.element.createDiv({class:'instant-resultCourseName'});
var courseCode  =   CORE.helper.element.createDiv({class:'instant-resultCourseCode'});

instantContainer.setAttribute('data-courseCode',v.courseCode);
courseName.innerHTML    =   v.courseName;
courseCode.innerHTML    =   v.courseCode;

instantContainer.appendChild(courseName);
instantContainer.appendChild(courseCode); 

_this.dropDown.appendChild(instantContainer);
instantContainer.addEventListener('click',function(){
chosenCourses.add(instantContainer.getAttribute('data-courseCode'));
});
instantContainer.addEventListener('mouseover',function(){
instantContainer.classList.add('instant-resultContainer-hover');
});
instantContainer.addEventListener('mouseout',function(){
instantContainer.classList.remove('instant-resultContainer-hover');
});
});
},
getPos:function(el) {
return {
x:el.offsetLeft,
y:el.offsetTop + el.offsetHeight,
width:el.offsetWidth
};
},
flush:function(){
this.dropDown.value='';
},
init:function(){
this.isDown =   false;
this.dropDown.style.position='relative';
this.dropDown.style.width   =   parseInt(this.getPos(this.mainInput.element).width)-2+'px';
this.dropDown.style.left   =   parseInt(this.getPos(this.mainInput.element).x)+'px';
}
}
dropDown.init();

var chosenCourses   =   {
container:document.getElementById('courseChoiceContainer'),
courseList:[],
createButton:function(html){
var li = document.createElement('li');
var span    =   document.createElement('span');
var img     =   document.createElement('div');

img.className   =   'courseKill';
img.setAttribute('onclick','chosenCourses.remove(this)');
li.className='courseChoice-wrap';
span.setAttribute('data-courseCode',html);
span.className='courseChoice';
span.appendChild(img);
span.innerHTML+=html;
li.appendChild(span);

return li;
},
add:function(e){
var courseCode  =   e;
var button  =   chosenCourses.createButton(courseCode);
var courseJSON  =   {};
courseJSON.button   =   button;
courseJSON.code =   courseCode;
chosenCourses.courseList.push(courseJSON);
chosenCourses.container.appendChild(button);
dropDown.flush();
dropDown.up();
dropDown.mainInput.element.value='';
},
remove:function(e){
chosenCourses.courseList    =   chosenCourses.courseList.filter(function(a){
return e.parentNode.getAttribute('data-courseCode')!==a.code
});
e.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode);
if(chosenCourses.courseList.length>0)
localStorage['oldCourses']=chosenCourses.courseList.map(function(a){return a.code}).join('.');
else
localStorage['oldCourses']="";                
}
};

var submit  =   {
button:document.getElementById('scheduleCreate'),
submit:function(){
if(chosenCourses.courseList.length==0)
return false;
var courseList  =   [];
chosenCourses.courseList=chosenCourses.courseList.map(function(e){
courseList.push([e.code.split(/(\d)/).shift(),e.code.split(/(\d)/).splice(1).join('')]);
return e;
});

if(chosenCourses.courseList.length>0)
localStorage['oldCourses']=chosenCourses.courseList.map(function(a){return a.code}).join('.');
else
localStorage['oldCourses']="";
console.log(courseList);
document.location   =   '/s/show/?c='+JSON.stringify(courseList)
},
init:function(){
this.button.addEventListener('click',this.submit)
}
}
submit.init();
document.location.hash='';
if(localStorage['oldCourses'].length>0)
localStorage['oldCourses'].split('.').forEach(function(v,i,a){
chosenCourses.add(v);
});

[].forEach.call(document.getElementsByClassName('seasonIcon'),function(v,i,a){
v.addEventListener('mouseover',function(){
var top =   (v.getBoundingClientRect().top-35)+'px';
var toolTip =   document.createElement('div');
document.body.appendChild(toolTip);
toolTip.className   =   'seasonToolTip';
toolTip.innerHTML=v.getAttribute('data-term');
var left    =   (v.getBoundingClientRect().left-(toolTip.getBoundingClientRect().width-v.getBoundingClientRect().width)/2)+'px';
toolTip.style.top   =   top;
toolTip.style.left =   left;
});
v.addEventListener('mouseout',function(){
var a = document.getElementsByClassName('seasonToolTip');
while(a.length){
a[0].parentNode.removeChild(a[0]);
}
});
});	