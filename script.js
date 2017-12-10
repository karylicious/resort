$(document).ready(function () {
	//===============INDEX PAGE ELEMENTS========================
	$( "#datepicker" ).datepicker({
		dateFormat: 'yy-mm-dd',
		onSelect: function(dateText ) {
            $( "#dt" ).val(dateText );
        }
	});
	$( "select" ).selectmenu();	
	$( "button" ).button();
	$("#divCheckList").hide();	
	$( "#slider-range" ).slider({
        range: true,
        min: 0,
        max: 3000,
        values: [ 0, 3000 ],
        slide: function( event, ui ) {		  
            $( "#minAmount" ).html("£" + ui.values[ 0 ]);
            $( "#maxAmount" ).html("£" + ui.values[ 1 ]);
            $( "#p" ).val( ui.values[ 0 ]+","+ ui.values[ 1 ]);			
        }
    });
    $( "#minAmount" ).html("£" + $( "#slider-range" ).slider( "values", 0 ));
    $( "#maxAmount" ).html("£" + $( "#slider-range" ).slider( "values", 1 ));
	
	$('.tlt').textillate({  
        loop: true,
        minDisplayTime: 2000,// sets the minimum display time for each text before it is replaced  
        initialDelay: 0,// sets the initial delay before starting the animation//FAZ O ZERO SENTIDO? TENTAR TIRAR
        autoStart: true,
        in: {    
            effect: 'flipInX',// set the effect name    
            delayScale: 1.5,// set the delay factor applied to each consecutive character
            delay: 50,// set the delay between each character
            sync: false,// set to true to animate all the characters at the same time
            shuffle: false,// randomize the character sequence 
            reverse: false// reverse the character sequence 
        },
        out: {
            effect: 'rotateOut',
            delayScale: 1.5,
            delay: 50,
            sync: false,
            shuffle: false,
            reverse: false
        }
	});
	//---------------EVENTS----------------------------
	$( "#comboBoxDesti" ).on( "selectmenuchange", function( event, ui ) {			
        $( "#comboBoxDesti option:selected" ).each(function() {
            $( "#dtn" ).val($( this ).attr("value"));//put the selected option selected's value on input hidden
        });
        
	});
	
	$( "#comboBoxComf" ).on( "selectmenuchange", function( event, ui ) {			
        $( "#comboBoxComf option:selected" ).each(function() {
            $( "#comf" ).val($( this ).attr("value"));//put the selected option selected's value on input hidden
        });
        
	});
	
	
   		
	$( "#btnAct" ).click(function( event ) {
		if($("#checkList").val()=="false"){//increase the divCriteria's height
		     $("#divCheckList").show("slow");
			 $("#checkList").val("true");
			 $("#divCriteria").animate({height:570}, 500);
		}
	    else{ //change the divCriteria's height as normal
			 $("#divCheckList").hide("slow");
			 $("#checkList").val("false");			 
			 $("#divCriteria").animate({height:400}, 500);
		}
        event.preventDefault();
    });
	
	//===============RESORTS PAGE ELEMENTS========================
	$( "#tabs" ).tabs({event: "mouseover"});	
	$('#btnOpen').button({
		icons:{primary: 'ui-icon-carat-1-s'},
	    text:false
    }).click(function() {
        $('#favList').toggle();
    });	
	$('#btnAdd').button({
		icons:{primary: 'ui-icon-plus'},
	    text:false
    }).click(function() {        
        var favResortList = $(".spanFavResortName");
		var alreadyAdded=false;
		if(favResortList.length>0){			
			favResortList.each(function() {	
				if($(this).html()==$("#resortName").html()){
					alreadyAdded=true;				
					return;
				}					
			});				
		}
		if(alreadyAdded==true)
			alert("Resort already added!");
		else
			$('#divListContainer').append('<div style="margin-bottom:10px;"><button class="btnRemove" style="height:20px; width:20px; margin-left:10px;"></button><span class="spanFavResortName">'+$("#resortName").html()+'</span></div>');
		
		$('.btnRemove').button({
		    icons:{primary: 'ui-icon-close'},
	        text:false
        }).click(function() {
            $(this).parent().remove();
        });	
	});
	$('#favList').hide();
	
	//====================GENERAL==============================	
	var fileName = location.href.split("/"); 
	var pageName=fileName[fileName.length-1].split(".")[0];	
	if (pageName=="results"){ 
		$("#formSearch").submit(function() {
			$("[name='idResort']").val(document.getElementsByName("idResort").value);//THIS CHANGE THE INPUT HIDDEN VALUE OF THIS FORM
        });   

		var mydata = JSON.parse(data);
		var arrayParamsNames=getParams(true);//GET PARAMETERS NAMES GIVEN BY URL
		var arrayParamsValues=getParams(false);//GET PARAMETERS VALUES GIVEN BY URL
        var arrayResortList=getResortsByCriteria(arrayParamsNames, arrayParamsValues, mydata);//GET RESORTS ID MATCHED BY PARAMETERS		
		if(arrayResortList.length>0){
			for (var i = 0; i < arrayResortList.length;i++) {	
				for (var index = 0; index < mydata.resort.length;index++){		
					if(arrayResortList[i]==mydata.resort[index].id){//CHECK IF THE RESORT ID IS ON JSON DATA, IF SO, SHOW A NEW DIV ON FORM					
						$("#formSearch").append(
							'<div style="margin: auto;">'
								+'<div style="background-image: url('+"'"+mydata.resort[index].thumbnail+"'"+'); background-size:100% 100%;  position:relative;	background-repeat: no-repeat; float:left; padding:7%;"><span style="color:white; background-color: #B22222; position:absolute; font-weight:bold; top:0; right:0; padding:2px;">£'+mydata.resort[index].price+'</span></div>'
								+'<div style="width:80%; margin-left:17%; padding-top:20px;">'
									+'<span style="font-size:20px; font-weight:bold;">'+mydata.resort[index].location+'</span><br/>'
									+'<span style="font-size:16px; font-weight:bold;">'+mydata.resort[index].name+'</span>'
									+'<p style="padding-bottom:7%;">'
										+mydata.resort[index].short_description+".."
										+'<button id="'+mydata.resort[index].id+'" onclick="document.getElementsByName('+ "'idResort'"+').value='+"'"+mydata.resort[index].id+"'"+';">See More</button>'
									+'</p>'
								+'</div>'
							+'</div><br/>');					
						break;					
					} 			
				} 			
			}
			$("#formSearch").append('<input type="hidden" name="idResort" value="">');
			$('button').addClass("btn").css("border-style", "double");
		}
		if(arrayResortList.length>0){
			$("#pNotFounded").hide();
			if(arrayResortList.length==1){
				$('#main_content').css('height', "100%");
			    $('footer').css('position', "absolute");
			}
		}
		else { 
			$("#formSearch").hide();
			$('#main_content').css('height', "100%");
			$('footer').css('position', "absolute");
		}
	}
	else if (pageName=="resorts"){    
        var parameters = location.search.substring(1).split("&");
        var temp = parameters[0].split("=");
        resortID = unescape(temp[1]);
		var mydata = JSON.parse(data);
		for (var index = 0; index < mydata.resort.length;index++) {			
            if(mydata.resort[index].id==resortID){
				$("h1[id='resortName']").html(mydata.resort[index].name);
				$("#price").html("£"+mydata.resort[index].price);
				$("#resortLoc").html(mydata.resort[index].location);
				$("#startDate").html("<span style='font-weight:bold;'>Start Date: </span>"+$.datepicker.formatDate('dd MM  yy', new  Date(mydata.resort[index].startDate)));
				$("#endDate").html("<span style='font-weight:bold;'>End Date: </span>" +$.datepicker.formatDate('dd MM  yy', new  Date(mydata.resort[index].endDate)));
				$("#shortDescr").html(mydata.resort[index].short_description);
				$("#resTopImg").css('background-image', 'url("' + mydata.resort[index].picture + '")');
				$(".innerRight").css('background-image', 'url("' + mydata.resort[index].thumbnail + '")');
				$("#longDescr").html(mydata.resort[index].long_description);
				var arrayActvJson=mydata.resort[index].activities;
				for (var v=0;v<arrayActvJson.length; v++){
					switch(arrayActvJson[v]){
						case "scuba diving":
						$("#activities").append('<li><img src="./imgs/diving.png" width="40px" height="40px" style="margin-right:10px;">Scuba Diving</li>');
							break;
						case "water skiing":
						$("#activities").append('<li><img src="./imgs/ski.png" width="40px" height="40px" style="margin-right:10px;">Water Skiing</li>');
							break;
						case "sailing":
						$("#activities").append('<li><img src="./imgs/sailing.png" width="40px" height="40px" style="margin-right:10px;">Sailing</li>');
							break;
						case "tennis":
						$("#activities").append('<li><img src="./imgs/tennis.png" width="40px" height="40px" style="margin-right:10px;">Tennis</li>');
							break;
						case "golf":
						$("#activities").append('<li><img src="./imgs/golf.png" width="40px" height="40px" style="margin-right:10px;">Golf</li>');
							break;
						case "hiking":
						$("#activities").append('<li><img src="./imgs/hiking.png" width="40px" height="40px" style="margin-right:10px;">Hiking</li>');
							break;
						case "horse riding":
						$("#activities").append('<li><img src="./imgs/horse.png" width="40px" height="40px" style="margin-right:10px;">Horse Riding</li>');
							break;
						case "spa":
						$("#activities").append('<li><img src="./imgs/spa.png" width="40px" height="40px" style="margin-right:10px;">Spa</li>');
							break;
						case "flying trapeze":
						$("#activities").append('<li><img src="./imgs/trapeze.jpg" width="40px" height="40px" style="margin-right:10px;">Flying Trapeze</li>');
							break;
						case "kids club":
						$("#activities").append('<li><img src="./imgs/kids.png" width="40px" height="40px" style="margin-right:10px;">Kids Club</li>');
							break;
					}	
				}
				break;
			} 			
        }		
	}
	else if (pageName="index"){
		//===============START THE SLIDE SHOW OF CRITERIA===================
		var img_array = [1, 2, 3, 4];
	    var indexI = 1;	
	    setTimeout(function () {
	        var image = $('#divRight');
	        image.css("background-image", 'url("./imgs/thumbs/' + img_array[indexI++] + '.jpg")');
            setTimeout(arguments.callee, 5000);//The 'arguments.callee' property contains the currently executing function
		    if(indexI==img_array.length)indexI=0;
        }, 5000);
		
		clearIndexPageForm();
	}

	$(window).bind('scroll', function() {
	    var navHeight = $( window ).height();
	    if ($(window).scrollTop() > navHeight) {
			$('nav').addClass('fixed');
			$('#arrowBottom').css('position','fixed');
		}
		else {
		    $('nav').removeClass('fixed');
		    $('#arrowBottom').css('position','absolute');
		}
	});
		 
	$( "#arrowTop" ).click(function() {
        $("body").animate({"scrollTop": $(this).offset().top+30}, 2500);
    });
	
	
    //=============================MAIN SLIDE SHOW================================
    var imgTop_array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12,13];
    var indexJ = 0;
    var interval = 9000;
    setTimeout(function () {
        $('#fullPage').animate({
            backgroundColor: 'transparent'
        }, 3000);
        $('body').css('background-image', 'url("./imgs/' + imgTop_array[indexJ++] + '.jpg")');
        $('#fullPage').delay(3000).animate({
            backgroundColor: 'rgb(255,255,255)'
        }, 3000);
        setTimeout(arguments.callee, interval);//The 'arguments.callee' property contains the currently executing function
		if(indexJ==imgTop_array.length)indexJ=0;
    }, 0);
	
	

	//THE FOLLOWING FUNCTION CLEAR ALL INPUTS FORM OF INDEX PAGE BECAUSE WHEN THE USER IS ON RESULTS PAGE AND TRY TO RETURN TO INDEX PAGE BY CLICKING THE
	//BROWSE'S BUTTON, THE INPUTS FORM OF INDEX PAGE ARE FILLED
	
	function clearIndexPageForm() {  
        $(':input', $('#formCriteria')).each(function() {
        var type = this.type;
        var tag = this.tagName.toLowerCase(); // normalize case
        if (type == 'hidden')
            this.value = "none";
        else if (type == 'checkbox')
            this.checked = false;
        });
		$( "#p" ).val("0,3000");//set the default value
		$( "#checkList" ).val("false");//set the default value
		$('select').val('none');
		$("select").selectmenu("refresh");
    }
	
	function getParams(findParamsName){	
	    var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		var arrayParams=[];
		for (var i = 0; i < sURLVariables.length; i++){			    
			var sParameterName = sURLVariables[i].split('=');			
			if(sParameterName[1]!="none"){//ONLY WILL INCLUDE PARAMETERS WITH VALUES DIFERENT FROM DEFAULT VALUES (DEFINED ON INDEX PAGE)	  
				if (findParamsName==true)				
				    arrayParams.push(sParameterName[0]);
				else arrayParams.push(sParameterName[1]);
			} 		
		}
	    return arrayParams;
	}
	
	function getResortsByCriteria(arrayParamsNames, arrayParamsValues, mydata){
		var arrayResort=[];
		var isValid=false;
		for (var index = 0; index < mydata.resort.length; index++){
			var arrayActvJson=mydata.resort[index].activities;			
			for (var i = 0; i < arrayParamsValues.length;i++) {				
				var newParam=splitToString(arrayParamsValues[i]);
				switch(arrayParamsNames[i]){
					case "dt":
						var dateParam = Date.parse(newParam);
						var startDate = Date.parse(mydata.resort[index].startDate);
						var endDate = Date.parse(mydata.resort[index].endDate);
						if((startDate<=dateParam)&& (endDate>=dateParam))
							isValid=true;		
						else
							isValid=false;
						break;
					case "p":
					    var priceRange=newParam.split(",");
						if((mydata.resort[index].price>=priceRange[0])&& (mydata.resort[index].price<=priceRange[1]))
							isValid=true;
						else
							isValid=false;
						break;
					case "dtn":
						if(newParam==mydata.resort[index].destination)
							isValid=true;
						else
							isValid=false;
						break;
					case "comf":	
					    if(newParam==mydata.resort[index].comfortLevel)
							isValid=true;	
						else
							isValid=false;
						break;					
                    default:
					    if(arrayParamsNames[i].indexOf("actv")>-1){	
							for (var v=0;v<arrayActvJson.length; v++){
								if(arrayActvJson[v]==newParam){									
									isValid=true;
									break;
								}									
								else if(v==arrayActvJson.length-1)
									isValid=false;								
							}		
						}
						break;
				}
				if(isValid==false)//IF A RESORT DOES NOT MATCH WITH ONE PARAMETER THEN BREAK "FOR" TO SEE THE NEXT RESORT
				   break;
			}
			
			if(isValid==true){
				arrayResort.push(mydata.resort[index].id);
				isValid=false;
			}
		}
		return arrayResort;
	}
	
	function splitToString(param){//THIS FUNCTION JOIN SPLITTED WORDS
		var strToFind="";
		var isPrice=false;		
		var auxStr=param;
        if(param.indexOf("%2C")>-1){//THIS IS FOR PARAMETER PRICE	
            strToFind="%2C";
			isPrice=true;
		}
		else if (param.indexOf("+")>-1)
			strToFind="+";							
		if((param.indexOf("%2C")>-1) || (param.indexOf("+")>-1))
			auxStr=param.split(strToFind);
		if(typeof auxStr=="string")
			return param;
		else{
			param="";
			var length=0;
			auxStr.forEach(function(item) {	
				length++;
				if(length==auxStr.length)
					param += item;
				else{
					if(isPrice==true)
						param += item +",";
					else param += item +" ";
				}					
			});		
			return param;
		}				
	}	
		
});