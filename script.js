const calendar = document.getElementById('calendar');
const tooltip = document.getElementById('tooltip');
const btn = document.querySelector("#check");
const footer = document.getElementById('scrollingText');
const body = document.body;

const now = new Date();
const year = now.getFullYear();
var month = (now.getMonth() + 1);
const day = now.getDate();


const dutySchedule = {
  
"2024-3-1": "S: 詹文欽 A: 方振彬 N: 唐茂 C: 張日曜 R: 張哲維 T: 呂明峰",
"2024-3-2": "S: 林森發 A: 許敦智 N: 劉暐丞 C: 孫景泰 R: 黃煜森 T: 洪柜峰",
"2024-3-3": "S: 范振宇 A: 許世勳 N: 彭偉慎 C: 邱冠霖 R: 林厚運 T: 林宏儒",
"2024-3-4": "S: 黃經洲 A: 黃煜森 N: 王瑞發 C: 秦桔萬 R: 張哲維 T: 周育稔",
"2024-3-5": "S: 黃榮國 A: 羅應順 N: 許敦智 C: 張日曜 R: 余金原 T: 方振彬",
"2024-3-6": "S: 柯正和 A: 陳建中 N: 劉暐丞 C: 邱冠霖 R: 林森發 T: 呂明峰",
"2024-3-7": "S: 林森發 A: 方振彬 N: 彭偉慎 C: 孫景泰 R: 張哲維 T: 黃經洲",
"2024-3-8": "S: 黃榮國 A: 唐茂 N: 范振宇 C: 邱冠霖 R: 林厚運 T: 洪柜峰",
"2024-3-9": "S: 詹文欽 A: 呂明峰 N: 王瑞發 C: 秦桔萬 R: 余金原 T: 許世勳",
"2024-3-10": "S: 柯正和 A: 林宏儒 N: 陳建中 C: 孫景泰 R: 黃煜森 T: 方振彬",
"2024-3-11": "S: 范振宇 A: 劉錦郎 N: 劉暐丞 C: 張日曜 R: 林厚運 T: 呂明峰",
"2024-3-12": "S: 黃經洲 A: 黃煜森 N: 唐茂 C: 秦桔萬 R: 余金原 T: 羅應順",
"2024-3-13": "S: 黃榮國 A: 方振彬 N: 許敦智 C: 邱冠霖 R: 劉錦郎 T: 許世勳",
"2024-3-14": "S: 林森發 A: 洪柜峰 N: 陳建中 C: 張日曜 R: 林厚運 T: 羅應順",
"2024-3-15": "S: 范振宇 A: 林宏儒 N: 王瑞發 C: 秦桔萬 R: 余金原 T: 黃經洲",
"2024-3-16": "S: 柯正和 A: 彭偉慎 N: 唐茂 C: 邱冠霖 R: 張哲維 T: 許世勳",
"2024-3-17": "S: 范振宇 A: 洪柜峰 N: 劉暐丞 C: 孫景泰 R: 劉錦郎 T: 羅應順",
"2024-3-18": "S: 黃經洲 A: 張哲維 N: 王瑞發 C: 張日曜 R: 余金原 T: 呂明峰",
"2024-3-19": "S: 黃榮國 A: 許世勳 N: 唐茂 C: 秦桔萬 R: 黃煜森 T: 方振彬",
"2024-3-20": "S: 柯正和 A: 林厚運 N: 彭偉慎 C: 邱冠霖 R: 劉錦郎 T: 林宏儒",
"2024-3-21": "S: 范振宇 A: 羅應順 N: 劉暐丞 C: 孫景泰 R: 張哲維 T: 洪柜峰",
"2024-3-22": "S: 黃經洲 A: 彭偉慎 N: 許敦智 C: 秦桔萬 R: 黃煜森 T: 方振彬",
"2024-3-23": "S: 詹文欽 A: 羅應順 N: 陳建中 C: 張日曜 R: 劉錦郎 T: 周育稔",
"2024-3-24": "S: 林森發 A: 范振宇 N: 彭偉慎 C: 邱冠霖 R: 張哲維 T: 林宏儒",
"2024-3-25": "S: 柯正和 A: 方振彬 N: 陳建中 C: 秦桔萬 R: 余金原 T: 許世勳",
"2024-3-26": "S: 黃榮國 A: 洪柜峰 N: 唐茂 C: 張日曜 R: 黃煜森 T: 呂明峰",
"2024-3-27": "S: 黃經洲 A: 柯正和 N: 劉暐丞 C: 孫景泰 R: 林厚運 T: 羅應順",
"2024-3-28": "S: 林森發 A: 許敦智 N: 彭偉慎 C: 秦桔萬 R: 張哲維 T: 林宏儒",
"2024-3-29": "S: 詹文欽 A: 羅應順 N: 陳建中 C: 張日曜 R: 劉錦郎 T: 呂明峰",
"2024-3-30": "S: 黃榮國 A: 林森發 N: 許敦智 C: 柯正和 R: 林厚運 T: 周育稔",
"2024-3-31": "S: 黃經洲 A: 劉暐丞 N: 王瑞發 C: 孫景泰 R: 余金原 T: 呂明峰"




};

const holidy = {
  "2024-3-1": "【廿一】",
  "2024-3-2": "【廿二】【放假日】",
  "2024-3-3": "【廿三】【放假日】",
  "2024-3-4": "【廿四】",
  "2024-3-5": "【驚蟄】",
  "2024-3-6": "【廿六】",
  "2024-3-7": "【廿七】",
  "2024-3-8": "【廿八】",
  "2024-3-9": "【廿九】【放假日】",
  "2024-3-10": "【二月大】【放假日】",
  "2024-3-11": "【初二】",
  "2024-3-12": "【初三】",
  "2024-3-13": "【初四】",
  "2024-3-14": "【初五】",
  "2024-3-15": "【初六】",
  "2024-3-16": "【初七】【放假日】",
  "2024-3-17": "【初八】【放假日】",
  "2024-3-18": "【初九】",
  "2024-3-19": "【初十】",
  "2024-3-20": "【春分】",
  "2024-3-21": "【十二】",
  "2024-3-22": "【十三】",
  "2024-3-23": "【十四】【放假日】",
  "2024-3-24": "【十五】【放假日】",
  "2024-3-25": "【十六】",
  "2024-3-26": "【十七】",
  "2024-3-27": "【十八】",
  "2024-3-28": "【十九】",
  "2024-3-29": "【二十】",
  "2024-3-30": "【廿一】【放假日】",
  "2024-3-31": "【廿二】【放假日】"
};

function Zellercongruence(day, month, year)
{
        if (month == 1)
        {
            month = 13;
            year--;
        }
        if (month == 2)
        {
            month = 14;
            year--;
        }
        let q = day;
        let m = month;
        let k = year % 100;
        let j = parseInt(year / 100, 10);
        let h = q + parseInt(13 * (m + 1) / 5, 10) + k + parseInt(k / 4, 10) + parseInt(j / 4, 10) + 5 * j;
        h = h % 7;
        switch (h)
        {
            case 0: 
              return 6;
              break;           
            case 1: 
                return 0;
                break;    
            case 2: 
                return 1;
                break;    
            case 3: 
                return 2;
                break; 
            case 4: 
                return 3;
                break;  
            case 5: 
                return 4;
                break;
            case 6: 
                return 5;
                break;
        }
}
// Function to create calendar days
function createCalendar(year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
   
  var now = new Date();
  var year_now = now.getFullYear();
  var month_now = (now.getMonth() + 1); // Months are zero-based
  var day_now = now.getDate();
 

  const headerCell = document.createElement('div');
  headerCell.classList.add('header-cell');
  //headerCell.textContent = `${year_now}  年 ${month_now}月  `;
  headerCell.textContent = `${year_now}  年 ${month}月  `;
  header.appendChild(headerCell); 

  
  for (let i=0; i < 7; i++){
    const weekdayElement = document.createElement('div');
    weekdayElement.classList.add('weekday');
    weekdayElement.textContent = weekdays[i];
    calendar.appendChild(weekdayElement);
  }

    dayOfWeek = Zellercongruence(1, month, year);
    
    if (dayOfWeek === 1) {

    } else if (dayOfWeek === 2) {
      for (let i = 0; i < 1; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = "";
        calendar.appendChild(dayElement);
      }
    } else if (dayOfWeek === 3) {
      for (let i = 0; i < 2; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = "";
        calendar.appendChild(dayElement);
      }
    } else if (dayOfWeek === 4) {
      for (let i = 0; i < 3; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = "";
        calendar.appendChild(dayElement);
      }
    } else if (dayOfWeek === 5) {
      for (let i = 0; i < 4; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = "";
        calendar.appendChild(dayElement);
      }
    } else if (dayOfWeek === 6) {
      for (let i = 0; i < 5; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = "";
        calendar.appendChild(dayElement);
      }
    } else {
      for (let i = 0; i < 6; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = "";
        calendar.appendChild(dayElement);
      }
    }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${month}-${day}`;
    const dayElement = document.createElement('div');
    dayElement.classList.add('day');
    dayElement.textContent = day;
    calendar.appendChild(dayElement);

    if (Zellercongruence(day, month, year) === 0 || Zellercongruence(day, month, year) === 6) {
      dayElement.classList.add('weekend');
    }

    if (day_now === day){
      dayElement.classList.add('today');
    }

    dayElement.addEventListener('mouseover', () => {
      if (btn.checked) {
        dayElement.style.color = 'MediumBlue'; // Change the color when button is checked and mouse is over
      }
      if (Zellercongruence(day, month, year) === 0 || Zellercongruence(day, month, year) === 6) {
        dayElement.style.color = 'red';
      }
      showTooltip(date);      
    });
    dayElement.addEventListener('mouseout', () => {
      if (btn.checked) {
        dayElement.style.color = 'white'; // Reset the color when button is checked and mouse is out
        let today = document.querySelectorAll('.today');
        today.forEach(today => {
        today.style.color = 'MediumBlue';
        });
        if (Zellercongruence(day, month, year) === 0 || Zellercongruence(day, month, year) === 6) {
          dayElement.style.color = 'red';
        }
      }
      hideTooltip();
      
    });
  }
}

function showTooltip(date) {
  document.addEventListener("mousemove", function(event){
    let x = event.clientX;
    let y = event.clientY;

    const isWeekend = Zellercongruence(new Date(date).getDate(), new Date(date).getMonth() + 1, new Date(date).getFullYear()) === 0 || 
                       Zellercongruence(new Date(date).getDate(), new Date(date).getMonth() + 1, new Date(date).getFullYear()) === 6;
    if (isWeekend) {
      tooltip.style.left = x - 460 + 'px';
    }else {
      tooltip.style.left = x + 25 + 'px';
    }
    // Adjust tooltip position based on the day
    //tooltip.style.left = isWeekend ? x - 480 + 'px' : x + 30 + 'px';
    tooltip.style.top = y + 'px';
  });

  tooltip.textContent = dutySchedule[date] || "None";
  tooltip.style.display = 'block';
}

// Function to hide tooltip
function hideTooltip() {
  tooltip.style.display = 'none';
}

function change() {
  if (btn.checked) {
    body.classList.add("dark");
    body.style.backgroundImage = "url('TIAC.png')";
    // Select all elements with the class '.day' and change their color to white
    let days = document.querySelectorAll('.day');
    days.forEach(day => {
      day.style.color = 'white';
    });
    let today = document.querySelectorAll('.today');
    today.forEach(today => {
      today.style.color = 'MediumBlue';
    });
    let weekendDays = document.querySelectorAll('.weekend');
    weekendDays.forEach(day => {
      day.style.color = 'red';
    });
    // Select the element with id 'header' and change its color to white
    let header = document.getElementById('header');
    header.style.color = 'white';   

    footer.style.color = 'MediumBlue';

  } else {
    body.classList.remove("dark");
    body.style.backgroundImage = "url('tower.png')";

    // Reset the color of '.day' elements to their default
    let days = document.querySelectorAll('.day');
    days.forEach(day => {
      day.style.color = ''; // This will remove the inline 'color' style, allowing the CSS rule to take effect
    });
    // Reset the color of 'header' element to its default
    let header = document.getElementById('header');
    header.style.color = ''; // This will remove the inline 'color' style, allowing the CSS rule to take effect
  
    footer.style.color = 'black';

  }
}


function scroll(info) {
  var result = ''; 
  var isSpaceBeforeUppercase = false; 
  for (var i = 0; i < info.length; i++) {
    var currentChar = info[i];
    var nextChar = info[i + 1];
    
    if (currentChar === ' ' && (nextChar.match(/[A-Z]/))) {
      result += '&nbsp;&nbsp;&nbsp'; 
      isSpaceBeforeUppercase = true; 
    } else {
      result += currentChar; 
      isSpaceBeforeUppercase = false; 
    }
  }
  var marquee = document.getElementById("scrollingText");
  marquee.innerHTML = '<p>' + result + '</p>'; 
}


const names = [
  "．．．",
  "柯正和",
  "張日曜",
  "孫景泰",
  "秦桔萬",
  "邱冠霖",
  "詹文欽",
  "黃榮國",
  "范振宇",
  "唐茂",
  "許敦智",
  "王瑞發",
  "彭偉慎",
  "陳建中",
  "劉暐丞",
  "林森發",
  "黃煜森",
  "劉錦郎",
  "余金原",
  "林厚運",
  "張哲維",
  "黃經洲",
  "洪柜峰",
  "林宏儒",
  "呂明峰",
  "周育稔",
  "許世勳",
  "羅應順",
  "方振彬",
  "．．．",
];
const namePicker = document.getElementById("namePicker");
let currentIndex = 0;

const selectedClassName = 'selected';

function highlightSelectedName(selectedName) {
  const days = document.querySelectorAll('.day');
  days.forEach(dayElement => {
    const date = `${year}-${month}-${dayElement.textContent}`;
    const namesForDay = (dutySchedule[date] || '').split(' ');
    if (namesForDay.includes(selectedName)) {
      dayElement.classList.add(selectedClassName);
    } else {
      dayElement.classList.remove(selectedClassName);
    }
  });
}

// Populate the name picker with the list of names
names.forEach((name) => {
  const selectedName = name;
  const item = document.createElement("div");
  item.className = "picker-item";
  item.textContent = name;
  // Add click event listener to handle name selection
  item.addEventListener("click", () => {
    updateSelection();
    item.style.backgroundColor = "turquoise";
    highlightSelectedName(selectedName);
  });

  namePicker.appendChild(item);
});

function clearSelectedClass() {
  const days = document.querySelectorAll('.day');
  days.forEach(dayElement => {
    dayElement.classList.remove(selectedClassName);
  });
}

function updateSelection() {
  const items = document.querySelectorAll(".picker-item");
  items.forEach((item) => {
      item.style.backgroundColor = "";
  });
}

function updateScale() {
  const container = document.getElementById('namePicker');
  const items = document.querySelectorAll('.picker-item');
  const containerRect = container.getBoundingClientRect();
  const containerCenterY = containerRect.top + containerRect.height / 2;
  
  items.forEach((item) => {
    const itemRect = item.getBoundingClientRect();
    const itemCenterY = itemRect.top + itemRect.height / 2;
    const distanceToCenter = Math.abs(containerCenterY - itemCenterY);
    if (distanceToCenter < containerRect.height / 5) { // Adjust this threshold as needed
      item.style.transform = 'scale(1.5)';
      updateSelection();
      item.style.backgroundColor = "turquoise";
      highlightSelectedName(item.textContent);
    } else {
      item.style.transform = 'scale(1)';
    }
  });
  
}

// Handle scroll events to change the selected name
namePicker.addEventListener("scroll", () => {
  const itemHeight = namePicker.querySelector(".picker-item").offsetHeight;
  currentIndex = Math.floor(namePicker.scrollTop / itemHeight);
  updateSelection();
  clearSelectedClass();
  updateScale();
});

const date2 = `${year}-${month}-${day}`;
const info = `${year}年${month}月${day}日` + holidy[date2] + " →→→ " + dutySchedule[date2];
scroll(info);
btn.addEventListener('change', change);
createCalendar(year, month);
