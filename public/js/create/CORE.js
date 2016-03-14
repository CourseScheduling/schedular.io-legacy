/*
*	CORE Module
*	This is the main module, it defines what all other modules should contain
*	Also, any helper/utility functions should be here.
*/

CORE	=	{
	term	:	{},
	buttons	:	{},
	instant	:	{},
	helper	:	{
		color	:	{},
		localStorage	:	{}
	}
}



/*
*	Core Helper Color	:	 The module used to create uniform color
*
*		@method	bgColor	->	Outputs a hex for a bright, cool, background color based on a string seed
*			@param {String}	seed	
*/

CORE.helper.color   =   (function(CORE){
		return {
			bgColor:function(seed){
				return randomColor({luminosity:"bright",format:"hex",seed:parseInt(seed,36)});           
			}
		};
})(CORE);


/*
*	Core Helper Element	:	The module used to help making HTML elements
*	
*		@method	editStyle	->	changes multiple styles for a provided element
*			@param	{Node}	element
*			@param	{JSON Object}	// Accepts input as {style:'value',color:'green'...}
*
*		@method create	->	creates an html of the provided type with attributes
*			@param	{String}	type	//	e.g. 'div'
*			@param	{JSON Object}	attributes //	If html is provided, the inner html is replaced with the value
*/

CORE.helper.element =  (function(CORE){
		return {
				editStyle:function(element,styles){
						for(var attributes in styles)
								element.style[attributes]=styles[attributes];
				},
				create:function(type,attributes){
						var element =   document.createElement(type);
						if(attributes.html!==undefined){
							element.innerHTML	=	attributes.html;
							delete attributes.html;
						}
						for(var attributeName in attributes)
								element.setAttribute(attributeName,attributes[attributeName]);
						return element;
				}
		}
})(CORE);


/*
*	Core Helper Time	:	The module used to help with dealing with time
*		
*		@method	inTime	->	checks if 2 timeblocks intersect
*			@param	{Integer}	start	//The starting time (in minutes) of the first time block
*			@param	{Integer}	end
*			@param	{Integer}	start2
*			@param	{Integer}	end2
*
*		@method	sameDay	->	checks if 2 day arrays intersect in anyway
*			@param	{Array}	day1	//	accepts the days in an array as 0,1,2 for Monday,Tuesday,Wednesday respectively
*			@param	{Array}	day2
*/

CORE.helper.time	=	(function(CORE){
	return {
		inTime:function(start,end,start2,end2){
				if(start==0||start2==0)
						return false;
				if((((start2>=start)&&(start2<end))||((end2>start)&&(end2<end)))||(((start>=start2)&&(start<end2))||((end>start2)&&(end<end2))))
						return true;
				return false;
		},
		sameDay:function(day1,day2){
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
})(CORE);


/*
*	Core Helper Array	:	Module used to help with array manipulation
*	
*		@method	hasFieldValue	->	searches an array of json objects for a field with a certain value
*															returns false if not found, or the json element if found
*			@param	{Array}	array		//	the array of JSON Objects
*			@param	{String}	field	//	the name of the json field
*			@param	{Mixed}	value		//	the value of the field
*
*		@method uniq	->	removes any duplicates in an array
*
*			@param	{Array}	array	//the array that needs uniqifying
*
*/

CORE.helper.array	=(function(CORE){
	return {
		hasFieldValue:function(array,field,value){
			for(var i = 0;i<array.length;i++){
				if(array[i][field]==value)
					return array[i];
			}
			return false;
		},
		uniq:function(array){
		
		 var u = {}, a = [];
		 for(var i = 0, l = array.length; i < l; ++i){
				if(u.hasOwnProperty(array[i])) {
					 continue;
				}
				a.push(array[i]);
				u[array[i]] = 1;
		 }
		 return a;
		}
	};
})(CORE);




/*
*	Core Helper LocalStorage	:	Module used to help with localStorage TTL
*
*		@method	get	->	gets a non-expired value from key, returns false if expired or Non-existent
*			@param	{String}	key	//	the key of the object
*
*		@method set	->	sets a value to a certain key as well as establishing a time to live
*			@param	{String}	key	//	the key used to look this up
*			@param	{Mixed}		value	//the value being stored
*			@param	{Number}	ttl		//the time to live in ms
*/
CORE.helper.localStorage	=	(function(window) {
  return {
    set: function(key, value	,	ttl) {
			//If no ttl is set, do it infinitely, i.e. 32 years
			ttl	=	ttl||1E15
			//Store the value into the localStorage
      window.localStorage[key] = JSON.stringify(value);
			//Append the max future expiry date so we don't have to check it again
			
			window.localStorage[key]	+= (Date.now()+ttl);
			
    },
    get: function(key) {
			
			var _value	=	window.localStorage[key];

			//incase the key is bad
			if(!_value)
				return 0;
			
			//grab the timestamp, the following code is only good for another 200ish years
			var _expiryDate	=	parseInt(_value.substr(-13));
			//This returns false if data expired
			if(_expiryDate<=Date.now())
				return !(delete window.localStorage[key]);
			
			//This is to get rid of the get and set object methods
			try{
				return JSON.parse(_value.slice(0,-13));
			}catch(e){
				//So this isn't json...
				//Ahh, just pass it
				return _value.slice(0,-13);
			}
			
			
    }
  }
})(window);