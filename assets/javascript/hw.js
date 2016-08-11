// Base array
var queryGIFs={buttons:[
	{name:"tos",offset:0},
	{name:"tng",offset:0},
	{name:"ds9",offset:0},
	{name:"voyager",offset:0},
	{name:"enterprise",offset:0},
	{name:"kirk",offset:0},
	{name:"spock",offset:0},
	{name:"mccoy",offset:0},
	{name:"piccard",offset:0},
	{name:"riker",offset:0},
	{name:"crusher",offset:0},
	{name:"sisko",offset:0},
	{name:"janeway",offset:0},
	{name:"archer",offset:0},
	{name:"klingon",offset:0},
	{name:"romulan",offset:0},
	{name:"starship",offset:0}
	],
	queryBase:"https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=10&q=",
	stillhtml:[],
	animatedhtml:[],
	additButtons:0,
	initialize:function(){
		var num=localStorage.getItem('additButtons');
		if (num!=null){
			for (var i=1;i<=num;i++){
				queryGIFs.buttons.push({name:localStorage.getItem('storedButton'+i),offset:0});
			}
			queryGIFs.additButtons+=num;
		}
		queryGIFs.addbuttons();
	},
	clearUserEntries:function (){
		localStorage.clear();
		for (var i=0;i<queryGIFs.additButtons;i++){
			queryGIFs.buttons.pop();
		}
		queryGIFs.initialize();
	},
	addbuttons:function(){
		$('#buttonDiv').empty();
		for (var i=0;i<queryGIFs.buttons.length;i++){
			var qButton=$('<button>').addClass('btn, btn-response').attr({'id':'selectButton','arrayplace':i,
				'value':queryGIFs.buttons[i].offset,'id':queryGIFs.buttons[i].name}).html('<h3>'+queryGIFs.buttons[i].name);
			$('#buttonDiv').append(qButton);
			$('#'+queryGIFs.buttons[i].name).on('click', queryGIFs.queryGiphy);
		}
		$('#addNew').on('click',queryGIFs.addNewButton);
		$('#clearUser').on('click',queryGIFs.clearUserEntries);
		$('#newTheme').focus();
	},
	addNewButton:function(){
		var newButton=$('#newTheme').val().trim();
		var inotfound=true;
		$('#newTheme').val('');
		// I know this is not a very efficient way to do this, but couldn't figure out
		// how to use the RegExp constructor in time...
		// At least it works!!!
		newButton=newButton.replace(/\*/g,'');
		newButton=newButton.replace(/'/g,'');
		newButton=newButton.replace(/ /g,'_');
		newButton=newButton.replace(/"/g,'');
		newButton=newButton.replace(/!/g,'');
		newButton=newButton.replace(/@/g,'');
		newButton=newButton.replace(/#/g,'');
		newButton=newButton.replace(/\$/g,'');
		newButton=newButton.replace(/%/g,'');
		newButton=newButton.replace(/\^/g,'');
		newButton=newButton.replace(/&/g,'');
		newButton=newButton.replace(/\(/g,'');
		newButton=newButton.replace(/\)/g,'');
		newButton=newButton.replace(/\+/g,'');
		newButton=newButton.replace(/=/g,'');
		newButton=newButton.replace(/:/g,'');
		newButton=newButton.replace(/;/g,'');
		newButton=newButton.replace(/,/g,'');
		newButton=newButton.replace(/\./g,'');
		newButton=newButton.replace(/\//g,'');
		newButton=newButton.replace(/</g,'');
		newButton=newButton.replace(/>/g,'');
		newButton=newButton.replace(/\?/g,'');
		newButton=newButton.replace(/~/g,'');
		newButton=newButton.replace(/`/g,'');
		for (var i=0;i<queryGIFs.buttons.length;i++){
			if (queryGIFs.buttons[i].name.toLowerCase()==newButton.toLowerCase()){inotfound=false;}
		}
		if (inotfound && newButton!=''){
			queryGIFs.additButtons++;
			queryGIFs.buttons.push({name:newButton,offset:0});
			localStorage.setItem('additButtons',queryGIFs.additButtons);
			localStorage.setItem('storedButton'+queryGIFs.additButtons, newButton);
			queryGIFs.addbuttons();
		}
	},
	queryGiphy:function(){
		var queryValue=$(this).attr('id');
		queryGIFs.buttons[$(this).attr('arrayplace')].offset++;
		queryValue=queryValue.trim().replace(/_/g,"+");
		queryURL=queryGIFs.queryBase+queryValue+'+\"Star+Trek\"+&offset='+($(this).attr('value')*10);
		$.ajax({url: queryURL, method: "GET"}) 
			.done(function(RETURN) {
			$('#displayGif').empty();
			for (var j=0;j<10;j+=3){
				var gifDiv=$('<div>').attr('class','row');
				for (var i=0;i<3;i++){
					if (j+i<10){
						queryGIFs.stillhtml[j+i]=RETURN.data[j+i].images.fixed_height_still.url;
						queryGIFs.animatedhtml[j+i]=RETURN.data[j+i].images.fixed_height.url;
						gifDiv.append($('<div>').attr({'class':'col-md-4','id':'gifContainer'}).append('<h2>'+"rating: "+RETURN.data[j+i].rating,
						$('<img>').attr({'src':queryGIFs.stillhtml[j+i],'state':'still','value':j+i,'class':'gifDisplay'})));
					}
				}
				$('#displayGif').append(gifDiv);
			}
			queryGIFs.addbuttons();
			$('.gifDisplay').on('click', queryGIFs.animate);
		});
	},
	animate:function(){
		if($(this).attr('state')=='still'){
			$(this).attr({'src':queryGIFs.animatedhtml[$(this).attr('value')],'state':'animated'});
		}else{
			$(this).attr({'src':queryGIFs.stillhtml[$(this).attr('value')],'state':'still'});
		}
	}
}

$(document).ready(function(){
	// localStorage.clear();	
	queryGIFs.initialize();
});
