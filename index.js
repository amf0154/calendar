let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectYear = document.getElementById("year");
let selectMonth = document.getElementById("month");
let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth-1, currentYear);
document.getElementById("closeevent").addEventListener("click", close);

function curMonth(){
   showCalendar(today.getMonth(),today.getFullYear());
}

function upd(y,m){
   showCalendar(m, y);
}

function clAndUpd(y,m){
   setTimeout(function(){
     close();
     upd(y,m);
   }, 2000);
}

function close(){
   document.getElementById("bg_form").style.display = "none";
}

function next() {
   currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
   currentMonth = (currentMonth + 1) % 12;
   showCalendar(currentMonth, currentYear);
}

function previous() {
   currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
   currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
   showCalendar(currentMonth, currentYear);
}
function jump() {
   currentYear = parseInt(selectYear.value);
   currentMonth = parseInt(selectMonth.value);
   showCalendar(currentMonth, currentYear);
}
function searchInStorage(y,m,d){
   let obj = y.toString()+m.toString()+d.toString();
   return (localStorage.getItem(obj))? true : false;
}
function getElementFromStorage(y,m,d){
   let obj = y.toString()+m.toString()+d.toString();
   if (localStorage.getItem(obj)){
      let object = JSON.parse(localStorage.getItem(obj));
      let body =  '<div class="container_form">'+
      '<input disabled value="'+object.event+'" placeholder="Event" value ="hi" id="form_event"><p/>'+
      '<input disabled placeholder="Day,month,year" value="'+object.data+'" id="form_data"><p/>'+
      '<input disabled  placeholder="Names of participants" value="'+object.participants+'" id="form_participants"><p/>'+
      '<textarea name="description" id="form_description" cols="16" rows="4">'+object.description+'</textarea><p/>'+
      '<a href="#" class="linker" id="form_ready" onclick="save('+y+","+m+","+d+')">Ok</a>'+
      '<a href="#" class="linker" onclick="delElFromStorage('+y+","+m+","+d+')" id="form_delete">Delete</a></div>';
      return body;
   }
}

function getActionForm(y,m,d) {
   let obj = y.toString()+m.toString()+d.toString();
   let container = document.getElementById(obj);
   let rect = container.getBoundingClientRect();
   let body = '<div class="container_form"><p/>'+
   '<input type="text" placeholder="Event" id="form_event"><p/>'+
   '<input type="text" placeholder="Day,month,year" id="form_data"><p/>'+
   '<input type="text" placeholder="Names of participants" id="form_participants"><p/>'+
   '<textarea name="description" id="form_description" placeholder="Descriptions" cols="16" rows="4"></textarea><p/>'+
   '<a href="#" class="linker" id="form_ready" onclick="save('+y+","+m+","+d+')">Add</a>'+
   '<a href="#" class="linker" onclick="delElFromStorage('+y+","+m+","+d+')" id="form_delete">Delete</a></div>';
   let bodyForm = (searchInStorage(y,m,d))? getElementFromStorage(y,m,d) : body;
   document.getElementById('body_form').innerHTML = bodyForm;
   document.getElementById("bg_form").style.left  = (rect.left + container.clientWidth + 10)+ "px";
   document.getElementById("bg_form").style.top = (rect.top - container.offsetHeight +10) + "px";
   document.getElementById("bg_form").style.position = "fixed";
   document.getElementById("bg_form").style.display = "block";
}

function getMessageForm(body) {
   document.getElementById('body_form').innerHTML = body;
   document.getElementById("bg_form").style.left  = (window.innerWidth/3)+ "px";
   document.getElementById("bg_form").style.top = (window.innerHeight/4) + "px";
   document.getElementById("bg_form").style.position = "fixed";
   document.getElementById("bg_form").style.display = "block";
}

function save(y,m,d){
   let event = document.getElementById("form_event").value;
   let data = document.getElementById("form_data").value;
   let participants = document.getElementById("form_participants").value;
   let description = document.getElementById("form_description").value;
   let div = document.createElement("div");
   div.className = 'container_form';
   if(event && data && participants && description){
      let info = document.createTextNode('Data has just saved successfully!');
      div.appendChild(info);
      document.getElementById('body_form').innerHTML = "";
      document.getElementById("form").style.height = '65px';
      document.getElementById('body_form').appendChild(div);
      let newEvent = {
	       year: y,
	       month: m,
         day: d,
         event: event,
         data: data,
         participants: participants,
         description: description
      };
   let key = y.toString()+m.toString()+d.toString();
   let value = JSON.stringify(newEvent);
   localStorage.setItem(key, value);
   clAndUpd(y,m);
    }else{
      let info = document.createTextNode('You have to fill up all fields! try again!');
      div.appendChild(info);
      document.getElementById('body_form').innerHTML = "";
      document.getElementById("form").style.height = '65px';
      document.getElementById('body_form').appendChild(div);
      setTimeout(close, 2000);
    }
}

function delElFromStorage(y,m,d){
   let key = y.toString()+m.toString()+d.toString();
   let div = document.createElement("div");
   div.className = 'container_form';
   if(localStorage.getItem(key)){
      localStorage.removeItem(key);
      let info = document.createTextNode('Event has just been removed successfully!');
      div.appendChild(info);
      document.getElementById('body_form').innerHTML = "";
      document.getElementById('body_form').appendChild(div);
      clAndUpd(y,m);
   }else{
      let info = document.createTextNode('Can\'t delete such event. Something has gone wrong!');
      div.appendChild(info);
      document.getElementById('body_form').innerHTML = "";
      document.getElementById("form").style.height = '65px';
      document.getElementById('body_form').appendChild(div);
      clAndUpd(y,m);
   }
}

function searchSavedEvents(y,m,d){
   let key = y.toString()+m.toString()+d.toString();
   if(localStorage.getItem(key)){
      let data = JSON.parse(localStorage.getItem(key));
      return data.event+'! '+ data.description;
   }else{
     return "";
   }
}
function searchInLocalStorageByQuery(){
  let word = document.getElementById('search-bar').value;
  if(word.length!==0){
     let searchedEvents = new Array();
     var seek = new RegExp(word, 'g');
     for (let i=0,len = localStorage.length; i < len; ++i ) {
        let obj = JSON.parse(localStorage.getItem(localStorage.key(i)));
        if( obj.event.match(seek) || obj.data.match(seek) || obj.participants.match(seek) || obj.description.match(seek) ){
        searchedEvents.push(localStorage.key(i));
        }
     }
     let result = (searchedEvents.length > 0) ? searchedEvents : false;
     if(result.length ===1){
        let obj = JSON.parse(localStorage.getItem(result));
        upd(obj.year,obj.month);
        document.getElementById(result).style.background = 'blue';
      }else if(result.length >1){
          let body = '<div class="container_form"><b>We have just find some events.</b><p/>Click one of them for opening:<p/>';
          for (let i=0; i < result.length; ++i ) {
             let data = JSON.parse(localStorage.getItem(result[i]));
             body += '<div class="find_event" onclick="upd('+data.year+','+data.month+')"><b>'+(i+1)+' event: </b>'+      data.event+' ('+data.day+'.'+data.month+'.'+data.year+')<p/></div>';
           }
           body+='</div>';
           getMessageForm(body);
      }else{
         alert('We can\'t found anything with such query!');
      }
   }else{
      alert('You have to input any word in search form!');
   }
}

function showCalendar(month, year) {
   document.getElementById("bg_form").style.display = 'none';
   document.getElementById("bg_form").style.zIndex = "2";
   let firstDay = (new Date(year, month)).getDay();
   let daysInMonth = 32 - new Date(year, month, 32).getDate();
   let daysInPreviousMonth = 32 - new Date(year, month-1, 32).getDate();
   let tbl = document.getElementById("calendar-body"); // body of the calendar
   var daysOfPrevviousMonth = daysInPreviousMonth-firstDay+1;
   tbl.innerHTML = "";
   monthAndYear.innerHTML = months[month] + " " + year;
   selectYear.value = year;
   selectMonth.value = month;
   let date = 1;
   for(let i = 0; i < 5; i++) {
       let row = document.createElement("tr");
       for(let j = 1; j < 8; j++) {
          if(i === 0 && j < firstDay) {
             let cell = document.createElement("td");
             cell.setAttribute("date_id", daysOfPrevviousMonth+j);
             cell.setAttribute("id",  year+''+(month - 1)+''+ cell.getAttribute("date_id"));
             cell.onclick = function() {
               document.getElementById("form").style.height = '275px';
               var get_number_day = cell.getAttribute("date_id");
               getActionForm(year,month-1,get_number_day);
             };
                var get_number_day = cell.getAttribute("date_id");
                var elid = cell.getAttribute("date_id");
                let prevmonth=month - 1;
                let elData = document.createElement('div');
                elData.className = 'eldata';
                let elNote = document.createElement('div');
                elNote.className = 'elnote';
                let note_events = searchSavedEvents(year,prevmonth,elid);
                if(note_events.length>1){
                   cell.classList.add("event_day");
                }
                let cellEllNote = document.createTextNode(note_events);
                elNote.appendChild(cellEllNote);
                let cellText = document.createTextNode(daysOfPrevviousMonth+j);
                elData.appendChild(cellText);
                cell.appendChild(elData);
                cell.classList.add("simple_day");
                cell.appendChild(elNote);
                row.appendChild(cell);
          }else if (date > daysInMonth) {
             break;
          }else{
             let cell = document.createElement("td");
             cell.setAttribute("date_id", date);
             cell.setAttribute("id", year+''+month+''+ cell.getAttribute("date_id"));
             cell.onclick = function() {
                 document.getElementById("form").style.height = '275px';
                 getActionForm(year,month,cell.getAttribute("date_id"));
             };
             let get_number_day = cell.getAttribute("date_id");
             let elData = document.createElement('div');
             elData.className = 'eldata';
             let elNote = document.createElement('div');
             elNote.className = 'elnote';
             let note_events = searchSavedEvents(year,month,get_number_day);
             if(note_events.length>1 && get_number_day !== today.getDate()){
                cell.classList.add("event_day");
              }else{
                cell.classList.add("simple_day");
              }
             let cellEllNote = document.createTextNode(note_events);
             elNote.appendChild(cellEllNote);
             let cellText = document.createTextNode(date);
             if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                  cell.classList.add("current_day");
             }
             elData.appendChild(cellText);
             cell.appendChild(elData);
             cell.appendChild(elNote);
             row.appendChild(cell);
             date++;
            }
        }
        tbl.appendChild(row);
    }
}



