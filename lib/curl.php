<?php
	$url			=	$_POST['url'];
	$fields_string	=	'request='.$_POST['request'];
	
	$ch 	= 	curl_init();
	
	curl_setopt($ch,CURLOPT_URL,$url);
	curl_setopt($ch,CURLOPT_POSTFIELDS,$fields_string);
	curl_exec($ch);

	echo $init_response	=	'{"error":0,"game_id":"121","denominations":"10,20,30,40,50","default_denomination":"30","balance":"1008.95","currency":"GBP","total_win_amount":0,"reel":"bacde|abcde|ddabc","is_resume":0,"no_of_lines":"20","min_coins":1,"max_coins":3,"default_coins":3}';
	//echo $play_response	=	'{"error":0,"game_id":"121","denominations":"10,20,30,40,50","default_denomination":"30","balance":"992.75","currency":"GBP","total_win_amount":1.8,"reel":"cccac|cfgdb|ddiab","is_resume":0,"no_of_lines":"20","min_coins":1,"max_coins":3,"default_coins":3,"win_details":[{"win_amount":0.9,"line_number":1,"blink_str":"11100"},{"win_amount":0.9,"line_number":8,"blink_str":"11100"}],"log_id":"283"}';
	//echo $play_response	=	'{"error":0,"game_id":"121","denominations":"10,20,30,40,50","default_denomination":"30","balance":"486.18","currency":"GBP","total_win_amount":0.12,"reel":"badaa|dffff|ddddg","min_coins":1,"max_coins":3,"default_coins":3,"no_of_lines":"20","is_resume":0,"win_details":[{"win_amount":0.06,"line_number":3,"blink_str":"11110"},{"win_amount":0.06,"line_number":9,"blink_str":"11110"}],"log_id":"344","can_gamble":1}';
?>