var bheight = window.innerHeight;
if (bheight < 400)
{
	Game.prototype.configuration	=	{
	rows			:	3,
	columns			:	5,
	icon_container_width_X	:	84,
	icon_container_height_Y	:	59,
	icon_width_X	:	80,
	icon_height_Y	:	62,
	autospin_values	:	[5,10,20,25,50],
	jerk_offset		:	10
	};

}

if (bheight > 400)
{
	Game.prototype.configuration	=	{
	rows			:	3,
	columns			:	5,
	icon_container_width_X	:	168,
	icon_container_height_Y	:	118,
	icon_width_X	:	160,
	icon_height_Y	:	124,
	autospin_values	:	[5,10,20,25,50],
	jerk_offset		:	10
	};

}


Game.prototype.gamedata	=	{
	error			:	false,
	betlines		:	0,
	coins			:	1,
	denominations	:	[],
	deno_index		:	0,
	curr_denomination	:	0,
	action			:	0,
	balance			:	0,
	total_bet		:	0,
	total_win_amount:	0,
	currency_name	:	'',
	currency_symbol	:	'',
	resume			:	false,
	min_coins		:	0,
	max_coins		:	0,
	max_lines		:	0,
	spinning		:	false,
	stopreel_counter:	0,
	icon_array		:	[],
	winline_array	:	[],
	winamount_array	:	[],
	winmask_array	:	[],
	winline_index	:	0,
	fs_trigger		:	false,
	total_free_spins:	0,
	freespins		:	0,
	freespin_winnings	:	0,
	value_selector_visible		:	false,
	autospin_selector_visible	:	false,
	paytable_visible            :   false,
	autospin_index	:	0,
	autospins		:	0,
	autospin_selected	:	false,
	bonus_trigger	:	false,
	bonus_finish	:	true,
	items_picked	:	0,
	picked_positions:	[],
	picked_amounts	:	[],
	feature_symbols	:	['s','k'],
	feature_symbol_count	:	[0,0],
	freespin_started	:	false,
	post_stop_glow		:	false,
	back_returned	:	false
};

Game.prototype.startGame		=	function(){
	hideAddressBar();
	
	this.createComponents();
	this.addEventHandlers();
	this.configureSpecifics();
	
	this.gamedata.action	=	0;
	var post_data			=	'url='+ServerURL+'&request='+escape(this.getRequestString(this.gamedata.action));
	this.communicator		=	new Communicator(this);
	this.communicator.sendRequest(CurlURL,post_data,this.communicator.successHandler);
	//this.communicator.sendRequest(ServerURL,post_data,this.communicator.successHandler);
}

Game.prototype.configureSpecifics	=	function(){
	//Override in main.js
}

Game.prototype.createComponents		=	function(){
	this.createIcons();
	this.createAutospinSelector();
}

Game.prototype.createIcons	=	function(){
	for(var i=0;i<this.configuration.rows;i++){
		for(j=0;j<this.configuration.columns;j++){
			var icon1		=	document.createElement('div');
			icon1.className	=	'icon1';
			icon1.setAttribute('id','icon1'+i+''+j);
			icon1.style.left	=	j*this.configuration.icon_container_width_X+'px';
			icon1.style.top	=	i*this.configuration.icon_container_height_Y+'px';
			mfx('#icon_container').append(icon1);
			
			var winicon		=	document.createElement('div');
			winicon.className	=	'icon1';
			winicon.setAttribute('id','winicon'+i+''+j);
			winicon.style.left	=	j*this.configuration.icon_container_width_X+'px';
			winicon.style.top	=	i*this.configuration.icon_container_height_Y+'px';
			mfx('#winicon_container').append(winicon);
			
			var box			=	document.createElement('div');
			box.className	=	'box';
			box.setAttribute('id','box'+i+''+j);
			mfx('#box_container').append(box);
		}
	}
}

Game.prototype.createLines	=	function(){
	for(var i=1;i<=this.gamedata.max_lines;i++){
		var line	=	document.createElement("div");
		line.className	=	'line';
		line.setAttribute('id','line'+i);
		mfx('#line_container').append(line);
	}
}

Game.prototype.createAutospinSelector	=	function(){
	for(var i=0;i<this.configuration.autospin_values.length;i++){
		var asopt		=	document.createElement("div");
		asopt.className	=	'asopt';
		asopt.setAttribute('id','asopt'+i);
		asopt.innerHTML	=	this.configuration.autospin_values[i];
		mfx('#asopt_container').append(asopt);
	}
}

Game.prototype.addEventHandlers			=	function(){
	var game	=	this;
	
	mfx('#paytable_button_overlay').on('press',function(){ game.pressButton('paytable_button_container'); });
	mfx('#paytable_button_overlay').on('release',function(){ game.releaseButton('paytable_button_container'); });
	mfx('#paytable_button_overlay').on('click',function(){ game.displayPaytable(); });
	mfx('#pay_cont_close').on('click',function(){ game.hidePaytable(); });
	
	mfx('#maxbet_button_overlay').on('press',function(){ game.pressButton('maxbet_button_container'); });
	mfx('#maxbet_button_overlay').on('release',function(){ game.releaseButton('maxbet_button_container'); });
	mfx('#maxbet_button_overlay').on('click',function(){ game.maxBet(); });
	
	mfx('#grouped_button_overlay').on('press',function(){ game.pressButton('grouped_button_container'); });
	mfx('#grouped_button_overlay').on('release',function(){ game.releaseButton('grouped_button_container'); });
	mfx('#grouped_button_overlay').on('click',function(){ game.toggleValueSelector(); });
	mfx('#ctrl_cont_close').on('click',function(){ game.hideValueSelector(); });
	
	mfx('#deno_minus').on('press',function(){ game.pressButton('deno_minus'); });
	mfx('#deno_minus').on('release',function(){ game.releaseButton('deno_minus'); });
	mfx('#deno_minus').on('click',function(){ game.decreaseDenomination(); });
	
	mfx('#deno_plus').on('press',function(){ game.pressButton('deno_plus'); });
	mfx('#deno_plus').on('release',function(){ game.releaseButton('deno_plus'); });
	mfx('#deno_plus').on('click',function(){ game.increaseDenomination(); });
	
	mfx('#line_minus').on('press',function(){ game.pressButton('line_minus'); });
	mfx('#line_minus').on('release',function(){ game.releaseButton('line_minus'); });
	mfx('#line_minus').on('click',function(){ game.decreaseLines(); });
	
	mfx('#line_plus').on('press',function(){ game.pressButton('line_plus'); });
	mfx('#line_plus').on('release',function(){ game.releaseButton('line_plus'); });
	mfx('#line_plus').on('click',function(){ game.increaseLines(); });
	
	mfx('#autospin_button_overlay').on('press',function(){ game.pressButton('autospin_button_container'); });
	mfx('#autospin_button_overlay').on('release',function(){ game.releaseButton('autospin_button_container'); });
	mfx('#autospin_button_overlay').on('click',function(){ game.toggleAutospinSelector(); });
	mfx('#autoselect_cont_close').on('click',function(){ game.hideAutospinSelector(); });
	
	for(var i=0;i<this.configuration.autospin_values.length;i++){
		mfx('#asopt'+i).on('press',function(n){ return function(){ game.pressButton('asopt'+n); }}(i));
		mfx('#asopt'+i).on('release',function(n){ return function(){ game.releaseButton('asopt'+n); }}(i));
		mfx('#asopt'+i).on('click',function(n){ return function(){ game.setAutospinValue(n); }}(i));
	}
	
	mfx('#spin_button_overlay').on('press',function(){ game.pressButton('spin_button_container'); });
	mfx('#spin_button_overlay').on('release',function(){ game.releaseButton('spin_button_container'); });
	mfx('#spin_button_overlay').on('click',function(){ game.playGame(); });
	
	mfx('#stop_autospin_button_overlay').on('press',function(){ game.pressButton('stop_autospin_button_container'); });
	mfx('#stop_autospin_button_overlay').on('release',function(){ game.releaseButton('stop_autospin_button_container'); });
	mfx('#stop_autospin_button_overlay').on('click',function(){ game.stopAutospin(); });
	
	document.onmouseup	=	function(){ game.releaseAllButtons(); };
	document.ontouchend	=	function(){ game.releaseAllButtons(); };

	this.addCustomEventHandlers();
}

Game.prototype.addCustomEventHandlers	=	function(){
	//Override in main.js
}

Game.prototype.pressButton			=	function(button_id){
	mfx('#'+button_id).moveTo(0,3);
}

Game.prototype.releaseButton		=	function(button_id){
	mfx('#'+button_id).moveTo(0,0);
}

Game.prototype.displayPaytable			=	function(){
	var game	=	this;
	mfx('#paytable_container').css({opacity:'0',filter:'alpha(opacity=0)',display:'block'});
	mfx('#paytable_container').animateOpacity(1,
											100,
											function(){
												game.gamedata.paytable_visible	=	true;
											});	
}

Game.prototype.hidePaytable		=	function(){
	var game	=	this;
	mfx('#paytable_container').animateOpacity(0,
											100,
											function(){
												mfx('#paytable_container').css('display','none');
												game.gamedata.paytable_visible	=	false;
											});
}


Game.prototype.toggleValueSelector		=	function(){
	if(game.gamedata.value_selector_visible){
		this.hideValueSelector();
	}else{
		this.displayValueSelector();
	}
}

Game.prototype.displayValueSelector		=	function(){
	this.hideWinningLines();
	if(this.gamedata.autospin_selector_visible){
		this.hideAutospinSelector();
	}
	var game	=	this;
	mfx('#controls_container').css({opacity:'0',filter:'alpha(opacity=0)',display:'block'});
	mfx('#controls_container').animateOpacity(1,
											100,
											function(){
												game.gamedata.value_selector_visible	=	true;
											});	
}

Game.prototype.hideValueSelector		=	function(){
	var game	=	this;
	mfx('#controls_container').animateOpacity(0,
											100,
											function(){
												mfx('#controls_container').css('display','none');
												game.gamedata.value_selector_visible	=	false;
											});
}

Game.prototype.toggleAutospinSelector	=	function(){
	if(game.gamedata.autospin_selector_visible){
		this.hideAutospinSelector();
	}else{
		this.displayAutospinSelector();
	}
}

Game.prototype.displayAutospinSelector	=	function(){
	this.hideWinningLines();
	if(this.gamedata.value_selector_visible){
		this.hideValueSelector();
	}
	var game	=	this;
	mfx('#autospin_select_container').css({opacity:'0',filter:'alpha(opacity=0)',display:'block'});
	mfx('#autospin_select_container').animateOpacity(1,
											100,
											function(){
												game.gamedata.autospin_selector_visible	=	true;
											});	
}

Game.prototype.hideAutospinSelector		=	function(){
	var game	=	this;
	mfx('#autospin_select_container').animateOpacity(0,
											100,
											function(){
												mfx('#autospin_select_container').css('display','none');
												game.gamedata.autospin_selector_visible	=	false;
											});
}

Game.prototype.decreaseDenomination		=	function(){
	if(this.gamedata.deno_index>0){
		this.gamedata.deno_index--;
		this.setCoinControl();
	}
}

Game.prototype.increaseDenomination		=	function(){
	if(this.gamedata.deno_index<this.gamedata.denominations.length-1){
		this.gamedata.deno_index++;
		this.setCoinControl();
	}
}

Game.prototype.decreaseLines			=	function(){
	if(this.gamedata.betlines>1){
		this.gamedata.betlines--;
		this.setLineControl();
		this.displayBetlines();
	}
}

Game.prototype.increaseLines			=	function(){
	if(this.gamedata.betlines<this.gamedata.max_lines){
		this.gamedata.betlines++;
		this.setLineControl();
		this.displayBetlines();
	}
}

Game.prototype.displayBetlines			=	function(){
	for(var i=1;i<=this.gamedata.betlines;i++){
		mfx('#line'+i).show();
	}
	for(var i=parseInt(this.gamedata.betlines)+1;i<=this.gamedata.max_lines;i++){
		mfx('#line'+i).hide();
	}
}

Game.prototype.hideBetLines				=	function(){
	for(var i=1;i<=this.gamedata.max_lines;i++){
		mfx('#line'+i).hide();
	}
}

Game.prototype.getRequestHeader			=	function(){
	var request_header	=	"<request><type>game</type><authentication><username>apiuser</username><password>password</password></authentication><game_details><game_id>121</game_id><game_type>WDSM</game_type><game_variant>MB</game_variant><demo>no</demo></game_details><account_id>1</account_id><amount_type>1</amount_type><brand_tag>SMBR</brand_tag><platform>MBL</platform><currency>GBP</currency>";
	
	return request_header;
}

Game.prototype.getRequestString			=	function(action){
	var request_xml	=	this.getRequestHeader();
	request_xml+="<selected_lines>"+this.gamedata.betlines+"</selected_lines>";
	request_xml+="<no_of_coins>"+this.gamedata.coins+"</no_of_coins>";
	request_xml+="<coin_value>"+parseFloat(this.gamedata.denominations[this.gamedata.deno_index]/100).toFixed(2)+"</coin_value>";
	request_xml+="<line_stake>"+parseFloat(this.gamedata.curr_denomination)*this.gamedata.coins+"</line_stake>";
	request_xml+="<action>"+action+"</action>";
	request_xml+="<currency>GBP</currency>";
	request_xml+="</request>";
	
	return request_xml;
}

Game.prototype.enableAllButtons	=	function(){
	mfx('.button_shadow').hide();
}

Game.prototype.disableAllButtons	=	function(){
	mfx('.button_shadow').show();
}

Game.prototype.setCoinControl	=	function(){
	this.gamedata.curr_denomination	=	parseInt(this.gamedata.denominations[this.gamedata.deno_index]);
	var deno_string	=	this.gamedata.curr_denomination+"P";
	if(parseFloat(this.gamedata.curr_denomination)>=100){
		deno_string	=	this.gamedata.currency_symbol + parseFloat(this.gamedata.curr_denomination/100).toFixed(2);
	}
	mfx('#deno_value').setContent(deno_string);
	mfx('#coin_value').setContent(deno_string);
	mfx('#deno_minus_shade').hide();
	mfx('#deno_plus_shade').hide();
	if(this.gamedata.deno_index == 0){
		mfx('#deno_minus_shade').show();
	}else if(this.gamedata.deno_index == this.gamedata.denominations.length-1){
		mfx('#deno_plus_shade').show();
	}
	this.updateTotalBet();
}

Game.prototype.setLineControl	=	function(){
	mfx('#num_lines').setContent(this.gamedata.betlines);
	mfx('#lines').setContent(this.gamedata.betlines);
	mfx('#line_minus_shade').hide();
	mfx('#line_plus_shade').hide();
	if(this.gamedata.betlines == 1){
		mfx('#line_minus_shade').show();
	}else if(this.gamedata.betlines == this.gamedata.max_lines){
		mfx('#line_plus_shade').show();
	}
	this.updateTotalBet();
}

Game.prototype.updateTotalBet	=	function(){
	this.gamedata.total_bet	=	parseFloat(((this.gamedata.curr_denomination*this.gamedata.betlines*this.gamedata.coins)/100)).toFixed(2);
	mfx('#bet_amount').setContent(this.gamedata.currency_symbol+this.gamedata.total_bet);
}

Game.prototype.setAutospinValue	=	function(n){
	this.gamedata.autospin_index	=	n;
	this.gamedata.autospins			=	this.configuration.autospin_values[this.gamedata.autospin_index]-1;
	this.gamedata.autospin_selected	=	true;
	this.hideAutospinSelector();
	mfx('#autospin_button_container').hide();
	mfx('#spin_button_container').hide();
	mfx('#stop_autospin_button_container').show();
	this.playGame();
}

Game.prototype.stopAutospin		=	function(){
	this.gamedata.autospin_selected	=	false;
	
	mfx('#stop_autospin_button_container').hide();
	mfx('#autospin_button_container').show();
	mfx('#spin_button_container').show();
	
	if(this.gamedata.spinning && !this.gamedata.post_stop_glow && this.gamedata.freespins==0){
		this.enableAllButtons();
		this.gamedata.spinning	=	false;
	}
}

Game.prototype.updateAutospin	=	function(){
	mfx('#as_num').setContent(this.gamedata.autospins);
}

Game.prototype.displayLoadbar	=	function(){
	mfx('#loadbar').show();
}

Game.prototype.hideLoadbar		=	function(){
	mfx('#loadbar').hide();
}

Game.prototype.displayOutcome	=	function(){
var bheight = window.innerHeight;
if(bheight > 400)
	{
	   var xfac = 2;
	}
else
    {
	   var xfac = 1;
	}

	for(var i=0;i<this.configuration.rows;i++){
		for(var j=0;j<this.configuration.columns;j++){
			var index	=	this.gamedata.icon_array[i].charCodeAt(j)-97;
			index		=	this.mapIndex(index);
			var xpos	=	-this.configuration.icon_width_X*index;
			mfx('#icon1'+i+''+j).css('backgroundPosition',xpos+'px 0px');
			mfx('#winicon'+i+''+j).css('backgroundPosition',xpos+'px 0px');
		}
	}
	mfx('#icon_container').show();
}

Game.prototype.mapIndex	=	function(index){									//Override in main.js
	return index;
}

Game.prototype.playGame	=	function(){
	if(!this.gamedata.spinning && !this.gamedata.error){
		if(this.gamedata.value_selector_visible){
			this.hideValueSelector();
		}
		if(this.gamedata.autospin_selector_visible){
			this.hideAutospinSelector();
		}
		if(parseFloat(this.gamedata.total_bet)<=parseFloat(this.gamedata.balance) || this.gamedata.freespins>0){
			this.gamedata.spinning	=	true;
			if(this.gamedata.freespins==0){
				this.gamedata.balance		=	(parseFloat(this.gamedata.balance)-parseFloat(this.gamedata.total_bet)).toFixed(2);
			}
			mfx('#balance').setContent(this.gamedata.currency_symbol+this.gamedata.balance);
			mfx('#total_win').setContent('');
			
			this.disableAllButtons();
			
			if(this.gamedata.autospin_selected==true){					//Keep autospin button activated if autospin is selected
				this.updateAutospin();
			}
			
			this.doSpin();
		}
	}
}

Game.prototype.doSpin	=	function(){
	this.gamedata.post_stop_glow	=	true;
	this.hideWinningLines();
	this.displayLoadbar();
	
	this.gamedata.action	=	1;
	var post_data			=	'url='+ServerURL+'&request='+escape(this.getRequestString(this.gamedata.action));
	this.communicator.sendRequest(CurlURL,post_data,this.communicator.successHandler)
	//this.communicator.sendRequest(ServerURL,post_data,this.communicator.successHandler)
}

Game.prototype.startReelAnimation	=	function(){
	for(var i=0;i<this.configuration.columns;i++){
		mfx('#reel'+i).animateBackground(i*80,0,-240,0,80,250,function(){},true);
	}
	this.moveIconsUp(0);
}

Game.prototype.moveIconsUp		=	function(count){
	var game	=	this;
	if(count<this.configuration.columns){
		for(var i=0;i<this.configuration.rows;i++){
			mfx('#icon1'+i+''+count).animatePosition(0,-this.configuration.jerk_offset,100,function(row,column){ return function(){ game.moveIconsDownLevel(row,column); }}(i,count));
		}
	}
}

Game.prototype.moveIconsDownLevel	=	function(row,column){
	var game	=	this;
	mfx('#icon1'+row+''+column).animatePosition(0,this.configuration.jerk_offset,100,function(){ game.revealReel(column); });
	if(row==this.configuration.rows-1){
		this.moveIconsUp(column+1);
	}
}

Game.prototype.revealReel			=	function(n){
	this.startCustomAnimations(n);
	mfx('#reel'+n).css('visibility','visible');
	if(n==this.configuration.columns-1){
		this.displayOutcome();
	}
}

Game.prototype.startCustomAnimations	=	function(n){
	//Override in main.js
}

Game.prototype.hideWinningLines		=	function(){
	clearTimeout(wlanim_id);
	clearTimeout(wicanim_id);
	this.hideAllLineWin();
	this.hideWinIcons();
	this.hideBetLines();
	this.showAllIcons();
}

Game.prototype.hideAllLineWin	=	function(){
	mfx('#linewin_panel').hide();
}

Game.prototype.stopSpin			=	function(counter){
	if(counter<this.configuration.columns){
		mfx('#reel'+counter).stop();
		mfx('#reel'+counter).css('visibility','hidden');
		this.moveIconsDown(counter);
		
		this.updateBonusCount(counter);
		
		counter++;
		var delay	=	200;
		if(counter<5 && this.shouldDelay(counter)==true){
			delay	=	2000;
		}
		var game	=	this;
		setTimeout(function(){ game.stopSpin(counter); },delay);
	}else{
		this.stopCustomAnimations();
		
		mfx('#balance').setContent(this.gamedata.currency_symbol+this.gamedata.balance);
		mfx('#total_win').setContent(this.gamedata.currency_symbol+this.gamedata.total_win_amount);
		
		if(this.gamedata.freespins>0){
			this.updateFreespinWinnings();
		}
		
		if(this.gamedata.autospin_selected){
			if(this.gamedata.autospins == 0){																				//Selected number of spins completed
				this.gamedata.autospin_selected	=	false;
				
				mfx('#stop_autospin_button_container').hide();
				mfx('#autospin_button_container').show();
				mfx('#spin_button_container').show();
			}
		}
		
		if(!this.gamedata.autospin_selected && !this.gamedata.bonus_trigger && this.gamedata.freespins==0){						//More conditions to come
			this.enableAllButtons();
			this.gamedata.spinning	=	false;
		}
		
		this.gamedata.winline_index	=	0;
		this.animateWinlines();
	}
}

Game.prototype.updateFreespinWinnings	=	function(){
	//Override in main.js
}

Game.prototype.stopCustomAnimations	=	function(){
	//Override in main.js
}

Game.prototype.moveIconsDown	=	function(count){
	var game	=	this;
	if(count<this.configuration.columns){
		for(var i=0;i<this.configuration.rows;i++){
			mfx('#icon1'+i+''+count).animatePosition(0,this.configuration.jerk_offset,100,function(row,column){ return function(){ game.moveIconsUpLevel(row,column); }}(i,count));
		}
	}
}

Game.prototype.moveIconsUpLevel	=	function(row,column){
	var game	=	this;
	mfx('#icon1'+row+''+column).animatePosition(0,-this.configuration.jerk_offset,100);
}

Game.prototype.updateBonusCount	=	function(s_counter){
	for(var i=0;i<3;i++){
		var symbol	=	this.gamedata.icon_array[i].charAt(s_counter);
		for(var j=0;j<this.gamedata.feature_symbols.length;j++){
			if(symbol==this.gamedata.feature_symbols[j]){
				this.gamedata.feature_symbol_count[j]++;
			}
		}
	}
}

Game.prototype.shouldDelay		=	function(s_counter){
	if(this.gamedata.stopreel_counter<4){
		for(var i=0;i<this.gamedata.feature_symbol_count.length;i++){
			if(this.gamedata.feature_symbol_count[i]==2){
				return true;
			}
		}
	}
	return false;
}

Game.prototype.resetFeatureSymbolCount	=	function(){
	this.gamedata.feature_symbol_count[0]=this.gamedata.feature_symbol_count[1]=0;
}

var wlanim_id		=	0;
var wicanim_id		=	0;
var winicon_timer	=	0;

Game.prototype.animateWinlines	=	function(){
	this.showAllIcons();
	this.hideBetLines();
	this.hideWinIcons();
	this.gamedata.post_stop_glow	=	false;
	winicon_timer	=	0;
	if(this.gamedata.winline_array.length>0 && (this.gamedata.spinning==true || this.gamedata.autospin_selected==false)){
		mfx('#line'+this.gamedata.winline_array[this.gamedata.winline_index]).show();
		var wl	=	this.gamedata.winline_array[this.gamedata.winline_index]-1;
		for(var i=0;i<this.configuration.columns;i++){
			if(this.gamedata.winmask_array[this.gamedata.winline_index].charAt(i)=='1'){
				var r	=	this.gamedata.box_array[wl].charAt(2*i);
				var c	=	this.gamedata.box_array[wl].charAt(2*i+1);

				mfx('#icon1'+r+''+c).css('visibility','hidden');
				mfx('#winicon'+r+''+c).css('visibility','visible');
				mfx('#box'+r+''+c).css('visibility','visible');
			}
		}
		if(parseFloat(this.gamedata.winamount_array[this.gamedata.winline_index])>0){
			this.setLineWinAmount();
		}
		var game	=	this;
		wicanim_id	=	setTimeout(function(){ game.animateWinIcon(); game.animateCustomWinIcon(); },10);
	}else{
		this.postProcessLineWin();
	}
}

Game.prototype.setLineWinAmount		=	function(){
	this.hideAllLineWin();
	var wl		=	this.gamedata.winline_array[this.gamedata.winline_index]-1;
	var amount	=	this.gamedata.winamount_array[this.gamedata.winline_index];
	mfx('#linewin_amt').setContent('Line '+wl+' - Win '+this.gamedata.currency_symbol+amount);
	mfx('#linewin_panel').css('opacity','0');
	mfx('#linewin_panel').css('filter','alpha(opacity=0)');
}

Game.prototype.showAllIcons		=	function(){
	for(var i=0;i<this.configuration.rows;i++){
		for(var j=0;j<this.configuration.columns;j++){
			mfx('#icon1'+i+''+j).css('visibility','visible');
		}
	}
}

Game.prototype.hideWinIcons		=	function(){
	for(var i=0;i<this.configuration.rows;i++){
		for(j=0;j<this.configuration.columns;j++){
			mfx('#winicon'+i+''+j).css('visibility','hidden');
			mfx('#box'+i+''+j).css('visibility','hidden');
		}
	}
}

Game.prototype.animateWinIcon	=	function(){
	var bheight = window.innerHeight;
	if(bheight > 400)
		{
			var xfac = 2;
		}
	else
		{
			var xfac = 1;
		}
	var wl	=	this.gamedata.winline_array[this.gamedata.winline_index]-1;
	if(winicon_timer<5){
		for(var i=0;i<this.configuration.columns;i++){
			if(this.gamedata.winmask_array[this.gamedata.winline_index].charAt(i)=='1'){
				var r		=	this.gamedata.box_array[wl].charAt(2*i);
				var c		=	this.gamedata.box_array[wl].charAt(2*i+1);
				var index	=	this.gamedata.icon_array[r].charCodeAt(c)-97;
				index		=	this.mapIndex(index);									//Must be declared in each slots game
				var xpos	=	-this.configuration.icon_width_X*index;
				var ypos	=	0;
				
				if(winicon_timer==1){
					ypos	=	-this.configuration.icon_height_Y;
				}else if(winicon_timer==3){
					ypos	=	-2*this.configuration.icon_height_Y;
				}
				
				mfx('#box'+r+''+c).css('visibility','visible');
				mfx('#winicon'+r+''+c).css('visibility','visible');
				mfx('#winicon'+r+''+c).css('backgroundPosition',xpos+'px '+ypos+'px');
			}
		}
		if(winicon_timer==0){
			mfx('#linewin_panel').show();
			mfx('#linewin_panel').animateOpacity(1,200);
		}else if(winicon_timer==4){
			mfx('#linewin_panel').animateOpacity(0,200);
		}
		winicon_timer++;
		var game	=	this;
		wicanim_id	=	setTimeout(function(){ game.animateWinIcon(); },200);
	}else{
		this.gamedata.winline_index	=	(this.gamedata.winline_index+1)%this.gamedata.winline_array.length;
		this.postProcessLineWin();
	}
}

Game.prototype.animateCustomWinIcon	=	function(){
	//Override in main.js
}

Game.prototype.postProcessLineWin	=	function(){
	var game	=	this;
	if(this.gamedata.bonus_trigger && (this.gamedata.winline_index==0 || (num_freespins>0 && winline_index==4))){
		//this.darkTransition(function(){ game.loadBonus(); });
		this.loadBonus();
	}else if(this.gamedata.freespins>0 && (this.gamedata.winline_index==0 || this.gamedata.winline_index==4)){
		if(this.gamedata.fs_trigger){
			//this.darkTransition(function(){ game.loadFreespin(); });
			this.loadFreespin();
		}else{
			setTimeout(function(){ game.setFreespinScreen(); game.continueFreespin(); },1000);
		}
	}else{
		if(this.gamedata.autospin_selected && this.gamedata.winline_index==0 && this.gamedata.spinning){
			var delay	=	1000;
			if(this.gamedata.freespin_started==true){
				delay	=	6000;
			}
			setTimeout(function(){ game.continueAutospin(); },delay);
		}else{
			if(this.gamedata.winline_array.length>0){
				wlanim_id	=	setTimeout(function(){ game.animateWinlines(); },200);
			}
		}
		if(this.gamedata.freespin_started==true && this.gamedata.freespins==0 && this.gamedata.winline_index==0){
			this.unloadFreespin();
		}
	}
}

Game.prototype.continueAutospin		=	function(){
	if(this.gamedata.autospin_selected){
		if(parseFloat(this.gamedata.total_bet)<=parseFloat(this.gamedata.balance)){
			this.gamedata.balance		=	(this.gamedata.balance-this.gamedata.total_bet).toFixed(2);
			mfx('#balance').setContent(this.gamedata.currency_symbol+this.gamedata.balance);
			mfx('#total_win').setContent('');
			this.hideWinningLines();
			
			if(this.gamedata.autospins>0){
				this.gamedata.autospins--;
				this.setAutospinNumber();
				this.gamedata.post_stop_glow	=	true;
				
				var game	=	this;
				setTimeout(function(){ game.doSpin(); },500);
			}
		}
	}
}

Game.prototype.setAutospinNumber	=	function(){
	mfx('#as_num').setContent(this.gamedata.autospins);
}

Game.prototype.loadBonus	=	function(){
	//Override in main.js
}

Game.prototype.continueFreespin		=	function(){
	this.gamedata.spinning			=	true;
	mfx('#total_win').setContent('');
	this.hideWinningLines();
	this.gamedata.post_stop_glow	=	true;
	
	this.customPostFreespin();
	
	var game	=	this;
	setTimeout(function(){ game.doSpin(); },500);
}

Game.prototype.loadFreespin			=	function(){
	this.gamedata.freespin_started	=	true;
	this.gamedata.freespin_winnings	=	0;
	this.continueFreespin();
}

Game.prototype.unloadFreespin		=	function(){
	this.gamedata.freespin_started	=	false;
}

Game.prototype.maxBet				=	function(){
	if(!this.gamedata.spinning && !this.gamedata.error){
		this.gamedata.betlines	=	this.gamedata.max_lines;
		this.gamedata.coins		=	1;
		this.gamedata.deno_index	=	this.gamedata.denominations.length-1;
		this.setCoinControl();
		this.setLineControl();
		this.playGame();
		//setLNPosition();
		//setCVPosition();
		//setCNPosition();
		//updateTotalBet();
		//spinReel();
	}
}

function Communicator(game){
	this.sendRequest		=	function(url,post_data,success_handler){
		var callback	=	{
			success:success_handler, 
			failure:this.failure_handler, 
			timeout: 30000 
		};
		YAHOO.util.Connect.asyncRequest('POST', url, callback, post_data);
	}
	
	this.successHandler	=	function(o){
		var response	=	o.responseText;
		//var response	=	'{"error":0,"game_id":"121","denominations":"10,20,30,40,50","default_denomination":"30","balance":"1318.35","currency":"GBP","total_win_amount":1.2,"reel":"hdfad|gggah|abhcd","min_coins":1,"max_coins":3,"default_coins":3,"no_of_lines":"20","is_resume":0,"win_details":[{"win_amount":0.6,"line_number":2,"blink_str":"11100"},{"win_amount":0.6,"line_number":6,"blink_str":"11100"}],"log_id":"1959","can_gamble":1}';
		var gamedata	=	game.gamedata;
		if(response!=''){
			var resObj	=	JSON.parse(response);
			
			if(parseInt(resObj.error)!=0){
				game.displayError(resObj.errorCode,resObj.errorMessage);
			}else{
				gamedata.balance				=	parseFloat(resObj.balance).toFixed(2);
				
				if(resObj.fs_trigger!=undefined){
					gamedata.fs_trigger			=	(parseInt(resObj.fs_trigger)==1)?true:false;
				}else{
					gamedata.fs_trigger			=	false;
				}
				if(resObj.total_free_spins!=undefined){
					gamedata.total_free_spins	=	parseInt(resObj.total_free_spins);
				}else{
					gamedata.total_free_spins	=	0;
				}
				if(resObj.num_fs_left!=undefined){
					gamedata.freespins			=	parseInt(resObj.num_fs_left);
				}else{
					gamedata.freespins			=	0;
				}
				if(resObj.bonus_trigger!=undefined){
					gamedata.items_picked		=	0;
					gamedata.picked_positions	=	[];
					gamedata.picked_amounts		=	[];
					gamedata.bonus_trigger		=	(parseInt(resObj.bonus_trigger)==1)?true:false;
				}else{
					gamedata.bonus_trigger		=	false;
				}
				if(resObj.bonus_finish!=undefined){
					gamedata.bonus_finish		=	(parseInt(resObj.bonus_finish)==1)?true:false;
				}else{
					gamedata.bonus_finish		=	true;
				}
				gamedata.bonus_returned			=	false;
				
				if(gamedata.action == 0){
					gamedata.currency_name		=	resObj.currency;
					gamedata.currency_symbol	=	game.getCurrencySymbol(resObj.currency);
					gamedata.resume				=	parseInt(resObj.is_resume)==1?true:false;
					gamedata.max_lines			=	parseInt(resObj.no_of_lines);
					gamedata.betlines			=	gamedata.max_lines;
					game.createLines();
					
					gamedata.denominations		=	resObj.denominations.split(",");
					gamedata.min_coins			=	parseInt(resObj.min_coins);
					gamedata.max_coins			=	parseInt(resObj.max_coins);
					gamedata.curr_denomination	=	parseInt(resObj.default_denomination);
					
					if(gamedata.resume){
						gamedata.betlines			=	parseInt(resObj.selected_lines);
						gamedata.coins				=	parseInt(resObj.no_of_coins);
						gamedata.curr_denomination	=	parseInt(parseFloat(resObj.coin_value)*100);
					}else{
						game.enableAllButtons();
						gamedata.spinning			=	false;
					}
					
					game.setLineControl();
					
					for(var i=0;i<gamedata.denominations.length;i++){						//Current denomination index
						if(gamedata.curr_denomination == parseInt(gamedata.denominations[i])){
							gamedata.deno_index	=	i;
							game.setCoinControl();
							break;
						}
					}
					
					game.updateTotalBet();
					
					gamedata.icon_array	=	resObj.reel.split("|");
					game.displayOutcome();
					
					mfx('#balance').setContent(gamedata.currency_symbol+gamedata.balance);
					
					if(gamedata.resume){
						if(!gamedata.bonus_finish){
							gamedata.items_picked		=	parseInt(resObj.picked);
							
							gamedata.picked_positions	=	[];
							gamedata.picked_amounts		=	[];
							if(resObj.picked_pos!=undefined){
								var pos_array			=	resObj.picked_pos.split(',');
								var amt_array			=	resObj.win_amt_str.split(',');
								
								for(var i=0;i<pos_array.length;i++){
									gamedata.picked_positions.push(parseInt(pos_array[i]));
									gamedata.picked_amounts.push(parseFloat(amt_array[i]).toFixed(2));
								}
							}							
							//game.loadBonus();
						}else if(gamedata.freespins>0){
							//game.loadFreespin();
						}
					}
					
					game.reveal();
					game.showLoadingScreen();
				}else if(gamedata.action == 1){
					gamedata.icon_array	=	resObj.reel.split("|");
					
					game.hideLoadbar();
					game.startReelAnimation();
					
					gamedata.total_win_amount	=	parseFloat(resObj.total_win_amount).toFixed(2);
					gamedata.winline_array		=	[];
					gamedata.winamount_array	=	[];
					gamedata.winmask_array		=	[];
					
					if(resObj.win_details!=undefined){
						for(var i=0;i<resObj.win_details.length;i++){	
							var curr_win	=	resObj.win_details[i];
							gamedata.winline_array.push(curr_win.line_number);
							gamedata.winamount_array.push(parseFloat(curr_win.win_amount).toFixed(2));
							gamedata.winmask_array.push(curr_win.blink_str);
						}
					}
					
					game.resetFeatureSymbolCount();
					setTimeout(function(){ game.stopSpin(0); },2000);
				}
			}
		}
	}
	
	this.failureHandler	=	function(){
		console.log("Error in communication");
	}
}

Game.prototype.showLoadingScreen	=	function(){
	//Override in main.js
}

Game.prototype.releaseAllButtons	=	function(){
	this.releaseButton('paytable_button_container');
	this.releaseButton('maxbet_button_container');
	this.releaseButton('autospin_button_container');
	this.releaseButton('stop_autospin_button_container');
	this.releaseButton('spin_button_container');
	this.releaseButton('grouped_button_container');
	this.releaseButton('deno_minus');
	this.releaseButton('deno_plus');
	this.releaseButton('line_minus');
	this.releaseButton('line_plus');
	
	for(var i=0;i<this.configuration.autospin_values.length;i++){
		this.releaseButton('asopt'+i);
	}
}