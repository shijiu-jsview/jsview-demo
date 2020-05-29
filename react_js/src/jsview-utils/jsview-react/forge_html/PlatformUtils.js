class PlatformUtils{
    static getTextPixelWith(text, fontStyle) {
        if (PlatformUtils.sCanvas === null) {
            PlatformUtils.sCanvas = window.originDocument.createElement("canvas"); // 创建 canvas 画布
        }

        var context = PlatformUtils.sCanvas.getContext("2d"); // 获取 canvas 绘图上下文环境
        context.font = fontStyle; // 设置字体样式，使用前设置好对应的 font 样式才能准确获取文字的像素长度
        var dimension = context.measureText(text); // 测量文字
        return Math.ceil(dimension.width);
    }

    static GetTextWidth(font_params) {
        let width = this.getTextPixelWith(font_params.str, font_params.size+"px "+font_params.font)

        return width;
    }
    static GetTextRect(str, max_rect, font_params, text_attr, line_height) {
        let rows = Math.ceil((font_params.size * str.length) /max_rect.width);
        let height = rows*line_height;
        if (height > max_rect.height) {
            height = max_rect.height;
        }
        let ret_json ={
            width:max_rect.width,
            height:height
        };
        return ret_json;
    }
};
PlatformUtils.sCanvas = null;
window["PlatformUtils"] = PlatformUtils;