const ReaxAudios = class {
  constructor (game) {
    this.game = game;
    this.isHummming = false;
    this.negList = [
      "audio_reaxneg_01.mp3",
      "audio_reaxneg_02.mp3",
      "audio_reaxneg_03.mp3"
    ];
    this.posList = [
      "audio_reaxpos_01.mp3",
      "audio_reaxpos_02.mp3",
      "audio_reaxpos_03.mp3",
      "audio_reaxpos_04.mp3",
      "audio_reaxpos_05.mp3"
    ];
    this.loadAudio();
  }

  loadAudio() {
    this.audioReasNegList = [];
    for (let i = 0; i < this.negList.length; i++) {
      this.audioReasNegList.push(this.game.audio(this.negList[i]));
    }

    this.audioReasPosList = [];
    for (let i = 0; i < this.posList.length; i++) {
      this.audioReasPosList.push(this.game.audio(this.posList[i]));
    }
    this.audioReasGoodJob = [];
    this.audioReasGoodJob.push(this.game.audio(this.posList[1]));
    this.audioReasWellDone = [];
    this.audioReasWellDone.push(this.game.audio(this.posList[4]));
  }

  // 从数据中获取不重复随机
  getRandomItem(list, undiffCount = 3) {
    if (list == null || list.length <= 0) {
      return;
    }

    // filter play list
    let playList = [];
    if (list.length > undiffCount) {
      if (list.hasplayed == null) {
        list.hasplayed = [];
      }
      for (let i = 0; i < list.length; i++) {
        let isplayed = false;
        for (let j = 0; j < list.hasplayed.length; j++) {
          if (list[i] === list.hasplayed[j]) {
            isplayed = true;
            break;
          }
        }

        if (!isplayed) {
          playList.push(list[i]);
        }
      }
    } else {
      playList = list;
    }

    const randomIndex = this.game.Math.between(0, playList.length - 1);
    const randomItem = playList[randomIndex];

    // update catched list
    if (list.length > undiffCount) {
      if (list.hasplayed == null) {
        list.hasplayed = [];
      }
      for (let i = undiffCount - 1; i >= 0; i--) {
        if (i > 0) {
          list.hasplayed[i] = list.hasplayed[i - 1];
        } else {
          list.hasplayed[i] = randomItem;
        }
      }
    }

    return randomItem;
  }

  playRandomAudio(list, callback) {
    if (list == null || list.length <= 0) {
      callback && callback();
      return;
    }

    const randomAudio = this.getRandomItem(list, 3);
    randomAudio.play();
    if (callback) {
      callback();
    }
    return randomAudio;
  }

  showPositiveHumm(callback) {
    if (!this.isHummming) {
      this.isHummming = true;
      this.playRandomAudio(this.audioReasPosList, () => {
        this.isHummming = false;
        callback && callback();
      });
    }

    // log 记录有效点击次数
    window.dataManage.effectiveAction();
  }

  showNegativeHumm(callback) {
    if (!this.isHummming) {
      this.isHummming = true;
      this.playRandomAudio(this.audioReasNegList, () => {
        this.isHummming = false;
        callback && callback();
      });
    }
    // log 记录错误点击次数
    window.dataManage.faultAction();
  }

  playAudioGoodJob(callback) {
    this.playRandomAudio(this.audioReasGoodJob, () => {
      callback && callback();
    });
    // log 记录有效点击次数
    window.dataManage.effectiveAction();
  }

  playAudioWellDone(callback) {
    this.playRandomAudio(this.audioReasWellDone, () => {
      callback && callback();
    });
    // log 记录有效点击次数
    window.dataManage.effectiveAction();
  }
};

export { ReaxAudios };
