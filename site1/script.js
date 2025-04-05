var username;
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


const now = new Date();
var year = now.getFullYear();
var month = (now.getMonth() + 1);
var day = now.getDate();
var temp_name;
const formattedDate = `${year}-${month}-${day}`;


const dutySchedule = {

"2025-2-1": "S: 黃榮國 A: 范振宇 N: 劉暐丞 C: 孫景泰 R: 黃煜森 T: 周育稔",
"2025-2-2": "S: 林森發 A: 羅應順 N: 許敦智 C: 柯正和 R: 張哲維 T: 呂明峰",
"2025-2-3": "S: 范振宇 A: 黃經洲 N: 唐__茂 C: 張日曜 R: 劉錦郎 T: 許世勳",
"2025-2-4": "S: 柯正和 A: 劉暐丞 N: 許敦智 C: 秦桔萬 R: 黃煜森 T: 洪柜峰",
"2025-2-5": "S: 黃經洲 A: 張哲維 N: 彭偉慎 C: 孫景泰 R: 林厚運 T: 羅應順",
"2025-2-6": "S: 黃榮國 A: 林宏儒 N: 王瑞發 C: 邱冠霖 R: 張哲維 T: 許世勳",
"2025-2-7": "S: 柯正和 A: 林厚運 N: 許敦智 C: 秦桔萬 R: 黃煜森 T: 洪柜峰",
"2025-2-8": "S: 詹文欽 A: 唐__茂 N: 王金誠 C: 孫景泰 R: 劉錦郎 T: 黃經洲",
"2025-2-9": "S: 林森發 A: 彭偉慎 N: 許敦智 C: 邱冠霖 R: 余金原 T: 許世勳",
"2025-2-10": "S: 黃榮國 A: 劉錦郎 N: 劉暐丞 C: 孫景泰 R: 張哲維 T: 林宏儒",
"2025-2-11": "S: 范振宇 A: 呂明峰 N: 唐__茂 C: 邱冠霖 R: 林厚運 T: 洪柜峰",
"2025-2-12": "S: 林森發 A: 張哲維 N: 彭偉慎 C: 秦桔萬 R: 黃煜森 T: 許世勳",
"2025-2-13": "S: 范振宇 A: 孫景泰 N: 王金誠 C: 張日曜 R: 劉錦郎 T: 羅應順",
"2025-2-14": "S: 詹文欽 A: 彭偉慎 N: 王瑞發 C: 秦桔萬 R: 林厚運 T: 呂明峰",
"2025-2-15": "S: 柯正和 A: 許世勳 N: 許敦智 C: 邱冠霖 R: 余金原 T: 林宏儒",
"2025-2-16": "S: 范振宇 A: 黃煜森 N: 王金誠 C: 張日曜 R: 劉錦郎 T: 洪柜峰",
"2025-2-17": "S: 林森發 A: 呂明峰 N: 王瑞發 C: 孫景泰 R: 張哲維 T: 許世勳",
"2025-2-18": "S: 黃榮國 A: 劉錦郎 N: 許敦智 C: 張日曜 R: 林厚運 T: 黃經洲",
"2025-2-19": "S: 柯正和 A: 洪柜峰 N: 劉暐丞 C: 邱冠霖 R: 黃煜森 T: 羅應順",
"2025-2-20": "S: 黃經洲 A: 唐__茂 N: 王金誠 C: 秦桔萬 R: 張哲維 T: 呂明峰",
"2025-2-21": "S: 黃榮國 A: 方振彬 N: 彭偉慎 C: 邱冠霖 R: 劉錦郎 T: 林宏儒",
"2025-2-22": "S: 詹文欽 A: 林森發 N: 唐__茂 C: 張日曜 R: 余金原 T: 羅應順",
"2025-2-23": "S: 黃經洲 A: 彭偉慎 N: 王瑞發 C: 秦桔萬 R: 林厚運 T: 林宏儒",
"2025-2-24": "S: 范振宇 A: 張哲維 N: 唐__茂 C: 張日曜 R: 劉錦郎 T: 洪柜峰",
"2025-2-25": "S: 柯正和 A: 羅應順 N: 劉暐丞 C: 孫景泰 R: 黃煜森 T: 呂明峰",
"2025-2-26": "S: 黃榮國 A: 王金誠 N: 王瑞發 C: 邱冠霖 R: 張哲維 T: 林宏儒",
"2025-2-27": "S: 黃經洲 A: 方振彬 N: 劉暐丞 C: 張日曜 R: 黃煜森 T: 羅應順",
"2025-2-28": "S: 詹文欽 A: 王瑞發 N: 王金誠 C: 秦桔萬 R: 張哲維 T: 洪柜峰",
"2025-3-1": "S: 范振宇 A: 呂明峰 N: 彭偉慎 C: 邱冠霖 R: 余金原 T: 羅應順",
"2025-3-2": "S: 柯正和 A: 王瑞發 N: 劉暐丞 C: 孫景泰 R: 林厚運 T: 林宏儒",
"2025-3-3": "S: 林森發 A: 王金誠 N: 彭偉慎 C: 秦桔萬 R: 張哲維 T: 羅應順",
"2025-3-4": "S: 黃經洲 A: 張日曜 N: 唐__茂 C: 邱冠霖 R: 劉錦郎 T: 洪柜峰",
"2025-3-5": "S: 范振宇 A: 林厚運 N: 劉暐丞 C: 孫景泰 R: 黃煜森 T: 呂明峰",
"2025-3-6": "S: 黃榮國 A: 許世勳 N: 王金誠 C: 秦桔萬 R: 張哲維 T: 周育稔",
"2025-3-7": "S: 詹文欽 A: 黃煜森 N: 許敦智 C: 柯正和 R: 劉錦郎 T: 洪柜峰",
"2025-3-8": "S: 黃經洲 A: 劉暐丞 N: 唐__茂 C: 秦桔萬 R: 余金原 T: 林宏儒",
"2025-3-9": "S: 黃榮國 A: 周育稔 N: 王金誠 C: 張日曜 R: 林厚運 T: 呂明峰",
"2025-3-10": "S: 柯正和 A: 王瑞發 N: 許敦智 C: 邱冠霖 R: 劉錦郎 T: 許世勳",
"2025-3-11": "S: 林森發 A: 周育稔 N: 王金誠 C: 孫景泰 R: 黃煜森 T: 羅應順",
"2025-3-12": "S: 黃經洲 A: 唐__茂 N: 許敦智 C: 秦桔萬 R: 劉錦郎 T: 呂明峰",
"2025-3-13": "S: 范振宇 A: 邱冠霖 N: 王瑞發 C: 張日曜 R: 黃煜森 T: 林宏儒",
"2025-3-14": "S: 黃經洲 A: 劉錦郎 N: 彭偉慎 C: 孫景泰 R: 張哲維 T: 許世勳",
"2025-3-15": "S: 詹文欽 A: 王瑞發 N: 許敦智 C: 柯正和 R: 余金原 T: 林宏儒",
"2025-3-16": "S: 林森發 A: 洪柜峰 N: 彭偉慎 C: 張日曜 R: 張哲維 T: 周育稔",
"2025-3-17": "S: 范振宇 A: 方振彬 N: 王金誠 C: 孫景泰 R: 劉錦郎 T: 林宏儒",
"2025-3-18": "S: 柯正和 A: 彭偉慎 N: 唐__茂 C: 邱冠霖 R: 黃煜森 T: 許世勳",
"2025-3-19": "S: 黃經洲 A: 洪柜峰 N: 許敦智 C: 秦桔萬 R: 張哲維 T: 周育稔",
"2025-3-20": "S: 林森發 A: 彭偉慎 N: 劉暐丞 C: 孫景泰 R: 黃煜森 T: 呂明峰",
"2025-3-21": "S: 黃榮國 A: 許敦智 N: 唐__茂 C: 邱冠霖 R: 劉錦郎 T: 羅應順",
"2025-3-22": "S: 詹文欽 A: 林森發 N: 王金誠 C: 張日曜 R: 張哲維 T: 許世勳",
"2025-3-23": "S: 柯正和 A: 方振彬 N: 劉暐丞 C: 秦桔萬 R: 黃煜森 T: 黃經洲",
"2025-3-24": "S: 范振宇 A: 周育稔 N: 許敦智 C: 孫景泰 R: 劉錦郎 T: 洪柜峰",
"2025-3-25": "S: 黃榮國 A: 方振彬 N: 王金誠 C: 張日曜 R: 張哲維 T: 林宏儒",
"2025-3-26": "S: 柯正和 A: 許世勳 N: 唐__茂 C: 邱冠霖 R: 林厚運 T: 呂明峰",
"2025-3-27": "S: 黃經洲 A: 林森發 N: 王瑞發 C: 張日曜 R: 黃煜森 T: 羅應順",
"2025-3-28": "S: 詹文欽 A: 呂明峰 N: 唐__茂 C: 秦桔萬 R: 張哲維 T: 周育稔",
"2025-3-29": "S: 黃榮國 A: 羅應順 N: 范振宇 C: 孫景泰 R: 林厚運 T: 洪柜峰",
"2025-3-30": "S: 林森發 A: 劉暐丞 N: 王瑞發 C: 邱冠霖 R: 余金原 T: 林宏儒",
"2025-3-31": "S: 范振宇 A: 張哲維 N: 彭偉慎 C: 秦桔萬 R: 劉錦郎 T: 羅應順",
"2025-4-1": "S: 黃榮國 A: 劉暐丞 N: 許敦智 C: 張日曜 R: 黃煜森 T: 呂明峰",
"2025-4-2": "S: 詹文欽 A: 許世勳 N: 范振宇 C: 孫景泰 R: 劉錦郎 T: 周育稔",
"2025-4-3": "S: 林森發 A: 許敦智 N: 王金誠 C: 秦桔萬 R: 余金原 T: 洪柜峰",
"2025-4-4": "S: 柯正和 A: 林宏儒 N: 劉暐丞 C: 邱冠霖 R: 黃煜森 T: 羅應順",
"2025-4-5": "S: 詹文欽 A: 張哲維 N: 彭偉慎 C: 張日曜 R: 余金原 T: 周育稔",
"2025-4-6": "S: 黃經洲 A: 劉暐丞 N: 王瑞發 C: 柯正和 R: 劉錦郎 T: 呂明峰",
"2025-4-7": "S: 黃榮國 A: 林森發 N: 唐__茂 C: 孫景泰 R: 張哲維 T: 許世勳",
"2025-4-8": "S: 范振宇 A: 周育稔 N: 王金誠 C: 秦桔萬 R: 林厚運 T: 洪柜峰",
"2025-4-9": "S: 黃經洲 A: 邱冠霖 N: 彭偉慎 C: 張日曜 R: 黃煜森 T: 羅應順",
"2025-4-10": "S: 柯正和 A: 周育稔 N: 許敦智 C: 秦桔萬 R: 張哲維 T: 林宏儒",
"2025-4-11": "S: 詹文欽 A: 林森發 N: 王金誠 C: 孫景泰 R: 劉錦郎 T: 羅應順",
"2025-4-12": "S: 黃榮國 A: 彭偉慎 N: 王瑞發 C: 邱冠霖 R: 余金原 T: 洪柜峰",
"2025-4-13": "S: 林森發 A: 羅應順 N: 王金誠 C: 柯正和 R: 林厚運 T: 周育稔",
"2025-4-14": "S: 黃經洲 A: 唐__茂 N: 劉暐丞 C: 張日曜 R: 劉錦郎 T: 呂明峰",
"2025-4-15": "S: 黃榮國 A: 黃煜森 N: 王瑞發 C: 邱冠霖 R: 林厚運 T: 許世勳",
"2025-4-16": "S: 范振宇 A: 孫景泰 N: 許敦智 C: 秦桔萬 R: 劉錦郎 T: 洪柜峰",
"2025-4-17": "S: 林森發 A: 林森發 N: 彭偉慎 C: 邱冠霖 R: 黃煜森 T: 羅應順",
"2025-4-18": "S: 黃榮國 A: 唐__茂 N: 劉暐丞 C: 張日曜 R: 林厚運 T: 許世勳",
"2025-4-19": "S: 詹文欽 A: 黃經洲 N: 許敦智 C: 秦桔萬 R: 余金原 T: 呂明峰",
"2025-4-20": "S: 范振宇 A: 洪柜峰 N: 唐__茂 C: 邱冠霖 R: 張哲維 T: 林宏儒",
"2025-4-21": "S: 柯正和 A: 劉錦郎 N: 王瑞發 C: 孫景泰 R: 林厚運 T: 許世勳",
"2025-4-22": "S: 黃經洲 A: 許敦智 N: 彭偉慎 C: 張日曜 R: 黃煜森 T: 羅應順",
"2025-4-23": "S: 林森發 A: 唐__茂 N: 王金誠 C: 孫景泰 R: 劉錦郎 T: 林宏儒",
"2025-4-24": "S: 黃榮國 A: 林厚運 N: 許敦智 C: 秦桔萬 R: 張哲維 T: 洪柜峰",
"2025-4-25": "S: 黃經洲 A: 黃經洲 N: 王瑞發 C: 張日曜 R: 黃煜森 T: 林宏儒",
"2025-4-26": "S: 范振宇 A: 呂明峰 N: 唐__茂 C: 孫景泰 R: 林厚運 T: 許世勳",
"2025-4-27": "S: 柯正和 A: 劉暐丞 N: 彭偉慎 C: 秦桔萬 R: 張哲維 T: 周育稔",
"2025-4-28": "S: 林森發 A: 王金誠 N: 王瑞發 C: 邱冠霖 R: 劉錦郎 T: 林宏儒",
"2025-4-29": "S: 黃榮國 A: 黃榮國 N: 唐__茂 C: 張日曜 R: 林厚運 T: 呂明峰",
"2025-4-30": "S: 范振宇 A: 黃煜森 N: 王金誠 C: 孫景泰 R: 張哲維 T: 許世勳",






};

const holiday = {


"2025-1-1": "【初二】【放假日】",
"2025-1-2": "【初三】",
"2025-1-3": "【初四】",
"2025-1-4": "【初五】【放假日】",
"2025-1-5": "【小寒】【放假日】",
"2025-1-6": "【初七】",
"2025-1-7": "【初八】",
"2025-1-8": "【初九】",
"2025-1-9": "【初十】",
"2025-1-10": "【十一】",
"2025-1-11": "【十二】【放假日】",
"2025-1-12": "【十三】【放假日】",
"2025-1-13": "【十四】",
"2025-1-14": "【十五】",
"2025-1-15": "【十六】",
"2025-1-16": "【十七】",
"2025-1-17": "【十八】",
"2025-1-18": "【十九】【放假日】",
"2025-1-19": "【二十】【放假日】",
"2025-1-20": "【大寒】",
"2025-1-21": "【廿二】",
"2025-1-22": "【廿三】",
"2025-1-23": "【廿四】",
"2025-1-24": "【廿五】",
"2025-1-25": "【廿六】【放假日】",
"2025-1-26": "【廿七】【放假日】",
"2025-1-27": "【廿八】【放假日】",
"2025-1-28": "【廿九】【放假日】",
"2025-1-29": "【正月大】【放假日】",
"2025-1-30": "【初二】【放假日】",
"2025-1-31": "【初三】【放假日】",
"2025-2-1": "【初四】【放假日】",
"2025-2-2": "【初五】【放假日】",
"2025-2-3": "【立春】",
"2025-2-4": "【初七】",
"2025-2-5": "【初八】",
"2025-2-6": "【初九】",
"2025-2-7": "【初十】",
"2025-2-8": "【十一】",
"2025-2-9": "【十二】【放假日】",
"2025-2-10": "【十三】",
"2025-2-11": "【十四】",
"2025-2-12": "【十五】",
"2025-2-13": "【十六】",
"2025-2-14": "【十七】",
"2025-2-15": "【十八】【放假日】",
"2025-2-16": "【十九】【放假日】",
"2025-2-17": "【二十】",
"2025-2-18": "【雨水】",
"2025-2-19": "【廿二】",
"2025-2-20": "【廿三】",
"2025-2-21": "【廿四】",
"2025-2-22": "【廿五】【放假日】",
"2025-2-23": "【廿六】【放假日】",
"2025-2-24": "【廿七】",
"2025-2-25": "【廿八】",
"2025-2-26": "【廿九】",
"2025-2-27": "【三十】",
"2025-2-28": "【二月小】【放假日】",
"2025-3-1": "【初二】【放假日】",
"2025-3-2": "【初三】【放假日】",
"2025-3-3": "【初四】",
"2025-3-4": "【初五】",
"2025-3-5": "【驚蟄】",
"2025-3-6": "【初七】",
"2025-3-7": "【初八】",
"2025-3-8": "【初九】【放假日】",
"2025-3-9": "【初十】【放假日】",
"2025-3-10": "【十一】",
"2025-3-11": "【十二】",
"2025-3-12": "【十三】",
"2025-3-13": "【十四】",
"2025-3-14": "【十五】",
"2025-3-15": "【十六】【放假日】",
"2025-3-16": "【十七】【放假日】",
"2025-3-17": "【十八】",
"2025-3-18": "【十九】",
"2025-3-19": "【二十】",
"2025-3-20": "【春分】",
"2025-3-21": "【廿二】",
"2025-3-22": "【廿三】【放假日】",
"2025-3-23": "【廿四】【放假日】",
"2025-3-24": "【廿五】",
"2025-3-25": "【廿六】",
"2025-3-26": "【廿七】",
"2025-3-27": "【廿八】",
"2025-3-28": "【廿九】",
"2025-3-29": "【三月大】【放假日】",
"2025-3-30": "【初二】【放假日】",
"2025-3-31": "【初三】",
"2025-4-1": "【初四】",
"2025-4-2": "【初五】",
"2025-4-3": "【初六】【放假日】",
"2025-4-4": "【清明】【放假日】",
"2025-4-5": "【初八】【放假日】",
"2025-4-6": "【初九】【放假日】",
"2025-4-7": "【初十】",
"2025-4-8": "【十一】",
"2025-4-9": "【十二】",
"2025-4-10": "【十三】",
"2025-4-11": "【十四】",
"2025-4-12": "【十五】【放假日】",
"2025-4-13": "【十六】【放假日】",
"2025-4-14": "【十七】",
"2025-4-15": "【十八】",
"2025-4-16": "【十九】",
"2025-4-17": "【二十】",
"2025-4-18": "【廿一】",
"2025-4-19": "【廿二】【放假日】",
"2025-4-20": "【穀雨】【放假日】",
"2025-4-21": "【廿四】",
"2025-4-22": "【廿五】",
"2025-4-23": "【廿六】",
"2025-4-24": "【廿七】",
"2025-4-25": "【廿八】",
"2025-4-26": "【廿九】【放假日】",
"2025-4-27": "【三十】【放假日】",
"2025-4-28": "【四月小】",
"2025-4-29": "【初二】",
"2025-4-30": "【初三】",
"2025-5-1": "【初四】",
"2025-5-2": "【初五】",
"2025-5-3": "【初六】【放假日】",
"2025-5-4": "【初七】【放假日】",
"2025-5-5": "【立夏】",
"2025-5-6": "【初九】",
"2025-5-7": "【初十】",
"2025-5-8": "【十一】",
"2025-5-9": "【十二】",
"2025-5-10": "【十三】【放假日】",
"2025-5-11": "【十四】【放假日】",
"2025-5-12": "【十五】",
"2025-5-13": "【十六】",
"2025-5-14": "【十七】",
"2025-5-15": "【十八】",
"2025-5-16": "【十九】",
"2025-5-17": "【二十】【放假日】",
"2025-5-18": "【廿一】【放假日】",
"2025-5-19": "【廿二】",
"2025-5-20": "【廿三】",
"2025-5-21": "【小滿】",
"2025-5-22": "【廿五】",
"2025-5-23": "【廿六】",
"2025-5-24": "【廿七】【放假日】",
"2025-5-25": "【廿八】【放假日】",
"2025-5-26": "【廿九】",
"2025-5-27": "【五月小】",
"2025-5-28": "【初二】",
"2025-5-29": "【初三】",
"2025-5-30": "【初四】【放假日】",
"2025-5-31": "【端午節】【放假日】",




};

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
    const days =document.querySelectorAll('.day');
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
            dayElement.classList.remove(selectedClassName);
            dayElement.classList.remove(selectedClassName2);
            dayElement.classList.remove(selectedClassName3);
            dayElement.classList.remove('today-selected');
          });

    
      
      headerCell.style.backgroundImage = "linear-gradient(to right, #345bdb, #2e4d8f)";


      showTooltip(formattedDate);
      positionTooltip();
      if (btn.checked){
        hideTooltip();
      }
    }
    clickCount++;
  });
  
}

function createheadercell(year, month, day) {
  const headerCell = document.createElement('div');
  headerCell.classList.add('header-cell');
   
  headerCell.innerHTML = `${year} 年 &nbsp;&nbsp;&nbsp&nbsp;&nbsp${month} 月&nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbsp ${day} 日 &nbsp;`; 

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
     
      alert("\n 1. 點【太陽】圖示，會切換下個月班表 \n 2. 點左側的【年月日框框】會切換個人班表及選擇某日班表 \n 3. 【滑動名字】會顯示值班人員當月班表 \n 4. 點2下名字會切換至【Line視窗】 \n 5. 背景取至windy網站的氣象資訊，其中越紅代表雲層越厚 \n 6. 新增功能→→→點日期會【放大】該點選的日期 \n 7. 新增總臺(桃園區臺)介紹短片，【播放1次】後會消失 \n 8. 標題會顯示最近1次更新班表的時間【Last Updated】 \n 9. 【今天】以灰底顏色搭配彩虹邊框表示，可以一目瞭然距離下次值班的天數 \n 10. 名單條【可以拖曳移動】，若要恢復原位置→【點2下】【年月日框框】\n 11. 【新增農曆】於日曆中 \n 12. 【換日會自動refresh】例如：23:59→00:00時，今天的格子會自動跳下一日，且 會跳出今日值班名單。\n 13. 按住星期一～星期日其中一格2秒，會自動reload網頁。\n 14. 按右下角的圓形圖示，可切換至【時鐘】 \n 15. 背景地圖可移動、可量風速，按左下角的三角形可看天氣變化。\n\n\n 祝 平安 順心 \n 洪柜峰敬上");
      
    
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
    
      function showEditor() {
        noteContent.style.display = 'none'; // Hide content when editing
        textarea.value = noteContent.textContent === 'Click to edit note' ? '' : noteContent.textContent;
        noteEditor.style.display = 'flex';
        
        // Force keyboard to appear by using a sequence of actions
        setTimeout(() => {
          textarea.readOnly = false;
          textarea.blur();
          
          // A more aggressive focusing technique
          textarea.click();
          textarea.focus();
          
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
        noteContent.textContent = text || 'Click to edit note';
        const safeKey = date + "-" + username;
    
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
        e.preventDefault();
        e.stopPropagation();
        textarea.focus();
      };
      
      textarea.addEventListener('touchstart', tapHandler, { passive: false });
    
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
      
      // Improve editor positioning
      
    }    

  
    

  function fetchNote(card, date) {
  
  const noteContent = card.querySelector('.note-content');
  
  
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
    noteContent.textContent = "Click to edit note";
    return;
  }
  
  const noteRef = window.firebaseRef(window.firebaseDB, "Notes/" + safeKey);

  
  window.firebaseGet(noteRef)
    .then((snapshot) => {
      if (snapshot && snapshot.exists()) {
        const noteData = snapshot.val();
        if (noteData && noteData.Content) {
          noteContent.textContent = noteData.Content;
          console.log(`Note for ${date} fetched successfully`);
        } else {
          console.log(`Empty note content for ${date}`);
          noteContent.textContent = "Click to edit note";
        }
      } else {
        console.log(`No note found for ${date}`);
        noteContent.textContent = "Click to edit note";
      }
    })
    .catch((error) => {
      console.error(`Error fetching note for ${date}:`, error);
      noteContent.textContent = "Click to edit note";
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

function showTooltip(date) {
  
  const [year, month, day] = date.split('-');
  const formattedDate =  `${month}月${day}日`
  const dutyInfo = dutySchedule[date] || "None";

  
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

function setMode(newMode) {


  
  body.classList.remove("light", "neutral", "dark");
  toggle.classList.remove("light", "neutral", "dark");

  
  body.classList.add(newMode);
  toggle.classList.add(newMode);

  let reloadDivs = document.getElementsByClassName("weekday"); 
  let pressTimer;
  

  if (newMode === "dark"){
    updateSelection();
    clearSelectedClass();
    hideTooltip();

    calendar.innerHTML = '';

    month++;
    
    if (month > 12) {
      month = 1;
      year++;
    }
    createCalendar(year,month);
    
    const headerCells = document.querySelector('.header-cell');
    headerCells.innerHTML = `${year} 年 &nbsp;&nbsp;&nbsp&nbsp;&nbsp${month} 月&nbsp;`;  
    
    
    let header = document.getElementById('header');
    header.style.color = 'white';
    
    for (let i = 0; i < 7; i++) {
      let reloadDiv = reloadDivs[i];

      
      reloadDiv.addEventListener("mousedown", startTimer);
      reloadDiv.addEventListener("mouseup", clearTimer);
      reloadDiv.addEventListener("mouseleave", clearTimer);

      
      reloadDiv.addEventListener("touchstart", startTimer);
      reloadDiv.addEventListener("touchend", clearTimer);
      reloadDiv.addEventListener("touchcancel", clearTimer); 
    }
    hideTooltip();
    highlightAdditionalHoliday();
  } else if (mode === "neutral"){
    updateSelection();
    clearSelectedClass();


    calendar.innerHTML = '';

    month = (now.getMonth() + 1);
    if (month === 12) {
      year--;
    }
    createCalendar(year,month);
    let header = document.getElementById('header');
    header.style.color = '';
  
    
    const headerCells = document.querySelector('.header-cell');
    headerCells.innerHTML = `${year} 年 &nbsp;&nbsp;&nbsp&nbsp;&nbsp${month} 月&nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbsp ${day} 日 &nbsp;`;  
    showTooltip(formattedDate); 
    fetchWeather();
    AddWeekDay();
    highlightAdditionalHoliday();
  } else if (mode === "light"){
    updateSelection();
    clearSelectedClass();

    calendar.innerHTML = '';

    month--;
    if (month === 12) {
      year--;
    }
    createCalendar(year,month);
    let header = document.getElementById('header');
    header.style.color = '';
    
    
    const headerCells = document.querySelector('.header-cell');
    headerCells.innerHTML = `${year} 年 &nbsp;&nbsp;&nbsp&nbsp;&nbsp${month} 月&nbsp;`;  
    showTooltip(formattedDate); 
    fetchWeather();
    hideTooltip();
    highlightAdditionalHoliday();
  }
  
  highlightSelectedName(temp_name);
  const items = document.querySelectorAll('.picker-item');
  items.forEach((item) => {
    if (temp_name === item.textContent && temp_name != "．．．"){
      item.style.transform = 'scale(1.5)';
      item.style.backgroundColor = "turquoise";
    }
  });
 
  
  for (let i = 0; i < 7; i++) {
    let reloadDiv = reloadDivs[i];

    
    reloadDiv.addEventListener("mousedown", startTimer);
    reloadDiv.addEventListener("mouseup", clearTimer);
    reloadDiv.addEventListener("mouseleave", clearTimer);

   
    reloadDiv.addEventListener("touchstart", startTimer);
    reloadDiv.addEventListener("touchend", clearTimer);
    reloadDiv.addEventListener("touchcancel", clearTimer);
  }





}//setMode ends here



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
  "唐__茂",
  "彭偉慎",
  "王瑞發",
  "柯正和",
  "張日曜",
  "秦桔萬",
  "邱冠霖",
  "孫景泰",
  "方振彬",
  "林森發",
  "黃煜森",
  "劉錦郎",
  "林厚運",
  "張哲維",
  "余金原",
  "黃經洲",
  "許世勳",
  "洪柜峰",
  "周育稔",
  "林宏儒",
  "羅應順",
  "呂明峰",
  "．．．",
  "．．．",
];
const namePicker = document.getElementById("namePicker");
let currentIndex = 0;

const selectedClassName = 'selected';
const selectedClassName2 = 'selected2';
const selectedClassName3 = 'selected3';

function highlightSelectedName(selectedName) {
  const days = document.querySelectorAll('.day');
  days.forEach(dayElement => {
    const dayText = dayElement.textContent.split('\n')[0].trim();
    const date = `${year}-${month}-${dayText}`;
    const scheduleForDay = dutySchedule[date] || '';
    
   
    const scheduleParts = scheduleForDay.split(' ');

   
    const namesForSelectedClassName = [];
    const namesForSelectedClassName2 = [];
    const namesForSelectedClassName3 = [];

   
    let shouldCategorizeToClassName2 = false;
    let shouldCategorizeToClassName3 = false;
   
    scheduleParts.forEach(part => {
     
      if (part.startsWith('S:')) {
       
        shouldCategorizeToClassName3 = true;
      } else if (part.startsWith('A:')) {
        shouldCategorizeToClassName2 = true;
      } else if (shouldCategorizeToClassName2) {
        
        const name = part.trim();
        namesForSelectedClassName2.push(name);
        shouldCategorizeToClassName2 = false;
      } else if (shouldCategorizeToClassName3) {
        
        const name = part.trim();
        namesForSelectedClassName3.push(name);
        shouldCategorizeToClassName3 = false;
      } else {
       
        const name = part.trim();
        namesForSelectedClassName.push(name);
      }
    });

    const isToday = dayElement.classList.contains('today');
    

    if (namesForSelectedClassName3.includes(selectedName)) {
      dayElement.classList.add(selectedClassName3);
    } else {
      dayElement.classList.remove(selectedClassName3);
    }

    if (namesForSelectedClassName2.includes(selectedName)) {
      dayElement.classList.add(selectedClassName2);
    } else {
      dayElement.classList.remove(selectedClassName2);
    }

    if (namesForSelectedClassName.includes(selectedName)) {
      dayElement.classList.add(selectedClassName);
    } else {
      dayElement.classList.remove(selectedClassName);
    }

    
    if (isToday && (dayElement.classList.contains('selected') || dayElement.classList.contains('selected2') || dayElement.classList.contains('selected3'))) {
      dayElement.classList.add('today-selected'); 
    } else if (isToday) {
      dayElement.classList.remove('today-selected');
    }
  });

    
    days.forEach(dayElement => {
      dayElement.addEventListener('mouseover', () => {
        days.forEach(day => {
          day.classList.remove(selectedClassName);
          day.classList.remove(selectedClassName2);
          day.classList.remove(selectedClassName3);
        });
      });
    });
}


function highlightAdditionalHoliday() {
  const days = document.querySelectorAll('.day');
  days.forEach(dayElement => {
    const dayText = dayElement.textContent.split('\n')[0].trim();
    const date = `${year}-${month}-${dayText}`;
    const namesForHoliday = (holiday[date] || '').split(' ');
    
    if (namesForHoliday.some(name => name.includes('放假日'))) {

        dayElement.style.color = 'red';
      
    }
    if (namesForHoliday.some(name => !name.includes('放假日'))) {
        dayElement.style.color = 'black';
    }
     
  });

  AddLunar();
 
}



function AddLunar() { 
  const days = document.querySelectorAll('.day');
  days.forEach(dayElement => {
    const date = `${year}-${month}-${dayElement.textContent.trim()}`;
    const lunarName = (holiday[date] || '').split('】')[0].replace('【', '');
    
    if (lunarName) {
      dayElement.innerHTML = `${dayElement.textContent}\n<span class="lunar-name">${lunarName}</span>`;
    }
  });
}


function isLineBrowser() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  return ua.indexOf('Line') > -1;
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

    
    item.addEventListener("dblclick", () => {
     
      if (isLineBrowser()) {
       
        alert('Use a Regular Browser, like chrome, to open LINE since it is in LINE now');
      } else {
       
        window.location.href = 'line://nv/chat';
      }
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
    dayElement.classList.remove(selectedClassName);
    dayElement.classList.remove(selectedClassName2);
    dayElement.classList.remove(selectedClassName3);
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
        document.body.style.background = 'url(cozy.png)';
        document.body.style.backgroundSize= 'cover';
        document.body.style.backgroundPosition= 'center';
        ch_weather='雨天';
        
      } else if (weatherCondition === 'Clouds' && humidity > 80) {
        document.body.style.background = 'url(cozy.png)';
        document.body.style.backgroundSize= 'cover';
        document.body.style.backgroundPosition= 'center';
        ch_weather='陰天';
        
      } else if (weatherCondition === 'Drizzle') {
        document.body.style.background = 'url(cozy.png)';
        document.body.style.backgroundSize= 'cover';
        document.body.style.backgroundPosition= 'center';
        ch_weather='毛毛雨';
        
      } else if (weatherCondition === 'Thunderstorm') {
        document.body.style.background = 'url(cozy.png)';
        document.body.style.backgroundSize= 'cover';
        document.body.style.backgroundPosition= 'center';
        ch_weather='雷雨';
        
      } else if (weatherCondition === 'Squall') {
        document.body.style.background = 'url(cozy.png)';
        document.body.style.backgroundSize= 'cover';
        document.body.style.backgroundPosition= 'center';
        ch_weather='狂風暴雨';
        
      } else if (weatherCondition === 'Mist') {
        document.body.style.background = 'url(cozy.png)';
        document.body.style.backgroundSize= 'cover';
        document.body.style.backgroundPosition= 'center';
        ch_weather='濛濛有霧';
        
      } else {
      
        document.body.style.background = 'url(cozy.png)';
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
  if (!btn.checked) {
    const headerCell = document.querySelector('.header-cell');
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






document.addEventListener('mousemove', (e) => {
  const trail = document.createElement('div');
  trail.classList.add('trail');
  document.body.appendChild(trail);

  trail.style.left = e.pageX + 'px';
  trail.style.top = e.pageY + 'px';

  setTimeout(() => {
    trail.remove();
  },500);

});




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
let offsetX = 0, offsetY = 0;
let isDragging = false;


function startDragging(e) {
  isDragging = true;
  
  const clientX = e.clientX || e.touches[0].clientX;
  const clientY = e.clientY || e.touches[0].clientY;

  offsetX = clientX - tooltip_.offsetLeft;
  offsetY = clientY - tooltip_.offsetTop;

  document.addEventListener(e.type === 'mousedown' ? 'mousemove' : 'touchmove', moveTooltip);
  document.addEventListener(e.type === 'mousedown' ? 'mouseup' : 'touchend', stopDragging);

  e.preventDefault();
}


function moveTooltip(e) {
  if (isDragging) {
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    tooltip_.style.left = (clientX - offsetX) + 'px';
    tooltip_.style.top = (clientY - offsetY) + 'px';
  }
}


function stopDragging() {
  isDragging = false;
  document.removeEventListener('mousemove', moveTooltip);
  document.removeEventListener('mouseup', stopDragging);
  document.removeEventListener('touchmove', moveTooltip);
  document.removeEventListener('touchend', stopDragging);
}


tooltip_.addEventListener('mousedown', startDragging);
tooltip_.addEventListener('touchstart', startDragging);



//movable cards
// Get all cards
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
  
  // Dragging functions
  function startDragging2(e) {
    // Check if card is flipped before allowing drag
    checkFlipped();
    if (!isFlipped) return;
    
    isDragging2 = true;
    
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    
    offsetX2 = clientX - card.offsetLeft;
    offsetY2 = clientY - card.offsetTop;
    
    document.addEventListener(e.type === 'mousedown' ? 'mousemove' : 'touchmove', moveCard);
    document.addEventListener(e.type === 'mousedown' ? 'mouseup' : 'touchend', stopDragging2);
    
    e.preventDefault();
  }
  
  function moveCard(e) {
    if (isDragging2) {
      const clientX = e.clientX || e.touches[0].clientX;
      const clientY = e.clientY || e.touches[0].clientY;
      
      card.style.position = 'absolute';
      card.style.left = (clientX - offsetX2) + 'px';
      card.style.top = (clientY - offsetY2) + 'px';
    }
  }
  
  function stopDragging2() {
    isDragging2 = false;
    document.removeEventListener('mousemove', moveCard);
    document.removeEventListener('mouseup', stopDragging2);
    document.removeEventListener('touchmove', moveCard);
    document.removeEventListener('touchend', stopDragging2);
  }
  
  // Add event listeners for each card
  card.addEventListener('mousedown', startDragging2);
  card.addEventListener('touchstart', startDragging2);
  
  // Listen for transition end to update flipped state
  innerCard.addEventListener('transitionend', checkFlipped);
});


namePicker.addEventListener('scroll', () => {

  const itemHeight = namePicker.querySelector(".picker-item").offsetHeight;
  currentIndex = Math.floor(namePicker.scrollTop / itemHeight);
  updateSelection();
  clearSelectedClass();
  updateScale();

});



document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  userEmail = urlParams.get('userEmail');


  const emailNameMap = {
    'kueifeng7166@gmail.com': '洪柜峰',
    'kueifeng.eo94g@g2.nctu.edu.tw': '洪柜峰',
    'shinchir46@gmail.com': '洪柜峰',
    'qqcats0901@mail.post.gov.tw': '洪柜峰',
    'jeremycks@gmail.com':'劉錦郎',
    'chinjiewan@anws.gov.tw':'秦桔萬',
    'sishin@anws.gov.tw':'許世勳',
    'cw.chang@anws.gov.tw':'張哲維',
    'death174@gmail.com':'周育稔',
    'johnnyjan65@gmail.com':'詹文欽',

  };
  
  const targetName = emailNameMap[userEmail];
  username = targetName;




  if (targetName) {    
    const items = document.querySelectorAll('.picker-item');
    const nameElement = Array.from(items).find(item => item.textContent.trim() === targetName);
    if (nameElement) {
      nameElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
      });
      nameElement.click();
    }
  }


  const button = document.getElementById('scrollToMeButton');

  button.addEventListener('click', () => {
   
    if (targetName) {    
    const items = document.querySelectorAll('.picker-item');
    const nameElement = Array.from(items).find(item => item.textContent.trim() === targetName);
    if (nameElement) {
      nameElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
      });
      nameElement.click();
    }
  }
  
   });


});


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
  
      // below enable copy-paste functionality.
  document.querySelectorAll('.card textarea').forEach(textarea => {
      // Enable paste functionality explicitly
    textarea.addEventListener('paste', function(e) {
    // This empty handler ensures the default paste behavior works
    // iOS sometimes needs a slight delay to register the paste
    });
    // Ensure the textarea is properly focusable and editable
    textarea.setAttribute('tabindex', '0');
    textarea.removeAttribute('readonly');
       
  });
  
}
