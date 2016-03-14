CORE.fetch	=	(function(CORE){
	
	//Show the blocks that exist
		RAW_COURSE_DATA.forEach(function(course){
			document.getElementById('courses-foundContainer').appendChild(
				CORE.helper.element.create('div',{
					class:'courses-previewBlock',
					html:course.title,
					style:['background-color:',CORE.helper.color.bgColor(course.title)].join('')
				})
			);
		});
	
	//Maps to help find the Sections and books after
	var _isbnMap	=	{};
	var _bookMap	=	{};
	//Grab the isbns
	var isbns	=	[].concat.apply([],RAW_COURSE_DATA.map(function(course){
		books	=	[];
		for (var type in course.sections){
			course.sections[type].forEach(function(section){
				books	=	books.concat(section.books.map(function(book){
					_isbnMap[book.isbn]	=	section;
					_bookMap[book.isbn]	=	book;
					return book.isbn;
				}));
			});
		}
		return books;
	})).filter(function(isbn){
		//Some of the isbns aren't real isbns
		return isbn.match(/[^0-9]/g)==null
	});

	
	
	$.get({
		url:'/g/books?isbn='+JSON.stringify(isbns),
		done:function(data){
			console.log(data);
			data.Item.forEach(function(Item){
				//The Amazon Product API can be unpredictable
				try{
					CORE.fetch.showBook(Item);
				}catch(e){
					console.log(e);
				}
			});
		}
	});
	
	return	{
		maps:{
			section	:	_isbnMap,
			books		:	_bookMap
		},
		showBook:function(book){
			
			
			//First we try to match the books found to the courses we want
			var _isbn;
			if(_bookMap[book.ASIN[0]])
				_isbn	=	book.ASIN[0];
			else if(book.ItemAttributes[0].ISBN&&book.ItemAttributes[0].ISBN[0]&&_bookMap[book.ItemAttributes[0].ISBN[0]])
				_isbn	=	book.ItemAttributes[0].ISBN&&book.ItemAttributes[0].ISBN[0];
			else if(book.ItemAttributes[0].EAN&&book.ItemAttributes[0].EAN[0]&&_bookMap[book.ItemAttributes[0].EAN[0]])
			_isbn	=	book.ItemAttributes[0].EAN[0]
			else 
				return;
			
			//Okay we've either exited from not finiding the book or we've found the correct ISBN
			var _bookItem	=	_bookMap[_isbn];
			var _section	=	_isbnMap[_isbn];

			
			var _bookContainer	=	document.getElementById('bookTemplate').cloneNode(true);
			_bookContainer.id	=	'';
			
			//Yes I know jQuery exists
			var _E	= CORE.helper.element.find;
			
			_E(_bookContainer,'.result-colorBar').style.backgroundColor	=	CORE.helper.color.bgColor(_section.title);
			
			var name	=	_E(_bookContainer,'.result-courseName',_section.title);
			name.innerHTML+='<div style="float:right">'+_section.section+'</div>'
			
			_E(_bookContainer,'.result-bookTitle',_bookItem.title)
			var _thumb	=	_E(_bookContainer,'img')
			_thumb.src=(book.SmallImage&&book.SmallImage[0].URL[0])||'/images/NABook.png';
			_thumb.parentNode.href	=	book.DetailPageURL[0];
			
			
			_E(_bookContainer,'.price-bookstore-amount','$'+_bookItem.price)
			_E(_bookContainer,'.price-amazon-amount',book.OfferSummary[0].LowestNewPrice[0].FormattedPrice);
			_E(_bookContainer,'.price-amazon','Amazon').parentNode.href	=	book.DetailPageURL[0];
			
			document.getElementById('resultContainer').appendChild(_bookContainer);
			
		}
	}

	
})(CORE);
