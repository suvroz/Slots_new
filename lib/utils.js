function loadGame(gamename,build){
	var skeleton	=	GameConfig[gamename].skeleton;
	var main		=	GameConfig[gamename].main;
	
	var skeletonfile=	'skeleton/'+skeleton+'/skeleton.html';
	var mainfile	=	'main/'+main+'/main.html';
	
	var allstyle		=	'main/common/all/'+build+'/allstyle.css';
	var categorystyle	=	'main/common/'+skeleton+'/'+build+'/categorystyle.css';
	var mainstyle		=	'main/'+main+'/'+build+'/mainstyle.css';
	
	var skeletonscript	=	'skeleton/'+skeleton+'/skeleton.js';
	var allscript		=	'main/common/all/'+build+'/allscript.js';
	var categoryscript	=	'main/common/'+skeleton+'/'+build+'/categoryscript.js';
	var mainscript		=	'main/'+main+'/main.js';	
	
	loadFile(mainfile,
			'game_container',
			function(){
				loadFile(skeletonfile,
						'skeleton_container',
						function(){
							loadStylesheets([allstyle,categorystyle,mainstyle],
								0,
								function(){
									loadScripts([skeletonscript,allscript,categoryscript,mainscript],0);
								});
						});
			});
}

function loadFile(url,cont_id,next_func){
	var callback	= 	{
							success	:	function(o){
											mfx('#'+cont_id).append(o.responseText);
											if(next_func!=undefined){
												next_func();
											}
										},
							failure	:	function(){
											console.log("Error in loading "+url);
										},
							timeout	:	30000
						};
	YAHOO.util.Connect.asyncRequest('GET', url+'?t='+(new Date()).getMilliseconds(), callback);
}

function loadStylesheets(file_list,counter,next_func){
	if(counter<file_list.length){
		var link	=	document.createElement("link");
		link.href	=	file_list[counter]+'?t='+(new Date()).getMilliseconds();
		link.rel	=	"stylesheet";
		link.type	=	"text/css";
		/*link.onload	=	function(){
							counter++;
							loadStylesheets(file_list,counter,next_func);
						}*/
		document.getElementsByTagName('head')[0].appendChild(link);
		counter++;
		loadStylesheets(file_list,counter,next_func);
	}else if(next_func!=undefined){
		next_func();
	}
}

function loadScripts(file_list,counter){
	if(counter<file_list.length){
		var script	=	document.createElement("script");
		script.src	=	file_list[counter]+'?t='+(new Date()).getMilliseconds();
		script.type	=	"text/javascript";
		script.onreadystatechange	=	function(){						//IE
			if(this.readyState == 'loaded' || this.readyState == 'complete'){
				counter++;
				loadScripts(file_list,counter);
			}
		}
		script.onload	=	function(){									//Rest of the browsers
			counter++;
			loadScripts(file_list,counter);
		}
		document.getElementsByTagName('head')[0].appendChild(script);
	}else{
		window.game	=	new Game();
		document.body.onresize				=	resizeScreen;
		document.body.onorientationchange	=	resizeScreen;
		game.startGame();
	}
}

function Game(){
	
}

Game.prototype.displayError	=	function(code,message){
	console.log(code+' '+message);
}

Game.prototype.getCurrencySymbol	=	function(currency_name){
	var symbol	=	'';
	switch(currency_name){
		case 'GBP':
			symbol	=	'&pound;';
	}
	return symbol;
}

Game.prototype.reveal	=	function(){
	mfx('#game_loader').hide();
}

Game.prototype.darkTransition	=	function(func){
	var game	=	this;
	mfx('#dark_screen').show();
	mfx('#dark_screen').animateOpacity(1,1000,function(){ 
												func(); 
												game.hideDarkScreen();
											});
}

Game.prototype.hideDarkScreen	=	function(){
	mfx('#dark_screen').animateOpacity(0,1000,function(){ mfx('#dark_screen').hide(); });
}

function resizeScreen(){
	if(isPortrait()){
		document.body.className	=	"portrait";
		resetIphone();
	}else{
		document.body.className	=	"landscape";
		mfx('#iphone').stop();
	}
	hideAddressBar();
}

function rotateIphone(){
	mfx('#iphone').animateRotation(90,1000,function(){ setTimeout(resetIphone,500); });
}

function resetIphone(){
	mfx('#iphone').rotateTo(0); 
	rotateIphone();
}

function hideAddressBar(){
	setTimeout(function(){ window.scrollTo(0,1); },1000);
}

function isPortrait(){	
	if(MFX.getDevice()=="rim"){
		return false;
	}
	
	var wwidth	=	0;
	var wheight	=	0;
	if(window.innerWidth && window.innerHeight){
		wwidth	=	window.innerWidth;
		wheight	=	window.innerHeight;
	}else{
		wwidth	=	document.body.offsetWidth;
		wheight	=	document.body.offsetHeight;
	}
	
	if(parseInt(wheight)>parseInt(wwidth)){
		return true;
	}
	return false;
}

function touchHandler(e){
    if(e.type=="touchstart"){
		hideAddressBar();
	}else if(e.type=="touchmove"){										//Prevent page from moving if finger is moved over screen
		e.preventDefault();
	}
}

document.ontouchstart	=	touchHandler;
document.ontouchmove	=	touchHandler;
document.ontouchend		=	touchHandler;