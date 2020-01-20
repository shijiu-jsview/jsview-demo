import React from 'react';
import {ContentFont} from '../CommonFontStyle'

class TextOverflow extends React.Component {
    render() {
        const itemWidth = 180;
        const itemHeight = 35;
        const gap = 2;

        const baseStyle = {
            ...ContentFont,
            width: itemWidth, height: itemHeight,
            backgroundColor: 'rgba(255, 255, 0, 0.5)',
            color: 'rgba(255, 0, 0, 1)',
        };

        // 多行的处理，在PC端依靠CSS属性 white-space: pre-line，在JsView平台不需要特别属性
        const multiLine1 = "5.多行文字（末尾省略)："
            + "\n 第一行：我末尾有个\"\\n\""
            + "\n 第二行：一二三四五六七八九十,一二三四五六七八九十,一二三四五六七八九十"
            + "\n 第三行：一二三四五六七八九十,一二三四五六七八九十,一二三四五六七八九十";

        const multiLine2 = "6.多行文字（末尾截断)："
            + "\n 第一行：我末尾有个\"\\n\""
            + "\n 第二行：一二三四五六七八九十,一二三四五六七八九十,一二三四五六七八九十"
            + "\n 第三行：一二三四五六七八九十,一二三四五六七八九十,一二三四五六七八九十";

        return <div id='layout-root' style={this.props.style}>
                <div style={{...baseStyle,
                        whiteSpace : 'nowrap',
                        textOverflow: 'clip', overflow : 'hidden',
                }}>1.长文字截断，后面的文字你可能看不到</div>

                <div style={{...baseStyle, top:(itemHeight + gap),
                        whiteSpace : 'nowrap',
                        textOverflow: 'ellipsis', overflow : 'hidden',
                }}>2.长文字省略，后面的文字你可能看不到</div>

                <div style={{...baseStyle, top:(itemHeight + gap) * 2,
                        textOverflow: 'clip', overflow : 'hidden',
                }}>3.长文字折行+截断，后面的文字你可能看不到，与PC效果有区别，一二三四五六七八九十</div>

                <div style={{...baseStyle, top:(itemHeight + gap) * 3,
                        textOverflow: 'ellipsis', overflow : 'hidden',
                }}>4.长文字折行+省略，后面的文字你可能看不到，与PC效果有区别，一二三四五六七八九十</div>

                <div style={{...baseStyle, top:(itemHeight + gap) * 4, height: 65,
                    textOverflow: 'ellipsis', overflow : 'hidden',
                }}>{multiLine1}</div>

                <div style={{...baseStyle, top:(itemHeight + gap) * 4 + 67, height:65,
                    textOverflow: 'clip', overflow : 'hidden',
                }}>{multiLine2}</div>
            </div>
    }
}

export default TextOverflow;
