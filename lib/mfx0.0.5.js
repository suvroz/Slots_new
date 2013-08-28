/*
* MobileFX library for Mobile Devices and Web Browsers supporting HTML5
* @uses		cssQuery v2.0.2 by Dean Edwards
*/

var MFX	=	MFX || {};

(function(){
	MFX.debug			=	true;
	MFX.setDebug		=	function(state){
		MFX.debug		=	state;
	}
	
	var prefix_list		=	['webkit','Moz','o','ms'],
		prefix			=	'',
		transform_pre	=	'',
		transition_pre	=	'',
		object_list		=	{},									//List of MovableNodes
		touchscreen		=	!!('ontouchstart' in window),
		device			=	'';
	
	(function setPrefix(){
		if(document.body!=undefined){
			for(var i=0;i<prefix_list.length;i++){
				if(prefix_list[i]+'Transform' in document.body.style){
					prefix	=	prefix_list[i];
					transform_pre	=	prefix+'Transform';
					transition_pre	=	prefix+'Transition';
					break;
				}
			}
		}else{
			setTimeout(setPrefix,1);
		}
	})();
	
	MFX.setDevice		=	function(device_name){
		device			=	device_name;
	}
	
	MFX.getDevice		=	function(){
		return device;
	}
	
	MFX.Transformation	=	function(type,args){
		this.type	=	type;
		this.value	=	args;
		this.unit	=	'';
		
		var that	=	this;
		
		var setUnit	=	function(){
			if(that.type=='translate'){
				that.unit	=	'px';
			}else if(that.type=='rotate'){
				that.unit	=	'deg';
			}
		}
		
		this.setValue	=	function(args){
			this.value	=	args;
			setUnit();
		}
		
		setUnit();
	}
	
	/*
	* Movable object for a single css query
	*/
	
	MFX.MovableNode	=	function(node_selector){
		this.node_list			=	cssQuery(node_selector);
		this.transform_stack	=	[];
		
		if(this.node_list.length>0){
			object_list[node_selector]	=	this;
		}else if(MFX.debug){
			console.log("No element found for "+node_selector);
		}
	}
	
	MFX.MovableNode.prototype.applyTransformationStack	=	function(){
		if(prefix!=''){
			var transform_string	=	'';
			for(var i=0;i<this.transform_stack.length;i++){
				var curr_transform	=	this.transform_stack[i];
				
				transform_string+=' '+curr_transform.type+'(';
				for(var j=0;j<curr_transform.value.length;j++){
					transform_string+=curr_transform.value[j]+curr_transform.unit+',';
				}
				transform_string	=	transform_string.substr(0,transform_string.length-1);
				transform_string+=')';
			}
			for(var i=0;i<this.node_list.length;i++){
				this.node_list[i].style[transform_pre]	=	transform_string;
			}
		}else{
			var x	=	0,
				y	=	0;
			for(var i=0;i<this.transform_stack.length;i++){
				var curr_transform	=	this.transform_stack[i];
				if(curr_transform.type=='translate'){
					x	+=	parseInt(curr_transform.value[0]);
					y	+=	parseInt(curr_transform.value[1]);
				}
			}
			for(var i=0;i<this.node_list.length;i++){
				this.node_list[i].style.marginLeft		=	x+'px';
				this.node_list[i].style.marginTop		=	y+'px';
			}
		}
	}
	
	MFX.MovableNode.prototype.transformTo	=	function(trans_type,trans_value){
		var trans_match	=	false;
		if(this.transform_stack.length>0){
			var last_transform	=	this.transform_stack[this.transform_stack.length-1];
			if(last_transform.type==trans_type){
				trans_match	=	true;
				last_transform.setValue(trans_value);
				this.transform_stack[this.transform_stack.length-1]	=	last_transform;
			}
		}
		if(!trans_match){
			this.transform_stack.push(new MFX.Transformation(trans_type,trans_value));
		}
		
		this.applyTransformationStack();
	}
	
	MFX.MovableNode.prototype.transformBy	=	function(trans_type,trans_value,animate){
		var trans_match	=	false;
		if(!animate && this.transform_stack.length>0){
			var last_transform	=	this.transform_stack[this.transform_stack.length-1];
			if(last_transform.type==trans_type){
				trans_match		=	true;
				for(var i=0;i<last_transform.value.length;i++){
					if(trans_type=='scale'){
						last_transform.value[i]	*=	trans_value[i];
					}else{
						last_transform.value[i]	+=	trans_value[i];
					}
				}
				this.transform_stack[this.transform_stack.length-1]	=	last_transform;
			}
		}
		if(!trans_match){
			this.transform_stack.push(new MFX.Transformation(trans_type,trans_value));
		}
		
		this.applyTransformationStack();
	}
	
	MFX.MovableNode.prototype.hide		=	function(){
		for(var i=0;i<this.node_list.length;i++){
			this.node_list[i].style.display	=	"none";
		}
	}
	
	MFX.MovableNode.prototype.show		=	function(){
		for(var i=0;i<this.node_list.length;i++){
			this.node_list[i].style.display	=	"block";
		}
	}
	
	MFX.MovableNode.prototype.moveTo		=	function(x,y){
		x	=	parseInt(x);
		y	=	parseInt(y);
		
		this.transformTo('translate',[x,y]);
	}
	
	MFX.MovableNode.prototype.moveBy		=	function(x,y,animate){
		x	=	parseInt(x);
		y	=	parseInt(y);
		
		this.transformBy('translate',[x,y],animate);
	}
	
	MFX.MovableNode.prototype.rotateTo	=	function(angle){
		angle	=	parseInt(angle);
		
		this.transformTo('rotate',[angle]);
	}
	
	MFX.MovableNode.prototype.rotateBy	=	function(angle,animate){
		angle	=	parseInt(angle);
		
		this.transformBy('rotate',[angle],animate);
	}
	
	MFX.MovableNode.prototype.scaleTo	=	function(scale_x,scale_y){
		scale_x		=	parseFloat(scale_x);
		scale_y		=	parseFloat(scale_y);
		
		this.transformTo('scale',[scale_x,scale_y]);
	}
	
	MFX.MovableNode.prototype.scaleBy	=	function(scale_x,scale_y,animate){
		scale_x		=	parseFloat(scale_x);
		scale_y		=	parseFloat(scale_y);
		
		this.transformBy('scale',[scale_x,scale_y],animate);
	}
	
	MFX.MovableNode.prototype.resetTransforms	=	function(){
		this.transform_stack	=	[];
		this.applyTransformationStack();
	}
	
	MFX.MovableNode.prototype.popTransformStack	=	function(){
		var last_transform	=	this.transform_stack.pop();
		this.applyTransformationStack();
		
		return last_transform;
	}
	
	MFX.MovableNode.prototype.packTransformStack	=	function(index){
		if(index>0){
			index	=	this.transform_stack.length-index;
			if(index>0){
				var curr_transform	=	this.transform_stack[index];
				var prev_transform	=	this.transform_stack[index-1];
				
				if(curr_transform.type==prev_transform.type){
					for(var i=0;i<prev_transform.value.length;i++){
						if(curr_transform.type=='scale'){
							prev_transform.value[i]	*=	curr_transform.value[i];
						}else{
							prev_transform.value[i]	+=	curr_transform.value[i];
						}
					}
					this.transform_stack[index-1]	=	prev_transform;
					
					for(var i=index;i<this.transform_stack.length-1;i++){
						this.transform_stack[i]	=	this.transform_stack[i+1];
					}
					this.transform_stack.pop();
					this.applyTransformationStack();
				}
			}
		}
	}
	
	MFX.MovableNode.prototype.css	=	function(property,value){
		for(var i=0;i<this.node_list.length;i++){
			if(typeof(property) == 'object'){
				for(key in property){
					this.node_list[i].style[key]	=	property[key];
				}
			}else{
				this.node_list[i].style[property]	=	value;
			}
		}
	}
		
	MFX.MovableNode.prototype.append	=	function(content){
		for(var i=0;i<this.node_list.length;i++){
			if(typeof(content)=='object'){
				this.node_list[i].appendChild(content);				
			}else{
				this.node_list[i].innerHTML		+=	content;
			}
		}
	}
	
	MFX.MovableNode.prototype.setContent	=	function(content){
		for(var i=0;i<this.node_list.length;i++){
			this.node_list[i].innerHTML		=	'';
		}
		this.append(content);
	}
	
	MFX.MovableNode.prototype.on			=	function(event_string,handler){
		if(event_string == 'press'){
			if(device == 'rim'){
				for(var i=0;i<this.node_list.length;i++){
					this.node_list[i].ontouchstart		=	handler;
					this.node_list[i].onmousedown		=	handler;
				}
			}else{
				if(touchscreen){
					for(var i=0;i<this.node_list.length;i++){
						this.node_list[i].ontouchstart	=	handler;
					}
				}else{
					for(var i=0;i<this.node_list.length;i++){
						this.node_list[i].onmousedown	=	handler;
					}
				}
			}
		}else if(event_string == 'release'){
			if(device == 'rim'){
				for(var i=0;i<this.node_list.length;i++){
					this.node_list[i].ontouchend		=	handler;
					this.node_list[i].onmouseup			=	handler;
				}
			}else{
				if(touchscreen){
					for(var i=0;i<this.node_list.length;i++){
						this.node_list[i].ontouchend	=	handler;
					}
				}else{
					for(var i=0;i<this.node_list.length;i++){
						this.node_list[i].onmouseup		=	handler;
					}
				}
			}
		}else if(event_string == 'drag'){
			if(device == 'rim'){
				for(var i=0;i<this.node_list.length;i++){
					this.node_list[i].onmousemove		=	handler;
					this.node_list[i].ontouchmove		=	handler;
				}
			}else{
				if(touchscreen){
					for(var i=0;i<this.node_list.length;i++){
						this.node_list[i].ontouchmove	=	handler;
					}
				}else{
					for(var i=0;i<this.node_list.length;i++){
						this.node_list[i].onmousemove	=	handler;
					}
				}
			}
		}else if(event_string == 'click'){
			if(device == 'rim'){
				for(var i=0;i<this.node_list.length;i++){
					this.node_list[i].onclick			=	handler;
				}
			}else{
				if(touchscreen){
					for(var i=0;i<this.node_list.length;i++){
						this.node_list[i].ontouchend	=	handler;
					}
				}else{
					for(var i=0;i<this.node_list.length;i++){
						this.node_list[i].onclick		=	handler;
					}
				}
			}
		}
	}
	
	/*
	* Creates object corresponding to a group of MovableNodes
	*/
	
	MFX.MobileFX	=	function(selector_list){
		this.selector_list	=	selector_list;
		var selector_array	=	this.selector_list.split(',');		
		this.node_group		=	[];
		
		for(var i=0;i<selector_array.length;i++){
			selector_array[i]	=	selector_array[i].trim();
			if(object_list[selector_array[i]]!=undefined){
				this.node_group.push(object_list[selector_array[i]]);
			}else{
				this.node_group.push(new MFX.MovableNode(selector_array[i]));
			}
		}
	}
	
	MFX.MobileFX.prototype.hide		=	function(){
		for(var i=0;i<this.node_group.length;i++){
			this.node_group[i].hide();
		}
		return this;
	}
	
	MFX.MobileFX.prototype.show		=	function(){
		for(var i=0;i<this.node_group.length;i++){
			this.node_group[i].show();
		}
		return this;
	}
	
	MFX.MobileFX.prototype.moveTo		=	function(x,y){
		for(var i=0;i<this.node_group.length;i++){
			this.node_group[i].moveTo(x,y);
		}
		
		return this;
	}
	
	MFX.MobileFX.prototype.moveBy		=	function(x,y,animate){
		if(animate==undefined){
			animate	=	false;
		}
		for(var i=0;i<this.node_group.length;i++){
			this.node_group[i].moveBy(x,y,animate);
		}
		
		return this;
	}
	
	MFX.MobileFX.prototype.rotateTo	=	function(angle){
		for(var i=0;i<this.node_group.length;i++){
			this.node_group[i].rotateTo(angle);
		}
		
		return this;
	}
	
	MFX.MobileFX.prototype.rotateBy	=	function(angle,animate){
		if(animate==undefined){
			animate	=	false;
		}
		for(var i=0;i<this.node_group.length;i++){
			this.node_group[i].rotateBy(angle,animate);
		}
		
		return this;
	}
	
	MFX.MobileFX.prototype.scaleTo	=	function(){
		var scale_x	=	1;
		var scale_y	=	1;
		if(arguments.length==1){
			scale_x=scale_y=parseFloat(arguments[0]);
		}else if(arguments.length==2){
			scale_x	=	parseFloat(arguments[0]);
			scale_y	=	parseFloat(arguments[1]);
		}
		
		for(var i=0;i<this.node_group.length;i++){
			this.node_group[i].scaleTo(scale_x,scale_y);
		}
		
		return this;
	}
	
	MFX.MobileFX.prototype.scaleBy	=	function(){
		var scale_x	=	1;
		var scale_y	=	1;
		var animate	=	false;
		if(arguments.length==1){
			scale_x=scale_y=parseFloat(arguments[0]);
		}else if(arguments.length>=2){
			scale_x	=	parseFloat(arguments[0]);
			scale_y	=	parseFloat(arguments[1]);
		}
		if(arguments.length==3){
			animate	=	arguments[2];
		}
		
		for(var i=0;i<this.node_group.length;i++){
			this.node_group[i].scaleBy(scale_x,scale_y,animate);
		}
		
		return this;
	}
	
	MFX.MobileFX.prototype.resetTransforms	=	function(){
		for(var i=0;i<this.node_group.length;i++){
			this.node_group[i].resetTransforms();
		}
		
		return this;
	}
	
	MFX.MobileFX.prototype.popTransformStack	=	function(){
		for(var i=0;i<this.node_group.length;i++){
			this.node_group[i].popTransformStack();
		}
	}
	
	MFX.MobileFX.prototype.packTransformStack	=	function(index){
		for(var i=0;i<this.node_group.length;i++){
			this.node_group[i].packTransformStack(index);
		}
	}
	
	MFX.MobileFX.prototype.css	=	function(property,value){
		for(var i=0;i<this.node_group.length;i++){
			this.node_group[i].css(property,value);
		}
	}
	
	MFX.MobileFX.prototype.append	=	function(content){
		for(var i=0;i<this.node_group.length;i++){
			this.node_group[i].append(content);
		}
	}
	
	MFX.MobileFX.prototype.setContent	=	function(content){
		for(var i=0;i<this.node_group.length;i++){
			this.node_group[i].setContent(content);
		}
	}
	
	MFX.MobileFX.prototype.animatePosition	=	function(xpos,ypos,duration,next_func,repeat,delay){
		if(xpos!=undefined && ypos!=undefined){
			var anim_args			=	{x:xpos,y:ypos};
			if(repeat!=undefined){
				anim_args.repeat	=	repeat;
			}
			if(delay!=undefined){
				anim_args.delay		=	delay;
			}
			this.animate(anim_args,duration,next_func);
		}
	}
	
	MFX.MobileFX.prototype.animateRotation	=	function(rot_angle,duration,next_func,repeat,delay){
		if(rot_angle!=undefined){
			var anim_args			=	{angle:rot_angle};
			if(repeat!=undefined){
				anim_args.repeat	=	repeat;
			}
			if(delay!=undefined){
				anim_args.delay		=	delay;
			}
			this.animate(anim_args,duration,next_func);
		}
	}
	
	MFX.MobileFX.prototype.animateScale		=	function(x,y,duration,next_func,repeat,delay){
		if(x!=undefined){
			var anim_args			=	{scalex:x,scaley:x};
			if(y!=undefined){
				anim_args.scaley	=	y;
			}
			if(repeat!=undefined){
				anim_args.repeat	=	repeat;
			}
			if(delay!=undefined){
				anim_args.delay		=	delay;
			}
			this.animate(anim_args,duration,next_func);
		}
	}
	
	MFX.MobileFX.prototype.animateBackground	=	function(x_offset,y_offset,x,y,x_gap,duration,next_func,repeat){
		var anim_args	=	{bgposx:x, bgposy:y, bgposx_offset:x_offset, bgposy_offset:y_offset};
		if(duration==undefined){
			duration	=	MFX.AnimationManager.default_duration;
		}
		
		if(x_gap!=undefined && x_gap!=0 && (x!=0 || y!=0)){
			var dist	=	(x!=0)?x:y;
			var delay	=	Math.abs(parseInt(duration/(dist/x_gap)));
			if(delay%10!=0){
				delay	=	10*Math.floor(delay/10);
			}
			anim_args.delay	=	delay;
		}
		if(repeat!=undefined){
			anim_args.repeat	=	repeat;
		}
		
		this.animate(anim_args,duration,next_func);
	}
	
	MFX.MobileFX.prototype.animateOpacity		=	function(opacity,duration,next_func,repeat,delay){
		if(opacity!=undefined){
			var anim_args			=	{opacity:opacity};
			if(repeat!=undefined){
				anim_args.repeat	=	repeat;
			}
			if(delay!=undefined){
				anim_args.delay		=	delay;
			}
			this.animate(anim_args,duration,next_func);
		}
	}
	
	/*
	* anim_args	 		:	x,y,angle,scale,scalex,scaley,bgposx,bgposy,bgposx_offset,bgposy_offset,repeat,delay
	*/
	MFX.MobileFX.prototype.animate		=	function(anim_args,duration,next_func){
		MFX.AnimationManager.animate(this.selector_list,new MFX.AnimatedObject(this,anim_args,duration,next_func));
	}
	
	MFX.MobileFX.prototype.stop			=	function(){
		MFX.AnimationManager.stopAnimation(this.selector_list);
	}
	
	MFX.MobileFX.prototype.on			=	function(event_string,handler){
		for(var i=0;i<this.node_group.length;i++){
			this.node_group[i].on(event_string,handler);
		}
	}
	
	MFX.AnimatedObject	=	function(element,anim_args,duration,next_func){
		this.element	=	element;
		this.anim_args	=	anim_args;
		this.repeat		=	false;
		this.duration	=	MFX.AnimationManager.default_duration;
		this.delay		=	MFX.AnimationManager.default_delay;
		if(duration!=undefined){
			this.duration	=	parseInt(duration);
		}
		if(next_func!=undefined){
			this.next_func	=	next_func;
		}
		if('repeat' in anim_args){
			this.repeat		=	anim_args['repeat'];
		}
		if('delay' in anim_args){
			this.delay		=	anim_args['delay'];
		}
		if(this.delay>this.duration){
			this.delay		=	this.duration;
		}
		this.steps			=	parseInt(this.duration/this.delay);
		this.loop_gap		=	1;
		this.counter		=	0;
		this.props_inc		=	{};
	}
	
	MFX.AnimationManager	=	{
		targets				:	{},
		target_count		:	0,
		default_duration	:	1000,
		default_delay		:	20,
		delay				:	20,				//Default 50 fps
		loop_counter		:	0,
		running				:	false,
		
		animate				:	function(obj_key,anim_obj){
			if(!(obj_key in MFX.AnimationManager.targets)){
				MFX.AnimationManager.targets[obj_key]	=	anim_obj;
				if(MFX.AnimationManager.target_count==0){						//First object
					MFX.AnimationManager.delay			=	anim_obj.delay;
				}else{
					MFX.AnimationManager.delay			=	getGCD(MFX.AnimationManager.delay,anim_obj.delay);
					for(key in MFX.AnimationManager.targets){
						var curr_obj		=	MFX.AnimationManager.targets[key];
						curr_obj.loop_gap	=	curr_obj.delay/MFX.AnimationManager.delay;
					}
				}
				
				MFX.AnimationManager.target_count++;
				for(key in anim_obj.anim_args){
					if(typeof(anim_obj.anim_args[key])=='number'){
						if(key=='x' || key=='y'){
							if(anim_obj.props_inc['translate']==undefined){
								anim_obj.props_inc['translate']	=	[0,0];
							}
							if(key=='x'){
								anim_obj.props_inc['translate'][0]		=	parseFloat(anim_obj.anim_args[key])/anim_obj.steps;
							}else{
								anim_obj.props_inc['translate'][1]		=	parseFloat(anim_obj.anim_args[key])/anim_obj.steps;
							}
						}else if(key=='angle'){
							anim_obj.props_inc['rotate']				=	[parseFloat(anim_obj.anim_args[key])/anim_obj.steps];
						}else if(key=='scale' || key=='scalex' || key=='scaley'){
							if(anim_obj.props_inc['scale']==undefined){
								anim_obj.props_inc['scale']				=	[1/anim_obj.steps,1/anim_obj.steps];
							}
							if(key=='scale'){
								anim_obj.props_inc['scale']				=	[(anim_obj.anim_args[key]-1)/anim_obj.steps,(anim_obj.anim_args[key]-1)/anim_obj.steps];
							}else if(key=='scalex'){
								anim_obj.props_inc['scale'][0]			=	parseFloat((anim_obj.anim_args[key])-1)/anim_obj.steps;
							}else if(key=='scaley'){
								anim_obj.props_inc['scale'][1]			=	parseFloat((anim_obj.anim_args[key])-1)/anim_obj.steps;
							}
						}else if(key=='bgposx' || key=='bgposy' || key=='bgposx_offset' || key=='bgposy_offset'){
							if(anim_obj.props_inc['bgpos']==undefined){
								anim_obj.props_inc['bgpos']				=	[0,0];
							}
							if(anim_obj.props_inc['bgpos_offset']==undefined){
								anim_obj.props_inc['bgpos_offset']		=	[0,0];
							}
							if(key=='bgposx'){
								anim_obj.props_inc['bgpos'][0]			=	parseFloat(anim_obj.anim_args[key])/anim_obj.steps;
							}else if(key=='bgposy'){
								anim_obj.props_inc['bgpos'][1]			=	parseFloat(anim_obj.anim_args[key])/anim_obj.steps;
							}else if(key=='bgposx_offset'){
								anim_obj.props_inc['bgpos_offset'][0]	=	parseInt(anim_obj.anim_args[key]);
							}else if(key=='bgposy_offset'){
								anim_obj.props_inc['bgpos_offset'][1]	=	parseInt(anim_obj.anim_args[key]);
							}
						}else if(key=='opacity'){
							var init_op	=	getComputedStyle(anim_obj.element.node_group[0].node_list[0]).getPropertyValue('opacity');
							if(init_op==undefined){
								init_op	=	1;
							}
							anim_obj.props_inc['init_opacity']			=	init_op;
							anim_obj.props_inc['opacity']				=	parseFloat((anim_obj.anim_args[key])-init_op)/anim_obj.steps;
						}
					}
				}
				
				if(!MFX.AnimationManager.running){
					MFX.AnimationManager.running		=	true;
					MFX.AnimationManager.loop_counter	=	0;
					MFX.AnimationManager.runAnimation();
				}
			}
		},
		
		runAnimation		:	function(){
			if(MFX.AnimationManager.target_count>0){
				for(obj_key in MFX.AnimationManager.targets){
					var anim_obj		=	MFX.AnimationManager.targets[obj_key];
					
					if(MFX.AnimationManager.loop_counter % anim_obj.loop_gap == 0){
						var prop_count	=	0;
						if(anim_obj.counter>0){
							for(key in anim_obj.props_inc){
								if(key=='translate' || key=='rotate' || key=='scale'){
									anim_obj.element.popTransformStack();
									prop_count++;
								}
							}
						}
						
						for(key in anim_obj.props_inc){
							if(key=='translate'){
								var trans_x		=	anim_obj.props_inc[key][0]*anim_obj.counter;
								var trans_y		=	anim_obj.props_inc[key][1]*anim_obj.counter;
								anim_obj.element.moveBy(trans_x,trans_y,true);
							}else if(key=='rotate'){
								var angle		=	anim_obj.props_inc[key][0]*anim_obj.counter;
								anim_obj.element.rotateBy(angle,true);
							}else if(key=='scale'){
								var scale_x		=	1+parseFloat(anim_obj.props_inc[key][0])*anim_obj.counter;
								var scale_y		=	1+parseFloat(anim_obj.props_inc[key][1])*anim_obj.counter;
								anim_obj.element.scaleBy(scale_x,scale_y,true);
							}else if(key=='bgpos'){
								var bgpos_x		=	parseInt(anim_obj.props_inc['bgpos_offset'][0]+anim_obj.props_inc[key][0]*anim_obj.counter);
								var bgpos_y		=	parseInt(anim_obj.props_inc['bgpos_offset'][1]+anim_obj.props_inc[key][1]*anim_obj.counter);
								anim_obj.element.css('backgroundPosition',bgpos_x+'px '+bgpos_y+'px');
							}else if(key=='opacity'){
								var op			=	parseFloat(anim_obj.props_inc['init_opacity'])+parseFloat(anim_obj.props_inc[key])*anim_obj.counter;
								anim_obj.element.css('opacity',op);
								anim_obj.element.css('filter','alpha(opacity='+(op*100)+')');
							}
						}
						anim_obj.counter++;
						if(anim_obj.counter==anim_obj.steps){
							if(anim_obj.repeat){
								anim_obj.counter	=	0;
							}else{
								anim_obj.element.packTransformStack(prop_count);
								delete MFX.AnimationManager.targets[obj_key];
								MFX.AnimationManager.target_count--;
								if(anim_obj.next_func!=undefined){
									anim_obj.next_func();
								}							
							}
						}
					}
				}
				MFX.AnimationManager.loop_counter++;
				setTimeout(MFX.AnimationManager.runAnimation,MFX.AnimationManager.delay);
			}else{
				MFX.AnimationManager.stopAllAnimations();
			}
		},
		
		resetParameters		:	function(){
			MFX.AnimationManager.delay			=	MFX.AnimationManager.default_delay;
			MFX.AnimationManager.loop_counter	=	0;
		},
		
		stopAnimation		:	function(obj_key){
			if(obj_key in MFX.AnimationManager.targets){
				delete MFX.AnimationManager.targets[obj_key];
				MFX.AnimationManager.target_count--;
			}
			if(MFX.AnimationManager.target_count==0){
				MFX.AnimationManager.stopAllAnimations();
			}
		},
		
		stopAllAnimations	:	function(){
			MFX.AnimationManager.targets		=	{};
			MFX.AnimationManager.target_count	=	0;
			MFX.AnimationManager.running		=	false;
			MFX.AnimationManager.resetParameters();
		}
	}
	
	function getGCD(x,y) {
		var w;
		while (y != 0) {
			w = x % y;
			x = y;
			y = w;
		}
		
		return x;
	}
	
	function getLCM(x,y) {
		var gcd = getGCD(x,y);
		var lcm = (x*y)/gcd;
		
		return lcm;
	}
	
	if(!String.prototype.trim) {  
		String.prototype.trim = function () {  
			return this.replace(/^\s+|\s+$/g,'');  
		};  
	}
	
	if (!window.getComputedStyle) {
		window.getComputedStyle = function(el, pseudo) {
			this.el = el;
			this.getPropertyValue = function(prop) {
				var re = /(\-([a-z]){1})/g;
				if (prop == 'float') prop = 'styleFloat';
				if (re.test(prop)) {
					prop = prop.replace(re, function () {
						return arguments[2].toUpperCase();
					});
				}
				return el.currentStyle[prop] ? el.currentStyle[prop] : null;
			}
			return this;
		}
	}
	
	window.mfx	=	function(selector_list){
		return new MFX.MobileFX(selector_list);
	}
}());