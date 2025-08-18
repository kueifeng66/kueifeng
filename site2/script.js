setInterval(setClock, 1)
setInterval(updateClock, 1)


const hourhand = document.querySelector('[hour-hand]')
const minhand = document.querySelector('[min-hand]')
const sechand = document.querySelector('[sec-hand]')


function setClock() {
    const currentTime = new Date()
    const secRatio_real = currentTime.getTime()/60000 /*it will retrieve time in ms */
    const secRatio = currentTime.getSeconds()/60
    const minRatio = (secRatio + currentTime.getMinutes())/60
    const hourRatio = (minRatio + currentTime.getHours())/12
    const sec = currentTime.getSeconds()
    const min = currentTime.getMinutes()
    const hour = currentTime.getHours()
    
    
    setRotation(sechand, secRatio_real)
    setRotation(minhand, minRatio)
    setRotation(hourhand, hourRatio)
	
}

function setRotation(element, rotationRatio) {
    element.style.setProperty('--rotation', rotationRatio * 360)
}

function updateClock() {
      var now = new Date();
	  var year = now.getFullYear();
      var month = (now.getMonth() + 1); // Months are zero-based
      var day = now.getDate();
	  var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
	  var dateString = year + "-" + month + "-" + day + "<br>";
	  dateString+=days[now.getDay()];  
    document.getElementById("clock2").innerHTML = dateString;
}
function removeBubble(bubble) {
  bubble.style.display = 'none';
}

setClock()
updateClock()