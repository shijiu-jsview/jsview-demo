function DataManage (game) {
  this.init(game);
}
/**
 *
 */
DataManage.prototype.init = function (game) {
  this.deviceModel = game.deviceModel;
  this.activityId = game.activityId;
  this.difficult = game.difficult;

  this.btnRestartNum = 0;
  this.dataList = [];
  this.currData = this.initData();
  this.dataList.push(this.currData);
};
/**
 * 初始化游戏中需要统计的数据
*/
DataManage.prototype.initData = function () {
  const data = {};
  data.dataTimeStart = 0;
  data.dataTimeEnd = 0;
  data.timeTotal = 0;
  data.effectiveActionNum = 0;
  data.faultActionNum = 0;
  data.btnHelpNum = 0;
  data.btnHelpFirstTime = 0;
  // data.btnBgmusicNum = 0;
  // data.btnBgmusicTime = null;
  data.btnQuitTime = 0;
  data.gameFinish = 0;
  // data.btnRestartNum = 0;
  // data.btnRestartTime = 0;
  data.activityScore = 0;
  data.difficult = 0;
  return data;
};
/**
 * 添加有效操作次数
 */
DataManage.prototype.effectiveAction = function () {
  this.currData.effectiveActionNum += 1;
};

/**
 * 添加错误操作次数
 */
DataManage.prototype.faultAction = function () {
  this.currData.faultActionNum += 1;
};
/**
 * 帮助按钮的点击统计
 */
DataManage.prototype.btnHelpAction = function () {
  this.currData.btnHelpNum += 1;
  if (!this.currData.btnHelpFirstTime) {
    this.currData.currData = Date.now();
  }
};
/**
 * 背景音乐按钮的点击统计
 */
DataManage.prototype.btnBgmusicAction = function () {
  this.currData.btnBgmusicAction += 1;
  this.currData.btnBgmusicTime = Date.now();
};
/**
 * 退出按钮的点击统计
 */
DataManage.prototype.btnQuitAction = function () {
  this.currData.btnQuitTime = Date.now();
};

DataManage.prototype.gameFinishStatus = function (status) {
  this.currData.gameFinish = status;
};

DataManage.prototype.resetData = function () {
  // this.btnRestartNum += 1;
  // this.currData.btnRestartNum = this.btnRestartNum;
  // this.currData.btnRestartTime = Date.now();
  this.currData = null;
  this.currData = this.initData();
  this.dataList.push(this.currData);
};

DataManage.prototype.activityScore = function (config) {
  const type = this.getActivityType(window.Editor.Config.common.template);
  const score = this.dealActivityScore(type, config);
  this.currData.activityScore = score;
  return score;
};

/**
 *  游戏开始时时间
 */
DataManage.prototype.dataTimeStart = function () {
  this.currData.dataTimeStart = Date.now();
};

/**
 * 游戏结束时间
 */
DataManage.prototype.dataTimeEnd = function (status, config) {
  this.currData.dataTimeEnd = Date.now();
  this.currData.timeTotal = this.currData.dataTimeEnd - this.currData.dataTimeStart;

  let score = 0;
  if (status !== 'skip') {
    score = this.activityScore(config);
  }
  const statusValue = this.getFinishStatusValue(status, score);
  this.gameFinishStatus(statusValue);
};

DataManage.prototype.setGameDifficult = function (level) {
  this.currData.difficult = level + 1;
  if (this.currData.difficult > this.difficult) {
    this.difficult = this.currData.difficult;
  }
};

DataManage.prototype.setUnloackDifficult = function (value) {
  this.difficult = value + 1;
};

DataManage.prototype.getUserData = function () {
  return {
    activityId: this.activityId,
    difficult: this.difficult,
    gameInfo: this.dataList
  };
};
DataManage.prototype.dealActivityScore = function (type, config) {
  switch (type) {
    case 'action': {
      const score = this.currData.effectiveActionNum / (this.currData.faultActionNum + this.currData.effectiveActionNum) * 100;
      return Math.round(score);
    }
    case 'time': {
      if (config.time > 10) {
        return 100;
      }
      return Math.round(config.time * 10);
    }
    case 'target': {
      const score = config.clickNum / config.targetNum * 100;
      return Math.round(score);
    }
    default:
      break;
  }
};
DataManage.prototype.getActivityType = function (template) {
  switch (template) {
    case 'puzzle':
    case 'runner':
    case 'card_matching':
    case 'search_find':
    case 'follow_squeence':
    case 'tracing':
    case 'tapping_normal':
      return 'action';
    case 'coloring':
      return 'time';
    case 'tapping': // tapping_launcher
    case 'tapping_quick':
    case 'tapping_flying':
    case 'balancing':
      return 'target';
    default:
      break;
  }
};
DataManage.prototype.getFinishStatusValue = function (status, score) {
  switch (status) {
    case 'complete':
      if (score >= 80) {
        return 1;
      } if (score >= 50) {
        return 2;
      }
      return 3;

    case 'uncomplete':
      return 3;
    case 'skip':
      return 4;
    default:
      return 0;
  }
};

export default DataManage;
