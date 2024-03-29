function drawVisualization() {

  //
  // Create Date objects
  //
  var temp = start_date.split("/");
  var sdate = new Date(temp[2], temp[1]-1, temp[0]);
  temp = deadline.split("/");
  var ddate = new Date(temp[2], temp[1]-1, temp[0]);  


  if (ddate.getTime() <= sdate.getTime()) {
  	alert("End date cannot be set to a date before the start!");
  	return;
  }
  var days_ = Math.floor((ddate.getTime() - sdate.getTime())/(ONE_DAY));
  var optpages = Math.round(target_word_count / days_);

  var day_obj = new Object();
  for (var i=0; i<(writing_history.length/2); i++) {
    var tmp_date = new Date(writing_history[(2*i)]);
    var tmp_id = tmp_date.getDate() + "-" + (tmp_date.getMonth()+1) + "-" + tmp_date.getFullYear();
  	if (typeof day_obj[tmp_id] == "undefined") day_obj[tmp_id] = writing_history[(2*i+1)];
  	else day_obj[tmp_id] += writing_history[(2*i+1)];
  }

  var d1 = [];
  var d2 = [];
  var lab = {};
  for (var i = 0; i < days_+1; i++) {
  	    d1[i] = (i) * optpages;
		lab[i] = i;
  }
  
  //
  // Setup data array and cumulative word count
  //
  var cumulative = 0;
  var data = new Array();
  //var projected = new Array();
  
  //
  // Iterate over each day in the series and add points
  //
  for(day=0;day<=days_;day++){
  
    //
    // The Date for this data item
    //
    var timeline_event = new Date(sdate.getTime()+(day*ONE_DAY));
    
    //
    // If an entry in writing history matches the Date of this data item, add its words to the total
    //
    for(i=0;i<writing_history.length;i++){
      var writing_event = new Date(writing_history[i][0]);
      if (writing_event.format("dd/mm/yyyy")===timeline_event.format("dd/mm/yyyy")) {
        cumulative = cumulative + writing_history[i][1];    
      }
    }   
    
    //
    // Add a data point. We don't add a data point for days in the future though
    //
    var days_from_now = Math.ceil( ( timeline_event.getTime() - new Date().getTime() )/(ONE_DAY));
    
    if (days_from_now < 1){
      data.push(cumulative);  
      //projected.push(cumulative);
    } else {
      //projected.push(cumulative);
    }

  }
  

  

  var g = new Bluff.Line('bluff_elem', '400x300');
  g.title = ' ';
  g.tooltips = true;
  g.theme_odeo();
  g.replace_colors(["#202020","white","#a21764","#8ab438","#999999","#3a5b87","black"]);
  g.data("Target", d1);
  g.data("Progress", data);
  //g.data("Projection", projected);
  g.labels = lab;
  g.draw();

}
