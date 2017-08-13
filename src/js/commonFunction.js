export const bytesCount = function(str) {
	var bytesCount = 0;
	for (var i = 0; i < str.length; i++) {
		var c = str.charAt(i);
		  if (/^[\u0000-\u00ff]$/.test(c)) //匹配双字节
			  {
			  	bytesCount += 1;
			  }
		  else
			  {
			  	bytesCount += 2;
			  }
	}
	return bytesCount;
}
export const getEmpNumber = function(scope) {
	try{
		ExpressPlugin.getUserWorkId(workId => {
			scope.empNumber = workId;
			localStorage.setItem('channelEmpNumber', workId);
		});
	}catch(err){
		scope.empNumber = '002628';
		localStorage.setItem('channelEmpNumber', '002628');
	}
}

export const resetPicAndAudioOrder = (targetArr, target)=>{
	var replyArr = targetArr;
	var audio = [];
	var other = [];
	var picArr = [];
	var picIndex = 0;
	for(let i=0; i<replyArr.length; i++){
		
		if(replyArr[i].type == 'image'){
			replyArr[i].index = picIndex++;
			replyArr[i].src = target.$global().imgHost + replyArr[i].src;
			picArr.push(replyArr[i]);
		}

		if(replyArr[i].type == 'audio'){
			audio.push(replyArr[i]);
		}else{
			other.push(replyArr[i]);
		}
		
	}
	//target[contentArr] = audio.concat(other);
	//target[picArr] = picArr;

	return {
		audioList: audio.concat(other),
		picArr: picArr
	}
}