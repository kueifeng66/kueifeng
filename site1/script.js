const calendar = document.getElementById('calendar');
const tooltip = document.getElementById('tooltip');
const btn = document.querySelector('#toggle');
const header = document.getElementById('header');
const body = document.body;
const lastUpdated = document.title;

const urlParams = new URLSearchParams(window.location.search);
const userID = urlParams.get('userID');


let mode = "neutral";
const currentDay = new Date().getDate();
let clickCount = 1;

 let username = null;
 let targetName = null;

const now = new Date();
var year = now.getFullYear();
var month = (now.getMonth() + 1);
var day = now.getDate();
var temp_name;
const formattedDate = `${year}-${month}-${day}`;

const MIN_YEAR = 1960;
const MAX_YEAR = 2050;				  

const dutySchedule = {


"2026-7-1": "S: 黃榮國 A: 羅應順 N: 彭偉慎 C: 官郁庭 R: 陳志偉 T: 周育稔",
"2026-7-2": "S: 范振宇 A: 方振彬 N: 劉暐丞 C: 孫景泰 R: 張哲維 T: 洪柜峰",
"2026-7-3": "S: 詹文欽 A: 林宏儒 N: 許敦智 C: 秦桔萬 R: 余金原 T: 黃經洲",
"2026-7-4": "S: 黃榮國 A: 許世勳 N: 王瑞發 C: 邱冠霖 R: 劉錦郎 T: 洪柜峰",
"2026-7-5": "S: 張日曜 A: 周育稔 N: 許敦智 C: 孫景泰 R: 林森發 T: 林宏儒",
"2026-7-6": "S: 范振宇 A: 羅應順 N: 王瑞發 C: 官郁庭 R: 陳志偉 T: 許世勳",
"2026-7-7": "S: 黃經洲 A: 劉暐丞 N: 彭偉慎 C: 方振彬 R: 張哲維 T: 洪柜峰",
"2026-7-8": "S: 張日曜 A: 呂明峯 N: 王金誠 C: 邱冠霖 R: 劉錦郎 T: 周育稔",
"2026-7-9": "S: 林森發 A: 許世勳 N: 王瑞發 C: 秦桔萬 R: 余金原 T: 林宏儒",
"2026-7-10": "S: 黃榮國 A: 彭偉慎 N: 范振宇 C: 邱冠霖 R: 張哲維 T: 洪柜峰",
"2026-7-11": "S: 詹文欽 A: 孫景泰 N: 王瑞發 C: 方振彬 R: 陳志偉 T: 呂明峯",
"2026-7-12": "S: 張日曜 A: 劉錦郎 N: 彭偉慎 C: 官郁庭 R: 余金原 T: 羅應順",
"2026-7-13": "S: 黃經洲 A: 王瑞發 N: 范振宇 C: 孫景泰 R: 陳志偉 T: 周育稔",
"2026-7-14": "S: 林森發 A: 秦桔萬 N: 王金誠 C: 官郁庭 R: 余金原 T: 林宏儒",
"2026-7-15": "S: 黃榮國 A: 許敦智 N: 彭偉慎 C: 邱冠霖 R: 張哲維 T: 周育稔",
"2026-7-16": "S: 黃經洲 A: 余金原 N: 劉暐丞 C: 秦桔萬 R: 劉錦郎 T: 呂明峯",
"2026-7-17": "S: 詹文欽 A: 張日曜 N: 王金誠 C: 方振彬 R: 陳志偉 T: 許世勳",
"2026-7-18": "S: 范振宇 A: 羅應順 N: 許敦智 C: 秦桔萬 R: 劉錦郎 T: 周育稔",
"2026-7-19": "S: 林森發 A: 劉暐丞 N: 王瑞發 C: 官郁庭 R: 張哲維 T: 洪柜峰",
"2026-7-20": "S: 黃榮國 A: 范振宇 N: 許敦智 C: 邱冠霖 R: 劉錦郎 T: 呂明峯",
"2026-7-21": "S: 黃經洲 A: 王金誠 N: 劉暐丞 C: 方振彬 R: 余金原 T: 羅應順",
"2026-7-22": "S: 林森發 A: 林宏儒 N: 王瑞發 C: 孫景泰 R: 陳志偉 T: 呂明峯",
"2026-7-23": "S: 張日曜 A: 洪柜峰 N: 許敦智 C: 秦桔萬 R: 劉錦郎 T: 周育稔",
"2026-7-24": "S: 黃經洲 A: 劉暐丞 N: 王金誠 C: 孫景泰 R: 余金原 T: 羅應順",
"2026-7-25": "S: 詹文欽 A: 林森發 N: 彭偉慎 C: 官郁庭 R: 張哲維 T: 林宏儒",
"2026-7-26": "S: 范振宇 A: 呂明峯 N: 王金誠 C: 孫景泰 R: 陳志偉 T: 許世勳",
"2026-7-27": "S: 張日曜 A: 羅應順_周育稔 N: 彭偉慎 C: 官郁庭 R: 張哲維 T: 洪柜峰",
"2026-7-28": "S: 黃經洲 A: 邱冠霖 N: 許敦智 C: 秦桔萬 R: 劉錦郎 T: 呂明峯",
"2026-7-29": "S: 范振宇 A: 彭偉慎 N: 王瑞發 C: 孫景泰 R: 陳志偉 T: 林宏儒",
"2026-7-30": "S: 黃榮國 A: 周育稔_羅應順 N: 王金誠 C: 邱冠霖 R: 張哲維 T: 許世勳",
"2026-7-31": "S: 林森發 A: 張日曜 N: 劉暐丞 C: 秦桔萬 R: 劉錦郎 T: 黃經洲",
"2026-8-1": "S: 詹文欽 A: 洪柜峰 N: 范振宇 C: 官郁庭 R: 陳志偉 T: 周育稔",
"2026-8-2": "S: 黃榮國 A: 劉暐丞 N: 王金誠 C: 秦桔萬 R: 劉錦郎 T: 呂明峯",
"2026-8-3": "S: 范振宇 A: 羅應順 N: 許敦智 C: 邱冠霖 R: 張哲維 T: 林宏儒",
"2026-8-4": "S: 張日曜 A: 周育稔 N: 王金誠 C: 官郁庭 R: 陳志偉 T: 洪柜峰",
"2026-8-5": "S: 黃榮國 A: 彭偉慎 N: 許敦智 C: 秦桔萬 R: 劉錦郎 T: 黃經洲",
"2026-8-6": "S: 林森發 A: 羅應順 N: 劉暐丞_王瑞發 C: 孫景泰 R: 張哲維 T: 許世勳",
"2026-8-7": "S: 詹文欽 A: 呂明峯 N: 許敦智 C: 官郁庭 R: 陳志偉 T: 周育稔",
"2026-8-8": "S: 范振宇 A: 張日曜 N: 劉暐丞 C: 方振彬 R: 劉錦郎 T: 黃經洲",
"2026-8-9": "S: 林森發 A: 彭偉慎 N: 許敦智 C: 孫景泰 R: 張哲維 T: 周育稔",
"2026-8-10": "S: 黃榮國 A: 林宏儒 N: 王金誠 C: 官郁庭 R: 余金原 T: 黃經洲",
"2026-8-11": "S: 范振宇 A: 呂明峯 N: 劉暐丞 C: 孫景泰 R: 陳志偉 T: 許世勳",
"2026-8-12": "S: 黃經洲 A: 邱冠霖 N: 彭偉慎 C: 官郁庭 R: 劉錦郎 T: 林宏儒",
"2026-8-13": "S: 黃榮國 A: 王瑞發 N: 許敦智 C: 方振彬 R: 余金原 T: 洪柜峰",
"2026-8-14": "S: 詹文欽 A: 孫景泰 N: 彭偉慎 C: 張日曜 R: 陳志偉 T: 許世勳",
"2026-8-15": "S: 黃經洲 A: 林森發 N: 許敦智 C: 邱冠霖 R: 余金原 T: 林宏儒",
"2026-8-16": "S: 范振宇 A: 秦桔萬 N: 王瑞發 C: 官郁庭 R: 張哲維 T: 洪柜峰",
"2026-8-17": "S: 張日曜 A: 許世勳 N: 彭偉慎 C: 方振彬 R: 劉錦郎 T: 羅應順",
"2026-8-18": "S: 林森發 A: 邱冠霖 N: 王金誠 C: 秦桔萬 R: 余金原 T: 洪柜峰",
"2026-8-19": "S: 黃經洲 A: 許敦智 N: 王瑞發 C: 官郁庭 R: 張哲維 T: 呂明峯",
"2026-8-20": "S: 范振宇 A: 周育稔 N: 劉暐丞 C: 孫景泰 R: 劉錦郎 T: 林宏儒",
"2026-8-21": "S: 黃榮國 A: 洪柜峰 N: 彭偉慎 C: 邱冠霖 R: 余金原 T: 羅應順",
"2026-8-22": "S: 詹文欽 A: 呂明峯 N: 王瑞發 C: 秦桔萬 R: 張哲維 T: 許世勳",
"2026-8-23": "S: 張日曜 A: 林森發 N: 王金誠 C: 邱冠霖 R: 陳志偉 T: 羅應順",
"2026-8-24": "S: 黃經洲 A: 方振彬 N: 劉暐丞 C: 秦桔萬 R: 余金原 T: 洪柜峰",
"2026-8-25": "S: 范振宇 A: 林宏儒 N: 王瑞發 C: 邱冠霖 R: 劉錦郎 T: 羅應順",
"2026-8-26": "S: 張日曜 A: 許世勳 N: 彭偉慎 C: 孫景泰 R: 陳志偉 T: 周育稔",
"2026-8-27": "S: 黃經洲 A: 官郁庭 N: 王金誠 C: 秦桔萬 R: 余金原 T: 呂明峯",
"2026-8-28": "S: 林森發 A: 彭偉慎 N: 劉暐丞 C: 方振彬 R: 劉錦郎 T: 林宏儒",
"2026-8-29": "S: 黃榮國 A: 王瑞發 N: 王金誠 C: 孫景泰 R: 張哲維 T: 羅應順",
"2026-8-30": "S: 張日曜 A: 許世勳 N: 劉暐丞 C: 邱冠霖 R: 余金原 T: 林宏儒",
"2026-8-31": "S: 林森發 A: 周育稔 N: 許敦智 C: 孫景泰 R: 陳志偉 T: 呂明峯",
"2026-9-1": "S: 黃經洲 A: 劉暐丞 N: 王金誠 C: 方振彬 R: 余金原 T: 羅應順",
"2026-9-2": "S: 張日曜 A: 洪柜峰 N: 王瑞發 C: 秦桔萬 R: 張哲維 T: 許世勳",
"2026-9-3": "S: 范振宇 A: 周育稔 N: 彭偉慎 C: 官郁庭 R: 陳志偉 T: 林宏儒",
"2026-9-4": "S: 黃榮國 A: 許敦智 N: 王瑞發 C: 孫景泰 R: 張哲維 T: 羅應順",
"2026-9-5": "S: 詹文欽 A: 張日曜 N: 彭偉慎 C: 陳信憲 R: 余金原 T: 洪柜峰",
"2026-9-6": "S: 林森發 A: 邱冠霖 N: 劉暐丞 C: 官郁庭 R: 劉錦郎 T: 林宏儒",
"2026-9-7": "S: 黃榮國 A: 周育稔 N: 許敦智 C: 方振彬 R: 陳志偉 T: 呂明峯",
"2026-9-8": "S: 范振宇 A: 孫景泰 N: 王金誠 C: 秦桔萬 R: 劉錦郎 T: 林宏儒",
"2026-9-9": "S: 張日曜 A: 許世勳 N: 劉暐丞 C: 邱冠霖 R: 林森發 T: 黃經洲",
"2026-9-10": "S: 黃榮國 A: 王瑞發 N: 彭偉慎 C: 方振彬 R: 劉錦郎 T: 呂明峯",
"2026-9-11": "S: 詹文欽 A: 秦桔萬 N: 王金誠 C: 官郁庭 R: 陳志偉 T: 周育稔",
"2026-9-12": "S: 范振宇 A: 林宏儒 N: 許敦智 C: 孫景泰 R: 張哲維 T: 羅應順",
"2026-9-13": "S: 林森發 A: 官郁庭 N: 王金誠 C: 邱冠霖 R: 余金原 T: 洪柜峰",
"2026-9-14": "S: 張日曜 A: 陳信憲 N: 彭偉慎 C: 秦桔萬 R: 陳志偉 T: 周育稔",
"2026-9-15": "S: 黃經洲 A: 許敦智 N: 王瑞發 C: 孫景泰 R: 張哲維 T: 羅應順",
"2026-9-16": "S: 范振宇 A: 呂明峯 N: 劉暐丞 C: 邱冠霖 R: 陳志偉 T: 許世勳",
"2026-9-17": "S: 黃榮國 A: 陳信憲 N: 王金誠 C: 孫景泰 R: 余金原 T: 洪柜峰",
"2026-9-18": "S: 張日曜 A: 林森發 N: 王瑞發 C: 方振彬 R: 劉錦郎 T: 許世勳",
"2026-9-19": "S: 詹文欽 A: 呂明峯 N: 劉暐丞 C: 邱冠霖 R: 陳志偉 T: 黃經洲",
"2026-9-20": "S: 范振宇 A: 許世勳 N: 彭偉慎 C: 秦桔萬 R: 劉錦郎 T: 周育稔",
"2026-9-21": "S: 黃榮國 A: 邱冠霖 N: 許敦智 C: 官郁庭 R: 張哲維 T: 洪柜峰",
"2026-9-22": "S: 林森發 A: 許世勳 N: 王瑞發 C: 張日曜 R: 余金原 T: 周育稔",
"2026-9-23": "S: 黃經洲 A: 陳信憲 N: 許敦智 C: 孫景泰 R: 劉錦郎 T: 羅應順",
"2026-9-24": "S: 詹文欽 A: 王金誠 N: 劉暐丞 C: 邱冠霖 R: 陳志偉 T: 呂明峯",
"2026-9-25": "S: 黃榮國 A: 林森發 N: 彭偉慎 C: 秦桔萬 R: 張哲維 T: 周育稔",
"2026-9-26": "S: 黃經洲 A: 許敦智 N: 王金誠 C: 方振彬 R: 余金原 T: 林宏儒",
"2026-9-27": "S: 范振宇 A: 洪柜峰 N: 王瑞發 C: 官郁庭 R: 劉錦郎 T: 許世勳",
"2026-9-28": "S: 張日曜 A: 羅應順 N: 彭偉慎 C: 孫景泰 R: 張哲維 T: 呂明峯",
"2026-9-29": "S: 黃經洲 A: 王金誠 N: 許敦智 C: 秦桔萬 R: 余金原 T: 林宏儒",
"2026-9-30": "S: 林森發 A: 羅應順 N: 劉暐丞 C: 官郁庭 R: 陳志偉 T: 呂明峯",
"2026-10-1": "S: 張日曜 A: 張哲維 N: 王瑞發 C: 孫景泰 R: 劉錦郎 T: 許世勳",
"2026-10-2": "S: 詹文欽 A: 黃金暄 N: 許敦智 C: 邱冠霖 R: 余金原 T: 林宏儒",
"2026-10-3": "S: 范振宇 A: 官郁庭 N: 劉暐丞 C: 秦桔萬 R: 劉錦郎 T: 洪柜峰",
"2026-10-4": "S: 黃榮國 A: 羅應順 N: 彭偉慎 C: 邱冠霖 R: 林森發 T: 周育稔",
"2026-10-5": "S: 張日曜 A: 許世勳 N: 劉暐丞 C: 方振彬 R: 陳志偉 T: 洪柜峰",
"2026-10-6": "S: 許敦智 A: 孫景泰 N: 王金誠 C: 陳信憲 R: 林森發 T: 周育稔",
"2026-10-7": "S: 范振宇 A: 洪柜峰 N: 彭偉慎 C: 官郁庭 R: 陳志偉 T: 許世勳",
"2026-10-8": "S: 黃經洲 A: 秦桔萬 N: 王瑞發 C: 方振彬 R: 余金原 T: 羅應順",
"2026-10-9": "S: 詹文欽 A: 彭偉慎 N: 許敦智 C: 孫景泰 R: 林森發 T: 周育稔",
"2026-10-10": "S: 黃榮國 A: 邱冠霖 N: 王瑞發 C: 官郁庭 R: 陳志偉 T: 許世勳",
"2026-10-11": "S: 張日曜 A: 黃金暄 N: 劉暐丞 C: 陳信憲 R: 劉錦郎 T: 洪柜峰",
"2026-10-12": "S: 范振宇 A: 秦桔萬 N: 彭偉慎 C: 孫景泰 R: 陳志偉 T: 林宏儒",
"2026-10-13": "S: 黃經洲 A: 黃金暄 N: 王金誠 C: 邱冠霖 R: 林森發 T: 許世勳",
"2026-10-14": "S: 范振宇 A: 羅應順 N: 劉暐丞 C: 官郁庭 R: 劉錦郎 T: 洪柜峰",
"2026-10-15": "S: 許敦智 A: 陳信憲 N: 王瑞發 C: 孫景泰 R: 余金原 T: 周育稔",
"2026-10-16": "S: 黃榮國 A: 呂明峯 N: 王金誠 C: 官郁庭 R: 陳志偉 T: 林宏儒",
"2026-10-17": "S: 詹文欽 A: 洪柜峰 N: 許敦智 C: 方振彬 R: 林森發 T: 羅應順",
"2026-10-18": "S: 黃榮國 A: 劉暐丞 N: 彭偉慎 C: 秦桔萬 R: 余金原 T: 黃經洲",
"2026-10-19": "S: 范振宇 A: 呂明峯 N: 王瑞發 C: 張日曜 R: 劉錦郎 T: 林宏儒",
"2026-10-20": "S: 黃經洲 A: 劉暐丞 N: 許敦智 C: 方振彬 R: 余金原 T: 羅應順",
"2026-10-21": "S: 黃榮國 A: 邱冠霖 N: 王金誠 C: 陳信憲 R: 陳志偉 T: 洪柜峰",
"2026-10-22": "S: 許敦智 A: 林宏儒 N: 黃金暄 C: 秦桔萬 R: 劉錦郎 T: 呂明峯",
"2026-10-23": "S: 張日曜 A: 周育稔 N: 王金誠 C: 孫景泰 R: 余金原 T: 黃經洲",
"2026-10-24": "S: 詹文欽 A: 林宏儒 N: 劉暐丞 C: 邱冠霖 R: 陳志偉 T: 呂明峯",
"2026-10-25": "S: 黃經洲 A: 張日曜 N: 王金誠 C: 陳信憲 R: 劉錦郎 T: 周育稔",
"2026-10-26": "S: 范振宇 A: 許世勳 N: 王瑞發 C: 官郁庭 R: 余金原 T: 林宏儒",
"2026-10-27": "S: 許敦智 A: 方振彬 N: 彭偉慎 C: 孫景泰 R: 林森發 T: 羅應順",
"2026-10-28": "S: 黃榮國 A: 周育稔 N: 王金誠 C: 秦桔萬 R: 陳志偉 T: 許世勳",
"2026-10-29": "S: 黃經洲 A: 官郁庭 N: 王瑞發 C: 邱冠霖 R: 劉錦郎 T: 呂明峯",
"2026-10-30": "S: 張日曜 A: 王金誠 N: 黃金暄 C: 孫景泰 R: 余金原 T: 羅應順",
"2026-10-31": "S: 范振宇 A: 許世勳 N: 彭偉慎 C: 秦桔萬 R: 林森發 T: 呂明峯",





};

// ============================================================================
// Dynamic Holiday & Lunar Generation System (農曆與節氣演算法)
// Calculates accurate 24 Solar Terms (二十四節氣) via Sun's apparent longitude,
// lunar dates (農曆日期與閏月) via 1900-2100 astronomical tables (定朔法),
// traditional festivals, and official public holiday / compensatory rules.
// ============================================================================

function getSunLongitude(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  let M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  let Mrad = M * Math.PI / 180.0;
  let C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad)
        + (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad)
        + 0.000289 * Math.sin(3 * Mrad);
  let trueLong = L0 + C;
  let omega = 125.04 - 1934.136 * T;
  let lambda = trueLong - 0.00569 - 0.00478 * Math.sin(omega * Math.PI / 180.0);
  lambda = lambda % 360;
  if (lambda < 0) lambda += 360;
  return lambda;
}

function dateToJD(date) {
  return (date.getTime() / 86400000.0) + 2440587.5;
}

const SOLAR_TERMS = [
  { name: '小寒', angle: 285 }, { name: '大寒', angle: 300 },
  { name: '立春', angle: 315 }, { name: '雨水', angle: 330 },
  { name: '驚蟄', angle: 345 }, { name: '春分', angle: 0 },
  { name: '清明', angle: 15 },  { name: '穀雨', angle: 30 },
  { name: '立夏', angle: 45 },  { name: '小滿', angle: 60 },
  { name: '芒種', angle: 75 },  { name: '夏至', angle: 90 },
  { name: '小暑', angle: 105 }, { name: '大暑', angle: 120 },
  { name: '立秋', angle: 135 }, { name: '處暑', angle: 150 },
  { name: '白露', angle: 165 }, { name: '秋分', angle: 180 },
  { name: '寒露', angle: 195 }, { name: '霜降', angle: 210 },
  { name: '立冬', angle: 225 }, { name: '小雪', angle: 240 },
  { name: '大雪', angle: 255 }, { name: '冬至', angle: 270 }
];

function getYearSolarTerms(targetYear) {
  const result = {};
  for (let m = 0; m < 12; m++) {
    const daysInMonth = new Date(targetYear, m + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      // Midnight to midnight in UTC+8
      const dtStart = new Date(Date.UTC(targetYear, m, d, -8, 0, 0));
      const dtEnd = new Date(Date.UTC(targetYear, m, d, 16, 0, 0));
      const l1 = getSunLongitude(dateToJD(dtStart));
      const l2 = getSunLongitude(dateToJD(dtEnd));
      for (const term of SOLAR_TERMS) {
        const crossed = term.angle === 0
          ? (l1 > 350 && l2 < 10)
          : (l1 <= term.angle && l2 > term.angle);
        if (crossed) {
          result[`${targetYear}-${m + 1}-${d}`] = term.name;
        }
      }
    }
  }
  return result;
}

const LUNAR_DAY_NAMES = [
  '', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
];

const LUNAR_MONTH_NAMES = [
  '', '正月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'
];

// 1900-2100 權威天文農曆數據表（依據紫金山天文台/中央氣象署精準定朔法編制）
const lunarInfo = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1900-1909
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, // 1910-1919
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1920-1929
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1930-1939
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1940-1949
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, // 1950-1959
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1960-1969
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, // 1970-1979
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, // 1980-1989
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0, // 1990-1999
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2000-2009
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, // 2010-2019
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, // 2020-2029
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2030-2039
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, // 2040-2049
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, // 2050-2059
  0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, // 2060-2069
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, // 2070-2079
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, // 2080-2089
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a4d0, 0x0d150, 0x0f252, // 2090-2099
  0x0d520 // 2100
];

function lYearDays(y) {
  let sum = 348;
  const info = lunarInfo[y - 1900];
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (info & i) ? 1 : 0;
  }
  return sum + leapDays(y);
}

function leapMonth(y) {
  return lunarInfo[y - 1900] & 0xf;
}

function leapDays(y) {
  if (leapMonth(y)) {
    return (lunarInfo[y - 1900] & 0x10000) ? 30 : 29;
  }
  return 0;
}

function monthDays(y, m) {
  if (m > 12 || m < 1) return -1;
  return (lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29;
}

/**
 * 公曆轉農曆核心計算（定朔法）
 * @param {number} y - 公曆年
 * @param {number} m - 公曆月 (1-12)
 * @param {number} d - 公曆日 (1-31)
 * @returns {{ lYear: number, lMonth: number, lDay: number, isLeap: boolean, isBig: boolean }}
 */
function solar2lunar(y, m, d) {
  if (y < 1900 || y > 2100) return null;
  let offset = (Date.UTC(y, m - 1, d) - Date.UTC(1900, 0, 31)) / 86400000;
  let temp = 0;
  let i;
  for (i = 1900; i < 2101 && offset > 0; i++) {
    temp = lYearDays(i);
    offset -= temp;
  }
  if (offset < 0) {
    offset += temp;
    i--;
  }
  const lYear = i;
  const leap = leapMonth(lYear);
  let isLeap = false;

  for (i = 1; i < 13 && offset > 0; i++) {
    if (leap > 0 && i === (leap + 1) && !isLeap) {
      --i;
      isLeap = true;
      temp = leapDays(lYear);
    } else {
      temp = monthDays(lYear, i);
    }
    if (isLeap && i === (leap + 1)) isLeap = false;
    offset -= temp;
  }

  if (offset === 0 && leap > 0 && i === leap + 1) {
    if (isLeap) {
      isLeap = false;
    } else {
      isLeap = true;
      --i;
    }
  }
  if (offset < 0) {
    offset += temp;
    --i;
  }
  const lMonth = i;
  const lDay = Math.floor(offset + 1);
  const mDays = isLeap ? leapDays(lYear) : monthDays(lYear, lMonth);
  return { lYear, lMonth, lDay, isLeap, isBig: mDays === 30 };
}

/**
 * Generates raw holiday and lunar data for any given year in the exact format
 * of the `holiday` data: { "YYYY-M-D": "【lunarName】" + (isHoliday ? "【放假日】" : "") }
 *
 * @param {number|string} [targetYear=year] - The target year (e.g. 2026, 2027, etc.)
 * @returns {Object.<string, string>} Complete dictionary of date keys to raw holiday strings
 */
function generateHolidayData(targetYear = year) {
  const y = parseInt(targetYear, 10);
  if (isNaN(y)) return {};

  const solarTerms = getYearSolarTerms(y);
  const daysMeta = [];
  const result = {};

  for (let m = 1; m <= 12; m++) {
    const daysInMonth = new Date(y, m, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(y, m - 1, d);
      const dateKey = `${y}-${m}-${d}`;
      const lunar = solar2lunar(y, m, d);
      const dayOfWeek = dt.getDay(); // 0: Sun, 6: Sat

      let name = '';
      if (m === 4 && d === 4) {
        name = '兒童節';
      } else if (solarTerms[dateKey]) {
        name = solarTerms[dateKey];
      } else if (lunar && lunar.lMonth === 5 && lunar.lDay === 5 && !lunar.isLeap) {
        name = '端午節';
      } else if (lunar && lunar.lMonth === 8 && lunar.lDay === 15 && !lunar.isLeap) {
        name = '中秋節';
      } else if (lunar && lunar.lDay === 1) {
        const monthPrefix = (lunar.isLeap ? '閏' : '') + (LUNAR_MONTH_NAMES[lunar.lMonth] || `${lunar.lMonth}月`);
        name = `${monthPrefix}${lunar.isBig ? '大' : '小'}`;
      } else if (lunar) {
        name = LUNAR_DAY_NAMES[lunar.lDay] || `初${lunar.lDay}`;
      }

      // Check holidays
      let isHoliday = (dayOfWeek === 0 || dayOfWeek === 6);
      let isFixedHoliday = false;

      // Fixed calendar statutory holidays (Taiwan)
      if (m === 1 && d === 1) isFixedHoliday = true;   // 元旦
      if (m === 2 && d === 28) isFixedHoliday = true;  // 和平紀念日
      if (m === 4 && d === 4) isFixedHoliday = true;   // 兒童節
      if (solarTerms[dateKey] === '清明') isFixedHoliday = true; // 清明節
      if (m === 5 && d === 1) isFixedHoliday = true;   // 勞動節
      if (lunar && lunar.lMonth === 5 && lunar.lDay === 5 && !lunar.isLeap) isFixedHoliday = true;  // 端午節
      if (lunar && lunar.lMonth === 8 && lunar.lDay === 15 && !lunar.isLeap) isFixedHoliday = true; // 中秋節
      if (m === 9 && d === 28) isFixedHoliday = true;  // 孔子誕辰 / 教師節
      if (m === 10 && d === 10) isFixedHoliday = true; // 國慶日
      if (m === 10 && d === 25) isFixedHoliday = true; // 光復節
      if (m === 12 && d === 25) isFixedHoliday = true; // 行憲紀念日

      // Spring Festival: 除夕 (day before 正月初一), 初一, 初二, 初三, 初四
      const tomorrow = new Date(y, m - 1, d + 1);
      const lTomorrow = solar2lunar(tomorrow.getFullYear(), tomorrow.getMonth() + 1, tomorrow.getDate());
      if (lTomorrow && lTomorrow.lMonth === 1 && lTomorrow.lDay === 1 && !lTomorrow.isLeap) {
        isFixedHoliday = true; // 除夕（無論是臘月廿九或三十，正月初一前一日即為除夕）
      }
      if (lunar && lunar.lMonth === 1 && !lunar.isLeap && [1, 2, 3, 4].includes(lunar.lDay)) {
        isFixedHoliday = true; // 初一, 初二, 初三, 初四
      }

      daysMeta.push({
        dateKey,
        dayOfWeek,
        name,
        isWeekend: (dayOfWeek === 0 || dayOfWeek === 6),
        isFixedHoliday,
        isHoliday: isHoliday || isFixedHoliday
      });
    }
  }

  // Weekend makeup / substitute holidays (Saturday -> preceding Friday, Sunday -> following Monday)
  daysMeta.forEach((dm, idx) => {
    if (dm.isFixedHoliday && dm.isWeekend) {
      if (dm.dayOfWeek === 6) {
        if (idx > 0 && !daysMeta[idx - 1].isHoliday) {
          daysMeta[idx - 1].isHoliday = true;
        }
      } else if (dm.dayOfWeek === 0) {
        let nextIdx = idx + 1;
        while (nextIdx < daysMeta.length && daysMeta[nextIdx].isHoliday) {
          nextIdx++;
        }
        if (nextIdx < daysMeta.length) {
          daysMeta[nextIdx].isHoliday = true;
        }
      }
    }
  });

  daysMeta.forEach(dm => {
    result[dm.dateKey] = `【${dm.name}】` + (dm.isHoliday ? '【放假日】' : '');
  });

  return result;
}

// Dynamic holiday & lunar data generated on demand via Lunar Generation System
const holiday = new Proxy({}, {
  get(cache, date) {
    if (typeof date === 'string' && /^\d{4}-\d{1,2}-\d{1,2}$/.test(date)) {
      if (!(date in cache)) {
   
										
        const y = parseInt(date.split('-')[0], 10);
        if (!isNaN(y)) Object.assign(cache, generateHolidayData(y));
								  
											 
										   
      }
    }
    return cache[date];
  },
  has(cache, date) {
					 
    if (typeof date === 'string' && /^\d{4}-\d{1,2}-\d{1,2}$/.test(date)) {
      if (!(date in cache)) {
        const y = parseInt(date.split('-')[0], 10);
        if (!isNaN(y)) Object.assign(cache, generateHolidayData(y));
							 
      }
    }
    return date in cache;
  }
});

function ensureHolidayData(targetYear) {
  if (targetYear) holiday[`${targetYear}-1-1`];
}

if (typeof window !== 'undefined') {
  window.generateHolidayData = generateHolidayData;
  window.generateHoliday = generateHolidayData;
  window.ensureHolidayData = ensureHolidayData;
  window.holiday = holiday;
}

const bgMusic = document.getElementById("bgMusic");


let isPlaying = false;

let lastTouchTime = 0;

function toggleMusic() {
  const now = Date.now();
  if (now - lastTouchTime < 300) return;
  lastTouchTime = now;
  if (!isPlaying) {
    bgMusic.play().catch(e => console.log(e));
    isPlaying = true;
  } else {
    bgMusic.pause();
    isPlaying = false;
  }
}

  


function checkDayChange() {
  const now = new Date();
  const newDay = now.getDate();

 
  if (newDay !== currentDay) {
      window.location.reload();
  }
}


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
  function handleMouseOver() {
    showTooltip(date);
    if (date == '999') {
      hideTooltip();
    }
    highlightAdditionalHoliday();
  }

  function handleMouseOut() {
    highlightSelectedName(temp_name);
    const items = document.querySelectorAll('.picker-item');
    items.forEach((item) => {
      if (temp_name === item.textContent && temp_name != "．．．") {
        item.style.transform = 'scale(1.5)';
        item.style.backgroundColor = "turquoise";
      }
    });
    highlightAdditionalHoliday();
    hideTooltip();
  }

  // Mouse events (for desktop)
  dayElement.addEventListener('mouseover', handleMouseOver);
  dayElement.addEventListener('mouseout', handleMouseOut);

  // Touch events (for mobile)
  dayElement.addEventListener('touchstart', (event) => {
    handleMouseOver();
    event.preventDefault();  // Prevents triggering mouse events after touch
  });

  dayElement.addEventListener('touchend', (event) => {
    handleMouseOut();
    event.preventDefault();
  });
}
function addEventListener_toHideToolTipandShowToday(headerCell) {
  headerCell.addEventListener('click', () => {
    const days = document.querySelectorAll('.day');
    if (clickCount % 2 === 0) {
      hideTooltip();
   
      highlightSelectedName(temp_name);
      const items = document.querySelectorAll('.picker-item');
      items.forEach((item) => {
        if (temp_name === item.textContent && temp_name != "．．．"){
          item.style.transform = 'scale(1.5)';
          item.style.backgroundColor = "turquoise";
        }
      });
   
      headerCell.style.backgroundColor="#3498db";
      headerCell.style.backgroundImage ="";
     
    } else {
      days.forEach(dayElement => {
        // Remove the original classes plus all the new top/bottom split classes
        dayElement.classList.remove(
          'selected', 'selected-top', 'selected-bottom',
          'selected2', 'selected2-top', 'selected2-bottom',
          'selected3', 'selected3-top', 'selected3-bottom',
          'today-selected'
        );
      });

      headerCell.style.backgroundImage = "linear-gradient(to right, #345bdb, #2e4d8f)";

      showTooltip(formattedDate);
      positionTooltip();
      if (btn && btn.checked){
        hideTooltip();
      }
    }
    clickCount++;
  });
}

function createheadercell(year, month, day) {
  const headerCell = document.createElement('div');
  headerCell.classList.add('header-cell');
   
  headerCell.innerHTML = `${year} 年 &nbsp;&nbsp&nbsp;&nbsp${month} 月&nbsp&nbsp;&nbsp&nbsp;&nbsp ${day} 日 &nbsp;`; 

  header.appendChild(headerCell);
  headerCell.style.zIndex = '20';
  addEventListener_toHideToolTipandShowToday(headerCell);
  
}


function createCalendar(year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
  var counter = 0;
  var counterN = 0;
  var now = new Date();
  var year_now = now.getFullYear();
  var month_now = (now.getMonth() + 1); 
  var day_now = now.getDate();
  
  
  

  
  
  for (let i=0; i < 7; i++){
    const weekdayElement = document.createElement('div');
    weekdayElement.classList.add('weekday');
    weekdayElement.textContent = weekdays[i];
    calendar.appendChild(weekdayElement);
    weekdayElement.addEventListener('dblclick', function() {
     
      alert("\n 1. 點【白色圓形】圖示：向左←上個月班表；向右→下個月班表 \n 2. 點正方形【年月日框框】會切換個人班表及選擇某日班表 \n 3. 【點下方Me】自動選擇自己的名字並顯示班表 4. 【滑動名字】顯示該員當月班表 \n 5. 點2下名字會切換至【Line視窗】 \n 6. 新增功能→→→按住日期會【放大】該點選的日期 \n 7. 新增功能→→→點日期會出現記事本且可拖曳，再點後可編輯，完成後可儲存、取消或刪除。 \n  8. 標題(title)會顯示最近1次更新班表的時間【Last Updated】 \n 9. 【今天】以灰底顏色搭配彩虹邊框(跑馬燈)表示 \n 10. 名單條【可以拖曳移動】，若要恢復原位置→【點2下】【年月日框框】\n 11.【新增農曆】於日曆中 \n 13. 按住星期一～星期日其中一格2秒，會自動reload網頁。\n  \n\n\n 祝 平安 順心 \n 洪柜峰敬上");
      
      addEventListeners(weekdayElement, btn, day, month, year, 999);  
      
    });
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
      
   
      const card = document.createElement('div');
      card.classList.add('card');
      
      const innerCard = document.createElement('div');
      innerCard.classList.add('inner-card');
      
      const frontFace = document.createElement('div');
      frontFace.classList.add('card-face', 'day');
      frontFace.textContent = day;
      
      const backFace = document.createElement('div');
      backFace.classList.add('card-face', 'back');
      
      const noteContent = document.createElement('div');
      noteContent.classList.add('note-content');
      noteContent.textContent = 'Loading...';
      
      const noteEditor = document.createElement('div');
      noteEditor.classList.add('note-editor');
      
      const textarea = document.createElement('textarea');
      textarea.placeholder = 'Write your note here...';
      
      const editorButtons = document.createElement('div');
      editorButtons.classList.add('note-editor-buttons');
      
      const saveBtn = document.createElement('button');
      saveBtn.classList.add('btn', 'save-btn');
      saveBtn.textContent = 'Save';
      
      const cancelBtn = document.createElement('button');
      cancelBtn.classList.add('btn', 'cancel-btn');
      cancelBtn.textContent = 'Cancel';
      
      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('btn', 'delete-btn');
      deleteBtn.textContent = 'Delete';
      
  
      editorButtons.appendChild(saveBtn);
      editorButtons.appendChild(cancelBtn);
      editorButtons.appendChild(deleteBtn);
      
      noteEditor.appendChild(textarea);
      noteEditor.appendChild(editorButtons);
      
      backFace.appendChild(noteContent);
      backFace.appendChild(noteEditor);
      
      innerCard.appendChild(frontFace);
      innerCard.appendChild(backFace);
      
      card.appendChild(innerCard);
      
   
      calendar.appendChild(card);
      
    
      if (Zellercongruence(day, month, year) === 0 || Zellercongruence(day, month, year) === 6) {
        frontFace.classList.add('weekend');
      }
      
    
      if (year === year_now && month === month_now && day === day_now) {
        frontFace.classList.add('today');
      }
      
     
      addEventListeners(card, btn, day, month, year, date);
      
      
      setupNoteEventListeners(card, date);

      
      fetchNote(card, date);
      
    }
  
    function setupNoteEventListeners(card, date) {
      const backFace = card.querySelector('.back');
      const noteContent = card.querySelector('.note-content');
      const noteEditor = card.querySelector('.note-editor');
      const textarea = card.querySelector('textarea');
      const saveBtn = card.querySelector('.save-btn');
      const cancelBtn = card.querySelector('.cancel-btn');
      const deleteBtn = card.querySelector('.delete-btn');
    
      // Enhanced textarea styling for better mobile interaction
      textarea.style.WebkitAppearance = 'none';
      textarea.style.appearance = 'none';
      textarea.style.borderRadius = '4px';
      textarea.style.border = '1px solid #ccc';
      textarea.style.padding = '8px';
      textarea.style.width = '100%';
      textarea.style.minHeight = '60px';
      textarea.style.fontSize = '16px'; // Important for iOS to prevent zoom
      textarea.autocomplete = 'off';
      textarea.autocorrect = 'off';
      textarea.autocapitalize = 'off';
      textarea.spellcheck = false;
      textarea.style.userSelect = 'text'; // Explicitly enable text selection
      textarea.style.WebkitUserSelect = 'text';
      textarea.style.MozUserSelect = 'text';
      textarea.style.msUserSelect = 'text';
    
      // Setup clipboard helper
      if (!window.Clipboard) {
        window.Clipboard = (function(window, document, navigator) {
          var textArea, copy;
          
          function isOS() {
            return navigator.userAgent.match(/ipad|iphone/i);
          }
          
          function createTextArea(text) {
            textArea = document.createElement('textArea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
          }
          
          function selectText() {
            var range, selection;
            if (isOS()) {
              range = document.createRange();
              range.selectNodeContents(textArea);
              selection = window.getSelection();
              selection.removeAllRanges();
              selection.addRange(range);
              textArea.setSelectionRange(0, 999999);
            } else {
              textArea.select();
            }
          }
          
          function copyToClipboard() {
            document.execCommand('copy');
            document.body.removeChild(textArea);
          }
          
          copy = function(text) {
            createTextArea(text);
            selectText();
            copyToClipboard();
          };
          
          return {
            copy: copy
          };
        })(window, document, navigator);
      }
    
      function showEditor() {
        noteContent.style.display = 'none';
        
        // Check if textarea already contains the date
        let content = noteContent.textContent === `${date}\nClick to edit note` ? '' : noteContent.textContent;
        
        if (!content.includes(`${date}`)) {
          // Date not found, add it at the beginning
          textarea.value = `${date}\n${content}`;
        } else {
          // Date already exists, just use the content as is
          textarea.value = content;
        }
        
        noteEditor.style.display = 'flex';
        
        // Force keyboard to appear by using a sequence of actions
        setTimeout(() => {
          textarea.readOnly = false;
          textarea.blur();
          
          // More aggressive focusing technique for iOS
          if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            // iOS specific focus handling
            textarea.click();
            textarea.focus();
            // Try to set cursor position explicitly for iOS
            try {
              const len = textarea.value.length;
              textarea.setSelectionRange(len, len);
            } catch (e) {
              console.log("Could not set selection range", e);
            }
          } else {
            textarea.focus();
          }
          
          // Secondary focus attempt after a longer delay
          setTimeout(() => {
            if (document.activeElement !== textarea) {
              textarea.focus();
              // Try to force virtual keyboard on mobile
              if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                textarea.click();
              }
            }
          }, 500);
        }, 100);
      }
    
      function hideEditor() {
        noteEditor.style.display = 'none';
        noteContent.style.display = 'block'; // Show content again
      }
    
      function saveNote(text) {
        noteContent.textContent = text || `${date}\nClick to edit note`;
        const safeKey = date + "-" + username;
        const frontFace = card.querySelector('.day');
        const existingDot = frontFace.querySelector('.note-dot');


        if (text && text.trim() !== '') {
          if (!existingDot) {
            const dot = document.createElement('span');
            dot.className = 'note-dot';
            frontFace.appendChild(dot);
          }
        } else {
          if (existingDot) {
            frontFace.removeChild(existingDot);
          }
        }

        window.firebaseSet(window.firebaseRef(window.firebaseDB, "Notes/" + safeKey), {
          Name: username,
          Date: date,
          Content: text || '',
          Timestamp: new Date().toISOString()
        })
        .then(() => {
          console.log("Note saved successfully");
        })
        .catch((error) => {
          console.error("Error saving note:", error);
          alert("Error saving note: " + error.message);
        });
      }
    

    
      // Separate touch and click events completely
      backFace.addEventListener('dblclick', function(e) {
        e.stopPropagation();
        if (e.target === backFace || e.target === noteContent) {
          showEditor();
        }
      });
    
      // Dedicated mobile touch handlers
      backFace.addEventListener('touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.target === backFace || e.target === noteContent) {
          showEditor();
        }
      });
    
      // Ensure textarea captures all its own events
      textarea.addEventListener('touchstart', function(e) {
        e.stopPropagation();
      }, { passive: true });
      
      textarea.addEventListener('touchend', function(e) {
        e.stopPropagation();
      });
    
      textarea.addEventListener('click', function(e) {
        e.stopPropagation();
        setTimeout(() => textarea.focus(), 10);
      });
    
      // Create a dedicated tap handler for the textarea
      let tapHandler = function(e) {
        e.stopPropagation();
        textarea.focus();
      };
      
      textarea.addEventListener('touchstart', tapHandler, { passive: false });
    
      // Improved cut/copy/paste handling for iOS
      textarea.addEventListener('cut', function(e) {
        e.stopPropagation();
        // Let default cut behavior happen
      });
      
      textarea.addEventListener('copy', function(e) {
        e.stopPropagation();
        // Let default copy behavior happen
      });
      
      textarea.addEventListener('paste', function(e) {
        e.stopPropagation();
        // For iOS Safari sometimes we need to manually handle paste
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && navigator.userAgent.indexOf('Safari') !== -1) {
          // Let default paste happen first, then ensure the textarea keeps focus
          setTimeout(() => {
            textarea.focus();
          }, 100);
        }
      });
    
      // Button handlers
      saveBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        saveNote(textarea.value);
        hideEditor();
      });
    
      saveBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        saveNote(textarea.value);
        hideEditor();
      });
    
      cancelBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        hideEditor();
      });
    
      cancelBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        hideEditor();
      });
    
      deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this note?')) {
          saveNote('');
          hideEditor();
        }
      });
    
      deleteBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this note?')) {
          saveNote('');
          hideEditor();
        }
      });
    
      // Prevent event bubbling in the editor
      noteEditor.addEventListener('click', function(e) {
        e.stopPropagation();
      });
      
      noteEditor.addEventListener('touchstart', function(e) {
        e.stopPropagation();
      }, { passive: true });
    }
    

  function fetchNote(card, date) {
  
  const noteContent = card.querySelector('.note-content');
  const frontFace = card.querySelector('.day');
  
  if (typeof username === 'undefined' || !username) {
    
    noteContent.textContent = "Loading...";
    
    setTimeout(() => {
      if (typeof username !== 'undefined' && username) {
        fetchNote(card, date); // Retry once username is defined
      }
    }, 500);
    return;
  }
  
  const safeKey = date + "-" + username;
  
  
  if (!window.firebaseRef || !window.firebaseDB || !window.firebaseGet) {
    console.error("Firebase references are not available");
    noteContent.textContent = `${date}\nClick to edit note`;
    return;
  }
  
  const noteRef = window.firebaseRef(window.firebaseDB, "Notes/" + safeKey);

  
  window.firebaseGet(noteRef)
    .then((snapshot) => {
      if (snapshot && snapshot.exists()) {
        const noteData = snapshot.val();
        if (noteData && noteData.Content) {
          noteContent.textContent = noteData.Content;

          // Add dot if not already there
          if (!frontFace.querySelector('.note-dot')) {
            const dot = document.createElement('span');
            dot.className = 'note-dot';
            frontFace.appendChild(dot);
          }

          console.log(`Note for ${date} fetched successfully`);
        } else {
          console.log(`Empty note content for ${date}`);
          noteContent.textContent = `${date}\nClick to edit note`;
          // Remove dot if note is empty
          const existingDot = frontFace.querySelector('.note-dot');
          if (existingDot) {
            frontFace.removeChild(existingDot);
          }
        }
      } else {
        console.log(`No note found for ${date}`);
        noteContent.textContent = `${date}\nClick to edit note`;

        const existingDot = frontFace.querySelector('.note-dot');
        if (existingDot) {
          frontFace.removeChild(existingDot);
        }
      }
    })
    .catch((error) => {
      console.error(`Error fetching note for ${date}:`, error);
      noteContent.textContent = `${date}\nClick to edit note`;
    });
}
    
    setupCardFlip();

} /* Create Calendar ends */






function positionTooltip() {
  const header = document.getElementById('header');
  const tooltip = document.getElementById('tooltip');
  
 
  const headerRect = header.getBoundingClientRect();
  
  
  tooltip.style.top = `${headerRect.bottom + 4}px`;
  tooltip.style.left = `${headerRect.left}px`; 
}
function colorizeDuty(dutyText) {
  return dutyText
    .replace(/S:\s*([^A-Z]+)/g, '<span class="duty-s">S: $1</span>')
    .replace(/A:\s*([^A-Z]+)/g, '<span class="duty-a">A: $1</span>')
    .replace(/N:\s*([^A-Z]+)/g, '<span class="duty-n">N: $1</span>')
    .replace(/C:\s*([^A-Z]+)/g, '<span class="duty-c">C: $1</span>')
    .replace(/R:\s*([^A-Z]+)/g, '<span class="duty-r">R: $1</span>')
    .replace(/T:\s*([^A-Z]+)/g, '<span class="duty-t">T: $1</span>');
}



function showTooltip(date) {
  
  const [year, month, day] = date.split('-');
  const formattedDate =  `${month}月${day}日`
  const rawDutyInfo = dutySchedule[date] || "None";
  const dutyInfo = colorizeDuty(rawDutyInfo);
  
  if (weatherData[date]) {
   
    const minTemperature = weatherData[date].minTemperature;
    const maxTemperature = weatherData[date].maxTemperature;
    const minHumidity = weatherData[date].minHumidity;
    const maxHumidity = weatherData[date].maxHumidity;
    const weatherCondition = weatherData[date].weatherCondition;


    tooltip.innerHTML = `<span class="tooltip-day">${formattedDate}</span><span class="tooltip-duty">${dutyInfo}</span><span class="tooltip-weather">Temperature: ${minTemperature}°C～${maxTemperature}°C
      Humidity:\n ${minHumidity}%～${maxHumidity}%
      Weather: ${weatherCondition}</span>
    `;

  } else {
   
    tooltip.innerHTML = `<span class="tooltip-day">${formattedDate}\n</span><span class="tooltip-duty">${dutyInfo}</span>`;
  }

  tooltip.style.display = 'block';
  document.title = holiday[date] || lastUpdated;
  tooltip.style.fontSize = '16px'; 
}


function hideTooltip() {
  tooltip.style.display = 'none';
  document.title = lastUpdated;
}

/**
 * Selects any month & year (e.g., 2026-01 through 2036-12) and applies
 * all the same calendar, header, holiday, lunar, and on-duty highlight effects.
 */
function selectYearMonth(targetYear, targetMonth) {
  let y = parseInt(targetYear, 10);
  let m = parseInt(targetMonth, 10);

  if (m > 12) {
    m = 1;
    y++;
  } else if (m < 1) {
    m = 12;
    y--;
  }

  if (y < MIN_YEAR) {
    y = MIN_YEAR;
    m = 1;
  } else if (y > MAX_YEAR) {
    y = MAX_YEAR;
    m = 12;
  }

  year = y;
  month = m;
						  

  const yearSelect = document.getElementById('yearSelect');
  const monthSelect = document.getElementById('monthSelect');
  if (yearSelect) yearSelect.value = String(year);
  if (monthSelect) monthSelect.value = String(month);

  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;
					 
				
			 
	 
							   
	
															   
																				
	
	
												   
								 
	
								 
									

  if (year === nowYear && month === nowMonth) {
    mode = "neutral";
  } else if (year < nowYear || (year === nowYear && month < nowMonth)) {
    mode = "light";
  } else {
    mode = "dark";
  }

  body.classList.remove("light", "neutral", "dark");
  body.classList.add(mode);
														 
															 
	 
				  
								 
  if (btn) {
    btn.classList.remove("light", "neutral", "dark");
    btn.classList.add(mode);
  }

  updateSelection();
  clearSelectedClass();
  hideTooltip();

  calendar.innerHTML = '';
  createCalendar(year, month);

  const headerCells = document.querySelector('.header-cell');
  let headerEl = document.getElementById('header');

  if (mode === "neutral") {
												   
    if (headerEl) headerEl.style.color = '';
  
	
    if (headerCells) {
      headerCells.innerHTML = `${year} 年 &nbsp;&nbsp;&nbsp${month} 月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp ${day} 日 &nbsp;`;
    }
    showTooltip(formattedDate);
    fetchWeather();
    AddWeekDay();
    highlightAdditionalHoliday();
  } else if (mode === "dark") {
    if (headerEl) headerEl.style.color = 'white';
    if (headerCells) {
      headerCells.innerHTML = `${year} 年 &nbsp;&nbsp;&nbsp${month} 月&nbsp;`;
							
								 
							 
   
					  
			 
				 
			
			   

    }
    hideTooltip();
    highlightAdditionalHoliday();
  } else {
    if (headerEl) headerEl.style.color = '';
	
	
    if (headerCells) {
      headerCells.innerHTML = `${year} 年 &nbsp;&nbsp;&nbsp&nbsp;&nbsp${month} 月&nbsp;`;
    }
    fetchWeather();
    hideTooltip();
    highlightAdditionalHoliday();
  }

  // Re-apply on-duty markings for the selected person on the newly selected month
  highlightSelectedName(temp_name);
  const items = document.querySelectorAll('.picker-item');
  items.forEach((item) => {
    if (temp_name === item.textContent && temp_name != "．．．") {
      item.style.transform = 'scale(1.5)';
      item.style.backgroundColor = "turquoise";
    }
  });
 
  
							   
								  

  // Re-attach weekday long-press reload handlers
  let reloadDivs = document.getElementsByClassName("weekday");
  for (let i = 0; i < reloadDivs.length; i++) {
    let reloadDiv = reloadDivs[i];
    reloadDiv.addEventListener("mousedown", startTimer);
    reloadDiv.addEventListener("mouseup", clearTimer);
    reloadDiv.addEventListener("mouseleave", clearTimer);

   
    reloadDiv.addEventListener("touchstart", startTimer);
    reloadDiv.addEventListener("touchend", clearTimer);
    reloadDiv.addEventListener("touchcancel", clearTimer);
  }

  makeCardDraggable();
}

					   

function setMode(newMode) {
  mode = newMode;
  if (newMode === "dark") {
    selectYearMonth(year, month + 1);
  } else if (newMode === "neutral") {
    selectYearMonth(now.getFullYear(), now.getMonth() + 1);
  } else if (newMode === "light") {
    selectYearMonth(year, month - 1);
  }
}

function initMonthPickerControls() {
  const yearSelect = document.getElementById('yearSelect');
  const monthSelect = document.getElementById('monthSelect');
  const prevMonthBtn = document.getElementById('prevMonthBtn');
  const nextMonthBtn = document.getElementById('nextMonthBtn');
  const currentMonthBtn = document.getElementById('currentMonthBtn');

  if (yearSelect && monthSelect) {
    yearSelect.innerHTML = '';
    for (let y = MIN_YEAR; y <= MAX_YEAR; y++) {
      const opt = document.createElement('option');
      opt.value = String(y);
      opt.textContent = `${y}年`;
      yearSelect.appendChild(opt);
    }

    monthSelect.innerHTML = '';
    for (let m = 1; m <= 12; m++) {
      const opt = document.createElement('option');
      opt.value = String(m);
      opt.textContent = `${m}月`;
      monthSelect.appendChild(opt);
    }

    const initialYear = Math.min(MAX_YEAR, Math.max(MIN_YEAR, year));
    yearSelect.value = String(initialYear);
    monthSelect.value = String(month);

    yearSelect.addEventListener('change', () => {
      selectYearMonth(parseInt(yearSelect.value, 10), parseInt(monthSelect.value, 10));
    });

    monthSelect.addEventListener('change', () => {
      selectYearMonth(parseInt(yearSelect.value, 10), parseInt(monthSelect.value, 10));
    });
  }

  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      selectYearMonth(year, month - 1);
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
      selectYearMonth(year, month + 1);
    });
  }

  if (currentMonthBtn) {
    currentMonthBtn.addEventListener('click', () => {
      selectYearMonth(now.getFullYear(), now.getMonth() + 1);
    });
  }
}

function scroll(info) {
  var result = ''; 
  
  
  for (var i = 0; i < info.length; i++) {
    var currentChar = info[i];
    var nextChar = info[i + 1];
    
    if (currentChar === ' ' && (nextChar.match(/[A-Z]/) )) {
      result += '&nbsp;&nbsp;&nbsp'; 
      
    } else if (currentChar === ' '){
      result += '&nbsp';
    }else {
      result += currentChar; 
 
    }
  }
  result =  result + '&nbsp;&nbsp;&nbsp★★★&nbsp;&nbsp;&nbsp【使用說明】請點2下&nbsp;&nbsp;&nbsp星期(一～日)&nbsp;&nbsp;&nbsp★★★' ;
  result = '&nbsp;&nbsp;&nbsp' + result;
  var marquee = document.getElementById("scrollingText");
  marquee.innerHTML = '<p>' + result + '</p>'; 
}

const names = [
  "．．．",
  "．．．",
  "詹文欽",
  "黃榮國",
  "范振宇",
  "王金誠",
  "許敦智",
  "劉暐丞",
  "彭偉慎",
  "王瑞發",
  "黃金暄",
  "張日曜",
  "秦桔萬",
  "邱冠霖",
  "孫景泰",
  "官郁庭",
  "方振彬",
  "陳信憲",
  "林森發",
  "劉錦郎",
  "張哲維",
  "余金原",
  "陳志偉",
  "黃經洲",
  "許世勳",
  "洪柜峰",
  "周育稔",
  "林宏儒",
  "羅應順",
  "呂明峯",
  "．．．",
  "．．．",
];

const photos = {
  "詹文欽": "images/詹文欽.jpg",
  "黃榮國": "images/黃榮國.jpg",
  "范振宇": "images/范振宇.jpg",
  "王金誠":"images/王金誠.jpg",
  "許敦智":"images/許敦智.jpg",
  "劉暐丞":"images/劉暐丞.jpg",
  "彭偉慎":"images/彭偉慎.jpg",
  "王瑞發":"images/王瑞發.jpg",
  "張日曜":"images/張日曜.jpg",
  "秦桔萬":"images/秦桔萬.jpg",
  "邱冠霖":"images/邱冠霖.jpg",
  "孫景泰":"images/孫景泰.jpg",
  "官郁庭":"images/官郁庭.jpg",
  "方振彬":"images/方振彬.jpg",
  "林森發":"images/林森發.jpg",
  "劉錦郎":"images/劉錦郎.jpg",
  "張哲維":"images/張哲維.jpg",
  "余金原":"images/余金原.jpg",
  "陳志偉":"images/陳志偉.jpg",
  "黃經洲":"images/黃經洲.png",
  "許世勳":"images/許世勳.jpg",
  "洪柜峰":"images/洪柜峰.jpg",
  "周育稔":"images/周育稔.jpg",
  "林宏儒":"images/林宏儒.jpg",
  "羅應順":"images/羅應順.jpg",
  "呂明峯":"images/呂明峯.jpg"
 
};
const namePicker = document.getElementById("namePicker");
let currentIndex = 0;

const selectedClassName = 'selected';
const selectedClassName2 = 'selected2';
const selectedClassName3 = 'selected3';

function highlightSelectedName(selectedName) {
  const days = document.querySelectorAll('.day');
  
  days.forEach(dayElement => {
    // Clear all previous highlight classes, including our new split variants
    dayElement.classList.remove(
      'selected', 'selected-top', 'selected-bottom',
      'selected2', 'selected2-top', 'selected2-bottom',
      'selected3', 'selected3-top', 'selected3-bottom',
      'today-selected'
    );

    const dayText = dayElement.textContent.split('\n')[0].trim();
    if (!dayText) return; // Skip empty blocks
    
    const date = `${year}-${month}-${dayText}`;
    const scheduleForDay = dutySchedule[date] || '';
    const scheduleParts = scheduleForDay.split(' ');

    let currentCat = 1; // 1 = N/C/R/T (default), 2 = A, 3 = S
    let match1 = 'none', match2 = 'none', match3 = 'none';

    scheduleParts.forEach(part => {
      let text = part.trim();
      if (!text) return;

      if (text === 'S:') {
        currentCat = 3;
      } else if (text === 'A:') {
        currentCat = 2;
      } else if (text.match(/^[A-Z]:$/)) { 
        // Matches N:, C:, R:, T:, etc.
        currentCat = 1;
      } else {
        // It's a name node. Check for a split shift:
        if (text.includes('_')) {
          let [topName, bottomName] = text.split('_');
          
          if (topName === selectedName) {
            if (currentCat === 3) match3 = 'top';
            else if (currentCat === 2) match2 = 'top';
            else match1 = 'top';
          }
          if (bottomName === selectedName) {
            if (currentCat === 3) match3 = 'bottom';
            else if (currentCat === 2) match2 = 'bottom';
            else match1 = 'bottom';
          }
        } else {
          // Full shift
          if (text === selectedName) {
            if (currentCat === 3) match3 = 'full';
            else if (currentCat === 2) match2 = 'full';
            else match1 = 'full';
          }
        }
        // Reset category back to default after processing a name
        currentCat = 1; 
      }
    });

    // Apply the corresponding classes based on our match results
    if (match3 !== 'none') {
      if (match3 === 'full') dayElement.classList.add('selected3');
      if (match3 === 'top') dayElement.classList.add('selected3-top');
      if (match3 === 'bottom') dayElement.classList.add('selected3-bottom');
    }
    if (match2 !== 'none') {
      if (match2 === 'full') dayElement.classList.add('selected2');
      if (match2 === 'top') dayElement.classList.add('selected2-top');
      if (match2 === 'bottom') dayElement.classList.add('selected2-bottom');
    }
    if (match1 !== 'none') {
      if (match1 === 'full') dayElement.classList.add('selected');
      if (match1 === 'top') dayElement.classList.add('selected-top');
      if (match1 === 'bottom') dayElement.classList.add('selected-bottom');
    }

   
  });

  // Maintain your existing hover clearing behavior
  days.forEach(dayElement => {
    dayElement.addEventListener('mouseover', () => {
      days.forEach(day => {
        day.classList.remove(
          'selected', 'selected-top', 'selected-bottom',
          'selected2', 'selected2-top', 'selected2-bottom',
          'selected3', 'selected3-top', 'selected3-bottom'
        );
      });
    });
  });
}


function highlightAdditionalHoliday() {
						  
  const days = document.querySelectorAll('.day');
  days.forEach(dayElement => {
    const dayText = dayElement.textContent.split('\n')[0].trim();
    if (!dayText) return;
    const date = `${year}-${month}-${dayText}`;
    const holidayInfo = holiday[date];
    
    if (holidayInfo) {
      const namesForHoliday = holidayInfo.split(' ');
      if (namesForHoliday.some(name => name.includes('放假日'))) {

        dayElement.style.color = 'red';
      } else {
	 
																	
        dayElement.style.color = 'black';
      }
    } else {
      // Fallback for any month not explicitly in `holiday`:
      // keep weekends red and weekdays black
      if (dayElement.classList.contains('weekend')) {
        dayElement.style.color = 'red';
      } else {
        dayElement.style.color = 'black';
      }
    }
	 
  });

  AddLunar();
 
}
function AddLunar() { 
						  
  const days = document.querySelectorAll('.day');
  days.forEach(dayElement => {
    const dayText = dayElement.textContent.split('\n')[0].trim();
    if (!dayText) return;
    const date = `${year}-${month}-${dayText}`;
    let lunarName = (holiday[date] || '').split('】')[0].replace('【', '');

    
    if (lunarName) {
      dayElement.innerHTML = `${dayText}\n<span class="lunar-name">${lunarName}</span>`;
    }
  });
}
function isLineBrowser() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  return ua.indexOf('Line') > -1;
}




function clearSelectedClass() {
  const days = document.querySelectorAll('.day');
  days.forEach(dayElement => {
    dayElement.classList.remove(
      'selected', 'selected-top', 'selected-bottom',
      'selected2', 'selected2-top', 'selected2-bottom',
      'selected3', 'selected3-top', 'selected3-bottom'
    );
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
  let hasTurquoiseBackground = false;
  items.forEach((item) => {
    const itemRect = item.getBoundingClientRect();
    const itemCenterY = itemRect.top + itemRect.height / 2;
    const distanceToCenter = Math.abs(containerCenterY - itemCenterY);
      if (distanceToCenter < containerRect.height / 10 && item.textContent != "．．．") { 
        item.style.transform = 'scale(1.5)';
        updateSelection();
        item.style.backgroundColor = "turquoise";
        item.style.color = '';
        item.style.opacity = '1';
        temp_name=item.textContent;
        highlightSelectedName(item.textContent);
        hasTurquoiseBackground = true;
      } else {
        item.style.transform = 'scale(1)';
        item.style.opacity = '0.85';
        item.style.color = 'gray';
      }
  });  

  if (!hasTurquoiseBackground) {
    ClearSelectedName();
    hasTurquoiseBackground = false;
  }
}

function ClearSelectedName() {
  const days = document.querySelectorAll('.day');
  days.forEach(dayElement => {        
    dayElement.classList.remove(
      'selected', 'selected-top', 'selected-bottom',
      'selected2', 'selected2-top', 'selected2-bottom',
      'selected3', 'selected3-top', 'selected3-bottom'
    );
  });
}







const apiKey = '35af5c01f0d331eb99f5a42b0259c663';
const latitude = 25.07639;
const longitude = 121.22389;


function fetchWeather() {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
       let temperatureKelvin = data.main.temp;
       let temperatureCelsius = (temperatureKelvin - 273.15).toFixed(1);
       let ch_weather ='';
       let visibility = (data.visibility/1000).toFixed(1);
       let windSpeed = (data.wind.speed*1.943844).toFixed(2);
     
       
       humidity = data.main.humidity;
       weatherCondition = data.weather[0].main;

     
      if (weatherCondition ==='Rain') {
        document.body.style.background = 'url(bg.png)';
        document.body.style.backgroundSize= 'cover';
        document.body.style.backgroundPosition= 'center';
        ch_weather='雨天';
        
      } else if (weatherCondition === 'Clouds' && humidity > 80) {
        document.body.style.background = 'url(bg.png)';
        document.body.style.backgroundSize= 'cover';
        document.body.style.backgroundPosition= 'center';
        ch_weather='陰天';
        
      } else if (weatherCondition === 'Drizzle') {
        document.body.style.background = 'url(bg.png)';
        document.body.style.backgroundSize= 'cover';
        document.body.style.backgroundPosition= 'center';
        ch_weather='毛毛雨';
        
      } else if (weatherCondition === 'Thunderstorm') {
        document.body.style.background = 'url(bg.png)';
        document.body.style.backgroundSize= 'cover';
        document.body.style.backgroundPosition= 'center';
        ch_weather='雷雨';
        
      } else if (weatherCondition === 'Squall') {
        document.body.style.background = 'url(bg.png)';
        document.body.style.backgroundSize= 'cover';
        document.body.style.backgroundPosition= 'center';
        ch_weather='狂風暴雨';
        
      } else if (weatherCondition === 'Mist') {
        document.body.style.background = 'url(bg.png)';
        document.body.style.backgroundSize= 'cover';
        document.body.style.backgroundPosition= 'center';
        ch_weather='濛濛有霧';
        
      } else {
      
        document.body.style.background = 'url(bg.png)';
        document.body.style.backgroundSize= 'cover';
        document.body.style.backgroundPosition= 'center';
        ch_weather='晴天';
      }
      if(windSpeed > 63) {
        document.body.style.background = 'url(typhoon.png)';
        document.body.style.backgroundSize= 'cover';
        document.body.style.backgroundPosition= 'center';
        ch_weather='颱風天';
        
      }
      
    })
    .catch(error => console.error('Error fetching weather:', error));
}

const weatherData = {};

function fetchWeatherForecast() {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
     
       const forecastByDay = {};

       data.list.forEach(item => {
           const timestamp = item.dt * 1000;
           const date = new Date(timestamp);
           const year = date.getFullYear();
           const month = date.getMonth() + 1;
           const day = date.getDate();

           
           const formattedMonth = month < 10 ? `0${month}` : `${month}`;
           const formattedDay = day < 10 ? `0${day}` : `${day}`;

           const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

           if (!forecastByDay[formattedDate]) {
               forecastByDay[formattedDate] = [];
           }

           forecastByDay[formattedDate].push(item);
       });

      
       const nextFiveDays = Object.keys(forecastByDay).slice(0, 6);
       
       let minTemperature = Infinity;
       let maxTemperature = -Infinity;
       let minHumidity = Infinity;
       let maxHumidity = -Infinity;
       const weatherConditions = [];
              
              nextFiveDays.forEach(day => {
                const forecastDataForDay = forecastByDay[day];
               
                let minTemperature = Infinity;
                let maxTemperature = -Infinity;
                let minHumidity = Infinity;
                let maxHumidity = -Infinity;
                const weatherConditions = [];
                
                forecastDataForDay.forEach(item => {
                    const temperatureKelvin = item.main.temp;
                    const temperatureCelsius = temperatureKelvin - 273.15;
                    const humidity = item.main.humidity;
                    let forecastWeatherCondition = item.weather[0].main;
                    
                    minTemperature = Math.min(minTemperature, temperatureCelsius);
                    maxTemperature = Math.max(maxTemperature, temperatureCelsius);
     
                    
                    minHumidity = Math.min(minHumidity, humidity);
                    maxHumidity = Math.max(maxHumidity, humidity);
                    
                    weatherConditions.push(forecastWeatherCondition);
                });

                 
                const conditionCounts = weatherConditions.reduce((acc, condition) => { acc[condition] = (acc[condition] || 0) + 1; return acc;}, {});
                const mostFrequentCondition = Object.keys(conditionCounts).reduce((a, b) => conditionCounts[a] > conditionCounts[b] ? a : b);

                const formattedDay = day.replace(/-0?/g, '-');
                weatherData[formattedDay] = { 
                  minTemperature: minTemperature.toFixed(1),
                  maxTemperature: maxTemperature.toFixed(1),
                  minHumidity: minHumidity.toFixed(1),
                  maxHumidity: maxHumidity.toFixed(1),
                  weatherCondition: mostFrequentCondition
              };
            });
            
            
         })
         .catch(error => console.error('Error fetching weather forecast:', error));
     }





function AddWeekDay() {
  if (!btn || !btn.checked) {
    const headerCell = document.querySelector('.header-cell');
	if (!headerCell) return;				   
    dayOfWeek = Zellercongruence(day, month, year);
   if (dayOfWeek === 1) {
      headerCell.textContent += `(一)`;
      
    } else if (dayOfWeek === 2) {
      headerCell.textContent += `(二)`;
    } else if (dayOfWeek === 3) {
     headerCell.textContent += `(三)`;
    } else if (dayOfWeek === 4) {
      headerCell.textContent += `(四)`;
    } else if (dayOfWeek === 5) {
      headerCell.textContent += `(五)`;
    } else if (dayOfWeek === 6) {
      headerCell.textContent += `(六)`;
    } else {
     headerCell.textContent += `(日)`;
    }
  }
}

fetchWeather();
fetchWeatherForecast();

setInterval(fetchWeather, 600000); 


window.onload = function() {
  const headerCells = document.querySelectorAll(".header-cell");


  headerCells.forEach(function(cell) {
    setTimeout(function() {
      cell.click();
    }, 10000);
  });
};



// Throttled: Limits creation to at most 1 element every 40ms (~25 fps)
let lastTrailTime = 0;

document.addEventListener('mousemove', (e) => {
  const cur = performance.now();
  if (cur - lastTrailTime < 40) return;
  lastTrailTime = cur;

  const trail = document.createElement('div');
  trail.classList.add('trail');
  trail.style.left = `${e.pageX}px`;
  trail.style.top = `${e.pageY}px`;
  document.body.appendChild(trail);

  setTimeout(() => trail.remove(), 600);
});



if (btn) {

btn.addEventListener("click", function (event) {
  const rect = btn.getBoundingClientRect(); 
  const centerX = rect.left + rect.width / 2;
  const clickX = event.clientX - centerX;
  const toggleWidth = rect.width;
  const center = toggleWidth / 2;
  
 
  const prevMode = mode;
  console.log(`Click Position: ${clickX}`);
  if (prevMode === "neutral") {
    if (clickX > 7 ){
      mode = "dark"
    } else if (clickX < -7){
      mode = "light"
    }

  }
  if (prevMode === "dark") {
    if (clickX < 22 ){
      mode = "neutral"
    } 
  }
  if (prevMode === "light") {
    if (clickX > -22 ){
      mode = "neutral"
    } 
  }
  

   
  if (mode !== prevMode) {
      setMode(mode);
  }
});

}


initMonthPickerControls();	
createheadercell(year, month, day);
createCalendar(year, month);
highlightAdditionalHoliday(); 
AddWeekDay();
setInterval(checkDayChange, 60000);

    
    let reloadDivs = document.getElementsByClassName("weekday"); 
    
    let pressTimer;

    
    function startTimer() {
      pressTimer = setTimeout(function() {
          window.location.reload();
      }, 800); 
    }

    
    function clearTimer() {
      clearTimeout(pressTimer);
    }

    for (let i = 0; i < 7; i++) {
      
      let reloadDiv = reloadDivs[i];
      
      
      reloadDiv.addEventListener("mousedown", startTimer);
      reloadDiv.addEventListener("mouseup", clearTimer);
      reloadDiv.addEventListener("mouseleave", clearTimer);

      
      reloadDiv.addEventListener("touchstart", startTimer);
      reloadDiv.addEventListener("touchend", clearTimer);
      reloadDiv.addEventListener("touchcancel", clearTimer); 
  }


  const tooltip_ = document.getElementById('tooltip');

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;


  function startDragging(e) {
    isDragging = true;

    const isTouch = e.type.startsWith('touch');
    const clientX = isTouch ? e.touches[0]?.clientX : e.clientX;
    const clientY = isTouch ? e.touches[0]?.clientY : e.clientY;

    offsetX = clientX - tooltip_.offsetLeft;
    offsetY = clientY - tooltip_.offsetTop;

    document.addEventListener(isTouch ? 'touchmove' : 'mousemove', moveTooltip, { passive: false });
    document.addEventListener(isTouch ? 'touchend' : 'mouseup', stopDragging);

    e.preventDefault(); // Prevent scrolling on touch
  }

  function moveTooltip(e) {
    if (!isDragging) return;

    const isTouch = e.type.startsWith('touch');
    const clientX = isTouch ? e.touches[0]?.clientX : e.clientX;
    const clientY = isTouch ? e.touches[0]?.clientY : e.clientY;

    tooltip_.style.left = `${clientX - offsetX}px`;
    tooltip_.style.top = `${clientY - offsetY}px`;

    e.preventDefault();
  }


  function stopDragging(e) {
    isDragging = false;

    const isTouch = e.type.startsWith('touch');
    document.removeEventListener(isTouch ? 'touchmove' : 'mousemove', moveTooltip);
    document.removeEventListener(isTouch ? 'touchend' : 'mouseup', stopDragging);
  }


  // Add event listeners for drag start
  tooltip_.addEventListener('mousedown', startDragging);
  tooltip_.addEventListener('touchstart', startDragging, { passive: false });


//movable cards

function makeCardDraggable() {

    const cards = document.querySelectorAll('.card');

    // Loop through each card to add dragging functionality
    cards.forEach(card => {
     const innerCard = card.querySelector('.inner-card');
  
      // Variables specific to each card
      let isFlipped = false;
      let offsetX2 = 0, offsetY2 = 0;
      let isDragging2 = false;
  
      // Store original position
      const originalPosition = {
        position: card.style.position || 'static',
        left: card.style.left || 'auto',
        top: card.style.top || 'auto'
      };
  
      // Function to check if card is flipped
    function checkFlipped() {
    // Get the current transform style and check if it contains rotateY(180deg)
      const transform = window.getComputedStyle(innerCard).getPropertyValue('transform');
      const wasFlipped = isFlipped;
      isFlipped = transform.includes('matrix3d') && transform.includes('-1');
    
      // If card was flipped but now is not, reset to original position
      if (wasFlipped && !isFlipped) {
       resetPosition();
      }
    }
  
    // Function to reset position
    function resetPosition() {
       card.style.position = originalPosition.position;
       card.style.left = originalPosition.left;
       card.style.top = originalPosition.top;
    }
  
    // Function to start dragging the card
    function startDragging2(e) {
      // Check if card is flipped before allowing drag
      checkFlipped();
      if (!isFlipped) return;
    
      isDragging2 = true;
    
      const isTouch = e.type.startsWith('touch');
      const clientX = isTouch ? e.touches[0]?.clientX : e.clientX;
      const clientY = isTouch ? e.touches[0]?.clientY : e.clientY;
    
      offsetX2 = clientX - card.offsetLeft;
      offsetY2 = clientY - card.offsetTop;
    
      // Add the appropriate event listeners based on touch or mouse
      document.addEventListener(isTouch ? 'touchmove' : 'mousemove', moveCard, { passive: false });
      document.addEventListener(isTouch ? 'touchend' : 'mouseup', stopDragging2);
    
      e.preventDefault(); // Prevent scrolling or other default actions during drag
    }
  
    // Function to move the card during dragging
    function moveCard(e) {
      if (!isDragging2) return;
    
      const isTouch = e.type.startsWith('touch');
      const clientX = isTouch ? e.touches[0]?.clientX : e.clientX;
      const clientY = isTouch ? e.touches[0]?.clientY : e.clientY;
    
      card.style.position = 'absolute';
      card.style.left = (clientX - offsetX2) + 'px';
      card.style.top = (clientY - offsetY2) + 'px';
    
      e.preventDefault(); // Prevent unwanted default behavior (like scrolling)
    }
  
    // Function to stop dragging the card
    function stopDragging2() {
      isDragging2 = false;
      document.removeEventListener('mousemove', moveCard);
      document.removeEventListener('mouseup', stopDragging2);
      document.removeEventListener('touchmove', moveCard);
      document.removeEventListener('touchend', stopDragging2);
    }
  
    // Add event listeners for each card to start dragging
    card.addEventListener('mousedown', startDragging2);
    card.addEventListener('touchstart', startDragging2, { passive: false });
  
    // Listen for transition end to update flipped state
    innerCard.addEventListener('transitionend', checkFlipped);
  }); //cards.forEach ends


}


makeCardDraggable();

namePicker.addEventListener('scroll', () => {
  const itemHeight = namePicker.querySelector(".picker-item").offsetHeight;
  currentIndex = Math.floor(namePicker.scrollTop / itemHeight);
  updateSelection();
  clearSelectedClass();
  updateScale();
});




(function () {
  const emailNameMap = {
    'kueifeng7166@gmail.com': '洪柜峰',
    'kueifeng.eo94g@g2.nctu.edu.tw': '洪柜峰',
    'shinchir46@gmail.com': '洪柜峰',
    'qqcats0901@mail.post.gov.tw': '洪柜峰',
    'jeremycks@gmail.com':'劉錦郎',
    'chinjiewan@anws.gov.tw':'秦桔萬',
    'shihhsun.hsu@gmail.com':'許世勳',
    'cw.chang@anws.gov.tw':'張哲維',
    'death174@gmail.com':'周育稔',
    'johnnyjan65@gmail.com':'詹文欽',
    'p0915208386@gmail.com':'清潔劉小惠',
    'larchyde310119@hotmail.com':'邱冠霖',
    'swimmingfish@hotmail.com.tw':'余金原',
    'sct@anws.gov.tw':'孫景泰',
    'folra679@gmail.com':'官郁庭',
    'jihyaos@gmail.com':'張日曜',
    'chihung24@gmail.com':'張啟鴻',
    'dick710209@gmail.com':'陳鈞緯',
    'allen99lo@gmail.com':'羅應順',
    'lmfcool@anws.gov.tw':'呂明峯'
  };

  function getUserEmailFromQueryOrParent(ev) {
    const urlParams = new URLSearchParams(window.location.search);
    const fromQuery = urlParams.get('userEmail');
    if (fromQuery) return fromQuery;
    // try parent (works if same-origin)
    try {
      if (window.parent && window.parent.currentUserEmail) return window.parent.currentUserEmail;
    } catch (e) {
      // cross-origin -> ignore
    }
    // try message payload
    if (ev && ev.data && ev.data.userEmail) return ev.data.userEmail;
    return null;
  }

  function scrollToUserWithRetry(userEmail) {
    if (!userEmail) return;
    targetName = emailNameMap[userEmail]
    username = targetName; //for firebase storage.Don't delete it or otherwise the Notes will be useless. it is a global parameters.
    if (!targetName) return;
    let attempts = 0;
    const maxAttempts = 40; // 40 * 100ms = 4s max wait
    const interval = setInterval(() => {
      attempts++;
      const items = document.querySelectorAll('.picker-item');
      const nameElement = Array.from(items).find(item => item.textContent.trim() === targetName);
      if (nameElement) {
        // scroll + click
        nameElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        nameElement.click();
        clearInterval(interval);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 100);
  }

  // On DOMContentLoaded — try to scroll using query or parent
  document.addEventListener('DOMContentLoaded', () => {
    header.addEventListener("click", toggleMusic);
    header.addEventListener("touchstart", toggleMusic);
    scrollToMeButton.addEventListener("click", toggleMusic);
    scrollToMeButton.addEventListener("touchstart", toggleMusic);
    

    const email = getUserEmailFromQueryOrParent();
    scrollToUserWithRetry(email);

    // hook up your manual button
    const button = document.getElementById('scrollToMeButton');
    if (button) {
      button.addEventListener('click', () => {
        const emailNow = getUserEmailFromQueryOrParent();
        scrollToUserWithRetry(emailNow);
      });
    }

      names.forEach((name) => {
        const selectedName = name;
        const item = document.createElement("div");
        item.className = "picker-item";
        item.textContent = name;
        item.style.color = "gray";
 

        item.addEventListener("click", () => {
        updateSelection();
        const items = document.querySelectorAll('.picker-item');
        items.forEach((item) => {
          item.style.transform = 'scale(1)';
          item.style.color = 'gray';
          item.style.opacity = '0.85';
          });
        item.style.transform = 'scale(1.5)';
        item.style.color = '';
        item.style.backgroundColor = "turquoise";
        item.style.opacity = '1';
        temp_name=selectedName;
        highlightSelectedName(selectedName);
      });

        // if (username !== "詹文欽"  && username !== "張啟鴻" && username !== "羅應順" && username !== "張日曜" && username !== "孫景泰" && username !== "張哲維" && username !== "陳鈞緯") {

        //     const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

        //   if (isIOS) {
        //     let pressTimer = null;

        //     item.addEventListener("touchstart", () => {
        //       pressTimer = setTimeout(() => {
        //       const photoUrl = photos[selectedName];
        //       if (photoUrl) {
        //         window.location.href = photoUrl;  
        //       } else {
        //         alert("No photo available.");
        //       }
        //       }, 1500);   
        //     });

        //     item.addEventListener("touchend", () => {
        //       clearTimeout(pressTimer);
        //     });
        //   }

        //   if (!isIOS) {
        //     item.addEventListener("dblclick", () => {
        //     const photoUrl = photos[selectedName];
        //     if (photoUrl) {
        //       window.open(photoUrl, "_blank");
        //     } else {
        //       alert("No photo available.");
        //     }
     
        //     if (isLineBrowser()) {
        //       alert('Use a Regular Browser, like chrome, to open LINE since it is in LINE now');
        //     } else {
        //       window.location.href = 'line://nv/chat';
        //     }
        //     });
        //   }
        // }
  namePicker.appendChild(item);
});



  });

  // Listen for postMessage from parent (parent will send {type:'scrollToUser', userEmail:...})
  window.addEventListener('message', (ev) => {
    if (!ev.data || ev.data.type !== 'scrollToUser') return;
    const email = getUserEmailFromQueryOrParent(ev) || ev.data.userEmail;
    scrollToUserWithRetry(email);
  });

})();



function setupCardFlip() {
  // Get all calendar cards
  const cards = document.querySelectorAll('.card');
  const overlay = document.createElement('div');
  
  overlay.className = 'overlay';
  document.body.appendChild(overlay);

  // Define smooth infinite scroll function
  function smoothInfiniteScrollNoteContent(noteContent, scrollSpeed) {
    if (!noteContent) {
      console.error('Note content element not found');
      return;
    }
    
    let scrollInterval = null;
    let isResetting = false;
    
    const scroll = () => {
      // If we're currently in a reset animation, don't do regular scrolling
      if (isResetting) {
        scrollInterval = setTimeout(scroll, scrollSpeed);
        return;
      }
      
      // Check if we've reached the bottom
      if (noteContent.scrollTop >= noteContent.scrollHeight - noteContent.clientHeight - 2) {
        // Start the smooth reset process
        isResetting = true;
        
        // Use requestAnimationFrame for smoother animation
        let start = null;
        const duration = 1000; // 1 second for reset animation
        const startPosition = noteContent.scrollTop;
        
        function resetAnimation(timestamp) {
          if (!start) start = timestamp;
          const elapsed = timestamp - start;
          const progress = Math.min(elapsed / duration, 1);
          
          // Ease-out function for smooth deceleration
          const easeOut = 1 - Math.pow(1 - progress, 2);
          
          // Gradually scroll back to top
          noteContent.scrollTop = startPosition * (1 - easeOut);
          
          if (progress < 1) {
            requestAnimationFrame(resetAnimation);
          } else {
            // Reset complete
            noteContent.scrollTop = 0;
            isResetting = false;
          }
        }
        
        requestAnimationFrame(resetAnimation);
      } else {
        // Continue scrolling down
        noteContent.scrollTop += 1;
      }
      
      // Continue the infinite scroll
      scrollInterval = setTimeout(scroll, scrollSpeed);
    };
    
    // Start at the top
    noteContent.scrollTop = 0;
    
    // Start the scrolling
    scroll();
    
    // Return a function to stop scrolling if needed
    return () => {
      if (scrollInterval) clearTimeout(scrollInterval);
      isResetting = false; // Ensure reset state is cleared
    };
  }

  // Track active scrolling processes
  const activeScrollProcesses = new Map();

  // Add event listeners to each card
  cards.forEach(card => {
    const noteContent = card.querySelector('.note-content');
    
    function toggleFlip(e) {
      e.preventDefault(); // Prevent zooming or other default touch behavior
      this.classList.toggle('flipped');
  
      // Toggle overlay
      if (this.classList.contains('flipped')) {
        overlay.classList.add('active');
        // Start smooth infinite scrolling when card is flipped
        if (noteContent) {
          // Store the stop function for this specific card
          activeScrollProcesses.set(card, smoothInfiniteScrollNoteContent(noteContent, 100));
        }
      } else {
        overlay.classList.remove('active');
        // Stop scrolling when card is unflipped
        if (activeScrollProcesses.has(card)) {
          const stopScrolling = activeScrollProcesses.get(card);
          stopScrolling();
          activeScrollProcesses.delete(card);
        }
      }
  
      // Stop propagation to prevent issues
      e.stopPropagation();
    }
  
    // Add both event listeners for desktop and mobile support
    card.addEventListener('dblclick', toggleFlip);  // Desktop double-click
    card.addEventListener('touchend', toggleFlip);  // Mobile tap
  });

  // Click on overlay to close flipped card
  overlay.addEventListener('click', function() {
    // Find and unflip any flipped cards
    const flippedCard = document.querySelector('.card.flipped');
    if (flippedCard) {
      flippedCard.classList.remove('flipped');
      
      // Stop any associated scrolling
      if (activeScrollProcesses.has(flippedCard)) {
        const stopScrolling = activeScrollProcesses.get(flippedCard);
        stopScrolling();
        activeScrollProcesses.delete(flippedCard);
      }
    }
  
    // Hide overlay
    this.classList.remove('active');
  });

  // Add event listeners for the buttons on the back of the card
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      
      // Close the card if it's a save, cancel, or delete button
      const card = this.closest('.card');
      if (card && card.classList.contains('flipped')) {
        card.classList.remove('flipped');
        
        // Stop any associated scrolling
        if (activeScrollProcesses.has(card)) {
          const stopScrolling = activeScrollProcesses.get(card);
          stopScrolling();
          activeScrollProcesses.delete(card);
        }
        
        overlay.classList.remove('active');
      }
    });
  });
  
  // Enhanced copy-paste functionality for all textareas
  document.querySelectorAll('.card textarea').forEach(textarea => {

    textarea.removeAttribute('readonly');
    // Enable text selection explicitly
    textarea.style.userSelect = 'text';
    textarea.style.WebkitUserSelect = 'text';
    textarea.style.MozUserSelect = 'text';
    textarea.style.msUserSelect = 'text';
    
    // Make sure textarea is editable
    textarea.setAttribute('tabindex', '0');
   
    
    // Handle iOS Safari specific paste issues
    textarea.addEventListener('paste', function(e) {
      // Let the default paste happen
      // Add a slight delay to ensure iOS processes the paste
      setTimeout(() => {
        // Force focus to remain on textarea after paste
        textarea.focus();
      }, 100);
    });
    
    // Better handling for iOS text selection
    textarea.addEventListener('touchstart', function(e) {
      // Don't prevent default to allow iOS text selection to work
      e.stopPropagation();
    }, { passive: true });
    
    // Help iOS maintain focus on textarea
    textarea.addEventListener('touchend', function(e) {
      e.stopPropagation();
      // Don't prevent default to allow selection to work
    });
    
    // Ensure the textarea is selectable on iOS
    textarea.addEventListener('click', function(e) {
      e.stopPropagation();
      // Make sure the click doesn't bubble up which could flip the card
    });
    
    // Handle selection changes to prevent unwanted card flips
    textarea.addEventListener('selectionchange', function(e) {
      e.stopPropagation();
    });
    
    // For iOS double tap to select word
    let lastTap = 0;
    textarea.addEventListener('touchend', function(e) {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      
      if (tapLength < 500 && tapLength > 0) {
        // Double tap detected - don't prevent default so iOS can select word
        e.stopPropagation();
      }
      
      lastTap = currentTime;
    });



  });
  
  // Initialize Clipboard utility if not already available
  if (!window.Clipboard) {
    window.Clipboard = (function(window, document, navigator) {
      var textArea, copy;
      
      function isOS() {
        return navigator.userAgent.match(/ipad|iphone/i);
      }
      
      function createTextArea(text) {
        textArea = document.createElement('textArea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
      }
      
      function selectText() {
        var range, selection;
        if (isOS()) {
          range = document.createRange();
          range.selectNodeContents(textArea);
          selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          textArea.setSelectionRange(0, 999999);
        } else {
          textArea.select();
        }
      }
      
      function copyToClipboard() {
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      copy = function(text) {
        createTextArea(text);
        selectText();
        copyToClipboard();
      };
      
      return {
        copy: copy
      };
    })(window, document, navigator);
  }
}


(function(){
  const stage = document.getElementById('stage');
  const spot = document.getElementById('spot');
  const uiVal = document.getElementById('val');

  // initial intensity read from CSS variable
  const style = getComputedStyle(document.documentElement);
  let intensity = parseFloat(style.getPropertyValue('--light-intensity')) || 0.5;

  // helpers
  function clamp(v, a=0, b=1){ return Math.max(a, Math.min(b, v)); }
  function setIntensity(v){
    intensity = clamp(v, 0, 1);
    document.documentElement.style.setProperty('--light-intensity', intensity.toFixed(3));
    uiVal.textContent = intensity.toFixed(2);
  }

  // Update UI at start
  setIntensity(intensity);

  /*********************
   * Mouse wheel (desktop)
   * Use wheel.deltaY: negative = scroll up -> brighten; positive = scroll down -> dim
   *********************/
  let wheelTimeout;
  stage.addEventListener('wheel', function(e){
    // prevent page scrolling if inside stage
    e.preventDefault();

    // sensitivity factor - tune as desired
    const factor = 0.0015; // small -> smooth change
    // deltaY is positive when wheel scrolls down (away from user)
    const delta = -e.deltaY * factor;
    setIntensity(intensity + delta);

    // optional: add a class for subtle transition while user scrolls
    stage.classList.add('bright');
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(()=> stage.classList.remove('bright'), 220);
  }, {passive:false});

  /*********************
   * Touch swipe (mobile)
   * We interpret vertical swipe distance to adjust intensity continuously
   *********************/
  let touchStartY = null;
  let startIntensity = null;

  stage.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    touchStartY = e.touches[0].clientY;
    startIntensity = intensity;
  }, {passive:true});

  stage.addEventListener('touchmove', (e) => {
    if (touchStartY === null) return;
    const ty = e.touches[0].clientY;
    const dy = touchStartY - ty; // positive when swipe up
    // Map dy pixels to intensity change. Sensitivity tuned for natural swipe.
    const sens = 0.006; // change per pixel
    setIntensity(startIntensity + dy * sens);
    // no preventDefault so native scroll may still happen; you can block if you want stable gesture
  }, {passive:true});

  stage.addEventListener('touchend', () => {
    touchStartY = null;
    startIntensity = null;
  });

  /*********************
   * Optionally allow keyboard +/- for accessibility
   *********************/
  window.addEventListener('keydown', (e) => {
    if (e.key === '+' || e.key === '=' ){
      setIntensity(intensity + 0.05);
    } else if (e.key === '-' || e.key === '_'){
      setIntensity(intensity - 0.05);
    }
  });

  /*********************
   * Nice: animate small pulses when intensity changes quickly (optional)
   *********************/
  let raf;
  let lastIntensity = intensity;
  function animate() {
    if (Math.abs(lastIntensity - intensity) > 0.0001){
      // subtle global brightness change for the whole stage to emphasize effect
      const stageFilter = 1 + (intensity - 0.5) * 0.25; // mild brightness adjustment
      stage.style.filter = `brightness(${stageFilter})`;
      lastIntensity = intensity;
    }
    raf = requestAnimationFrame(animate);
  }
  animate();

  // expose for debug in console
  window.__lamp = { get intensity(){ return intensity; }, setIntensity };

})();