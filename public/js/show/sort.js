

CORE.sort	=	(function(CORE){
	//This is the default sort

	return	{
		_currentSort:'time.mornings',
		go:function(type){
			
			if(type==CORE.sort._currentSort)
				return;
			else if(type)
				CORE.sort._currentSort	=	type;
			
			
			var _sortRef	=	CORE.sort.functions;
			CORE.sort._currentSort.split('.').forEach(function(attr){
				_sortRef	=	_sortRef[attr];
			});

			CORE.schedules.current.sort(_sortRef);
		}
	}
})(CORE);











CORE.sort.functions   =   (function(CORE){
	return  {
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
						aSum+=(CORE.profs.map[a[i].profs[0]]&&CORE.profs.map[a[i].profs[0]].rating)||0;
						aCount++;
				}

				for(var i=b.length;i--;){
						bSum+=(CORE.profs.map[b[i].profs[0]]&&CORE.profs.map[b[i].profs[0]].rating)||0;
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