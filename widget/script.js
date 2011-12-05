// Constants
var DEFAULT_START_DATE = new Date().format("dd/mm/yyyy");
var ONE_DAY = 1000*60*60*24;
var DEFAULT_DEADLINE = new Date(new Date().getTime()+(ONE_DAY*7)).format("dd/mm/yyyy");
var DEFAULT_WORD_COUNT = 10000;

// Variables
var debug_mode = false;
var target_word_count = DEFAULT_WORD_COUNT;
var start_date = DEFAULT_START_DATE;
var deadline =  DEFAULT_DEADLINE;
var words_to_date = 0;
var writing_history = new Array();


//icons
var ANGRY_ICON = "images/face_angry.png";
var CRY_ICON = "images/face_cry.png";
var SMILE_ICON = "images/face_smile.png";
var COOL_ICON = "images/face_cool.png";
var HAPPY_ICON = "images/face_happy.png";
var START_ICON = "images/face_start.png";
var INNOCENT_ICON = "images/face_innocent.png";
var DESPAIR_ICON = "images/face_upset.png";


function thesis_init(){
    loadDataOnStart();
    jQuery("#word_count").val(target_word_count);
    jQuery("#start_date").val(start_date);
    jQuery("#deadline").val(deadline);
    jQuery("#deadline" ).datepicker();
    jQuery("#start_date" ).datepicker();
	jQuery("#write_words_btn").click(function(event){
		write();
	});
}

function onDataLoaded(){
    generateMessage();
    drawVisualization();
}

function generateMessage(){
    var message = "Keep going! " + (target_word_count - words_to_date) + " words to go.";
    var icon = COOL_ICON;
    
	if(deadline == "" || start_date == null || target_word_count == 0){
		message = "Please, set your goals in the Settings menu (in the upper right corner)!"
		icon = INNOCENT_ICON;
	}
	else {
        //
        // Convert date strings to dates
        //
    	var temp = start_date.split("/");
	    var start = new Date(temp[2], parseInt(temp[1]) - 1, temp[0]);
	    temp = deadline.split("/");
	    var end = new Date(temp[2], parseInt(temp[1]) - 1, temp[0]);  
		
		if(writing_history != null && writing_history.length > 0){
            
            //
            // "today" is last entry in writing history
            //
			var today = new Date(writing_history[writing_history.length -1][0]);

			if(end != "" && end != null){
                //
				//Calculate difference btw the two dates, and convert to days
                //
				var nb_days_to_go = Math.ceil((end.getTime()-today.getTime())/(ONE_DAY));
				var total_days = Math.ceil((end.getTime()-start.getTime())/(ONE_DAY));

				var time_progress = ((total_days - nb_days_to_go) / total_days);
				var words_left = (target_word_count - parseInt(words_to_date));
				var word_progress = parseInt(words_to_date) / target_word_count;

			    // Zero
			    if (parseInt(words_to_date) == 0){
			      	message = "Get started!";
					icon = START_ICON;
			    }
				//TODO if you have 0 words written but time is running up.
				if(time_progress >= 0.5 && parseInt(words_to_date) == 0)
				{
					message = "Move your ass! Time is running up! Get writing NOW!";
					icon = CRY_ICON;
				}
				// Off target
		    	else if((time_progress - word_progress) <= 0.2){
					message = "Almost back on track! Don't despair!";
					icon = DESPAIR_ICON;
				}
				else if(word_progress < time_progress){
					message = "Write faster! Hurry up!";
					icon = ANGRY_ICON;
				}

			    // Nearly there!
			    if (words_left <= 1500){
			    	message = "Nearly there now! Only " + (target_word_count - parseInt(words_to_date)) + " words to go.";
					icon = SMILE_ICON;
			    }
				// On target
				else if(word_progress >= time_progress){
					message = "You are on track! Keep going!";
					icon = SMILE_ICON;
				}

			    // Done
			    if (parseInt(words_to_date) >= parseInt(target_word_count)){
			        message = "You did it!";
					icon = HAPPY_ICON;
			    }
	    	}
		}	
		else if (parseInt(words_to_date) == 0){
	     	message = "Get started!";
			icon = START_ICON;
		}
	}
    jQuery("#message").html(message);
	jQuery("#message").prepend(jQuery("<img>").attr("src", icon).css({'width': '35px', 'height': '35px', 'vertical-align': 'middle', 'padding-right': '5px'}));
}

//
// Save app settings
//
function saveSettings(){
    target_word_count = parseInt(jQuery("#word_count").val());
    start_date = jQuery("#start_date").val();
    deadline = jQuery("#deadline").val();
    refreshWidget()
}

//
// Add a writing event to the history
//
function write(){
    var words = parseInt(jQuery("#words").val());
    if (isNaN(words)) words = 0;
    words_to_date = parseInt(words_to_date) + words;
    
    
    //
    // If in debug mode, increments day by one for each history element, otherwise
    // use now 
    //
    var now = new Date();
    if (debug_mode) now = new Date(now.getTime()+(ONE_DAY*writing_history.length));
    
    //
    // See if we need to merge with previous entry - if the new set of words have the
    // same day as the previous set in the history, we sum them and update; otherwise we
    // push the entry onto the array
    //
    if (writing_history.length > 0){
     var previous_date = new Date(writing_history[writing_history.length-1][0]);
     var previous_words = writing_history[writing_history.length-1][1];
     if (previous_date.getDay() === now.getDay() && previous_date.getMonth() === now.getMonth() && previous_date.getYear() === now.getYear()){
        writing_history[writing_history.length-1] = [previous_date.getTime(), parseInt(previous_words) + parseInt(words) ];
     } else {
        writing_history.push([now.getTime(),words]);     
     }
    } else {
        writing_history.push([now.getTime(),words]);       
    }
    
    refreshWidget()
}

function loadDataOnStart(){
  if (typeof(localStorage) == "undefined" ) {
     alert("Your browser does not support HTML5 localStorage. Try upgrading.");
  } else {
     try {
        target_word_count = localStorage.getItem("target_word_count");
        start_date = localStorage.getItem("start_date"); 
        deadline = localStorage.getItem("deadline");
        words_to_date = localStorage.getItem("words_to_date");
        writing_history = localStorage.getItem("writing_history");
        
        if(typeof target_word_count === "undefined" || target_word_count === null){ target_word_count = DEFAULT_WORD_COUNT;}
        if(typeof start_date === "undefined" || start_date === null){ start_date = DEFAULT_START_DATE;}
        if(typeof deadline === "undefined" || deadline === null){ deadline = DEFAULT_DEADLINE;}
        if(typeof words_to_date === "undefined" || words_to_date === null){ words_to_date = 0;}
        if(typeof writing_history === "undefined" || writing_history === null) {
            writing_history = new Array();
        } else {
            writing_history = JSON.parse(writing_history);
        }
     } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) {
          alert("Quota exceeded!"); //data wasn’t successfully saved due to quota exceed so throw an error
        }
     }
  }
  onDataLoaded();
}

function persistData(){
  if (typeof(localStorage) == "undefined") {
     alert("Your browser does not support HTML5 localStorage. Try upgrading.");
  } else {
     try {
        localStorage.setItem("target_word_count", target_word_count);
        localStorage.setItem("start_date", start_date); 
        localStorage.setItem("deadline", deadline); 
        localStorage.setItem("words_to_date", words_to_date);
        localStorage.setItem("writing_history", JSON.stringify(writing_history));
     } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) {
          alert("Quota exceeded!"); //data wasn’t successfully saved due to quota exceed so throw an error
        }
     }
  }
}

//
// Reset to default values and clear history
//
function reset(){
    words_to_date = 0;
    start_date = DEFAULT_START_DATE;
    deadline = DEFAULT_DEADLINE;
    target_word_count = DEFAULT_WORD_COUNT;
    writing_history = new Array();
    refreshWidget()
}

//
// Refresh widget - save data, generate the message and redraw graph
//
function refreshWidget(){
    persistData();
    generateMessage();
    drawVisualization();
}