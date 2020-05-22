/**
 * Created by luocf on 2020/5/11.
 */
var Config = {
    "title": "Disney Game",
    "version": "1.5",
    "common": {
        "language": "en",
        "platform": "MobilePro",
        "ratio": "16/9",
        "pix": "720p",
        "effect": false,
        "ending": "default_ending",
        "theme": "Mickey_Mouse_Clubhouse",
        "template": "tapping_flying",
        "style": "tapping_flying",
        "uiTheme": "default_ui_theme",
        "log": true,
        "autoGameStart": true,
        "showProgressBar": true,
        "showProfile": false,
        "exitInterval": 5,
        "exitTotalTime": 5,
        "gesture": true
    },
    "setting": {
        "x": 426,
        "y": 360
    },
    "stages": [
        {
            "roundsNum": 1,
            "roundIndex": 1,
            "backgroundSound": {
                "type": "audio",
                "value": "bgmusic.mp3"
            },
            "narration": {
                "type": "audio",
                "value": "mmch11003_narration_en.mp3",
                "lang": true
            },
            "ambientSound": {
                "type": "audio",
                "value": "none.mp3"
            },
            "flySound": {
                "type": "audio",
                "value": "none.mp3"
            },
            "clashSound": {
                "type": "audio",
                "value": "char_clash.mp3"
            },
            "crossTargetSound": {
                "type": "audio",
                "value": "none.mp3"
            },
            "clickSound": {
                "type": "audio",
                "value": "click.mp3"
            },
            "throughFail": {
                "type": "audio",
                "value": "none.mp3"
            },
            "rounds": [{
                "assets": {
                    "backgroundImage": {
                        "type": "images",
                        "value": "middle_5.jpg"
                    },
                    "iconImage": {
                        "type": "images",
                        "value": "",
                        "x": 0,
                        "y": 0
                    },
                    "role": {
                        "type": "atlas",
                        "value": "dog_1.png",
                        "json": "dog_1.json",
                        "detail": "dog_1_info",
                        "rate": 24,
                        "bodySize": {
                            "x": 27,
                            "y": 17,
                            "w": 247,
                            "h": 178
                        }
                    },
                    "roleJump": {
                        "type": "atlas",
                        "value": "fly.png",
                        "json": "fly.json",
                        "detail": "fly_info",
                        "rate": 10
                    },
                    "clashObstacle": {
                        "type": "atlas",
                        "value": "dizziness.png",
                        "json": "dizziness.json",
                        "detail": "dizziness_info",
                        "rate": 10
                    },
                    "targetUp": {
                        "type": "atlas",
                        "value": "",
                        "json": "",
                        "rate": 10
                    },
                    "targetDown": {
                        "type": "atlas",
                        "value": "",
                        "json": "",
                        "rate": 10
                    },
                    "obstacle": {
                        "type": "atlas",
                        "value": "ba.png",
                        "json": "ba.json",
                        "detail": "ba_info",
                        "rate": 10,
                        "speed": 400,
                        "bodySize": {
                            "x": 47,
                            "y": 9,
                            "w": 70,
                            "h": 130
                        }
                    },
                    "startAni": {
                        "type": "atlas",
                        "value": "",
                        "json": "",
                        "rate": 10,
                        "x": 0,
                        "y": 200
                    }
                },
                "game": {
                    "midImageNum": 7,
                    "isTarget": false,
                    "isTargetDown": false,
                    "targetNum": 6,
                    "appearNum": 7,
                    "crossTargetNum": 0,
                    "isObstacle": true,
                    "obstacleNum": 9,
                    "roleUpSpeed": 500,
                    "roleDownSpeed": 800,
                    "roleSpeed": 400,
                    "offsetX": 0,
                    "counterOffset": {
                        "x": 0,
                        "y": 0
                    },
                    "isStartAni": false,
                    "isIconImage": false,
                    "isFlyingMode": false,
                    "topBorder": 0,
                    "rangeHeight": 530,
                    "targetMinY": 180,
                    "targetMaxY": 600,
                    "obstacleMinY": 480,
                    "obstacleMaxY": 480
                }
            }]
        }]
};

export default Config;