/**
 * Created by luocf on 2020/3/19.
 */
import btnBgNormal from "../images/btn_bg_normal.png";
import btnBgFocus from "../images/btn_bg_focus.png";
import backgroundImg from "../images/background.jpg";
import prize1 from "../images/prize1.png";
import prize2 from "../images/prize2.png";
import prize3 from "../images/prize3.png";
import prize4 from "../images/prize4.png";
import prize5 from "../images/prize5.png";
import prize6 from "../images/prize6.png";
import prize7 from "../images/prize7.png";
import prize8 from "../images/prize8.png";
import goImgNormal from "../images/btn_zhizhen_normal.png";
import goImgFocus from "../images/btn_zhizhen_selected.png";
import moveFocusBg from "../images/move_focus_bg.png";

class PageTheme {
  static get() {
    return {
      MainPage: {
        bgStyle: {
          width: 1920,
          height: 1080,
          backgroundImage: `url(${backgroundImg})`,
          left: (1280 - 1920) / 2,
          top: (720 - 1080) / 2,
          transform: "scale3d(0.67,0.67,1.0)"
        },
        btn1: {
          style: {
            left: 1403,
            top: 33,
            width: 200,
            height: 60,
            backgroundImage: `url(${btnBgNormal})`,
            fontSize: 30,
            color: "#151e77",
            lineHeight: "60px",
            textAlign: "center",
            verticalAlign: "middle"
          },
          focusStyle: {
            left: 1403,
            top: 33,
            width: 200,
            height: 60,
            backgroundImage: `url(${btnBgFocus})`,
            fontSize: 30,
            color: "#151e77",
            lineHeight: "60px",
            textAlign: "center",
            verticalAlign: "middle"
          }
        },
        btn2: {
          style: {
            left: 1644,
            top: 33,
            width: 200,
            height: 60,
            backgroundImage: `url(${btnBgNormal})`,
            fontSize: 30,
            color: "#151e77",
            lineHeight: "60px",
            textAlign: "center",
            verticalAlign: "middle"
          },
          focusStyle: {
            left: 1644,
            top: 33,
            width: 200,
            height: 60,
            backgroundImage: `url(${btnBgFocus})`,
            fontSize: 30,
            color: "#151e77",
            lineHeight: "60px",
            textAlign: "center",
            verticalAlign: "middle"
          }
        }
      },
      NineSquared: {
        data: [
          {
            left: 192,
            top: 432,
            width: 216,
            height: 216,
            backgroundImage: `url(${prize1})`,
          },
          {
            left: 192,
            top: 198,
            width: 216,
            height: 216,
            backgroundImage: `url(${prize2})`,
          },
          {
            left: 426,
            top: 198,
            width: 216,
            height: 216,
            backgroundImage: `url(${prize3})`,
          },
          {
            left: 660,
            top: 198,
            width: 216,
            height: 216,
            backgroundImage: `url(${prize4})`,
          },
          {
            left: 660,
            top: 432,
            width: 216,
            height: 216,
            backgroundImage: `url(${prize5})`,
          },
          {
            left: 660,
            top: 666,
            width: 216,
            height: 216,
            backgroundImage: `url(${prize6})`,
          },
          {
            left: 426,
            top: 666,
            width: 216,
            height: 216,
            backgroundImage: `url(${prize7})`,
          },
          {
            left: 192,
            top: 666,
            width: 216,
            height: 216,
            backgroundImage: `url(${prize8})`,
          },

        ],
        moveFocusBg: {
          backgroundImage: `url(${moveFocusBg})`,
        },
        goBtn: {
          style: {
            left: 426,
            top: 432,
            width: 216,
            height: 216,
            backgroundImage: `url(${goImgNormal})`,
          },
          focusStyle: {
            left: 426,
            top: 432,
            width: 216,
            height: 216,
            backgroundImage: `url(${goImgFocus})`,
          },
          font: {
            left: 426 + 68,
            top: 432 + 155,
            width: 50,
            height: 40,
            fontSize: 32,
            color: "#ffffff",
            lineHeight: "40px",
            textAlign: "center",
            verticalAlign: "middle"
          }
        },

      },
      tipsInfo: {
        left: 265,
        top: 955,
        width: 560,
        height: 60,
        fontSize: 24,
        color: "#ffffff",
        lineHeight: "60px",
        textAlign: "center",
        verticalAlign: "middle"
      }
    };
  }
}

export default PageTheme;
