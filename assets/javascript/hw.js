// Base array
var buttons=[
	{name:"TOS",offset:0},
	{name:"TNG",offset:0},
	{name:"DS9",offset:0},
	{name:"Voyager",offset:0},
	{name:"Enterprise",offset:0},
	{name:"Kirk",offset:0},
	{name:"Spock",offset:0},
	{name:"McCoy",offset:0},
	{name:"Piccard",offset:0},
	{name:"Riker",offset:0},
	{name:"Crusher",offset:0},
	{name:"Sisko",offset:0},
	{name:"Janeway",offset:0},
	{name:"Archer",offset:0},
	{name:"Klingon",offset:0},
	{name:"Romulan",offset:0},
	{name:"Starship",offset:0}
	];
var apiKey="dc6zaTOxFJmzC";
var queryBase="https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=10&q=";
var stillhtml=[];
var animatedhtml=[];
var additButtons=0;
initialize();
function initialize(){
	// localStorage.clear();
	var num=localStorage.getItem('additButtons');
	if (num!=null){
		for (var i=1;i<=num;i++){
			buttons.push({name:localStorage.getItem('storedButton'+i),offset:0});
		}
		additButtons+=num;
	}

	addbuttons();
}
function addbuttons(){
	$('#buttonDiv').empty();
	for (var i=0;i<buttons.length;i++){
		var qButton=$('<button>').addClass('btn, btn-response').attr({'id':'selectButton','arrayplace':i,
			'value':buttons[i].offset,'id':buttons[i].name}).html('<h4>'+buttons[i].name);
		$('#buttonDiv').append(qButton);
		$('#'+buttons[i].name).on('click', queryGiphy);
	}
}
$('#addNew').on('click',function(){
	var newButton=$('#newTheme').val().trim();
	var inotfound=true;
	$('#newTheme').val('');
	newButton=newButton.replace(/ /g,'_');
	for (var i=0;i<buttons.length;i++){
		if (buttons[i].name==newButton){inotfound=false;}
	}
	if (inotfound){
	additButtons++;
	buttons.push({name:newButton,offset:0});
	localStorage.setItem('additButtons',additButtons);
	localStorage.setItem('storedButton'+additButtons, newButton);
	addbuttons();

}
});

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
					gifDiv.append($('<div>').attr({'class':'col-md-4','id':'gifContainer'}).append('<h3>'+"Rating: "+RETURN.data[j+i].rating,
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