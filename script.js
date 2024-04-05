body {
  font-family:  Arial, Helvetica, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
  overflow: hidden; 
  background-image: url('tower.png');
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat; 
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  transition: 0.1s;
}


#calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
}

#header {
  border: 1px solid #ccc;
  font-weight: bold;
  padding: 5px;
  background-color: #3498db;
  text-align: center;
  color: #fff;
  font-size:18px;
  border-radius: 10px;
}

.day {
  width: 2.6em;
  height: 2.7em;
  border: 1px solid #ffffff;
  padding: 10px;
  font-weight: bold;
  text-align: center;
  position: relative;
  cursor: pointer;
  color:#0040c2;
}

.today {
  width: 2.6em;
  height: 2.7em;
  /* background-color: lightgreen; */
  border:3px solid magenta;
  
}

.selected  {
  background-color: turquoise;
}



.weekday {
  width: 2.6em;
  height: 2.7em;
  border: 1px solid #ffffff;
  background-color: #3498db;
  color: #fff;
  padding: 8px;
  font-weight: bold;
  position: relative;
  cursor: pointer;
  text-align: center;
  z-index: 10;
}
.weekend {
  width: 2.6em;
  height: 2.7em;
  color: red;
  font-weight: bold;
  text-align: center;
}

#tooltip {
  position: absolute;
  background-color: rgba(51, 51, 51, 0.75); 
  color: white;
  padding: 10px;
  display: none;
  z-index: 10;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Add box shadow for a subtle lift */
  transition: 0.1s ease-in-out; /* Add transition for smooth appearance */
}

/* Optional: Add some styling when tooltip is hovered */
#tooltip:hover {
  background-color: rgba(51, 51, 51, 1);
}

.day:hover {
  cursor: pointer;
  background-color: #ffff99;
}

body.dark {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.dark {
  background: #121212;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.display {
 
  width: 100px;
  height: 40px;
  border-radius: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}
label:before {
  content: "";
  /*background: linear-gradient(110deg,red, orange,yellow, #FFD600,green,blue, purple);*/
  background: linear-gradient(90deg,#fff,transparent,transparent,#fff);
  position: absolute;
  top: 0px;
  left: 0px;
  background-size:200%;
  
  filter: blur(8px);
  width: calc(100% + 4px);
  height: calc(100% + 4px); 
  animation: glowing-button 15s linear infinite;
  transition: opacity 0.3s ease-in-out;
  border-radius: 200px;
  z-index:-10;
}
@keyframes glowing-button {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 400% 0;
  }
}
label:after {
  z-index: -1;
  content: "";
  position: absolute;
  width: 100%;
  height: 50%;
  left: 0;
  top: 0;
  border-radius: 200px;
}

label {
  width:100px;
  height: 42px;
  border-radius: 200px;
  box-shadow: 20px 20px 40px rgba(0, 0, 0, 0.2) inset;
  background:lightgrey;
  cursor: pointer;
  position: relative;
}
input {
  display: none;
  border-radius: 200px;
}

.circle {
    width: 40px;
    height: 40px;
    border-radius: 30px;
    background: white;
    box-shadow: 20px 20px 40px rgba(0, 0, 0, 0.01),
    -10px -10px 30px rgba(0, 0, 0, 0.01) inset;
    position: absolute;
    top: 50%;
    left: -2.2%;
    transform: translate(3%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}
svg {
  width: 30px;
  position: absolute;
}
.sun {
  color: #FFD600;
  margin-top: 0%;
  opacity: 1;
}
.moon {
  margin-top: -180%;
  color: white;
  opacity: 1;
}
input:checked + .display {
  background: #121212;
  width: 100px;
  height: 40px;
}
input:checked + .display label {
  background: #2ecc71;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5) inset;
}
.indicator {
color:gray;
font-size: 10pt;
}
input:checked + .display label .circle {
  left: 100%;
  transform: translate(-104.8%, -50%);
  background: #121212;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5),
  -1px -1px 10px rgba(0, 0, 0, 0.5) inset;
}
input:checked + .display label .circle .sun {
  margin-top: 50%;
  opacity: 0;
}
input:checked + .display label .circle .moon {
  margin-top: 0%;
  opacity: 1;
}
label:active .circle  {
  width: 48px;
  height: 40px;
}

footer {
  height: 30px;
  align-items: flex-start;
  position: fixed;
  font-weight: bold;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(144,238,144,0.4);
  box-shadow: 10px 10px 30px green inset; /* Adjust the background color as needed */
  padding: 8px;
  text-align: center;
  color: black;
  z-index: -1;
}

.picker-container {
  border: 1px solid #ffffff;
  width: 100px;
  margin: 3px;
  background-color: #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border-radius: 20px;
  text-align: center;
}

.picker-body {
  /* border: 1px double #ffffff; */
  border-radius: 5px;
  padding: 1px;
  background-color: lightgrey;
  font-weight: bold;
  font-size: 18px;
  overflow: auto;
  height: 150px;
}

.picker-item {
  margin-bottom: 10px;
  /*transition: background-color 0.3s ease;*/
  transition: transform 0.3s ease;

}

.picker-item:hover {
  background-color: #f2f2f2;
  transform: scale(1.5);
  overflow-x: hidden;
}

#namePicker {
  overflow-x: hidden;
}

#scrollingText {
  white-space: nowrap; /* Prevents the text from wrapping */
  overflow: hidden; /* Hides the overflow text */
}

#scrollingText p {
  display: inline-block; /* Makes the text inline but allows it to be treated as a block element */
  margin-right: 100%; /* Moves the text off-screen initially */
  animation: marquee 20s linear infinite; /* Define the animation */
}

/* Define the animation */
@keyframes marquee {
  from {
    margin-right: 100%; /* Start off-screen to the right */
  }
  to {
    margin-left: 0%; /* Move to the left, displaying the text */
  }
}

