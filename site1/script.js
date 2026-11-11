/**
 * Duty Schedule & Lunar Calendar Application
 * Refactored: All "mode" (light/neutral/dark) logic removed, modularized, and memory-safe.
 */

// ============================================================================
// 1. CONSTANTS & STATIC DATA
// ============================================================================

const CONFIG = {
  MIN_YEAR: 1950,
  MAX_YEAR: 2050,
  WEATHER_API_KEY: '35af5c01f0d331eb99f5a42b0259c663',
  LATITUDE: 25.07639,
  LONGITUDE: 121.22389,
  WEATHER_REFRESH_MS: 600_000,
  DAY_CHECK_INTERVAL_MS: 60_000,
  DEFAULT_STAFF: '洪柜峰',
};

const WEEKDAYS_ZH = ['一', '二', '三', '四', '五', '六', '日'];
const WEEKDAY_LABELS = { 0: '(日)', 1: '(一)', 2: '(二)', 3: '(三)', 4: '(四)', 5: '(五)', 6: '(六)' };

const HIGHLIGHT_CLASSES = [
  'selected', 'selected-top', 'selected-bottom',
  'selected2', 'selected2-top', 'selected2-bottom',
  'selected3', 'selected3-top', 'selected3-bottom',
  'today-selected',
];

const STAFF_NAMES = [
  '詹文欽', '黃榮國', '范振宇', '王金誠', '許敦智', '劉暐丞', '彭偉慎',
  '王瑞發', '黃金暄', '張日曜', '秦桔萬', '邱冠霖', '孫景泰', '官郁庭',
  '方振彬', '陳信憲', '林森發', '劉錦郎', '張哲維', '余金原', '陳志偉',
  '黃經洲', '許世勳', '洪柜峰', '周育稔', '林宏儒', '羅應順', '呂明峯',
];

const EMAIL_NAME_MAP = {
  'kueifeng7166@gmail.com': '洪柜峰',
  'kueifeng.eo94g@g2.nctu.edu.tw': '洪柜峰',
  'shinchir46@gmail.com': '洪柜峰',
  'qqcats0901@mail.post.gov.tw': '洪柜峰',
  'test@gmail.com': '林森發',
  'jeremycks@gmail.com': '劉錦郎',
  'chinjiewan@anws.gov.tw': '秦桔萬',
  'shihhsun.hsu@gmail.com': '許世勳',
  'cw.chang@anws.gov.tw': '張哲維',
  'death174@gmail.com': '周育稔',
  'johnnyjan65@gmail.com': '詹文欽',
  'p0915208386@gmail.com': '清潔劉小惠',
  'larchyde310119@hotmail.com': '邱冠霖',
  'swimmingfish@hotmail.com.tw': '余金原',
  'sct@anws.gov.tw': '孫景泰',
  'folra679@gmail.com': '官郁庭',
  'jihyaos@gmail.com': '張日曜',
  'chihung24@gmail.com': '張啟鴻',
  'dick710209@gmail.com': '陳鈞緯',
  'allen99lo@gmail.com': '羅應順',
  'lmfcool@anws.gov.tw': '呂明峯',
  'senfa6526@gmail.com': '林森發',
};

const dutySchedule = {
  "2026-1-1": "S: 張日曜 A: 林宏儒 N: 劉暐丞 C: 孫景泰 R: 陳志偉 T: 羅應順",
  "2026-1-2": "S: 黃榮國 A: 秦桔萬 N: 王金誠 C: 官郁庭 R: 余金原 T: 黃經洲",
  "2026-1-3": "S: 黃榮國 A: 呂明峯 N: 許敦智 C: 邱冠霖 R: 張哲維 T: 許世勳",
  "2026-1-4": "S: 范振宇 A: 劉錦郎 N: 彭偉慎 C: 張日曜 R: 黃煜森 T: 周育稔",
  "2026-1-5": "S: 黃經洲 A: 方振彬 N: 王金誠 C: 官郁庭 R: 余金原 T: 呂明峯",
  "2026-1-6": "S: 林森發 A: 洪柜峰 N: 許敦智 C: 邱冠霖 R: 劉錦郎 T: 周育稔",
  "2026-1-7": "S: 黃榮國 A: 羅應順 N: 劉暐丞 C: 孫景泰 R: 黃煜森 T: 林宏儒",
  "2026-1-8": "S: 范振宇 A: 余金原 N: 許敦智 C: 秦桔萬 R: 張哲維 T: 周育稔",
  "2026-1-9": "S: 張日曜 A: 洪柜峰 N: 彭偉慎 C: 方振彬 R: 劉錦郎 T: 許世勳",
  "2026-1-10": "S: 詹文欽 A: 劉暐丞 N: 王瑞發 C: 官郁庭 R: 陳志偉 T: 林宏儒",
  "2026-1-11": "S: 林森發 A: 孫景泰 N: 彭偉慎 C: 秦桔萬 R: 張哲維 T: 羅應順",
  "2026-1-12": "S: 范振宇 A: 許世勳 N: 劉暐丞 C: 官郁庭 R: 余金原 T: 洪柜峰",
  "2026-1-13": "S: 黃經洲 A: 張日曜 N: 許敦智 C: 方振彬 R: 劉錦郎 T: 周育稔",
  "2026-1-14": "S: 黃榮國 A: 林宏儒 N: 王瑞發 C: 孫景泰 R: 黃煜森 T: 呂明峯",
  "2026-1-15": "S: 林森發 A: 王金誠 N: 劉暐丞 C: 邱冠霖 R: 張哲維 T: 洪柜峰",
  "2026-1-16": "S: 范振宇 A: 羅應順 N: 王瑞發 C: 方振彬 R: 余金原 T: 呂明峯",
  "2026-1-17": "S: 詹文欽 A: 彭偉慎 N: 王金誠 C: 孫景泰 R: 黃煜森 T: 周育稔",
  "2026-1-18": "S: 黃經洲 A: 秦桔萬 N: 王瑞發 C: 邱冠霖 R: 劉錦郎 T: 許世勳",
  "2026-1-19": "S: 張日曜 A: 黃煜森 N: 許敦智 C: 官郁庭 R: 張哲維 T: 洪柜峰",
  "2026-1-20": "S: 黃榮國 A: 周育稔 N: 王金誠 C: 方振彬 R: 余金原 T: 許世勳",
  "2026-1-21": "S: 林森發 A: 呂明峯 N: 范振宇 C: 秦桔萬 R: 劉錦郎 T: 林宏儒",
  "2026-1-22": "S: 黃經洲 A: 官郁庭 N: 王金誠 C: 孫景泰 R: 張哲維 T: 許世勳",
  "2026-1-23": "S: 黃榮國 A: 王瑞發 N: 許敦智 C: 邱冠霖 R: 黃煜森 T: 林宏儒",
  "2026-1-24": "S: 林森發 A: 官郁庭 N: 彭偉慎 C: 張日曜 R: 余金原 T: 羅應順",
  "2026-1-25": "S: 范振宇 A: 洪柜峰 N: 許敦智 C: 邱冠霖 R: 劉錦郎 T: 呂明峯",
  "2026-1-26": "S: 黃經洲 A: 張哲維 N: 王瑞發 C: 方振彬 R: 余金原 T: 羅應順",
  "2026-1-27": "S: 林森發 A: 許世勳 N: 王金誠 C: 秦桔萬 R: 黃煜森 T: 林宏儒",
  "2026-1-28": "S: 范振宇 A: 邱冠霖 N: 彭偉慎 C: 官郁庭 R: 劉錦郎 T: 洪柜峰",
  "2026-1-29": "S: 黃榮國 A: 呂明峯 N: 王瑞發 C: 張日曜 R: 黃煜森 T: 羅應順",
  "2026-1-30": "S: 詹文欽 A: 范振宇 N: 王金誠 C: 孫景泰 R: 張哲維 T: 林宏儒",
  "2026-1-31": "S: 黃經洲 A: 林森發 N: 劉暐丞 C: 秦桔萬 R: 陳志偉 T: 洪柜峰",
  "2026-2-1": "S: 張日曜 A: 彭偉慎 N: 許敦智 C: 邱冠霖 R: 張哲維 T: 林宏儒",
  "2026-2-2": "S: 范振宇 A: 方振彬 N: 王金誠 C: 官郁庭 R: 余金原 T: 羅應順",
  "2026-2-3": "S: 黃經洲 A: 劉錦郎 N: 劉暐丞 C: 秦桔萬 R: 黃煜森 T: 呂明峯",
  "2026-2-4": "S: 黃榮國 A: 洪柜峰 N: 王瑞發 C: 邱冠霖 R: 張哲維 T: 周育稔",
  "2026-2-5": "S: 林森發 A: 許世勳 N: 王金誠 C: 孫景泰 R: 余金原 T: 呂明峯",
  "2026-2-6": "S: 詹文欽 A: 黃煜森 N: 彭偉慎 C: 張日曜 R: 劉錦郎 T: 周育稔",
  "2026-2-7": "S: 黃榮國 A: 羅應順 N: 許敦智 C: 邱冠霖 R: 陳志偉 T: 黃經洲",
  "2026-2-8": "S: 范振宇 A: 官郁庭 N: 王瑞發 C: 秦桔萬 R: 余金原 T: 洪柜峰",
  "2026-2-9": "S: 林森發 A: 周育稔 N: 彭偉慎 C: 方振彬 R: 劉錦郎 T: 呂明峯",
  "2026-2-10": "S: 黃榮國 A: 王金誠 N: 王瑞發 C: 官郁庭 R: 張哲維 T: 林宏儒",
  "2026-2-11": "S: 張日曜 A: 呂明峯 N: 許敦智 C: 邱冠霖 R: 黃煜森 T: 羅應順",
  "2026-2-12": "S: 黃經洲 A: 林森發 N: 劉暐丞 C: 秦桔萬 R: 陳志偉 T: 周育稔",
  "2026-2-13": "S: 黃榮國 A: 許世勳 N: 范振宇 C: 官郁庭 R: 黃煜森 T: 洪柜峰",
  "2026-2-14": "S: 詹文欽 A: 張哲維 N: 許敦智 C: 孫景泰 R: 劉錦郎 T: 呂明峯",
  "2026-2-15": "S: 黃經洲 A: 黃煜森 N: 王瑞發 C: 邱冠霖 R: 余金原 T: 周育稔",
  "2026-2-16": "S: 范振宇 A: 張哲維 N: 許敦智 C: 方振彬 R: 陳志偉 T: 林宏儒",
  "2026-2-17": "S: 林森發 A: 秦桔萬 N: 彭偉慎 C: 官郁庭 R: 劉錦郎 T: 許世勳",
  "2026-2-18": "S: 黃榮國 A: 王金誠 N: 劉暐丞 C: 孫景泰 R: 陳志偉 T: 洪柜峰",
  "2026-2-19": "S: 張日曜 A: 呂明峯 N: 王瑞發 C: 邱冠霖 R: 黃煜森 T: 羅應順",
  "2026-2-20": "S: 詹文欽 A: 官郁庭 N: 彭偉慎 C: 方振彬 R: 陳志偉 T: 周育稔",
  "2026-2-21": "S: 黃經洲 A: 范振宇 N: 王金誠 C: 秦桔萬 R: 林森發 T: 呂明峯",
  "2026-2-22": "S: 張日曜 A: 羅應順 N: 劉暐丞 C: 孫景泰 R: 余金原 T: 許世勳",
  "2026-2-23": "S: 林森發 A: 周育稔 N: 彭偉慎 C: 秦桔萬 R: 劉錦郎 T: 洪柜峰",
  "2026-2-24": "S: 黃經洲 A: 許敦智 N: 王瑞發 C: 官郁庭 R: 黃煜森 T: 許世勳",
  "2026-2-25": "S: 黃榮國 A: 邱冠霖 N: 彭偉慎 C: 孫景泰 R: 陳志偉 T: 林宏儒",
  "2026-2-26": "S: 林森發 A: 劉暐丞 N: 王金誠 C: 秦桔萬 R: 劉錦郎 T: 羅應順",
  "2026-2-27": "S: 詹文欽 A: 周育稔 N: 王瑞發 C: 張日曜 R: 余金原 T: 林宏儒",
  "2026-2-28": "S: 范振宇 A: 洪柜峰 N: 劉暐丞 C: 孫景泰 R: 張哲維 T: 許世勳",
  "2026-3-1": "S: 林森發 A: 呂明峯 N: 王瑞發 C: 方振彬 R: 黃煜森 T: 林宏儒",
  "2026-3-2": "S: 張日曜 A: 范振宇 N: 彭偉慎 C: 秦桔萬 R: 陳志偉 T: 洪柜峰",
  "2026-3-3": "S: 黃經洲 A: 張哲維 N: 劉暐丞 C: 官郁庭 R: 余金原 T: 許世勳",
  "2026-3-4": "S: 范振宇 A: 林森發 N: 王瑞發 C: 秦桔萬 R: 劉錦郎 T: 林宏儒",
  "2026-3-5": "S: 黃榮國 A: 洪柜峰 N: 許敦智 C: 方振彬 R: 張哲維 T: 周育稔",
  "2026-3-6": "S: 詹文欽 A: 羅應順 N: 彭偉慎 C: 秦桔萬 R: 陳志偉 T: 呂明峯",
  "2026-3-7": "S: 范振宇 A: 張日曜 N: 劉暐丞 C: 官郁庭 R: 劉錦郎 T: 許世勳",
  "2026-3-8": "S: 黃經洲 A: 陳志偉 N: 王瑞發 C: 邱冠霖 R: 余金原 T: 羅應順",
  "2026-3-9": "S: 林森發 A: 周育稔 N: 劉暐丞 C: 官郁庭 R: 劉錦郎 T: 許世勳",
  "2026-3-10": "S: 張日曜 A: 方振彬 N: 王瑞發 C: 秦桔萬 R: 余金原 T: 林宏儒",
  "2026-3-11": "S: 黃榮國 A: 洪柜峰 N: 劉暐丞 C: 邱冠霖 R: 陳志偉 T: 周育稔",
  "2026-3-12": "S: 張日曜 A: 羅應順 N: 彭偉慎 C: 官郁庭 R: 劉錦郎 T: 呂明峯",
  "2026-3-13": "S: 張日曜 A: 黃煜森 N: 王瑞發 C: 方振彬 R: 張哲維 T: 許世勳",
  "2026-3-14": "S: 詹文欽 A: 林宏儒 N: 彭偉慎 C: 秦桔萬 R: 陳志偉 T: 黃經洲",
  "2026-3-15": "S: 范振宇 A: 許世勳 N: 許敦智 C: 張日曜 R: 黃煜森 T: 洪柜峰",
  "2026-3-16": "S: 黃榮國 A: 彭偉慎 N: 王瑞發 C: 秦桔萬 R: 張哲維 T: 呂明峯",
  "2026-3-17": "S: 黃經洲 A: 劉暐丞 N: 許敦智 C: 邱冠霖 R: 余金原 T: 羅應順",
  "2026-3-18": "S: 范振宇 A: 劉錦郎 N: 王金誠 C: 官郁庭 R: 黃煜森 T: 周育稔",
  "2026-3-19": "S: 林森發 A: 彭偉慎 N: 劉暐丞 C: 秦桔萬 R: 陳志偉 T: 林宏儒",
  "2026-3-20": "S: 詹文欽 A: 范振宇 N: 許敦智 C: 邱冠霖 R: 張哲維 T: 周育稔",
  "2026-3-21": "S: 黃榮國 A: 呂明峯 N: 王金誠 C: 官郁庭 R: 余金原 T: 洪柜峰",
  "2026-3-22": "S: 林森發 A: 彭偉慎 N: 劉暐丞 C: 秦桔萬 R: 劉錦郎 T: 周育稔",
  "2026-3-23": "S: 張日曜 A: 許世勳 N: 許敦智 C: 邱冠霖 R: 陳志偉 T: 羅應順",
  "2026-3-24": "S: 黃榮國 A: 張哲維 N: 王金誠 C: 方振彬 R: 余金原 T: 呂明峯",
  "2026-3-25": "S: 張日曜 A: 周育稔 N: 王瑞發 C: 官郁庭 R: 黃煜森 T: 羅應順",
  "2026-3-26": "S: 黃經洲 A: 陳志偉 N: 許敦智 C: 邱冠霖 R: 張哲維 T: 許世勳",
  "2026-3-27": "S: 黃榮國 A: 林宏儒 N: 劉暐丞 C: 官郁庭 R: 余金原 T: 洪柜峰",
  "2026-3-28": "S: 詹文欽 A: 林森發 N: 許敦智 C: 邱冠霖 R: 黃煜森 T: 羅應順",
  "2026-3-29": "S: 黃經洲 A: 劉錦郎 N: 王瑞發 C: 孫景泰 R: 張哲維 T: 周育稔",
  "2026-3-30": "S: 張日曜 A: 洪柜峰 N: 彭偉慎 C: 邱冠霖 R: 黃煜森 T: 呂明峯",
  "2026-3-31": "S: 林森發 A: 林宏儒 N: 許敦智 C: 孫景泰 R: 余金原 T: 黃經洲",
  "2026-4-1": "S: 黃榮國 A: 陳志偉 N: 劉暐丞 C: 張日曜 R: 張哲維 T: 周育稔",
  "2026-4-2": "S: 范振宇 A: 呂明峯 N: 許敦智 C: 秦桔萬 R: 劉錦郎 T: 黃經洲",
  "2026-4-3": "S: 詹文欽 A: 林森發 N: 王金誠 C: 方振彬 R: 余金原 T: 林宏儒",
  "2026-4-4": "S: 張日曜 A: 洪柜峰 N: 劉暐丞 C: 邱冠霖 R: 黃煜森 T: 羅應順",
  "2026-4-5": "S: 詹文欽 A: 官郁庭 N: 王瑞發 C: 孫景泰 R: 陳志偉 T: 周育稔",
  "2026-4-6": "S: 黃榮國 A: 王金誠 N: 劉暐丞 C: 秦桔萬 R: 張哲維 T: 呂明峯",
  "2026-4-7": "S: 范振宇 A: 孫景泰 N: 王瑞發 C: 邱冠霖 R: 陳志偉 T: 洪柜峰",
  "2026-4-8": "S: 張日曜 A: 呂明峯 N: 劉暐丞 C: 官郁庭 R: 余金原 T: 黃經洲",
  "2026-4-9": "S: 林森發 A: 林宏儒 N: 許敦智 C: 秦桔萬 R: 黃煜森 T: 洪柜峰",
  "2026-4-10": "S: 詹文欽 A: 劉錦郎 N: 王金誠 C: 官郁庭 R: 陳志偉 T: 周育稔",
  "2026-4-11": "S: 黃經洲 A: 范振宇 N: 彭偉慎 C: 孫景泰 R: 張哲維 T: 林宏儒",
  "2026-4-12": "S: 張日曜 A: 黃煜森 N: 劉暐丞 C: 邱冠霖 R: 陳志偉 T: 羅應順",
  "2026-4-13": "S: 林森發 A: 周育稔 N: 彭偉慎 C: 方振彬 R: 余金原 T: 呂明峯",
  "2026-4-14": "S: 范振宇 A: 邱冠霖 N: 許敦智 C: 秦桔萬 R: 陳志偉 T: 洪柜峰",
  "2026-4-15": "S: 黃榮國 A: 許世勳 N: 王金誠 C: 官郁庭 R: 黃煜森 T: 林宏儒",
  "2026-4-16": "S: 黃經洲 A: 林森發 N: 王瑞發 C: 孫景泰 R: 劉錦郎 T: 洪柜峰",
  "2026-4-17": "S: 黃榮國 A: 劉暐丞 N: 彭偉慎 C: 邱冠霖 R: 張哲維 T: 許世勳",
  "2026-4-18": "S: 范振宇 A: 羅應順 N: 許敦智 C: 張日曜 R: 陳志偉 T: 呂明峯",
  "2026-4-19": "S: 林森發 A: 秦桔萬 N: 王瑞發 C: 官郁庭 R: 余金原 T: 周育稔",
  "2026-4-20": "S: 黃經洲 A: 張哲維 N: 彭偉慎 C: 邱冠霖 R: 劉錦郎 T: 許世勳",
  "2026-4-21": "S: 黃榮國 A: 羅應順 N: 王金誠 C: 方振彬 R: 余金原 T: 林宏儒",
  "2026-4-22": "S: 范振宇 A: 洪柜峰 N: 許敦智 C: 官郁庭 R: 張哲維 T: 許世勳",
  "2026-4-23": "S: 張日曜 A: 林宏儒 N: 劉暐丞 C: 邱冠霖 R: 黃煜森 T: 呂明峯",
  "2026-4-24": "S: 林森發 A: 彭偉慎 N: 王瑞發 C: 孫景泰 R: 余金原 T: 周育稔",
  "2026-4-25": "S: 黃榮國 A: 許世勳 N: 許敦智 C: 秦桔萬 R: 劉錦郎 T: 洪柜峰",
  "2026-4-26": "S: 黃經洲 A: 黃煜森 N: 彭偉慎 C: 孫景泰 R: 張哲維 T: 羅應順",
  "2026-4-27": "S: 張日曜 A: 王金誠 N: 王瑞發 C: 方振彬 R: 陳志偉 T: 周育稔",
  "2026-4-28": "S: 林森發 A: 林宏儒 N: 許敦智 C: 秦桔萬 R: 余金原 T: 許世勳",
  "2026-4-29": "S: 黃經洲 A: 王瑞發 N: 彭偉慎 C: 孫景泰 R: 劉錦郎 T: 呂明峯",
  "2026-4-30": "S: 詹文欽 A: 官郁庭 N: 王金誠 C: 方振彬 R: 黃煜森 T: 許世勳",
  "2026-5-1": "S: 范振宇 A: 洪柜峰 N: 彭偉慎 C: 邱冠霖 R: 余金原 T: 周育稔",
  "2026-5-2": "S: 黃榮國 A: 許世勳 N: 王瑞發 C: 孫景泰 R: 陳志偉 T: 呂明峯",
  "2026-5-3": "S: 林森發 A: 彭偉慎 N: 王金誠 C: 秦桔萬 R: 劉錦郎 T: 羅應順",
  "2026-5-4": "S: 黃經洲 A: 邱冠霖 N: 許敦智 C: 官郁庭 R: 余金原 T: 許世勳",
  "2026-5-5": "S: 范振宇 A: 周育稔 N: 劉暐丞 C: 方振彬 R: 黃煜森 T: 林宏儒",
  "2026-5-6": "S: 黃榮國 A: 孫景泰 N: 王瑞發 C: 張日曜 R: 張哲維 T: 呂明峯",
  "2026-5-7": "S: 林森發 A: 羅應順 N: 王金誠 C: 官郁庭 R: 陳志偉 T: 洪柜峰",
  "2026-5-8": "S: 詹文欽 A: 劉暐丞 N: 許敦智 C: 秦桔萬 R: 劉錦郎 T: 周育稔",
  "2026-5-9": "S: 張日曜 A: 許世勳 N: 王金誠 C: 方振彬 R: 余金原 T: 呂明峯",
  "2026-5-10": "S: 黃經洲 A: 秦桔萬 N: 王瑞發 C: 官郁庭 R: 陳志偉 T: 周育稔",
  "2026-5-11": "S: 林森發 A: 黃榮國 N: 彭偉慎 C: 孫景泰 R: 劉錦郎 T: 羅應順",
  "2026-5-12": "S: 張日曜 A: 洪柜峰 N: 王金誠 C: 邱冠霖 R: 余金原 T: 呂明峯",
  "2026-5-13": "S: 范振宇 A: 張哲維 N: 王瑞發 C: 官郁庭 R: 陳志偉 T: 許世勳",
  "2026-5-14": "S: 黃榮國 A: 彭偉慎 N: 許敦智 C: 孫景泰 R: 余金原 T: 周育稔",
  "2026-5-15": "S: 詹文欽 A: 陳志偉 N: 劉暐丞 C: 邱冠霖 R: 張哲維 T: 洪柜峰",
  "2026-5-16": "S: 黃經洲 A: 林森發 N: 彭偉慎 C: 孫景泰 R: 黃煜森 T: 羅應順",
  "2026-5-17": "S: 張日曜 A: 許世勳 N: 劉暐丞 C: 官郁庭 R: 劉錦郎 T: 林宏儒",
  "2026-5-18": "S: 范振宇 A: 呂明峯 N: 許敦智 C: 方振彬 R: 張哲維 T: 周育稔",
  "2026-5-19": "S: 林森發 A: 林宏儒 N: 王瑞發 C: 邱冠霖 R: 余金原 T: 黃經洲",
  "2026-5-20": "S: 黃榮國 A: 羅應順 N: 許敦智 C: 秦桔萬 R: 劉錦郎 T: 洪柜峰",
  "2026-5-21": "S: 張日曜 A: 呂明峯 N: 劉暐丞 C: 孫景泰 R: 黃煜森 T: 林宏儒",
  "2026-5-22": "S: 林森發 A: 方振彬 N: 王瑞發 C: 官郁庭 R: 張哲維 T: 黃經洲",
  "2026-5-23": "S: 詹文欽 A: 范振宇 N: 劉暐丞 C: 秦桔萬 R: 劉錦郎 T: 林宏儒",
  "2026-5-24": "S: 黃榮國 A: 黃煜森 N: 許敦智 C: 邱冠霖 R: 陳志偉 T: 洪柜峰",
  "2026-5-25": "S: 黃經洲 A: 劉暐丞 N: 彭偉慎 C: 方振彬 R: 張哲維 T: 林宏儒",
  "2026-5-26": "S: 張日曜 A: 劉錦郎 N: 王金誠 C: 秦桔萬 R: 余金原 T: 羅應順",
  "2026-5-27": "S: 黃榮國 A: 許敦智 N: 范振宇 C: 孫景泰 R: 張哲維 T: 洪柜峰",
  "2026-5-28": "S: 黃經洲 A: 劉錦郎 N: 彭偉慎 C: 秦桔萬 R: 陳志偉 T: 許世勳",
  "2026-5-29": "S: 林森發 A: 王瑞發 N: 王金誠 C: 孫景泰 R: 張哲維 T: 林宏儒",
  "2026-5-30": "S: 詹文欽 A: 張日曜 N: 許敦智 C: 官郁庭 R: 黃煜森 T: 羅應順",
  "2026-5-31": "S: 范振宇 A: 余金原 N: 王金誠 C: 邱冠霖 R: 張哲維 T: 呂明峯",
  "2026-6-1": "S: 張日曜 A: 林宏儒 N: 王瑞發 C: 秦桔萬 R: 陳志偉 T: 黃經洲",
  "2026-6-2": "S: 黃榮國 A: 方振彬 N: 許敦智 C: 孫景泰 R: 余金原 T: 洪柜峰",
  "2026-6-3": "S: 范振宇 A: 邱冠霖 N: 彭偉慎 C: 官郁庭 R: 劉錦郎 T: 許世勳",
  "2026-6-4": "S: 林森發 A: 許敦智 N: 劉暐丞 C: 方振彬 R: 黃煜森 T: 林宏儒",
  "2026-6-5": "S: 詹文欽 A: 張哲維 N: 王金誠 C: 秦桔萬 R: 陳志偉 T: 黃經洲",
  "2026-6-6": "S: 黃榮國 A: 劉暐丞 N: 王瑞發 C: 孫景泰 R: 余金原 T: 許世勳",
  "2026-6-7": "S: 黃經洲 A: 劉錦郎 N: 王金誠 C: 官郁庭 R: 黃煜森 T: 呂明峯",
  "2026-6-8": "S: 范振宇 A: 秦桔萬 N: 彭偉慎 C: 邱冠霖 R: 張哲維 T: 林宏儒",
  "2026-6-9": "S: 黃經洲 A: 許敦智 N: 劉暐丞 C: 孫景泰 R: 余金原 T: 周育稔",
  "2026-6-10": "S: 林森發 A: 洪柜峰 N: 王瑞發 C: 官郁庭 R: 劉錦郎 T: 羅應順",
  "2026-6-11": "S: 黃榮國 A: 黃煜森 N: 王金誠 C: 秦桔萬 R: 陳志偉 T: 周育稔",
  "2026-6-12": "S: 詹文欽 A: 呂明峯 N: 彭偉慎_范振宇 C: 邱冠霖 R: 余金原 T: 許世勳",
  "2026-6-13": "S: 林森發 A: 官郁庭 N: 許敦智 C: 方振彬 R: 陳志偉 T: 洪柜峰",
  "2026-6-14": "S: 張日曜 A: 劉暐丞 N: 彭偉慎 C: 秦桔萬 R: 張哲維 T: 羅應順",
  "2026-6-15": "S: 范振宇 A: 周育稔 N: 王瑞發 C: 方振彬 R: 劉錦郎 T: 洪柜峰",
  "2026-6-16": "S: 林森發 A: 許世勳 N: 王金誠 C: 秦桔萬 R: 張哲維 T: 呂明峯",
  "2026-6-17": "S: 黃經洲 A: 孫景泰 N: 劉暐丞 C: 官郁庭 R: 劉錦郎 T: 羅應順",
  "2026-6-18": "S: 黃榮國 A: 許敦智 N: 王瑞發 C: 秦桔萬 R: 陳志偉 T: 洪柜峰",
  "2026-6-19": "S: 張日曜 A: 林森發 N: 彭偉慎 C: 孫景泰 R: 張哲維 T: 周育稔",
  "2026-6-20": "S: 詹文欽 A: 呂明峯 N: 王金誠 C: 官郁庭 R: 黃煜森 T: 林宏儒",
  "2026-6-21": "S: 范振宇 A: 羅應順 N: 許敦智 C: 邱冠霖 R: 余金原 T: 許世勳",
  "2026-6-22": "S: 張日曜 A: 官郁庭 N: 彭偉慎 C: 秦桔萬 R: 陳志偉 T: 周育稔",
  "2026-6-23": "S: 黃經洲 A: 劉錦郎 N: 劉暐丞 C: 方振彬 R: 余金原 T: 羅應順",
  "2026-6-24": "S: 黃榮國 A: 林森發 N: 王金誠 C: 邱冠霖 R: 張哲維 T: 林宏儒",
  "2026-6-25": "S: 范振宇 A: 許世勳 N: 彭偉慎 C: 孫景泰 R: 陳志偉 T: 周育稔",
  "2026-6-26": "S: 黃經洲 A: 林宏儒 N: 王瑞發 C: 邱冠霖 R: 張哲維 T: 呂明峯",
  "2026-6-27": "S: 詹文欽 A: 范振宇 N: 彭偉慎 C: 張日曜 R: 劉錦郎 T: 羅應順",
  "2026-6-28": "S: 黃榮國 A: 洪柜峰 N: 劉暐丞 C: 孫景泰 R: 陳志偉 T: 許世勳",
  "2026-6-29": "S: 林森發 A: 呂明峯 N: 王金誠 C: 秦桔萬 R: 張哲維 T: 林宏儒",
  "2026-6-30": "S: 張日曜 A: 王瑞發 N: 許敦智 C: 邱冠霖 R: 余金原 T: 周育稔",
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
  "2026-10-19": "S: 范振宇 A: 呂明峯 N: 黃金暄_王瑞發 C: 張日曜 R: 劉錦郎 T: 林宏儒",
  "2026-10-20": "S: 黃經洲 A: 劉暐丞 N: 許敦智 C: 方振彬 R: 余金原 T: 羅應順",
  "2026-10-21": "S: 黃榮國 A: 邱冠霖 N: 王金誠 C: 陳信憲 R: 陳志偉 T: 洪柜峰",
  "2026-10-22": "S: 許敦智 A: 林宏儒 N: 黃金暄 C: 秦桔萬 R: 劉錦郎 T: 呂明峯",
  "2026-10-23": "S: 張日曜 A: 周育稔 N: 王金誠 C: 孫景泰 R: 余金原 T: 黃經洲",
  "2026-10-24": "S: 詹文欽 A: 林宏儒 N: 劉暐丞 C: 邱冠霖 R: 陳志偉 T: 呂明峯",
  "2026-10-25": "S: 黃經洲 A: 張日曜 N: 王金誠 C: 陳信憲 R: 劉錦郎 T: 周育稔",
  "2026-10-26": "S: 范振宇 A: 許世勳 N: 王瑞發 C: 官郁庭 R: 余金原 T: 林宏儒",
  "2026-10-27": "S: 許敦智 A: 周育稔 N: 彭偉慎 C: 孫景泰 R: 林森發 T: 羅應順",
  "2026-10-28": "S: 黃榮國 A: 方振彬 N: 王金誠 C: 秦桔萬 R: 陳志偉 T: 許世勳",
  "2026-10-29": "S: 黃經洲 A: 官郁庭 N: 王瑞發 C: 邱冠霖 R: 劉錦郎 T: 呂明峯",
  "2026-10-30": "S: 張日曜 A: 王金誠 N: 黃金暄 C: 孫景泰 R: 余金原 T: 羅應順",
  "2026-10-31": "S: 范振宇 A: 許世勳 N: 彭偉慎 C: 秦桔萬 R: 林森發 T: 呂明峯",
  "2026-11-1": "S: 詹文欽 A: 孫景泰 N: 劉暐丞 C: 方振彬 R: 劉錦郎 T: 羅應順",
"2026-11-2": "S: 黃經洲 A: 王瑞發 N: 王金誠 C: 陳信憲 R: 陳志偉 T: 呂明峯",
"2026-11-3": "S: 張日曜 A: 許世勳 N: 黃金暄 C: 官郁庭 R: 余金原 T: 洪柜峰",
"2026-11-4": "S: 范振宇 A: 秦桔萬 N: 劉暐丞 C: 邱冠霖 R: 林森發 T: 周育稔",
"2026-11-5": "S: 許敦智 A: 洪柜峰 N: 王金誠 C: 孫景泰 R: 余金原 T: 許世勳",
"2026-11-6": "S: 黃榮國 A: 張日曜 N: 彭偉慎 C: 陳信憲 R: 陳志偉 T: 黃經洲",
"2026-11-7": "S: 詹文欽 A: 林宏儒 N: 黃金暄 C: 邱冠霖 R: 余金原 T: 羅應順",
"2026-11-8": "S: 黃經洲 A: 周育稔 N: 王金誠 C: 陳信憲 R: 林森發 T: 呂明峯",
"2026-11-9": "S: 許敦智 A: 許世勳 N: 黃金暄 C: 官郁庭 R: 劉錦郎 T: 洪柜峰",
"2026-11-10": "S: 范振宇 A: 方振彬 N: 彭偉慎 C: 秦桔萬 R: 陳志偉 T: 周育稔",
"2026-11-11": "S: 黃榮國 A: 羅應順 N: 王金誠 C: 邱冠霖 R: 林森發 T: 林宏儒",
"2026-11-12": "S: 黃經洲 A: 許敦智 N: 劉暐丞 C: 陳信憲 R: 陳志偉 T: 呂明峯",
"2026-11-13": "S: 范振宇 A: 黃金暄 N: 王瑞發 C: 秦桔萬 R: 劉錦郎 T: 洪柜峰",
"2026-11-14": "S: 林森發 A: 孫景泰 N: 彭偉慎 C: 官郁庭 R: 余金原 T: 許世勳",
"2026-11-15": "S: 黃榮國 A: 邱冠霖 N: 劉暐丞 C: 張日曜 R: 劉錦郎 T: 林宏儒",
"2026-11-16": "S: 黃經洲 A: 劉錦郎 N: 王金誠 C: 秦桔萬 R: 余金原 T: 周育稔",
"2026-11-17": "S: 許敦智 A: 許世勳 N: 黃金暄 C: 孫景泰 R: 林森發 T: 洪柜峰",
"2026-11-18": "S: 范振宇 A: 官郁庭 N: 劉暐丞 C: 邱冠霖 R: 張哲維 T: 林宏儒",
"2026-11-19": "S: 黃榮國 A: 彭偉慎 N: 王瑞發 C: 秦桔萬 R: 劉錦郎 T: 羅應順",
"2026-11-20": "S: 詹文欽 A: 劉暐丞 N: 許敦智 C: 陳信憲 R: 張哲維 T: 周育稔",
"2026-11-21": "S: 范振宇 A: 呂明峯 N: 王瑞發 C: 方振彬 R: 陳志偉 T: 黃經洲",
"2026-11-22": "S: 張日曜 A: 林宏儒 N: 劉暐丞 C: 邱冠霖 R: 張哲維 T: 許世勳",
"2026-11-23": "S: 許敦智 A: 陳信憲 N: 王瑞發 C: 方振彬 R: 余金原 T: 周育稔",
"2026-11-24": "S: 黃榮國 A: 呂明峯 N: 彭偉慎 C: 秦桔萬 R: 張哲維 T: 許世勳",
"2026-11-25": "S: 范振宇 A: 官郁庭 N: 王金誠 C: 孫景泰 R: 余金原 T: 洪柜峰",
"2026-11-26": "S: 張日曜 A: 王瑞發 N: 黃金暄 C: 陳信憲 R: 張哲維 T: 林宏儒",
"2026-11-27": "S: 黃榮國 A: 周育稔 N: 彭偉慎 C: 官郁庭 R: 林森發 T: 羅應順",
"2026-11-28": "S: 詹文欽 A: 許敦智 N: 王金誠 C: 秦桔萬 R: 張哲維 T: 洪柜峰",
"2026-11-29": "S: 張日曜 A: 陳志偉 N: 黃金暄 C: 孫景泰 R: 劉錦郎 T: 呂明峯",
"2026-11-30": "S: 范振宇 A: 林森發 N: 王瑞發 C: 官郁庭 R: 張哲維 T: 羅應順",

};

// ============================================================================
// 2. APPLICATION STATE & DOM REFERENCES
// ============================================================================

const now = new Date();
const todayFormatted = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
const urlParams = new URLSearchParams(window.location.search);

const state = {
  year: now.getFullYear(),
  month: now.getMonth() + 1,
  day: now.getDate(),
  initialDay: now.getDate(),
  headerClickCount: 1,
  tooltipMoved: false, // true once the user drags the tooltip															  
  username: null,
  targetName: null,
  selectedStaff: null,
  userID: urlParams.get('userID'),
  weatherData: {},
  isMusicPlaying: false,
  lastTouchTime: 0,
  lastTrailTime: 0,
};

const dom = {
  calendar: document.getElementById('calendar'),
  tooltip: document.getElementById('tooltip'),
  header: document.getElementById('header'),
  bgMusic: document.getElementById('bgMusic'),
  body: document.body,
  defaultTitle: document.title,
};

// ============================================================================
// 3. LUNAR CALENDAR & SOLAR TERMS ENGINE (農曆與二十四節氣演算法)
// ============================================================================

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
  { name: '大雪', angle: 255 }, { name: '冬至', angle: 270 },
];

const LUNAR_DAY_NAMES = [
  '', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',
];

const LUNAR_MONTH_NAMES = [
  '', '正月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月',
];

// 1900-2100 Astronomical Lunar Info Table (定朔法)
const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
  0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a4d0, 0x0d150, 0x0f252,
  0x0d520,
];

function dateToJD(date) {
  return date.getTime() / 86400000.0 + 2440587.5;
}

function getSunLongitude(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Mrad = (M * Math.PI) / 180.0;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);
  const omega = 125.04 - 1934.136 * T;
  let lambda = (L0 + C - 0.00569 - 0.00478 * Math.sin((omega * Math.PI) / 180.0)) % 360;
  return lambda < 0 ? lambda + 360 : lambda;
}

function getYearSolarTerms(targetYear) {
  const result = {};
  for (let m = 0; m < 12; m++) {
    const daysInMonth = new Date(targetYear, m + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const l1 = getSunLongitude(dateToJD(new Date(Date.UTC(targetYear, m, d, -8))));
      const l2 = getSunLongitude(dateToJD(new Date(Date.UTC(targetYear, m, d, 16))));
      for (const term of SOLAR_TERMS) {
        const crossed =
          term.angle === 0 ? l1 > 350 && l2 < 10 : l1 <= term.angle && l2 > term.angle;
        if (crossed) {
          result[`${targetYear}-${m + 1}-${d}`] = term.name;
        }
      }
    }
  }
  return result;
}

const leapMonth = (y) => LUNAR_INFO[y - 1900] & 0xf;
const leapDays = (y) => (leapMonth(y) ? ((LUNAR_INFO[y - 1900] & 0x10000) ? 30 : 29) : 0);
const monthDays = (y, m) =>
  m >= 1 && m <= 12 ? ((LUNAR_INFO[y - 1900] & (0x10000 >> m)) ? 30 : 29) : -1;

function lYearDays(y) {
  let sum = 348;
  const info = LUNAR_INFO[y - 1900];
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    if (info & i) sum += 1;
  }
  return sum + leapDays(y);
}

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
    if (leap > 0 && i === leap + 1 && !isLeap) {
      --i;
      isLeap = true;
      temp = leapDays(lYear);
    } else {
      temp = monthDays(lYear, i);
    }
    if (isLeap && i === leap + 1) isLeap = false;
    offset -= temp;
  }

  if (offset === 0 && leap > 0 && i === leap + 1) {
    if (isLeap) isLeap = false;
    else {
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

function generateHolidayData(targetYear = state.year) {
  const y = parseInt(targetYear, 10);
  if (isNaN(y)) return {};

  const solarTerms = getYearSolarTerms(y);
  const daysMeta = [];
  const result = {};

  const isLunarNewYearDay = (dateObj) => {
    const l = solar2lunar(dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate());
    return Boolean(l && l.lMonth === 1 && l.lDay === 1 && !l.isLeap);
  };

  for (let m = 1; m <= 12; m++) {
    const daysInMonth = new Date(y, m, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(y, m - 1, d);
      const dateKey = `${y}-${m}-${d}`;
      const lunar = solar2lunar(y, m, d);
      const dayOfWeek = dt.getDay();

      const isSpringEve = isLunarNewYearDay(new Date(y, m - 1, d + 1));
      const isLittleSpringEve = isLunarNewYearDay(new Date(y, m - 1, d + 2));
      const isDragonBoat = lunar && lunar.lMonth === 5 && lunar.lDay === 5 && !lunar.isLeap;
      const isMidAutumn = lunar && lunar.lMonth === 8 && lunar.lDay === 15 && !lunar.isLeap;
      const isSpringBreak = lunar && lunar.lMonth === 1 && !lunar.isLeap && [1, 2, 3, 4].includes(lunar.lDay);

      let name = '';
      if (m === 4 && d === 4) name = '兒童節';
      else if (solarTerms[dateKey]) name = solarTerms[dateKey];
      else if (isDragonBoat) name = '端午節';
      else if (isMidAutumn) name = '中秋節';
      else if (isLittleSpringEve) name = '小年夜';
      else if (isSpringEve) name = '除夕';
      else if (isSpringBreak) name = LUNAR_DAY_NAMES[lunar.lDay];
      else if (lunar && lunar.lDay === 1) {
        const prefix = (lunar.isLeap ? '閏' : '') + (LUNAR_MONTH_NAMES[lunar.lMonth] || `${lunar.lMonth}月`);
        name = `${prefix}${lunar.isBig ? '大' : '小'}`;
      } else if (lunar) {
        name = LUNAR_DAY_NAMES[lunar.lDay] || `初${lunar.lDay}`;
      }

      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isFixedHoliday =
        (m === 1 && d === 1) ||
        (m === 2 && d === 28) ||
        (m === 4 && d === 4) ||
        solarTerms[dateKey] === '清明' ||
        (m === 5 && d === 1) ||
        isDragonBoat ||
        isMidAutumn ||
        (m === 9 && d === 28) ||
        (m === 10 && d === 10) ||
        (m === 10 && d === 25) ||
        (m === 12 && d === 25) ||
        isLittleSpringEve ||
        isSpringEve ||
        isSpringBreak;

      daysMeta.push({
        dateKey,
        dayOfWeek,
        name,
        isWeekend,
        isFixedHoliday,
        isHoliday: isWeekend || isFixedHoliday,
      });
    }
  }

  // Compensatory / substitute holidays for fixed holidays landing on weekends
  daysMeta.forEach((dm, idx) => {
    if (!dm.isFixedHoliday || !dm.isWeekend) return;
    if (dm.dayOfWeek === 6 && idx > 0 && !daysMeta[idx - 1].isHoliday) {
      daysMeta[idx - 1].isHoliday = true;
    } else if (dm.dayOfWeek === 0) {
      let nextIdx = idx + 1;
      while (nextIdx < daysMeta.length && daysMeta[nextIdx].isHoliday) nextIdx++;
      if (nextIdx < daysMeta.length) daysMeta[nextIdx].isHoliday = true;
    }
  });

  daysMeta.forEach((dm) => {
    result[dm.dateKey] = `【${dm.name}】${dm.isHoliday ? '【放假日】' : ''}`;
  });

  return result;
}

const holiday = new Proxy({}, {
  get(cache, date) {
    if (typeof date === 'string' && /^\d{4}-\d{1,2}-\d{1,2}$/.test(date) && !(date in cache)) {
      const y = parseInt(date.split('-')[0], 10);
      if (!isNaN(y)) Object.assign(cache, generateHolidayData(y));
    }
    return cache[date];
  },
  has(cache, date) {
    if (typeof date === 'string' && /^\d{4}-\d{1,2}-\d{1,2}$/.test(date) && !(date in cache)) {
      const y = parseInt(date.split('-')[0], 10);
      if (!isNaN(y)) Object.assign(cache, generateHolidayData(y));
    }
    return date in cache;
  },
});

const ensureHolidayData = (targetYear) => {
  if (targetYear) void holiday[`${targetYear}-1-1`];
};

// ============================================================================
// 4. UTILITIES (DATE, CLIPBOARD, AUDIO, DRAGGING)
// ============================================================================

/** Returns 0 for Sunday, 1..6 for Monday..Saturday */
function Zellercongruence(d, m, y) {
  if (m < 3) {
    m += 12;
    y -= 1;
  }
  const k = y % 100;
  const j = Math.floor(y / 100);
  const h = (d + Math.floor((13 * (m + 1)) / 5) + k + Math.floor(k / 4) + Math.floor(j / 4) + 5 * j) % 7;
  return (h + 6) % 7;
}

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

function copyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);

  if (/ipad|iphone/i.test(navigator.userAgent)) {
    const range = document.createRange();
    range.selectNodeContents(textArea);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    textArea.setSelectionRange(0, 999999);
  } else {
    textArea.select();
  }

  document.execCommand('copy');
  document.body.removeChild(textArea);
}

window.Clipboard = window.Clipboard || { copy: copyToClipboard };

function toggleMusic() {
  if (!dom.bgMusic) return;
  const curTime = Date.now();
  if (curTime - state.lastTouchTime < 300) return;
  state.lastTouchTime = curTime;

  if (!state.isMusicPlaying) {
    dom.bgMusic.play().catch((e) => console.log(e));
    state.isMusicPlaying = true;
  } else {
    dom.bgMusic.pause();
    state.isMusicPlaying = false;
  }
}

function checkDayChange() {
  if (new Date().getDate() !== state.initialDay) {
    window.location.reload();
  }
}

/**
 * Reusable pointer (mouse + touch) drag helper
 */
function attachDragBehavior(element, { canDrag = () => true, onDragStart, onDragMove, onDragEnd } = {}) {
  if (!element) return;
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  const getCoords = (e) => {
    const src = e.type.startsWith('touch') ? e.touches[0] : e;
    return { x: src?.clientX ?? 0, y: src?.clientY ?? 0 };
  };

  const onMove = (e) => {
    if (!dragging) return;
    const { x, y } = getCoords(e);
    onDragMove?.(x - offsetX, y - offsetY);
    e.preventDefault();
  };

  const onEnd = (e) => {
    dragging = false;
    const isTouch = e.type.startsWith('touch');
    document.removeEventListener(isTouch ? 'touchmove' : 'mousemove', onMove);
    document.removeEventListener(isTouch ? 'touchend' : 'mouseup', onEnd);
    onDragEnd?.();
  };

  const onStart = (e) => {
    if (!canDrag()) return;
    dragging = true;
    const { x, y } = getCoords(e);
    offsetX = x - element.offsetLeft;
    offsetY = y - element.offsetTop;
    onDragStart?.();

    const isTouch = e.type.startsWith('touch');
    document.addEventListener(isTouch ? 'touchmove' : 'mousemove', onMove, { passive: false });
    document.addEventListener(isTouch ? 'touchend' : 'mouseup', onEnd);
    e.preventDefault();
  };

  element.addEventListener('mousedown', onStart);
  element.addEventListener('touchstart', onStart, { passive: false });
}

// ============================================================================
// 5. UNIFIED 3D CYLINDER WHEEL PICKER ENGINE
// ============================================================================

class CylinderWheelColumn {
  constructor({ container, wheelEl, items, itemClass, itemHeight, cylinderRadius, angleStep, maxVisibleDelta, onChange }) {
    this.container = container;
    this.wheelEl = wheelEl;
    this.items = items; // [{ value, label }]
    this.itemClass = itemClass;
    this.itemHeight = itemHeight;
    this.cylinderRadius = cylinderRadius;
    this.angleStep = angleStep;
    this.maxVisibleDelta = maxVisibleDelta;
    this.onChange = onChange;

    this.currentIndex = 0;
    this.floatIndex = 0;
    this.isDragging = false;
    this.startY = 0;
    this.startFloatIndex = 0;
    this.lastY = 0;
    this.lastTime = 0;
    this.velocity = 0;
    this.dragDistance = 0;
    this.animId = null;
    this.wheelTimer = null;

    this.render();
    this.bindEvents();
  }

  render() {
    this.wheelEl.innerHTML = '';
    this.domItems = this.items.map((item, idx) => {
      const div = document.createElement('div');
      div.className = this.itemClass;
      div.textContent = item.label;
      div.dataset.index = String(idx);
      div.dataset.value = String(item.value);
      this.wheelEl.appendChild(div);
      return div;
    });
  }

  updateVisuals(fIndex) {
    const nearestInt = Math.round(fIndex);
    this.floatIndex = fIndex;

    if (nearestInt !== this.currentIndex && nearestInt >= 0 && nearestInt < this.items.length) {
      this.currentIndex = nearestInt;
      if (navigator.vibrate && navigator.userActivation?.hasBeenActive) {
        try { navigator.vibrate(4); } catch (_) {}
      }
    }

    const rad = Math.PI / 180;
    for (let i = 0; i < this.domItems.length; i++) {
      const delta = i - fIndex;
      const dom = this.domItems[i];

      if (Math.abs(delta) > this.maxVisibleDelta) {
        dom.style.display = 'none';
        dom.classList.remove('active');
        continue;
      }

      dom.style.display = 'flex';
      const thetaDeg = delta * this.angleStep;
      const thetaRad = thetaDeg * rad;
      const y = this.cylinderRadius * Math.sin(thetaRad);
      const z = this.cylinderRadius * (Math.cos(thetaRad) - 1);
      const opacity = Math.max(0.14, Math.pow(Math.cos(thetaRad), 2.4));
      const scale = 1 - (1 - Math.cos(thetaRad)) * 0.45;

      dom.style.transform = `translate3d(0, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateX(${(-thetaDeg).toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      dom.style.opacity = opacity.toFixed(3);
      dom.classList.toggle('active', Math.abs(delta) < 0.35);
    }

    const active = this.items[this.currentIndex];
    if (active) {
      this.container.setAttribute('aria-valuenow', String(active.value));
      this.container.setAttribute('aria-valuetext', active.label);
    }
  }

  snapTo(targetIdx, duration = 220, forceNotify = false) {
    if (this.animId) cancelAnimationFrame(this.animId);
    targetIdx = clamp(targetIdx, 0, this.items.length - 1);
    const startF = this.floatIndex;
    const change = targetIdx - startF;

    if (Math.abs(change) < 0.001) {
      this.updateVisuals(targetIdx);
      this.floatIndex = targetIdx;
      this.currentIndex = targetIdx;
      this.onChange?.(this.items[targetIdx], forceNotify);
      return;
    }

    const startTime = performance.now();
    const step = (ts) => {
      const t = Math.min(1, (ts - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      this.updateVisuals(startF + change * eased);

      if (t < 1) {
        this.animId = requestAnimationFrame(step);
      } else {
        this.updateVisuals(targetIdx);
        this.floatIndex = targetIdx;
        this.currentIndex = targetIdx;
        this.onChange?.(this.items[targetIdx], forceNotify);
      }
    };

    this.animId = requestAnimationFrame(step);
  }

  setImmediate(idx, notify = false) {
    if (this.animId) cancelAnimationFrame(this.animId);
    idx = clamp(idx, 0, this.items.length - 1);
    this.updateVisuals(idx);
    this.floatIndex = idx;
    this.currentIndex = idx;
    if (notify) this.onChange?.(this.items[idx], true);
  }

  bindEvents() {
    const getClientY = (e) => e.clientY ?? e.touches?.[0]?.clientY ?? 0;

    const onPointerMove = (e) => {
      if (!this.isDragging) return;
      const clientY = getClientY(e);
      this.dragDistance += Math.abs(clientY - this.lastY);

      let candidate = this.startFloatIndex + -(clientY - this.startY) / this.itemHeight;
      const max = this.items.length - 1;
      if (candidate < 0) candidate *= 0.25;
      else if (candidate > max) candidate = max + (candidate - max) * 0.25;

      const ts = performance.now();
      const dt = ts - this.lastTime;
      if (dt > 10) {
        this.velocity = (-(clientY - this.lastY) / this.itemHeight) / (dt / 16.67);
        this.lastY = clientY;
        this.lastTime = ts;
      }
      this.updateVisuals(candidate);
    };

    const onPointerUp = (e) => {
      if (!this.isDragging) return;
      this.isDragging = false;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      const max = this.items.length - 1;
      if (this.dragDistance < 5) {
        const itemEl = e.target.closest('[data-index]');
        if (itemEl) {
          this.snapTo(parseInt(itemEl.dataset.index, 10), 220, true);
          return;
        }
      }

      if (this.floatIndex < 0) return this.snapTo(0, 200);
      if (this.floatIndex > max) return this.snapTo(max, 200);

      if (Math.abs(this.velocity) > 0.08) {
        let currentF = this.floatIndex;
        let v = this.velocity;
        const momentumStep = () => {
          v *= 0.92;
          currentF += v;
          if (currentF < -0.5 || currentF > max + 0.5 || Math.abs(v) < 0.02) {
            this.snapTo(Math.round(clamp(currentF, 0, max)), 200);
          } else {
            this.updateVisuals(currentF);
            this.animId = requestAnimationFrame(momentumStep);
          }
        };
        this.animId = requestAnimationFrame(momentumStep);
      } else {
        this.snapTo(Math.round(clamp(this.floatIndex, 0, max)), 180);
      }
    };

    this.container.addEventListener('pointerdown', (e) => {
      if (this.animId) cancelAnimationFrame(this.animId);
      this.isDragging = true;
      const clientY = getClientY(e);
      this.startY = this.lastY = clientY;
      this.startFloatIndex = this.floatIndex;
      this.lastTime = performance.now();
      this.velocity = 0;
      this.dragDistance = 0;

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
      if (e.pointerId && this.container.setPointerCapture) {
        try { this.container.setPointerCapture(e.pointerId); } catch (_) {}
      }
    });

    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (this.animId) cancelAnimationFrame(this.animId);
      const candidate = clamp(this.floatIndex + (e.deltaY / this.itemHeight) * 0.6, 0, this.items.length - 1);
      this.updateVisuals(candidate);
      clearTimeout(this.wheelTimer);
      this.wheelTimer = setTimeout(() => this.snapTo(Math.round(this.floatIndex), 160), 100);
    }, { passive: false });

    this.container.addEventListener('keydown', (e) => {
      const stepMap = { ArrowUp: -1, ArrowDown: 1, PageUp: -5, PageDown: 5 };
      if (e.key in stepMap) {
        e.preventDefault();
        this.snapTo(this.currentIndex + stepMap[e.key], 180);
      }
    });
  }
}

class IosWheelPicker {
  constructor({ container, yearColumn, monthColumn, minYear = 1950, maxYear = 2050, initialYear, initialMonth, onSelect }) {
    this.onSelect = onSelect || (() => {});
    this.lastYear = initialYear || minYear;
    this.lastMonth = initialMonth || 1;

    this.yearList = Array.from({ length: maxYear - minYear + 1 }, (_, i) => ({
      value: minYear + i,
      label: `${minYear + i}年`,
    }));
    this.monthList = Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      label: `${i + 1}月`,
    }));

    const notify = () => {
      const y = this.yearList[this.yearCol.currentIndex].value;
      const m = this.monthList[this.monthCol.currentIndex].value;
      if (y !== this.lastYear || m !== this.lastMonth) {
        this.lastYear = y;
        this.lastMonth = m;
        this.onSelect(y, m);
      }
    };

    this.yearCol = new CylinderWheelColumn({
      container: yearColumn,
      wheelEl: yearColumn.querySelector('.ios-picker-wheel'),
      items: this.yearList,
      itemClass: 'ios-picker-item',
      itemHeight: 26,
      cylinderRadius: 48,
      angleStep: 26,
      maxVisibleDelta: 2.3,
      onChange: notify,
    });

    this.monthCol = new CylinderWheelColumn({
      container: monthColumn,
      wheelEl: monthColumn.querySelector('.ios-picker-wheel'),
      items: this.monthList,
      itemClass: 'ios-picker-item',
      itemHeight: 26,
      cylinderRadius: 48,
      angleStep: 26,
      maxVisibleDelta: 2.3,
      onChange: notify,
    });

    this.setValue(this.lastYear, this.lastMonth, false);
  }

  setValue(targetYear, targetMonth, animate = true) {
    this.lastYear = targetYear;
    this.lastMonth = targetMonth;
    const yIdx = this.yearList.findIndex((i) => i.value === targetYear);
    const mIdx = this.monthList.findIndex((i) => i.value === targetMonth);

    if (yIdx !== -1) {
      animate && Math.abs(this.yearCol.currentIndex - yIdx) <= 5
        ? this.yearCol.snapTo(yIdx, 240)
        : this.yearCol.setImmediate(yIdx, false);
    }
    if (mIdx !== -1) {
      animate && Math.abs(this.monthCol.currentIndex - mIdx) <= 5
        ? this.monthCol.snapTo(mIdx, 240)
        : this.monthCol.setImmediate(mIdx, false);
    }
  }
}

class IosNameWheelPicker {
  constructor({ container, wheelEl, names, initialName, onSelect }) {
    this.names = names || [];
    this.onSelect = onSelect || (() => {});
    this.lastReportedName = null;

    this.col = new CylinderWheelColumn({
      container,
      wheelEl,
      items: this.names.map((n) => ({ value: n, label: n })),
      itemClass: 'name-picker-item picker-item',
      itemHeight: 30,
      cylinderRadius: 85,
      angleStep: 20,
      maxVisibleDelta: 2.6,
      onChange: (item, force) => {
        if (item && (force || item.value !== this.lastReportedName)) {
          this.lastReportedName = item.value;
          this.onSelect(item.value);
        }
      },
    });

    const startName = initialName || (this.names.includes(CONFIG.DEFAULT_STAFF) ? CONFIG.DEFAULT_STAFF : this.names[0]);
    this.setValue(startName, false);
  }

  setValue(targetName, animate = true) {
    if (!targetName) return;
    const target = String(targetName).trim();
    let idx = this.names.findIndex((n) => n.trim() === target);
    if (idx === -1) {
      idx = this.names.findIndex((n) => target.includes(n.trim()) || n.trim().includes(target));
    }
    if (idx === -1) return;

    if (animate) {
      const dist = Math.abs(this.col.currentIndex - idx);
      const duration = dist === 0 ? 50 : Math.min(650, Math.max(200, 160 + dist * 18));
      this.col.snapTo(idx, duration, true);
    } else {
      this.col.setImmediate(idx, true);
    }
  }
}

// ============================================================================
// 6. TOOLTIP, DUTY HIGHLIGHTING & HEADER RENDERING
// ============================================================================

function clearHighlightClasses(elements = document.querySelectorAll('.day')) {
  elements.forEach((el) => el.classList.remove(...HIGHLIGHT_CLASSES));
}

function colorizeDuty(dutyText) {
  return dutyText.replace(/\b([SANCRT]):\s*([^A-Z]+)/g, (_, role, staff) => {
    return `<span class="duty-${role.toLowerCase()}">${role}: ${staff}</span>`;
  });
}

function positionTooltip() {
  if (!dom.header || !dom.tooltip) return;
  const rect = dom.header.getBoundingClientRect();
  dom.tooltip.style.top = `${rect.bottom + 4}px`;
  dom.tooltip.style.left = `${rect.left - 4}px`;
}

function showTooltip(date) {
  if (!dom.tooltip || !date || date === '999') return;
  const [, m, d] = date.split('-');
  const dutyInfo = colorizeDuty(dutySchedule[date] || 'None');
  const weather = state.weatherData[date];

  dom.tooltip.innerHTML = weather
    ? `<span class="tooltip-day">${m}月${d}日</span><span class="tooltip-duty">${dutyInfo}</span><span class="tooltip-weather">Temperature: ${weather.minTemperature}°C～${weather.maxTemperature}°C
      Humidity:\n ${weather.minHumidity}%～${weather.maxHumidity}%
      Weather: ${weather.weatherCondition}</span>`
    : `<span class="tooltip-day">${m}月${d}日\n</span><span class="tooltip-duty">${dutyInfo}</span>`;

  dom.tooltip.style.display = 'block';
  dom.tooltip.style.fontSize = '16px';
    // Default anchor: below the header cell, unless the user has dragged it elsewhere
  if (!state.tooltipMoved) positionTooltip();																					
  document.title = holiday[date] || dom.defaultTitle;
}

function hideTooltip() {
  if (dom.tooltip) dom.tooltip.style.display = 'none';
  document.title = dom.defaultTitle;
}

function highlightWeekdayForDate(d, m, y) {
  const weekdays = document.querySelectorAll('#calendar .weekday');
  weekdays.forEach((el) => el.classList.remove('active-weekday'));
  if (!d || !m || !y) return;

  const dow = Zellercongruence(d, m, y);
  const colIndex = dow === 0 ? 6 : dow - 1;
  weekdays[colIndex]?.classList.add('active-weekday');
}

function clearWeekdayHighlight() {
  document.querySelectorAll('#calendar .weekday').forEach((el) => el.classList.remove('active-weekday'));
}

function highlightSelectedName(selectedName) {
  const days = document.querySelectorAll('.day');
  clearHighlightClasses(days);
  if (!selectedName) return;

  days.forEach((dayElement) => {
    const dayMatch = dayElement.textContent.match(/^\s*(\d+)/);
    if (!dayMatch) return;

    const date = `${state.year}-${state.month}-${dayMatch[1]}`;
    const parts = (dutySchedule[date] || '').split(' ');

    let currentCat = 1; // 1 = N/C/R/T, 2 = A, 3 = S
    const matches = { 1: 'none', 2: 'none', 3: 'none' };

    parts.forEach((rawPart) => {
      const text = rawPart.trim();
      if (!text) return;

      if (text === 'S:') currentCat = 3;
      else if (text === 'A:') currentCat = 2;
      else if (/^[A-Z]:$/.test(text)) currentCat = 1;
      else {
        if (text.includes('_')) {
          const [topName, bottomName] = text.split('_');
          if (topName === selectedName) matches[currentCat] = 'top';
          if (bottomName === selectedName) matches[currentCat] = 'bottom';
        } else if (text === selectedName) {
          matches[currentCat] = 'full';
        }
        currentCat = 1;
      }
    });

    const prefixMap = { 3: 'selected3', 2: 'selected2', 1: 'selected' };
    [3, 2, 1].forEach((cat) => {
      const match = matches[cat];
      if (match === 'full') dayElement.classList.add(prefixMap[cat]);
      else if (match === 'top') dayElement.classList.add(`${prefixMap[cat]}-top`);
      else if (match === 'bottom') dayElement.classList.add(`${prefixMap[cat]}-bottom`);
    });
  });
}

function highlightAdditionalHoliday() {
  const days = document.querySelectorAll('.day');
  days.forEach((dayElement) => {
    const dayMatch = dayElement.textContent.match(/^\s*(\d+)/);
    if (!dayMatch) return;

    const date = `${state.year}-${state.month}-${dayMatch[1]}`;
    const holidayInfo = holiday[date];

    if (holidayInfo) {
      dayElement.style.color = holidayInfo.includes('放假日') ? 'red' : 'black';
    } else {
      dayElement.style.color = dayElement.classList.contains('weekend') ? 'red' : 'black';
    }

    const lunarName = (holidayInfo || '').split('】')[0].replace('【', '');
    if (lunarName) {
      let lunarSpan = dayElement.querySelector('.lunar-name');
      if (!lunarSpan) {
        lunarSpan = document.createElement('span');
        lunarSpan.className = 'lunar-name';
        const existingDot = dayElement.querySelector('.note-dot');
        existingDot ? dayElement.insertBefore(lunarSpan, existingDot) : dayElement.appendChild(lunarSpan);
      }
      if (lunarSpan.textContent !== lunarName) {
        lunarSpan.textContent = lunarName;
      }
    }

    if (dayElement.dataset.hasNote === 'true' && !dayElement.querySelector('.note-dot')) {
      const dot = document.createElement('span');
      dot.className = 'note-dot';
      dayElement.appendChild(dot);
    }
  });
}

function updateHeaderClock() {
  const el = document.querySelector('.header-cell-clock');
  if (el) el.textContent = new Date().toLocaleTimeString('en-GB', { hour12: false });
}

function renderHeaderCellContent(y, m, d, showFullDate = true) {
  const headerCell = document.querySelector('.header-cell');
  if (!headerCell) return;

  if (showFullDate && d) {
    const weekText = WEEKDAY_LABELS[Zellercongruence(d, m, y)] || '(日)';
    headerCell.innerHTML = `
      <span class="header-cell-year">${y} 年</span>
      <span class="header-cell-date">${m}月 ${d}日</span>
      <span class="header-cell-weekday">${weekText}</span>
      <span class="header-cell-clock"></span>
    `;
  } else {
    headerCell.innerHTML = `
      <span class="header-cell-year">${y} 年</span>
      <span class="header-cell-date">${m} 月</span>
    `;
  }
  updateHeaderClock();
}

function createHeaderCell(y, m, d) {
  if (!dom.header) return;
  let headerCell = document.querySelector('.header-cell');
  if (!headerCell) {
    headerCell = document.createElement('div');
    headerCell.classList.add('header-cell');
    headerCell.style.zIndex = '20';
    dom.header.appendChild(headerCell);

    headerCell.addEventListener('click', () => {
      if (state.headerClickCount % 2 === 0) {
        hideTooltip();
        highlightSelectedName(state.selectedStaff);
        if (window.nameWheelPicker && state.selectedStaff) {
          window.nameWheelPicker.setValue(state.selectedStaff, false);
        }
        headerCell.classList.remove('active');
        dom.header.classList.remove('active');
      } else {
        clearHighlightClasses();
        headerCell.classList.add('active');
        dom.header.classList.add('active');
        showTooltip(todayFormatted);
        positionTooltip();
      }
      headerCell.style.backgroundColor = '';
      headerCell.style.backgroundImage = '';
      state.headerClickCount++;
    });
  }
  renderHeaderCellContent(y, m, d, true);
}

// ============================================================================
// 7. CALENDAR GRID, NOTES & CARD INTERACTIONS
// ============================================================================

function ensureNoteDot(card) {
  const frontFace = card?.querySelector('.day');
  if (!frontFace) return;

  const contentText = card.querySelector('.note-content')?.textContent.trim() || '';
  const isPlaceholder =
    !contentText ||
    contentText === 'Loading...' ||
    contentText.endsWith('Click to edit note') ||
    contentText.includes('\nClick to edit note');

  const hasNote = frontFace.dataset.hasNote === 'true' || !isPlaceholder;
  const existingDot = frontFace.querySelector('.note-dot');

  if (hasNote && frontFace.dataset.hasNote !== 'false') {
    frontFace.dataset.hasNote = 'true';
    if (!existingDot) {
      const dot = document.createElement('span');
      dot.className = 'note-dot';
      frontFace.appendChild(dot);
    }
  } else if (!hasNote && existingDot) {
    existingDot.remove();
  }
}

function attachDayHoverAndTouch(card, d, m, y, date) {
  const frontFace = card.querySelector('.card-face.day');

  const onEnter = () => {
    clearHighlightClasses();
    showTooltip(date);
    if (date === '999') {
      hideTooltip();
      clearWeekdayHighlight();
    } else {
      highlightWeekdayForDate(d, m, y);
    }
    highlightAdditionalHoliday();
  };

  const onLeave = () => {
    clearWeekdayHighlight();
    document.querySelectorAll('.card-face.day.active-day, .card.active-card').forEach((el) => {
      el.classList.remove('active-day', 'active-card');
    });
    highlightSelectedName(state.selectedStaff);
    if (window.nameWheelPicker && state.selectedStaff) {
      window.nameWheelPicker.setValue(state.selectedStaff, false);
    }
    highlightAdditionalHoliday();
    hideTooltip();
  };

  card.addEventListener('mouseover', onEnter);
  card.addEventListener('mouseout', onLeave);

  card.addEventListener('touchstart', (e) => {
    document.querySelectorAll('.card-face.day.active-day, .card.active-card').forEach((el) => {
      el.classList.remove('active-day', 'active-card');
    });
    if (frontFace && date !== '999') {
      frontFace.classList.add('active-day');
      card.classList.add('active-card');
    }
    onEnter();
    e.preventDefault();
  });

  card.addEventListener('touchend', (e) => e.preventDefault());
}

function setupNoteEditor(card, date) {
  const backFace = card.querySelector('.back');
  const noteContent = card.querySelector('.note-content');
  const noteEditor = card.querySelector('.note-editor');
  const textarea = card.querySelector('textarea');
  const saveBtn = card.querySelector('.save-btn');
  const cancelBtn = card.querySelector('.cancel-btn');
  const deleteBtn = card.querySelector('.delete-btn');

  Object.assign(textarea.style, {
    WebkitAppearance: 'none',
    appearance: 'none',
    borderRadius: '4px',
    border: '1px solid #ccc',
    padding: '8px',
    width: '100%',
    minHeight: '60px',
    fontSize: '16px',
    userSelect: 'text',
    WebkitUserSelect: 'text',
  });
  textarea.autocomplete = 'off';
  textarea.autocorrect = 'off';
  textarea.autocapitalize = 'off';
  textarea.spellcheck = false;
  textarea.setAttribute('tabindex', '0');

  const showEditor = () => {
    noteContent.style.display = 'none';
    const raw = noteContent.textContent === `${date}\nClick to edit note` ? '' : noteContent.textContent;
    textarea.value = raw.includes(date) ? raw : `${date}\n${raw}`;
    noteEditor.style.display = 'flex';

    setTimeout(() => {
      textarea.readOnly = false;
      textarea.blur();
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        textarea.click();
        textarea.focus();
        try {
          const len = textarea.value.length;
          textarea.setSelectionRange(len, len);
        } catch (_) {}
      } else {
        textarea.focus();
      }
    }, 100);
  };

  const hideEditor = () => {
    noteEditor.style.display = 'none';
    noteContent.style.display = 'block';
  };

  const saveNote = (text) => {
    noteContent.textContent = text || `${date}\nClick to edit note`;
    const frontFace = card.querySelector('.day');
    const existingDot = frontFace.querySelector('.note-dot');

    if (text && text.trim() !== '') {
      frontFace.dataset.hasNote = 'true';
      if (!existingDot) {
        const dot = document.createElement('span');
        dot.className = 'note-dot';
        frontFace.appendChild(dot);
      }
    } else {
      delete frontFace.dataset.hasNote;
      existingDot?.remove();
    }

    if (window.firebaseSet && window.firebaseRef && window.firebaseDB) {
      window.firebaseSet(window.firebaseRef(window.firebaseDB, `Notes/${date}-${state.username}`), {
        Name: state.username,
        Date: date,
        Content: text || '',
        Timestamp: new Date().toISOString(),
      }).catch((err) => {
        console.error('Error saving note:', err);
        alert('Error saving note: ' + err.message);
      });
    }
  };

  const openIfBackground = (e) => {
    e.stopPropagation();
    if (e.target === backFace || e.target === noteContent) {
      if (e.type === 'touchend') e.preventDefault();
      showEditor();
    }
  };

  backFace.addEventListener('dblclick', openIfBackground);
  backFace.addEventListener('touchend', openIfBackground);

  textarea.addEventListener('touchstart', (e) => { e.stopPropagation(); textarea.focus(); }, { passive: false });
  textarea.addEventListener('touchend', (e) => e.stopPropagation());
  textarea.addEventListener('click', (e) => { e.stopPropagation(); setTimeout(() => textarea.focus(), 10); });
  textarea.addEventListener('paste', (e) => {
    e.stopPropagation();
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      setTimeout(() => textarea.focus(), 100);
    }
  });

  const bindAction = (btn, handler) => {
    const wrapped = (e) => {
      if (e.type === 'touchend') e.preventDefault();
      e.stopPropagation();
      handler();
    };
    btn.addEventListener('click', wrapped);
    btn.addEventListener('touchend', wrapped);
  };

  bindAction(saveBtn, () => { saveNote(textarea.value); hideEditor(); });
  bindAction(cancelBtn, hideEditor);
  bindAction(deleteBtn, () => {
    if (confirm('Are you sure you want to delete this note?')) {
      saveNote('');
      hideEditor();
    }
  });

  noteEditor.addEventListener('click', (e) => e.stopPropagation());
  noteEditor.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
}

function fetchNote(card, date) {
  const noteContent = card.querySelector('.note-content');
  const frontFace = card.querySelector('.day');

  if (!state.username) {
    noteContent.textContent = 'Loading...';
    setTimeout(() => { if (state.username) fetchNote(card, date); }, 500);
    return;
  }

  if (!window.firebaseRef || !window.firebaseDB || !window.firebaseGet) {
    noteContent.textContent = `${date}\nClick to edit note`;
    return;
  }

  window.firebaseGet(window.firebaseRef(window.firebaseDB, `Notes/${date}-${state.username}`))
    .then((snapshot) => {
      const content = snapshot?.exists() ? snapshot.val()?.Content?.trim() : '';
      if (content) {
        noteContent.textContent = snapshot.val().Content;
        frontFace.dataset.hasNote = 'true';
        if (!frontFace.querySelector('.note-dot')) {
          const dot = document.createElement('span');
          dot.className = 'note-dot';
          frontFace.appendChild(dot);
        }
      } else {
        noteContent.textContent = `${date}\nClick to edit note`;
        delete frontFace.dataset.hasNote;
        frontFace.querySelector('.note-dot')?.remove();
      }
    })
    .catch((err) => {
      console.error(`Error fetching note for ${date}:`, err);
      noteContent.textContent = `${date}\nClick to edit note`;
    });
}

function smoothInfiniteScrollNoteContent(noteContent, scrollSpeed = 100) {
  if (!noteContent) return () => {};
  let scrollInterval = null;
  let isResetting = false;
  noteContent.scrollTop = 0;

  const scroll = () => {
    if (isResetting) {
      scrollInterval = setTimeout(scroll, scrollSpeed);
      return;
    }

    if (noteContent.scrollTop >= noteContent.scrollHeight - noteContent.clientHeight - 2) {
      isResetting = true;
      let start = null;
      const startPos = noteContent.scrollTop;

      const resetAnim = (ts) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / 1000, 1);
        noteContent.scrollTop = startPos * (1 - (1 - Math.pow(1 - progress, 2)));
        if (progress < 1) requestAnimationFrame(resetAnim);
        else {
          noteContent.scrollTop = 0;
          isResetting = false;
        }
      };
      requestAnimationFrame(resetAnim);
    } else {
      noteContent.scrollTop += 1;
    }
    scrollInterval = setTimeout(scroll, scrollSpeed);
  };

  scroll();
  return () => {
    clearTimeout(scrollInterval);
    isResetting = false;
  };
}

function setupCardFlipAndDrag() {
  const cards = document.querySelectorAll('.card');
  let overlay = document.querySelector('.overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
  }

  const activeScrolls = new Map();

  const closeCard = (card) => {
    if (!card?.classList.contains('flipped')) return;
    card.classList.remove('flipped');
    activeScrolls.get(card)?.();
    activeScrolls.delete(card);
    ensureNoteDot(card);
    overlay.classList.remove('active');
  };

  if (!overlay.dataset.bound) {
    overlay.dataset.bound = 'true';
    overlay.addEventListener('click', () => closeCard(document.querySelector('.card.flipped')));
  }

  cards.forEach((card) => {
    const innerCard = card.querySelector('.inner-card');
    const noteContent = card.querySelector('.note-content');
    const origPos = {
      position: card.style.position || 'static',
      left: card.style.left || 'auto',
      top: card.style.top || 'auto',
    };

    const isCardFlipped = () => {
      const transform = getComputedStyle(innerCard).getPropertyValue('transform');
      return transform.includes('matrix3d') && transform.includes('-1');
    };

    innerCard.addEventListener('transitionend', () => {
      if (!isCardFlipped()) {
        Object.assign(card.style, origPos);
        ensureNoteDot(card);
      }
    });

    attachDragBehavior(card, {
      canDrag: isCardFlipped,
      onDragMove: (x, y) => {
        card.style.position = 'absolute';
        card.style.left = `${x}px`;
        card.style.top = `${y}px`;
      },
    });

    const toggleFlip = (e) => {
      e.preventDefault();
      e.stopPropagation();
      card.classList.toggle('flipped');
      if (card.classList.contains('flipped')) {
        overlay.classList.add('active');
        activeScrolls.set(card, smoothInfiniteScrollNoteContent(noteContent, 100));
      } else {
        closeCard(card);
      }
    };

    card.addEventListener('dblclick', toggleFlip);

    let lastTap = 0;
    card.addEventListener('touchend', (e) => {
      const curTime = Date.now();
      if (curTime - lastTap > 0 && curTime - lastTap < 300) {
        lastTap = 0;
        toggleFlip(e);
      } else {
        lastTap = curTime;
      }
    });

    card.querySelectorAll('.btn').forEach((button) => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        closeCard(card);
      });
    });
  });
}

function createCalendar(targetYear, targetMonth) {
  if (!dom.calendar) return;
  const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
  const today = new Date();

  // 1. Weekday Headers
  WEEKDAYS_ZH.forEach((label, i) => {
    const el = document.createElement('div');
    el.classList.add('weekday');
    if (i === 5) el.classList.add('saturday');
    if (i === 6) el.classList.add('sunday');
    el.textContent = label;
    dom.calendar.appendChild(el);

    el.addEventListener('dblclick', () => {
      alert('\n 1. 可查1950年～2050年的農明曆 \n 2. 網頁登入後，若有註冊，會自動滑到自己的名字 \n 3. 可滑到特定日期，點2下，進行筆記 \n 4. 點Me會自動滑到自己的名字 \n  \n\n\n 祝 平安 順心 \n 洪柜峰敬上');
    });

    // Long-press reload
    let pressTimer;
    const startTimer = () => { pressTimer = setTimeout(() => window.location.reload(), 800); };
    const clearTimer = () => clearTimeout(pressTimer);
    ['mousedown', 'touchstart'].forEach((evt) => el.addEventListener(evt, startTimer));
    ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach((evt) => el.addEventListener(evt, clearTimer));
  });

  // 2. Leading Empty Cells
  const firstDow = Zellercongruence(1, targetMonth, targetYear);
  const leadingEmptyCount = firstDow === 0 ? 6 : firstDow - 1;
  for (let i = 0; i < leadingEmptyCount; i++) {
    const empty = document.createElement('div');
    empty.classList.add('day', 'empty-day');
    if (i === 5) empty.classList.add('saturday');
    if (i === 6) empty.classList.add('sunday');
    dom.calendar.appendChild(empty);
  }

  // 3. Date Cards
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${targetYear}-${targetMonth}-${d}`;
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="inner-card">
        <div class="card-face day">${d}\n</div>
        <div class="card-face back">
          <div class="note-content">Loading...</div>
          <div class="note-editor">
            <textarea placeholder="Write your note here..."></textarea>
            <div class="note-editor-buttons">
              <button class="btn save-btn">Save</button>
              <button class="btn cancel-btn">Cancel</button>
              <button class="btn delete-btn">Delete</button>
            </div>
          </div>
        </div>
      </div>
    `;
    dom.calendar.appendChild(card);

    const frontFace = card.querySelector('.day');
    const dow = Zellercongruence(d, targetMonth, targetYear);
    if (dow === 0 || dow === 6) frontFace.classList.add('weekend');
    if (dow === 6) { frontFace.classList.add('saturday'); card.classList.add('saturday'); }
    if (dow === 0) { frontFace.classList.add('sunday'); card.classList.add('sunday'); }
    if (targetYear === today.getFullYear() && targetMonth === today.getMonth() + 1 && d === today.getDate()) {
      frontFace.classList.add('today');
    }

    attachDayHoverAndTouch(card, d, targetMonth, targetYear, date);
    setupNoteEditor(card, date);
    fetchNote(card, date);
  }

  // 4. Trailing Empty Cells
  const remainder = (leadingEmptyCount + daysInMonth) % 7;
  if (remainder !== 0) {
    for (let i = 0; i < 7 - remainder; i++) {
      const trailing = document.createElement('div');
      trailing.classList.add('day', 'empty-day');
      const col = remainder + i;
      if (col === 5) trailing.classList.add('saturday');
      if (col === 6) trailing.classList.add('sunday');
      dom.calendar.appendChild(trailing);
    }
  }

  setupCardFlipAndDrag();
}

// ============================================================================
// 8. NAVIGATION, CONTROLS & WEATHER API
// ============================================================================

function selectYearMonth(targetYear, targetMonth, options = {}) {
  let y = parseInt(targetYear, 10);
  let m = parseInt(targetMonth, 10);

  if (m > 12) { m = 1; y++; }
  else if (m < 1) { m = 12; y--; }

  if (y < CONFIG.MIN_YEAR) { y = CONFIG.MIN_YEAR; m = 1; }
  else if (y > CONFIG.MAX_YEAR) { y = CONFIG.MAX_YEAR; m = 12; }

  state.year = y;
  state.month = m;

  const yearSelect = document.getElementById('yearSelect');
  const monthSelect = document.getElementById('monthSelect');
  if (yearSelect) yearSelect.value = String(y);
  if (monthSelect) monthSelect.value = String(m);

  window.iosWheelPicker?.setValue(y, m, !options.fromWheel);

  document.querySelectorAll('.picker-item').forEach((item) => { item.style.backgroundColor = ''; });
  clearHighlightClasses();
  hideTooltip();

  if (dom.calendar) {
    dom.calendar.innerHTML = '';
    createCalendar(y, m);
  }

  const isCurrentMonth = y === now.getFullYear() && m === now.getMonth() + 1;
  if (isCurrentMonth) {
    renderHeaderCellContent(y, m, state.day, true);
    showTooltip(todayFormatted);
    fetchWeather();
    AddWeekDay();
  } else {
    renderHeaderCellContent(y, m, null, false);
    hideTooltip();
  }

  highlightAdditionalHoliday();
  highlightSelectedName(state.selectedStaff);
  if (window.nameWheelPicker && state.selectedStaff) {
    window.nameWheelPicker.setValue(state.selectedStaff, false);
  }
}

function initMonthPickerControls() {
  const yearSelect = document.getElementById('yearSelect');
  const monthSelect = document.getElementById('monthSelect');

  if (yearSelect && monthSelect) {
    yearSelect.innerHTML = Array.from({ length: CONFIG.MAX_YEAR - CONFIG.MIN_YEAR + 1 }, (_, i) => {
      const y = CONFIG.MIN_YEAR + i;
      return `<option value="${y}">${y}年</option>`;
    }).join('');

    monthSelect.innerHTML = Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}">${i + 1}月</option>`).join('');

    yearSelect.value = String(clamp(state.year, CONFIG.MIN_YEAR, CONFIG.MAX_YEAR));
    monthSelect.value = String(state.month);

    const onSelectChange = () => selectYearMonth(parseInt(yearSelect.value, 10), parseInt(monthSelect.value, 10));
    yearSelect.addEventListener('change', onSelectChange);
    monthSelect.addEventListener('change', onSelectChange);
  }

  const iosContainer = document.getElementById('iosMonthWheelPicker');
  const yearColumn = document.getElementById('iosYearColumn');
  const monthColumn = document.getElementById('iosMonthColumn');
  if (iosContainer && yearColumn && monthColumn) {
    window.iosWheelPicker = new IosWheelPicker({
      container: iosContainer,
      yearColumn,
      monthColumn,
      minYear: CONFIG.MIN_YEAR,
      maxYear: CONFIG.MAX_YEAR,
      initialYear: state.year,
      initialMonth: state.month,
      onSelect: (y, m) => selectYearMonth(y, m, { fromWheel: true }),
    });
  }

  document.getElementById('prevMonthBtn')?.addEventListener('click', () => selectYearMonth(state.year, state.month - 1));
  document.getElementById('nextMonthBtn')?.addEventListener('click', () => selectYearMonth(state.year, state.month + 1));
  document.getElementById('currentMonthBtn')?.addEventListener('click', () => selectYearMonth(now.getFullYear(), now.getMonth() + 1));
}

function initNamePickerWheel() {
  if (window.nameWheelPicker) return;
  const container = document.getElementById('namePicker');
  const wheelEl = document.getElementById('namePickerWheel') || container;
  if (!container || !wheelEl) return;

  const validStaff = STAFF_NAMES.filter((n) => n && n !== '．．．' && n !== '……' && n.trim().length > 0);
  window.nameWheelPicker = new IosNameWheelPicker({
    container,
    wheelEl,
    names: validStaff,
    initialName: state.targetName || state.username || CONFIG.DEFAULT_STAFF,
    onSelect: (selectedName) => {
      state.selectedStaff = selectedName;
      highlightSelectedName(selectedName);
    },
  });
}

function AddWeekDay() {
  const weekdayEl = document.querySelector('.header-cell-weekday');
  const weekStr = WEEKDAY_LABELS[Zellercongruence(state.day, state.month, state.year)] || '(日)';
  if (weekdayEl) {
    weekdayEl.textContent = weekStr;
  } else {
    renderHeaderCellContent(state.year, state.month, state.day, true);
  }
}

function scroll(info) {
  const marquee = document.getElementById('scrollingText');
  if (!marquee) return;
  let result = '';
  for (let i = 0; i < info.length; i++) {
    if (info[i] === ' ' && info[i + 1]?.match(/[A-Z]/)) result += '&nbsp;&nbsp;&nbsp';
    else if (info[i] === ' ') result += '&nbsp';
    else result += info[i];
  }
  marquee.innerHTML = `<p>&nbsp;&nbsp;&nbsp${result}&nbsp;&nbsp;&nbsp★★★&nbsp;&nbsp;&nbsp【使用說明】請點2下&nbsp;&nbsp;&nbsp星期(一～日)&nbsp;&nbsp;&nbsp★★★</p>`;
}

function fetchWeather() {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${CONFIG.LATITUDE}&lon=${CONFIG.LONGITUDE}&appid=${CONFIG.WEATHER_API_KEY}`)
    .then((res) => res.json())
    .then(() => {
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
    })
    .catch((err) => console.error('Error fetching weather:', err));
}

function fetchWeatherForecast() {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${CONFIG.LATITUDE}&lon=${CONFIG.LONGITUDE}&appid=${CONFIG.WEATHER_API_KEY}`)
    .then((res) => res.json())
    .then((data) => {
      if (!Array.isArray(data.list)) return;
      const forecastByDay = {};

      data.list.forEach((item) => {
        const dt = new Date(item.dt * 1000);
        const key = `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
        (forecastByDay[key] ||= []).push(item);
      });

      Object.keys(forecastByDay).slice(0, 6).forEach((dayKey) => {
        const items = forecastByDay[dayKey];
        const temps = items.map((i) => i.main.temp - 273.15);
        const humids = items.map((i) => i.main.humidity);
        const counts = items.reduce((acc, i) => {
          const cond = i.weather[0].main;
          acc[cond] = (acc[cond] || 0) + 1;
          return acc;
        }, {});
        const mostFrequent = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));

        state.weatherData[dayKey] = {
          minTemperature: Math.min(...temps).toFixed(1),
          maxTemperature: Math.max(...temps).toFixed(1),
          minHumidity: Math.min(...humids).toFixed(1),
          maxHumidity: Math.max(...humids).toFixed(1),
          weatherCondition: mostFrequent,
        };
      });
    })
    .catch((err) => console.error('Error fetching weather forecast:', err));
}

// ============================================================================
// 9. USER AUTH RESOLUTION & AUTO-SCROLL TO STAFF
// ============================================================================

(function initUserAutoScroll() {
  const getStoredEmail = () => {
    try { return sessionStorage.getItem('currentUserEmail'); } catch (_) { return null; }
  };

  const saveEmail = (email) => {
    if (!email) return;
    try { sessionStorage.setItem('currentUserEmail', email); } catch (_) {}
  };

  const resolveUserEmail = (ev) => {
    const fromQuery = new URLSearchParams(window.location.search).get('userEmail');
    if (fromQuery) { saveEmail(fromQuery); return fromQuery; }

    try {
      if (window.location.protocol !== 'file:' && window.parent !== window && window.parent.currentUserEmail) {
        saveEmail(window.parent.currentUserEmail);
        return window.parent.currentUserEmail;
      }
    } catch (_) {}

    if (ev?.data?.userEmail) { saveEmail(ev.data.userEmail); return ev.data.userEmail; }
    return getStoredEmail();
  };

  const resolveName = (email) => {
    if (!email) return null;
    const clean = String(email).trim().toLowerCase();
    return EMAIL_NAME_MAP[clean] || EMAIL_NAME_MAP[email] || null;
  };

  const scrollToUser = (email, isManual = false) => {
    const foundName = resolveName(email);
    if (!foundName) return;

    state.targetName = foundName;
    state.username = foundName;
    state.selectedStaff = foundName;

    let attempts = 0;
    const poll = () => {
      attempts++;
      const picker = window.nameWheelPicker;
      if (picker?.names?.length && document.querySelectorAll('.day').length) {
        setTimeout(() => {
          window.nameWheelPicker?.setValue(foundName, true);
          highlightSelectedName(foundName);
        }, isManual ? 0 : 180);
      } else if (attempts < 60) {
        setTimeout(poll, 80);
      } else {
        picker?.setValue(foundName, false);
        highlightSelectedName(foundName);
      }
    };
    poll();
  };

  const init = () => {
    if (dom.header) {
      dom.header.addEventListener('click', toggleMusic);
      dom.header.addEventListener('touchstart', toggleMusic);
    }

    const scrollToMeBtn = document.getElementById('scrollToMeButton');
    if (scrollToMeBtn) {
      scrollToMeBtn.addEventListener('click', toggleMusic);
      scrollToMeBtn.addEventListener('touchstart', toggleMusic);
      scrollToMeBtn.addEventListener('click', () => {
        const nameToUse = resolveName(resolveUserEmail()) || state.targetName || state.username || CONFIG.DEFAULT_STAFF;
        state.targetName = state.username = state.selectedStaff = nameToUse;
        window.nameWheelPicker?.setValue(nameToUse, true);
        highlightSelectedName(nameToUse);
      });
    }

    initNamePickerWheel();
    const email = resolveUserEmail();
    if (email) scrollToUser(email, false);
  };

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();

  window.addEventListener('message', (ev) => {
    if (ev.data?.type === 'scrollToUser') {
      const email = resolveUserEmail(ev) || ev.data.userEmail;
      if (email) scrollToUser(email, false);
    }
  });
})();

// ============================================================================
// 10. STAGE AMBIENT LIGHTING CONTROLLER
// ============================================================================

(function initStageLighting() {
  const stage = document.getElementById('stage');
  const uiVal = document.getElementById('val');
  if (!stage) return;

  let intensity = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--light-intensity')) || 0.5;
  let lastIntensity = intensity;
  let wheelTimeout;
  let touchStartY = null;
  let startIntensity = null;

  const setIntensity = (v) => {
    intensity = clamp(v, 0, 1);
    document.documentElement.style.setProperty('--light-intensity', intensity.toFixed(3));
    if (uiVal) uiVal.textContent = intensity.toFixed(2);
  };

  setIntensity(intensity);

  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    setIntensity(intensity - e.deltaY * 0.0015);
    stage.classList.add('bright');
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => stage.classList.remove('bright'), 220);
  }, { passive: false });

  stage.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
      startIntensity = intensity;
    }
  }, { passive: true });

  stage.addEventListener('touchmove', (e) => {
    if (touchStartY !== null) {
      setIntensity(startIntensity + (touchStartY - e.touches[0].clientY) * 0.006);
    }
  }, { passive: true });

  stage.addEventListener('touchend', () => { touchStartY = null; startIntensity = null; });

  window.addEventListener('keydown', (e) => {
    if (e.key === '+' || e.key === '=') setIntensity(intensity + 0.05);
    else if (e.key === '-' || e.key === '_') setIntensity(intensity - 0.05);
  });

  const animate = () => {
    if (Math.abs(lastIntensity - intensity) > 0.0001) {
      stage.style.filter = `brightness(${1 + (intensity - 0.5) * 0.25})`;
      lastIntensity = intensity;
    }
    requestAnimationFrame(animate);
  };
  animate();

  window.__lamp = { get intensity() { return intensity; }, setIntensity };
})();

// ============================================================================
// 11. GLOBAL LISTENERS & BOOTSTRAP
// ============================================================================

// Dismiss mobile tooltip when tapping outside interactive elements
document.addEventListener('touchstart', (e) => {
  if (e.target.closest('.card, #tooltip, #header, .header-cell')) return;

  clearWeekdayHighlight();
  document.querySelectorAll('.card-face.day.active-day, .card.active-card').forEach((el) => {
    el.classList.remove('active-day', 'active-card');
  });

  if (dom.tooltip?.style.display === 'block') {
    highlightSelectedName(state.selectedStaff);
    if (window.nameWheelPicker && state.selectedStaff) {
      window.nameWheelPicker.setValue(state.selectedStaff, false);
    }
    highlightAdditionalHoliday();
    hideTooltip();
  }
}, { passive: true });

// Throttled cursor trail effect (~25 fps)
document.addEventListener('mousemove', (e) => {
  const cur = performance.now();
  if (cur - state.lastTrailTime < 40) return;
  state.lastTrailTime = cur;

  const trail = document.createElement('div');
  trail.classList.add('trail');
  trail.style.left = `${e.pageX}px`;
  trail.style.top = `${e.pageY}px`;
  document.body.appendChild(trail);
  setTimeout(() => trail.remove(), 600);
});

// Draggable tooltip
attachDragBehavior(dom.tooltip, {
  onDragMove: (x, y) => {
	state.tooltipMoved = true;								  
    dom.tooltip.style.left = `${x}px`;
    dom.tooltip.style.top = `${y}px`;
  },
});

// Expose public globals
Object.assign(window, {
  generateHolidayData,
  generateHoliday: generateHolidayData,
  ensureHolidayData,
  holiday,
});

// Initialize Application
initMonthPickerControls();
initNamePickerWheel();
createHeaderCell(state.year, state.month, state.day);
createCalendar(state.year, state.month);

state.selectedStaff ||= state.targetName || state.username || CONFIG.DEFAULT_STAFF;
highlightSelectedName(state.selectedStaff);
highlightAdditionalHoliday();
AddWeekDay();

fetchWeather();
fetchWeatherForecast();

setInterval(updateHeaderClock, 1000);
setInterval(fetchWeather, CONFIG.WEATHER_REFRESH_MS);
setInterval(checkDayChange, CONFIG.DAY_CHECK_INTERVAL_MS);

window.addEventListener('load', () => {
  document.querySelectorAll('.header-cell').forEach((cell) => {
    setTimeout(() => cell.click(), 10_000);
  });
});