/**
 * Created by luocf on 2020/5/11.
 */
import bg from "./assets/images/loading_bg.jpg";
import process_total from "./assets/images/loading_total.png";
import process from "./assets/images/loading_progress.png";

const PreloadTheme = {
  bg: {
    style: {
      left: 0,
      top: 0,
      width: 1280,
      height: 720,
      backgroundImage: bg,
    }
  },
  mickey: {
    style: {
      left: (1280 - 156) / 2, top: (720 - 140) / 2 - 68, width: 156, height: 140,
    }
  },
  loading: {
    duration: 2,
    total: {
      style: {
        left: (1280 - 300) / 2,
        top: (720 - 28) / 2 + 80,
        width: 300,
        height: 99,
        backgroundImage: process_total,
      }
    },
    process: {
      mask: {
        left: (1280 - 300) / 2,
        top: (720 - 28) / 2 + 80,
        width: 300,
        height: 99,
        overflow: "hidden",
      },
      style: {
        left: 0,
        top: 0,
        width: 300,
        height: 99,
        backgroundImage: process,
      }
    }
  },
  tipsinfo: null,
  audio: null
};
export default PreloadTheme;
