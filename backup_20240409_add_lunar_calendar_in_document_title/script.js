const calendar = document.getElementById('calendar');
const tooltip = document.getElementById('tooltip');
const btn = document.querySelector("#check");
const footer = document.getElementById('scrollingText');
const header = document.getElementById('header');
const body = document.body;

const now = new Date();
var year = now.getFullYear();
var month = (now.getMonth() + 1);
var day = now.getDate();
var temp_name;


const dutySchedule = {
  "2024-4-1": "S: 范振宇 A: 黃煜森 N: 彭偉慎 C: 張日曜 R: 張哲維 T: 方振彬",
  "2024-4-2": "S: 柯正和 A: 許敦智 N: 劉暐丞 C: 邱冠霖 R: 林厚運 T: 羅應順",
  "2024-4-3": "S: 詹文欽 A: 呂明峰 N: 陳建中 C: 秦桔萬 R: 黃煜森 T: 林宏儒",
  "2024-4-4": "S: 黃經洲 A: 劉暐丞 N: 彭偉慎 C: 孫景泰 R: 余金原 T: 方振彬",
  "2024-4-5": "S: 詹文欽 A: 洪柜峰 N: 許敦智 C: 邱冠霖 R: 張哲維 T: 羅應順",
  "2024-4-6": "S: 范振宇 A: 林宏儒 N: 唐__茂 C: 張日曜 R: 劉錦郎 T: 呂明峰",
  "2024-4-7": "S: 林森發 A: 王瑞發 N: 劉暐丞 C: 秦桔萬 R: 林厚運 T: 方振彬",
  "2024-4-8": "S: 黃榮國 A: 張哲維 N: 陳建中 C: 孫景泰 R: 余金原 T: 羅應順",
  "2024-4-9": "S: 柯正和 A: 劉暐丞 N: 王瑞發 C: 邱冠霖 R: 劉錦郎 T: 洪柜峰",
  "2024-4-10": "S: 黃經洲 A: 張哲維 N: 彭偉慎 C: 張日曜 R: 林厚運 T: 林宏儒",
  "2024-4-11": "S: 林森發 A: 孫景泰 N: 范振宇 C: 秦桔萬 R: 黃煜森 T: 方振彬",
  "2024-4-12": "S: 詹文欽 A: 陳建中 N: 劉暐丞 C: 邱冠霖 R: 劉錦郎 T: 洪柜峰",
  "2024-4-13": "S: 黃榮國 A: 林宏儒 N: 王瑞發 C: 柯正和 R: 黃煜森 T: 羅應順",
  "2024-4-14": "S: 黃經洲 A: 唐__茂 N: 陳建中 C: 秦桔萬 R: 林厚運 T: 呂明峰",
  "2024-4-15": "S: 范振宇 A: 劉錦郎 N: 彭偉慎 C: 張日曜 R: 余金原 T: 方振彬",
  "2024-4-16": "S: 柯正和 A: 羅應順 N: 許敦智 C: 孫景泰 R: 黃煜森 T: 林宏儒",
  "2024-4-17": "S: 林森發 A: 唐__茂 N: 彭偉慎 C: 邱冠霖 R: 劉錦郎 T: 許世勳",
  "2024-4-18": "S: 黃榮國 A: 林厚運 N: 王瑞發 C: 張日曜 R: 黃煜森 T: 呂明峰",
  "2024-4-19": "S: 柯正和 A: 唐__茂 N: 許敦智 C: 孫景泰 R: 劉錦郎 T: 許世勳",
  "2024-4-20": "S: 詹文欽 A: 林森發 N: 范振宇 C: 秦桔萬 R: 林厚運 T: 黃經洲",
  "2024-4-21": "S: 黃榮國 A: 許世勳 N: 許敦智 C: 張日曜 R: 余金原 T: 洪柜峰",
  "2024-4-22": "S: 黃經洲 A: 王瑞發 N: 唐__茂 C: 孫景泰 R: 劉錦郎 T: 方振彬",
  "2024-4-23": "S: 林森發 A: 柯正和 N: 陳建中 C: 邱冠霖 R: 余金原 T: 林宏儒",
  "2024-4-24": "S: 黃榮國 A: 許世勳 N: 王瑞發 C: 秦桔萬 R: 張哲維 T: 洪柜峰",
  "2024-4-25": "S: 范振宇 A: 彭偉慎 N: 許敦智 C: 孫景泰 R: 林厚運 T: 黃經洲",
  "2024-4-26": "S: 林森發 A: 方振彬 N: 王瑞發 C: 邱冠霖 R: 黃煜森 T: 呂明峰",
  "2024-4-27": "S: 柯正和 A: 彭偉慎 N: 陳建中 C: 張日曜 R: 張哲維 T: 許世勳",
  "2024-4-28": "S: 黃榮國 A: 洪柜峰 N: 唐__茂 C: 孫景泰 R: 余金原 T: 羅應順",
  "2024-4-29": "S: 范振宇 A: 張哲維 N: 許敦智 C: 邱冠霖 R: 黃煜森 T: 呂明峰",
  "2024-4-30": "S: 林森發 A: 余金原 N: 劉暐丞 C: 秦桔萬 R: 劉錦郎 T: 許世勳",
  
  

};

const holiday = {
  
"2024-4-1": "【廿三】",
"2024-4-2": "【廿四】",
"2024-4-3": "【廿五】",
"2024-4-4": "【清明兒童節】【放假日】",
"2024-4-5": "【廿七】【放假日】",
"2024-4-6": "【廿八】【放假日】",
"2024-4-7": "【廿九】【放假日】",
"2024-4-8": "【三十】",
"2024-4-9": "【三月小】",
"2024-4-10": "【初二】",
"2024-4-11": "【初三】",
"2024-4-12": "【初四】",
"2024-4-13": "【初五】【放假日】",
"2024-4-14": "【初六】【放假日】",
"2024-4-15": "【初七】",
"2024-4-16": "【初八】",
"2024-4-17": "【初九】",
"2024-4-18": "【初十】",
"2024-4-19": "【穀雨】",
"2024-4-20": "【十二】【放假日】",
"2024-4-21": "【十三】【放假日】",
"2024-4-22": "【十四】",
"2024-4-23": "【十五】",
"2024-4-24": "【十六】",
"2024-4-25": "【十七】",
"2024-4-26": "【十八】",
"2024-4-27": "【十九】【放假日】",
"2024-4-28": "【二十】【放假日】",
"2024-4-29": "【廿一】",
"2024-4-30": "【廿二】",
"2024-5-1": "【廿三】",
"2024-5-2": "【廿四】",
"2024-5-3": "【廿五】",
"2024-5-4": "【廿六】【放假日】",
"2024-5-5": "【立夏】【放假日】",
"2024-5-6": "【廿八】",
"2024-5-7": "【廿九】",
"2024-5-8": "【四月小】",
"2024-5-9": "【初二】",
"2024-5-10": "【初三】",
"2024-5-11": "【初四】【放假日】",
"2024-5-12": "【初五】【放假日】",
"2024-5-13": "【初六】",
"2024-5-14": "【初七】",
"2024-5-15": "【初八】",
"2024-5-16": "【初九】",
"2024-5-17": "【初十】",
"2024-5-18": "【十一】【放假日】",
"2024-5-19": "【十二】【放假日】",
"2024-5-20": "【小滿】",
"2024-5-21": "【十四】",
"2024-5-22": "【十五】",
"2024-5-23": "【十六】",
"2024-5-24": "【十七】",
"2024-5-25": "【十八】【放假日】",
"2024-5-26": "【十九】【放假日】",
"2024-5-27": "【二十】",
"2024-5-28": "【廿一】",
"2024-5-29": "【廿二】",
"2024-5-30": "【廿三】",
"2024-5-31": "【廿四】",

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

function addEventListeners(dayElement, btn, day, month, year, date) {
  dayElement.addEventListener('mouseover', () => {
    if (btn.checked) {
      dayElement.style.color = 'purple'; // Change the color when button is checked and mouse is over
    }
    showTooltip(date); 
    // showTooltip2(date);     
  });

  dayElement.addEventListener('mouseout', () => {
    if (btn.checked) {
      dayElement.style.color = 'white'; // Reset the color when button is checked and mouse is out
      let today = document.querySelectorAll('.today');
      today.forEach(today => {
        today.style.color = 'MediumBlue';
      });
      if (Zellercongruence(day, month, year) === 0 || Zellercongruence(day, month, year) === 6) {
        dayElement.style.color = 'yellow';
      }
    }
    hideTooltip();
  });
}
function addEventListener_toHideToolTip(headerCell) {
  headerCell.addEventListener('mouseover', () => {
    hideTooltip();      
  });
}

// Function to create calendar days
function createCalendar(year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
  var counter = 0;
  var counterN = 0;
  var now = new Date();
  var year_now = now.getFullYear();
  var month_now = (now.getMonth() + 1); // Months are zero-based
  var day_now = now.getDate();
  var yearN;
  var nextMonth = (now.getMonth() + 1) + 1;
    if (nextMonth > 12) {
      nextMonth = 1;
      yearN = year + 1;
    }
  yearN=year;
  const daysInMonthN = new Date(yearN, nextMonth, 0).getDate();
  dayOfWeekN = Zellercongruence(1, nextMonth, yearN);
  if (dayOfWeekN === 1) {
    counterN=0;
  } else if (dayOfWeekN === 2) {
    counterN=1;
  } else if (dayOfWeekN === 3) {
    counterN=2;
  } else if (dayOfWeekN === 4) {
    counterN=3;
  } else if (dayOfWeekN === 5) {
    counterN=4;
  } else if (dayOfWeekN === 6) {
    counterN=5;
  } else {
    counterN=6;
  }
  const headerCell = document.createElement('div');
  headerCell.classList.add('header-cell');
  headerCell.textContent = ` ${year} 年　${month} 月  `;
  header.appendChild(headerCell);
  addEventListener_toHideToolTip(headerCell);
  

  const date = `${year}-${month}-${day}`;
  
  for (let i=0; i < 7; i++){
    const weekdayElement = document.createElement('div');
    weekdayElement.classList.add('weekday');
    weekdayElement.textContent = weekdays[i];
    calendar.appendChild(weekdayElement);
  }

    dayOfWeek = Zellercongruence(1, month, year);
    
    if (dayOfWeek === 1) {
      counter=0;
    } else if (dayOfWeek === 2) {
      counter=1;
      for (let i = 0; i < counter; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = "";
        calendar.appendChild(dayElement);
      }
    } else if (dayOfWeek === 3) {
      counter=2;
      for (let i = 0; i < counter; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = "";
        calendar.appendChild(dayElement);
      }
    } else if (dayOfWeek === 4) {
      counter=3;
      for (let i = 0; i < counter; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = "";
        calendar.appendChild(dayElement);
      }
    } else if (dayOfWeek === 5) {
      counter=4;
      for (let i = 0; i < counter; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = "";
        calendar.appendChild(dayElement);
      }
    } else if (dayOfWeek === 6) {
      counter=5;
      for (let i = 0; i < counter; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = "";
        calendar.appendChild(dayElement);
      }
    } else {
      counter=6;
      for (let i = 0; i < counter; i++) {
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
    if (year === year_now && month === month_now && day === day_now) {
      dayElement.classList.add('today');
    }
    addEventListeners(dayElement, btn, day, month, year, date);    
  }

  //below is created for the next month. If the days of next month exceeds this month
  for (let i = 0; i < (daysInMonthN + counterN - daysInMonth - counter) ; i++) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('day');
    dayElement.textContent = "";
    calendar.appendChild(dayElement);
  }

}

function showTooltip(date) {
  const calendarRect = calendar.getBoundingClientRect(); 
  
  tooltip.style.left = `${calendarRect.left-102}px`;
  tooltip.style.top = `${calendarRect.top+106}px`;

  tooltip.textContent = dutySchedule[date] || "None";
  tooltip.style.display = 'block';

  document.title = holiday[date] || "None";
}



function hideTooltip() {
  tooltip.style.display = 'none';
  document.title = 'On Duty Calendar';
}

function change() {
  var day_now = now.getDate();
  if (btn.checked) {
    updateSelection();
    clearSelectedClass();
    
    let previousToday = document.querySelectorAll('.today');
    previousToday.forEach(today => {
      today.classList.remove('today');
    });

    body.classList.add("dark");
    body.style.backgroundImage = "url('TIAC.png')";
    
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
      day.style.color = 'yellow';
    });
    
    let header = document.getElementById('header');
    header.style.color = 'white';   
    footer.style.color = 'MediumBlue';

   

    month = (now.getMonth() + 1) + 1;
    if (month > 12) {
      month = 1;
      year++;
    }
    var daysInNextMonth = new Date(year, month, 0).getDate();
    days.forEach((day, index) => {
      day.textContent = "";
      if (index >= Zellercongruence(1, month, year) - 1 && index < daysInNextMonth + Zellercongruence(1, month, year) - 1) {
        const date = `${year}-${month}-${index - Zellercongruence(1, month, year) + 2}`;
        day.textContent = index - Zellercongruence(1, month, year) + 2;
        addEventListeners(day, btn, index - Zellercongruence(1, month, year) + 2, month, year, date);
      }else{
        addEventListeners(day, btn, index - Zellercongruence(1, month, year) + 2, month, year, 999);
      }
    });
    const headerCell = document.querySelector('.header-cell');
    headerCell.textContent = ` ${year} 年　${month} 月  `;
    highlightAdditionalHoliday();
  } else {
    updateSelection();
    clearSelectedClass();

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
    
    month = (now.getMonth() + 1);
    if (month === 12) {
      year--;
    }
    var daysInCurrentMonth = new Date(year, month, 0).getDate();
    days.forEach((day, index) => {
      day.textContent = "";
      if (index >= Zellercongruence(1, month, year) - 1 && index < daysInCurrentMonth + Zellercongruence(1, month, year) - 1) {
        const date = `${year}-${month}-${index - Zellercongruence(1, month, year) + 2}`;
        day.textContent = index - Zellercongruence(1, month, year) + 2;
        addEventListeners(day, btn, index - Zellercongruence(1, month, year) + 2, month, year, date);
      }else {
        addEventListeners(day, btn, index - Zellercongruence(1, month, year) + 2, month, year, 999);
      }
      if (index - Zellercongruence(1, month, year) + 2 === day_now) {
        day.classList.add('today');
      }
    });
    
    const headerCell = document.querySelector('.header-cell');
    headerCell.textContent = ` ${year} 年　${month} 月  `;   
  }
  //below is to highlight the name previously selected in the change function
  highlightSelectedName(temp_name);
  const items = document.querySelectorAll('.picker-item');
  items.forEach((item) => {
    if (temp_name === item.textContent && temp_name != "．．．"){
      item.style.transform = 'scale(1.5)';
      item.style.backgroundColor = "turquoise";
    }
  });
  highlightAdditionalHoliday();
} //change function ends here

function scroll(info) {
  var result = ''; 
  var isSpaceBeforeUppercase = false; 
  
  for (var i = 0; i < info.length; i++) {
    var currentChar = info[i];
    var nextChar = info[i + 1];
    
    if (currentChar === ' ' && (nextChar.match(/[A-Z]/) )) {
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
  "．．．",
  "．．．",
  "詹文欽",
  "黃榮國",
  "范振宇",
  "唐__茂",
  "許敦智",
  "王瑞發",
  "彭偉慎",
  "陳建中",
  "劉暐丞",
  "柯正和",
  "張日曜",
  "孫景泰",
  "秦桔萬",
  "邱冠霖",
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
function highlightAdditionalHoliday() {
  const days = document.querySelectorAll('.day');
  days.forEach(dayElement => {
    const date = `${year}-${month}-${dayElement.textContent}`;
    const namesForHoliday = (holiday[date] || '').split(' ');
    // console.log('namesForHoliday:', namesForHoliday);
    if (namesForHoliday.some(name => name.includes('放假日'))) {
      if (btn.checked) {
      dayElement.style.color = 'yellow';
      } else{
        dayElement.style.color = 'red';
      }
    }
  });
}

// Populate the name picker with the list of names
names.forEach((name) => {
  const selectedName = name;
  const item = document.createElement("div");
  item.className = "picker-item";
  item.textContent = name;
  item.style.color = "gray";
 
 // Add click event listener to handle name selection
 item.addEventListener("click", () => {
    updateSelection();
    const items = document.querySelectorAll('.picker-item');
    items.forEach((item) => {
      item.style.transform = 'scale(1)';
      item.style.color = 'gray';
    });
    item.style.transform = 'scale(1.5)';
    item.style.color = '';
    item.style.backgroundColor = "turquoise";
    temp_name=selectedName;
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
      if (distanceToCenter < containerRect.height / 10 && item.textContent != "．．．") { // Adjust this threshold as needed
        item.style.transform = 'scale(1.5)';
        updateSelection();
        item.style.backgroundColor = "turquoise";
        item.style.color = '';
        temp_name=item.textContent;
        highlightSelectedName(item.textContent);
      } else {
        item.style.transform = 'scale(1)';
        item.style.color = 'gray';
      }
  });  
}

namePicker.addEventListener("scroll", () => {
  const itemHeight = namePicker.querySelector(".picker-item").offsetHeight;
  currentIndex = Math.floor(namePicker.scrollTop / itemHeight);
  updateSelection();
  clearSelectedClass();
  updateScale();
  
});


const date2 = `${year}-${month}-${day}`;
const info = `${year}年${month}月${day}日` + holiday[date2] + " →→→ " + dutySchedule[date2];
scroll(info);
btn.addEventListener('change', change);

createCalendar(year, month);
highlightAdditionalHoliday();//this must be done finally.
