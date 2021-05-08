/**
 * Created by luocf on 2019/12/26.
 */
import borderImgPath from './images/nine_patch_focus.png';

export const PAGE_THEME_ITEM_WIDTH = 178 / 2;
export const PAGE_THEME_ITEM_HEIGHT = 242 / 2;
export const PAGE_THEME_ITEM_TEXT_HEIGHT = 25;
export const PAGE_THEME_ITEM_GAP = 16;
export const PAGE_THEME_ITEM_SCALE = 1.05;
export const MenuPageStyle = {
  title: {
    style: {
      top: 10,
      left: 40,
      width: 200,
      height: PAGE_THEME_ITEM_TEXT_HEIGHT,
      fontSize: 22,
      color: "#ffffff",
      whiteSpace: "nowrap",
      textAlign: "center"
    }
  },

  content: {
    top: PAGE_THEME_ITEM_TEXT_HEIGHT + 20,
    left: 10,
    width: 280,
    height: 50 * 4,
    gap: { width: PAGE_THEME_ITEM_GAP, height: PAGE_THEME_ITEM_GAP },
    scale: 1.0,
    padding: { left: 0, top: 0 },
    title: {
      normalStyle: {
        backgroundColor: "#575d8d",
        color: "#ececec",
        fontSize: 12,
        whiteSpace: 'nowrap',
        textOverflow: "ellipsis",
        overflow: "hidden",
        left: 0,
        top: 0,
        lineHeight: `${40}px`,
        width: 280,
        height: 40
      },
      focusStyle: {
        backgroundColor: "#06a7ff",
        color: "#ffffff",
        fontSize: 12,
        whiteSpace: 'nowrap',
        textOverflow: "ellipsis",
        overflow: "hidden",
        left: 0,
        top: 0,
        lineHeight: `${40}px`,
        width: 280,
        height: 40
      }
    }
  }
};
export const MenuPageData = [
  {
    blocks: {
      w: 280,
      h: 50
    },
    focusable: true,
    hasSub: false,
    id: 0,
    title: "电视剧",
  },
  {
    blocks: {
      w: 280,
      h: 50
    },
    focusable: true,
    hasSub: false,
    id: 1,
    title: "影视",
  },
  {
    blocks: {
      w: 280,
      h: 50
    },
    focusable: true,
    hasSub: false,
    id: 2,
    title: "综艺",
  },
  {
    blocks: {
      w: 280,
      h: 50
    },
    focusable: true,
    hasSub: false,
    id: 3,
    title: "综艺",
  }
];

export const HomePageStyle = {
  title: {
    style: {
      top: 0,
      left: 40,
      width: 200,
      height: PAGE_THEME_ITEM_TEXT_HEIGHT,
      fontSize: 22,
      color: "#369cc4",
      whiteSpace: "nowrap",
      textAlign: "left"
    }
  },

  content: {
    top: PAGE_THEME_ITEM_TEXT_HEIGHT + 10,
    left: 40,
    width: 800,
    height: 200,
    gap: { width: PAGE_THEME_ITEM_GAP, height: PAGE_THEME_ITEM_GAP },
    scale: PAGE_THEME_ITEM_SCALE,
    padding: { left: 10, top: 10 },
    title: {
      normalStyle: {
        color: "#ffffff",
        fontSize: 12,
        whiteSpace: 'nowrap',
        textOverflow: "ellipsis",
        overflow: "hidden",
        left: 0,
        top: PAGE_THEME_ITEM_HEIGHT,
        lineHeight: `${PAGE_THEME_ITEM_TEXT_HEIGHT}px`,
        width: PAGE_THEME_ITEM_WIDTH,
        height: PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusStyle: {
        color: "#ffffff",
        fontSize: 12,
        left: 0,
        top: PAGE_THEME_ITEM_HEIGHT,
        width: PAGE_THEME_ITEM_WIDTH,
        height: PAGE_THEME_ITEM_TEXT_HEIGHT
      }
    },
    image: {
      normalStyle: {
        borderImage: `url(null) 0 fill`,
        borderRadius: '8px 8px 8px 8px',
      },
      focusStyle: {
        transform: "scale3d(1.03,1.03,1)",
        borderRadius: '8px 8px 8px 8px',
        borderImage: `url(${borderImgPath}) 40 fill`,
        borderImageWidth: '40px',
        borderImageOutset: "28px 28px 28px 28px",
      }
    }
  }
};

export const HomePageData = [
  {
    blocks: {
      w: 800,
      h: 200
    },
    focusable: true,
    hasSub: true,
    id: 0,
    title: "电视剧",
    data: [{
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#000022",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191224/0fdcdc8b258fe7baac16b73f58f8989d.jpg",
        title: "剑王朝",
      }
    },
    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#003300",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191216/d0b14128b1783e5188de6ca98e6b5d05.jpg",
        title: "我和我的祖国",
      }
    },

    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#000055",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191224/6235ab61a3c89ef2997b4c0441d91eae.jpg",
        title: "汪汪队立大功第4季",
      }
    },


    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#0000CD",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191224/bded4e88fd610b7107c9836f5d5db959.jpg",
        title: "变形警车珀利消防安全篇",
      }
    },
    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#000022",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191224/259f41751aa9642c5d543114a71b070a.png",
        title: "迪士尼电影",
      }
    },
    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#000022",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20190618/e449792161d2e66f39f6608f70c6c89b.png",
        title: "灯塔慧",
      }
    }]
  },
  {
    blocks: {
      w: 800,
      h: 200
    },
    focusable: true,
    hasSub: true,
    id: 1,
    title: "影视",
    data: [{
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#000022",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191224/0fdcdc8b258fe7baac16b73f58f8989d.jpg",
        title: "剑王朝",
      }
    },
    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#003300",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191216/d0b14128b1783e5188de6ca98e6b5d05.jpg",
        title: "我和我的祖国",
      }
    },

    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#000055",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191224/6235ab61a3c89ef2997b4c0441d91eae.jpg",
        title: "汪汪队立大功第4季",
      }
    },


    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#0000CD",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191224/bded4e88fd610b7107c9836f5d5db959.jpg",
        title: "变形警车珀利消防安全篇",
      }
    },
    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#000022",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191224/259f41751aa9642c5d543114a71b070a.png",
        title: "迪士尼电影",
      }
    },
    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#000022",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20190618/e449792161d2e66f39f6608f70c6c89b.png",
        title: "灯塔慧",
      }
    }]
  },
  {
    blocks: {
      w: 800,
      h: 200
    },
    focusable: true,
    hasSub: true,
    id: 2,
    title: "综艺",
    data: [{
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#000022",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191224/0fdcdc8b258fe7baac16b73f58f8989d.jpg",
        title: "剑王朝",
      }
    },
    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#003300",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191216/d0b14128b1783e5188de6ca98e6b5d05.jpg",
        title: "我和我的祖国",
      }
    },

    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#000055",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191224/6235ab61a3c89ef2997b4c0441d91eae.jpg",
        title: "汪汪队立大功第4季",
      }
    },


    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#0000CD",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191224/bded4e88fd610b7107c9836f5d5db959.jpg",
        title: "变形警车珀利消防安全篇",
      }
    },
    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#000022",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191224/259f41751aa9642c5d543114a71b070a.png",
        title: "迪士尼电影",
      }
    },
    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#000022",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20190618/e449792161d2e66f39f6608f70c6c89b.png",
        title: "灯塔慧",
      }
    }]
  },
  {
    blocks: {
      w: 800,
      h: 200
    },
    focusable: true,
    hasSub: true,
    id: 3,
    title: "电视剧",
    data: [{
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#000022",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191224/0fdcdc8b258fe7baac16b73f58f8989d.jpg",
        title: "剑王朝",
      }
    },
    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#003300",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191216/d0b14128b1783e5188de6ca98e6b5d05.jpg",
        title: "我和我的祖国",
      }
    },

    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#000055",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191224/6235ab61a3c89ef2997b4c0441d91eae.jpg",
        title: "汪汪队立大功第4季",
      }
    },


    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#0000CD",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191224/bded4e88fd610b7107c9836f5d5db959.jpg",
        title: "变形警车珀利消防安全篇",
      }
    },
    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#000022",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191224/259f41751aa9642c5d543114a71b070a.png",
        title: "迪士尼电影",
      }
    },
    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#000022",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20190618/e449792161d2e66f39f6608f70c6c89b.png",
        title: "灯塔慧",
      }
    }]
  },
  {
    blocks: {
      w: 800,
      h: 200
    },
    focusable: true,
    hasSub: true,
    id: 4,
    title: "影视",
    data: [{
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#000022",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191224/0fdcdc8b258fe7baac16b73f58f8989d.jpg",
        title: "剑王朝",
      }
    },
    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#003300",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191216/d0b14128b1783e5188de6ca98e6b5d05.jpg",
        title: "我和我的祖国",
      }
    },

    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#000055",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191224/6235ab61a3c89ef2997b4c0441d91eae.jpg",
        title: "汪汪队立大功第4季",
      }
    },


    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#0000CD",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191224/bded4e88fd610b7107c9836f5d5db959.jpg",
        title: "变形警车珀利消防安全篇",
      }
    },
    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#000022",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191224/259f41751aa9642c5d543114a71b070a.png",
        title: "迪士尼电影",
      }
    },
    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#000022",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20190618/e449792161d2e66f39f6608f70c6c89b.png",
        title: "灯塔慧",
      }
    }]
  },
  {
    blocks: {
      w: 800,
      h: 200
    },
    focusable: true,
    hasSub: true,
    id: 5,
    title: "综艺",
    data: [{
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#000022",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191224/0fdcdc8b258fe7baac16b73f58f8989d.jpg",
        title: "剑王朝",
      }
    },
    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#003300",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191216/d0b14128b1783e5188de6ca98e6b5d05.jpg",
        title: "我和我的祖国",
      }
    },

    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#000055",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191224/6235ab61a3c89ef2997b4c0441d91eae.jpg",
        title: "汪汪队立大功第4季",
      }
    },


    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#0000CD",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191224/bded4e88fd610b7107c9836f5d5db959.jpg",
        title: "变形警车珀利消防安全篇",
      }
    },
    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#000022",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20191224/259f41751aa9642c5d543114a71b070a.png",
        title: "迪士尼电影",
      }
    },
    {
      blocks: {
        w: PAGE_THEME_ITEM_WIDTH + PAGE_THEME_ITEM_GAP,
        h: PAGE_THEME_ITEM_HEIGHT + PAGE_THEME_ITEM_GAP + PAGE_THEME_ITEM_TEXT_HEIGHT
      },
      focusable: true,
      color: "#000022",
      content: {
        url: "http://oss.image.51vtv.cn/homepage/20190618/e449792161d2e66f39f6608f70c6c89b.png",
        title: "灯塔慧",
      }
    }]
  }
];
