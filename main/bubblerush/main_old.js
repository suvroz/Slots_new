Game.prototype.mapIndex	=	function(index){				//For specifying exception mapping of icons
	if(index==10){
		index	=	8;
	}else if(index==18){
		index	=	9;
	}else if(index==22){
		index	=	10;
	}
	return index;
}

var screen_height_Y	=	800;
Game.prototype.configureSpecifics	=	function(){
	this.gamedata.box_array		=	["0001020304", "1011121314", "2021222324", "0011021304", "1001120314", "1021122314", "2011221324", "1001020314", "0011121304", "2011121324", "1021222314", "1011021314", "1011221314", "0001120304", "2021122324", "0021022304", "2001220324", "2011021324", "0011221304", "2001122324"];
	mfx('#middle_container').moveTo(0,screen_height_Y);
	mfx('#bubble_bonus').moveTo(0,screen_height_Y);
	
	this.addIngameBubbles();
	this.addBoxBubbles();
	this.addIconShadowContainer();
}

var num_crabs	=	3;
Game.prototype.addCustomEventHandlers	=	function(){
	var game	=	this;
	for(var i=0;i<num_crabs;i++){
		mfx('#crab'+i).on('click',function(n){ return function(){ game.selectCrab(n); } }(i+1));
	}
}

var num_ingame_bubbles	=	5;
Game.prototype.addIngameBubbles	=	function(){
	var igc	=	document.createElement("div");
	igc.setAttribute("id","ingame_bubble_container");
	document.getElementById("skeleton_container").insertBefore(igc,document.getElementById("paytable_button_container"));
	
	for(var i=0;i<6;i++){
		for(var j=0;j<num_ingame_bubbles;j++){
			var bubble			=	document.createElement("div");
			var bnum			=	2+Math.floor(3*Math.random());
			bubble.className	=	"bubble"+bnum+" column"+i;
			bubble.setAttribute("id","ingame_bubble"+i+"_"+j);
			document.getElementById("ingame_bubble_container").appendChild(bubble);
			
			var bubble			=	document.createElement("div");
			var bnum			=	2+Math.floor(3*Math.random());
			bubble.className	=	"bubble"+bnum+" column"+i;
			bubble.setAttribute("id","transition_bubble"+i+"_"+j);
			document.getElementById("transition_bubble_container").appendChild(bubble);
		}
	}
}

var num_icon_bubbles	=	4;
Game.prototype.addBoxBubbles	=	function(){
	for(var i=0;i<this.configuration.rows;i++){
		for(var j=0;j<this.configuration.columns;j++){
			for(var k=0;k<num_icon_bubbles;k++){
				var bubble			=	document.createElement("div");
				var bnum			=	2+Math.floor(3*Math.random());
				bubble.className	=	"bubble"+bnum+" column"+i;
				bubble.setAttribute("id","box_bubble"+i+""+j+"_"+k);
				document.getElementById("box"+i+""+j).appendChild(bubble);	
			}
		}
	}
}

Game.prototype.addIconShadowContainer	=	function(){
	var iscont	=	document.createElement("div");
	iscont.setAttribute("id","icon_shadow_container");
	document.getElementById("skeleton_container").insertBefore(iscont,document.getElementById("icon_container"));
	
	for(var i=0;i<this.configuration.rows;i++){
		for(var j=0;j<this.configuration.columns;j++){
			var icon_shadow	=	document.createElement("div");
			icon_shadow.className	=	"icon1 icon_shadow";
			icon_shadow.setAttribute("id","icon_shadow"+i+""+j);
			iscont.appendChild(icon_shadow);
		}
	}
}

var load_percent	=	0;
var wave_width_X	=	1152;
var loadfish_height_Y	=	112;
Game.prototype.showLoadingScreen	=	function(){
	this.moveWaveRight();
	/*this.moveFishUp();
	this.animateLoadBubbles();*/
	this.animateLoadFish();
}

Game.prototype.moveWaveRight	=	function(){
	var game	=	this;
	mfx('#game_waves').animateBackground(0,0,-wave_width_X,0,0,10000,function(){ game.moveWaveLeft(); });
}

Game.prototype.moveWaveLeft		=	function(){
	if(load_percent<100){
		var game	=	this;
		mfx('#game_waves').animateBackground(-wave_width_X,0,wave_width_X,0,0,10000,function(){ game.moveWaveRight(); });
	}
}

Game.prototype.animateLoadFish	=	function(){
	var game	=	this;
	mfx('#load_fish').animateBackground(0,0,0,-2*loadfish_height_Y,loadfish_height_Y,400,function(){ game.animateLoadBubbles(); });
}

/*Game.prototype.moveFishUp		=	function(){
	var game	=	this;
	mfx('#load_fish, #load_fish_shadow').animatePosition(0,-10,400,function(){ game.moveFishDown(); });
}

Game.prototype.moveFishDown		=	function(){
	var game	=	this;
	mfx('#load_fish, #load_fish_shadow').animatePosition(0,10,400,function(){ game.moveFishUp(); });
}*/

Game.prototype.updateLoadPercent	=	function(){
	var rand_value	=	15+Math.floor(15*Math.random());
	if(load_percent+rand_value>100){
		load_percent	=	100;
	}else{
		load_percent	+=	rand_value;
	}
	mfx('#load_bubble0').setContent(load_percent);
}

var load_bubble_count	=	5;
Game.prototype.animateLoadBubbles	=	function(){
	if(load_percent<100){
		this.updateLoadPercent();
		this.animateSingleLoadBubble(0);
	}else{
		mfx('#game_waves').stop();
		mfx('#load_fish, #load_fish_shadow').stop();
		var game	=	this;
		mfx('#loading_screen,#middle_container').animatePosition(0,-screen_height_Y,500,function(){ game.hideLoadingScreen(); });
		mfx('#game_waves').animatePosition(0,-75);
		this.animateTransitionBubbles(0);
	}
}

Game.prototype.animateTransitionBubbles	=	function(n){
	if(n<num_ingame_bubbles){
		for(var i=0;i<6;i++){
			var x		=	-15+Math.floor(30*Math.random());
			mfx('#transition_bubble'+i+'_'+n).moveTo(x,0);
			mfx('#transition_bubble'+i+'_'+n).animatePosition(0,-screen_height_Y-100,1000);
		}
		n++;
		var game	=	this;
		setTimeout(function(){ game.animateTransitionBubbles(n); },100);
	}
}

Game.prototype.hideLoadingScreen		=	function(){
	if(this.gamedata.resume){
		if(!this.gamedata.bonus_finish){
			this.loadBonus();
		}else if(this.gamedata.freespins>0){
			if(this.gamedata.fs_trigger){
				this.loadFreespin();
			}else{
				this.setFreespinScreen();
				this.continueFreespin();
				//var game 	=	this;
				//setTimeout(function(){ game.continueFreespin(); },3000);
			}
		}
	}
	mfx('#loading_screen').hide();
}

Game.prototype.animateSingleLoadBubble	=	function(counter){
	if(counter<load_bubble_count){
		var x		=	-15+Math.floor(30*Math.random());
		mfx('#load_bubble'+counter).moveTo(x,0).show();
		
		var game	=	this;
		var func	=	function(){};
		if(counter==load_bubble_count-1){
			mfx('#load_fish').css('backgroundPosition','0px 0px');
			func	=	function(){ game.animateLoadFish(); };
		}
		mfx('#load_bubble'+counter).animatePosition(0,-320,500,func);
		
		counter++;
		setTimeout(function(){ game.animateSingleLoadBubble(counter); },100);
	}
}

Game.prototype.displayOutcome			=	function (){
	for(var i=0;i<this.configuration.rows;i++){
		for(var j=0;j<this.configuration.columns;j++){
			var index	=	this.gamedata.icon_array[i].charCodeAt(j)-97;
			index		=	this.mapIndex(index);
			var xpos	=	-this.configuration.icon_width_X*index;
			mfx('#icon1'+i+''+j).css('backgroundPosition',xpos+'px 0px');
			mfx('#winicon'+i+''+j).css('backgroundPosition',xpos+'px 0px');
			
			if(index>=5){
				xpos	=	-this.configuration.icon_width_X*(index-5);
				mfx('#icon_shadow'+i+''+j).css({backgroundPosition:xpos+'px 0px',visibility:'visible'});
			}else{
				mfx('#icon_shadow'+i+''+j).css('visibility','hidden');
			}
		}
	}
	mfx('#icon_container').show();
}

Game.prototype.startCustomAnimations			=	function(n){
	if(n==0){
		bubble_limit	=	0;
		this.animateBubbles(0);
	}
}

Game.prototype.animateBubbles	=	function(n){
	if(n<num_ingame_bubbles){
		for(var i=0;i<6;i++){
			this.animateSingleBubble(i,n);
		}
		n++;
		var game	=	this;
		setTimeout(function(){ game.animateBubbles(n); },100);
	}
}

var bubble_limit	=	0;

Game.prototype.animateSingleBubble	=	function(m,n){
	if(n>=bubble_limit){
		var game	=	this;
		var x		=	-15+Math.floor(30*Math.random());
		mfx('#ingame_bubble'+m+'_'+n).moveTo(x,0);
		mfx('#ingame_bubble'+m+'_'+n).animatePosition(0,-270,500,function(){ game.repositionBubble(m,n); });
	}
}

Game.prototype.repositionBubble	=	function(m,n){
	mfx('#ingame_bubble'+m+'_'+n).moveTo(0,270);
	this.animateSingleBubble(m,n);
}

Game.prototype.stopCustomAnimations	=	function(){
	bubble_limit	=	6;
}

var curr_winline_index	=	0;
var curr_winline		=	0;
Game.prototype.animateCustomWinIcon	=	function(){
	curr_winline_index	=	this.gamedata.winline_index;
	curr_winline		=	this.gamedata.winline_array[curr_winline_index]-1;
	for(var i=0;i<this.configuration.columns;i++){
		if(this.gamedata.winmask_array[curr_winline_index].charAt(i)=='1'){
			var r		=	this.gamedata.box_array[curr_winline].charAt(2*i);
			var c		=	this.gamedata.box_array[curr_winline].charAt(2*i+1);
			for(var j=0;j<num_icon_bubbles;j++){
				var x		=	-15+Math.floor(30*Math.random());
				mfx('#box_bubble'+r+''+c+'_'+j).moveTo(x,0);
				mfx('#box_bubble'+r+''+c+'_'+j).css('visibility','hidden');
			}
		}
	}
	this.animateBoxIcon(0);
}

Game.prototype.animateBoxIcon	=	function(counter){
	if(counter<num_icon_bubbles){
		for(var i=0;i<this.configuration.columns;i++){
			if(this.gamedata.winmask_array[curr_winline_index].charAt(i)=='1'){
				var r		=	this.gamedata.box_array[curr_winline].charAt(2*i);
				var c		=	this.gamedata.box_array[curr_winline].charAt(2*i+1);
				var index	=	this.gamedata.icon_array[r].charCodeAt(c)-97;
				index		=	this.mapIndex(index);
				
				if(index>=5){
					mfx('#box_bubble'+r+''+c+'_'+counter).css('visibility','visible');
					mfx('#box_bubble'+r+''+c+'_'+counter).animatePosition(0,-250,500);
				}
			}
		}
		counter++;
		var game	=	this;
		setTimeout(function(){ game.animateBoxIcon(counter); },100);
	}
}

Game.prototype.loadFreespin				=	function(){
	this.animateTransitionBubbles(0);
	
	var game	=	this;
	mfx('#middle_container').animatePosition(0,-screen_height_Y,500,function(){ game.bringFreespinFish(); });
	if(!this.gamedata.freespin_started){
		mfx('#game_waves').animatePosition(0,75);
	}
}

Game.prototype.bringFreespinFish		=	function(){
	mfx('#middle_container').moveTo(0,screen_height_Y);
	this.setFreespinScreen();
	
	var game	=	this;
	mfx('#fsfish_bubble0').setContent(this.gamedata.freespins);
	mfx('#freespin_fish, #freespin_fish_shadow, #fsfish_bubble_container').resetTransforms();
	mfx('#freespin_fish, #freespin_fish_shadow, #fsfish_bubble_container').animatePosition(-250,0,500,function(){ setTimeout(function(){ game.animateSingleFSFishBubble(0);},500); });
}

Game.prototype.setFreespinScreen		=	function(){
	mfx('#paytable_button_container, #maxbet_button_container, #autospin_button_container, #spin_button_container, #stop_autospin_button_container, #grouped_button_container, #game_logo, .home_button, .info_panel').hide();
	mfx('#game_waves').stop();
	mfx('#game_waves').moveTo(0,0);
	mfx('#remaining_spins').setContent(this.gamedata.freespins);
	mfx('#freespin_screen').show();
	this.gamedata.freespin_started	=	true;
	this.gamedata.freespin_winnings	=	0;
}

var num_fsfish_bubbles	=	4;
Game.prototype.animateSingleFSFishBubble	=	function(counter){
	if(counter<num_fsfish_bubbles){
		var x		=	-15+Math.floor(30*Math.random());
		mfx('#fsfish_bubble'+counter).moveTo(x,0);
		mfx('#fsfish_bubble'+counter).show();
		
		var game	=	this;
		var func	=	function(){};
		if(counter==num_fsfish_bubbles-1){
			func	=	function(){ game.sendFreespinFish(); };
		}
		mfx('#fsfish_bubble'+counter).animatePosition(0,-270,1500,func);
		
		counter++;
		setTimeout(function(){ game.animateSingleFSFishBubble(counter); },300);
	}
}

Game.prototype.sendFreespinFish		=	function(){
	mfx('#freespin_fish, #freespin_fish_shadow, #fsfish_bubble_container').animatePosition(-380,0,500);
	
	var game	=	this;
	mfx('#middle_container').animatePosition(0,-screen_height_Y,500,function(){ game.continueFreespin(); });
	this.animateTransitionBubbles(0);
}

/*Game.prototype.loadFreespin			=	function(){
	mfx('#paytable_button_container, #maxbet_button_container, #autospin_button_container, #spin_button_container, #stop_autospin_button_container, #grouped_button_container, #game_logo, .home_button, .info_panel').hide();
	//mfx('.waves').css('backgroundPosition','0px -12px');
	mfx('#remaining_spins').setContent(this.gamedata.freespins);
	mfx('#freespin_screen').show();
	
	this.gamedata.freespin_started	=	true;
	this.gamedata.freespin_winnings	=	0;
	//this.continueFreespin();
}*/

Game.prototype.updateFreespinWinnings	=	function(){
	this.gamedata.freespin_winnings	+=	parseFloat(this.gamedata.total_win_amount);
	mfx('#fs_winnings').setContent(parseFloat(this.gamedata.freespin_winnings).toFixed(2));
}

Game.prototype.unloadFreespin		=	function(){
	this.animateTransitionBubbles(0);
	var game	=	this;
	mfx('#game_waves').animatePosition(0,-75);
	mfx('#middle_container').animatePosition(0,-screen_height_Y,500,function(){ game.displayNormalScreen(); });
	/*mfx('#paytable_button_container, #maxbet_button_container, #autospin_button_container, #spin_button_container, #grouped_button_container, #game_logo, .home_button, .info_panel').show();
	if(this.gamedata.autospin_selected){
		mfx('#stop_autospin_button_container').show();
		mfx('#autospin_button_container, #spin_button_container').hide();
	}
	mfx('.waves').css('backgroundPosition','0px 0px');
	mfx('#freespin_screen').hide();
	
	this.gamedata.freespin_started	=	false;*/
}

Game.prototype.displayNormalScreen	=	function(){
	mfx('#middle_container').moveTo(0,screen_height_Y);
	mfx('#paytable_button_container, #maxbet_button_container, #autospin_button_container, #spin_button_container, #grouped_button_container, #game_logo, .home_button, .info_panel').show();
	if(this.gamedata.autospin_selected){
		mfx('#stop_autospin_button_container').show();
		mfx('#autospin_button_container, #spin_button_container').hide();
	}
	//mfx('.waves').css('backgroundPosition','0px 0px');
	mfx('#freespin_screen').hide();
	
	this.gamedata.freespin_started	=	false;
	mfx('#middle_container').animatePosition(0,-screen_height_Y,500);
	this.animateTransitionBubbles(0);
}

Game.prototype.customPostFreespin	=	function(){
	mfx('#remaining_spins').setContent(this.gamedata.freespins-1);
}

var num_crab_bubbles	=	4;
var crab_clicked		=	false;
var total_bonus_win		=	0;
Game.prototype.loadBonus	=	function(){
	this.gamedata.bonus_trigger		=	false;
	crab_clicked	=	false;
	total_bonus_win	=	0;
	for(var i=0;i<num_crabs;i++){
		mfx('#crab'+i).resetTransforms();
		//mfx('#crab'+i).css({opacity:'1',filter:'alpha(opacity=100)'});
		mfx('#crab'+i).show();
		mfx('#bonus_amount'+i).setContent('');
		
		for(var j=0;j<num_crab_bubbles;j++){
			mfx('#crab_bubble'+i+''+j).css('display','none');
		}
	}
	for(var i=0;i<this.gamedata.items_picked;i++){
		var position	=	this.gamedata.picked_positions[i]-1;
		var amount		=	this.gamedata.picked_amounts[i];
		//mfx('#crab'+position).css({opacity:'0.5',filter:'alpha(opacity=50)'});
		mfx('#crab'+position).hide();
		mfx('#bonus_amount'+i).setContent(this.gamedata.currency_symbol+amount);
		total_bonus_win	+=	parseFloat(amount);
	}
	mfx('#bubble_bonus').show();
	mfx('#middle_container, #bubble_bonus').animatePosition(0,-screen_height_Y,500,function(){ mfx('#middle_container').moveTo(0,screen_height_Y); });
	this.animateTransitionBubbles(0);
}

Game.prototype.selectCrab	=	function(n){
	if(this.gamedata.picked_positions.indexOf(n)==-1 && !crab_clicked){
		crab_clicked			=	true;
		this.gamedata.picked_positions.push(n);
		this.gamedata.action	=	0;
		this.gamedata.action	=	3;
		var post_data			=	'url='+ServerURL+'&request='+escape(this.getBonusRequestString(n));
		var game				=	this;
		this.communicator.sendRequest(CurlURL,post_data,game.bonusHandler);
		//this.communicator.sendRequest(ServerURL,post_data,game.bonusHandler);
	}
}

Game.prototype.getBonusRequestString	=	function(n){
	var request_xml	=	this.getRequestHeader();
	request_xml+="<action>"+this.gamedata.action+"</action>";
	request_xml+="<selected_pos>"+n+"</selected_pos>";
	request_xml+="</request>";
		
	return request_xml;
}

Game.prototype.bonusHandler	=	function(o){
	var response	=	o.responseText;
	var gamedata	=	game.gamedata;
	if(response!=''){
		var resObj	=	JSON.parse(response);
		
		if(parseInt(resObj.error)!=0){
			game.displayError(resObj.errorCode,resObj.errorMessage);
		}else{
			var win_amount	=	parseFloat(resObj.bonus_win_amount).toFixed(2);
			mfx('#bonus_amount'+game.gamedata.items_picked).setContent(win_amount);
			game.gamedata.picked_amounts.push(win_amount);
			total_bonus_win	+=	parseFloat(win_amount);
			
			game.gamedata.bonus_finish	=	parseInt(resObj.bonus_finish);
			
			game.animateCrabBubble(game.gamedata.picked_positions[game.gamedata.items_picked]-1);
			
			game.gamedata.items_picked++;
		}
	}
}

Game.prototype.animateCrabBubble	=	function(n){
	for(var i=0;i<num_crab_bubbles;i++){
		var x	=	-20+Math.floor(40*Math.random());
		mfx('#crab_bubble'+n+''+i).moveTo(x,0);
	}
	mfx('#crab'+n).animateScale(1.2,1.2,500,function(){ mfx('#crab'+n).animatePosition(0,120,1000,function(){ mfx('#crab'+n).hide(); }); });
	this.moveCrabBubble(n,0);
}

Game.prototype.moveCrabBubble		=	function(n,counter){
	if(counter<num_crab_bubbles){
		mfx('#crab_bubble'+n+''+counter).css('display','block');
		mfx('#crab_bubble'+n+''+counter).animatePosition(0,-270,500);
		counter++;
		
		var game	=	this;
		setTimeout(function(){ game.moveCrabBubble(n,counter); },100);
	}else{
		crab_clicked	=	false;
		//mfx('#crab'+n).css({opacity:'0.5',filter:'alpha(opacity=50)'});
		//mfx('#crab'+n).hide();
		if(this.gamedata.bonus_finish==1){
			this.gamedata.total_win_amount	=	(parseFloat(this.gamedata.total_win_amount)+parseFloat(total_bonus_win)).toFixed(2);
			mfx('#total_win').setContent(this.gamedata.currency_symbol+this.gamedata.total_win_amount);
			
			var game	=	this;
			setTimeout(function(){ game.unloadBonus(); },1000);
			//setTimeout(function(){ game.darkTransition(function(){ game.unloadBonus(); }); },1000);
		}
	}
}

Game.prototype.unloadBonus	=	function(){
	this.gamedata.bonus_returned	=	true;
	//mfx('#bubble_bonus').hide();
	if(!this.gamedata.autospin_selected && this.gamedata.freespins==0){
		this.enableAllButtons();
		this.gamedata.spinning	=	false;
	}
	this.postProcessLineWin();
	mfx('#middle_container, #bubble_bonus').animatePosition(0,-screen_height_Y,500,function(){ mfx('#bubble_bonus').moveTo(0,screen_height_Y).hide(); });
	this.animateTransitionBubbles(0);
}