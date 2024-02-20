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
  font-weight: bold;
  
}

.day {
  border: 1px solid #ccc;
  padding: 10px;
  font-weight: bold;
  text-align: center;
  position: relative;
  cursor: pointer;
  
}
.today {
  background-color: lightgreen;
}

.weekday {
  border: 1px solid #ccc;
  background-color: lightgrey;
  padding: 10px;
  font-weight: bold;
  position: relative;
  cursor: pointer;
  z-index: 10;
}
.weekend {
  color: red; 
  font-weight: bold;
  text-align: center;
}

#tooltip {
  position: absolute;
  background-color: rgba(51, 51, 51, 0.8);;
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

.dark {
  background: #121212;
}

.display {
  width: 100px;
  height: 40px;
  border-radius: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

label {
  width:80px;
  height: 40px;
  border-radius: 200px;
  background: #f3f3f3;
  box-shadow: 20px 20px 40px rgba(0, 0, 0, 0.2) inset;
  cursor: pointer;
  position: relative;
}
input {
  display: none;
}

.circle {
  width: 38px;
    height: 38px;
    border-radius: 30px;
    background: white;
    box-shadow: 20px 20px 40px rgba(0, 0, 0, 0.01),
    -10px -10px 30px rgba(0, 0, 0, 0.01) inset;
    position: absolute;
    top: 50%;
    left: 0%;
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
  width:80px;
  height: 40px;
}
input:checked + .display label {
  background: #2ecc71;
  box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.5) inset;
}
input:checked + .display label .circle {
  left: 100%;
  transform: translate(-100%, -50%);
  background: #121212;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5),
  -5px -5px 15px rgba(0, 0, 0, 0.5) inset;
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


