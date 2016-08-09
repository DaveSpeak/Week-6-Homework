// Base array
var buttons=[
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
	];
var apiKey="dc6zaTOxFJmzC";
var queryBase="https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=10&q=";
var stillhtml=[];
var animatedhtml=[];
var additButtons=0;
var initArrayLength=buttons.length;
console.log(initArrayLength);
initialize();
function initialize(){
	var num=localStorage.getItem('additButtons');
	if (num!=null){
		for (var i=1;i<=num;i++){
			buttons.push({name:localStorage.getItem('storedButton'+i),offset:0});
		}
		additButtons+=num;
	}
	addbuttons();
}
function clearUserEntries(){
		localStorage.clear();
		for (var i=0;i<additButtons;i++){
			buttons.pop();
		}
		initialize();
}
function addbuttons(){
	$('#buttonDiv').empty();
	for (var i=0;i<buttons.length;i++){
		var qButton=$('<button>').addClass('btn, btn-response').attr({'id':'selectButton','arrayplace':i,
			'value':buttons[i].offset,'id':buttons[i].name}).html('<h3>'+buttons[i].name);
		$('#buttonDiv').append(qButton);
		$('#'+buttons[i].name).on('click', queryGiphy);
	}
	$('#addNew').on('click',addNewButton);
	$('#clearUser').on('click',clearUserEntries);
	$('#newTheme').focus();

}
function addNewButton(){
	var newButton=$('#newTheme').val().trim();
	var inotfound=true;
	$('#newTheme').val('');
	newButton=newButton.replace(/ /g,'_');
	for (var i=0;i<buttons.length;i++){
		if (buttons[i].name.toLowerCase()==newButton.toLowerCase()){inotfound=false;}
	}
	if (inotfound && newButton!=''){
		additButtons++;
		buttons.push({name:newButton,offset:0});
		localStorage.setItem('additButtons',additButtons);
		localStorage.setItem('storedButton'+additButtons, newButton);
		addbuttons();
	}
}

function queryGiphy(){
	var queryValue=$(this).attr('id');
	buttons[$(this).attr('arrayplace')].offset++;
	queryValue=queryValue.replace(/_/g,"+");
	queryURL=queryBase+queryValue+'+\"Star+Trek\"+&offset='+($(this).attr('value')*10);
	$.ajax({url: queryURL, method: "GET"}) 
		.done(function(RETURN) {
		$('#displayGif').empty();
		for (var j=0;j<10;j+=3){
			var gifDiv=$('<div>').attr('class','row');
			for (var i=0;i<3;i++){
				if (j+i<10){
					stillhtml[j+i]=RETURN.data[j+i].images.fixed_height_still.url;
					animatedhtml[j+i]=RETURN.data[j+i].images.fixed_height.url;
					gifDiv.append($('<div>').attr({'class':'col-md-4','id':'gifContainer'}).append('<h2>'+"rating: "+RETURN.data[j+i].rating,
					$('<img>').attr({'src':stillhtml[j+i],'state':'still','value':j+i,'class':'gifDisplay'})));
				}
			}
			$('#displayGif').append(gifDiv);
		}
		addbuttons();
		$('.gifDisplay').on('click', animate);
	});
}

function animate(){
	if($(this).attr('state')=='still'){
		$(this).attr({'src':animatedhtml[$(this).attr('value')],'state':'animated'});
	}else{
		$(this).attr({'src':stillhtml[$(this).attr('value')],'state':'still'});
	}

}