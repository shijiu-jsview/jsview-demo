import React from "react"
import "./rain.css"

class RedPack extends React.Component{
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false
    }

    render() {
        return (
            <div key={"rp_" + this.props.id} style={{
                    left: this.props.x,
                    top: 640,
                    animation: "rainDown " + this.props.speed + "s",
                    backgroundImage: "url(http://oss.image.qcast.cn/jsview_demo/hisense_redRain/red20191202.png)",
                    width:87,
                    height:118
                }}
                 onAnimationEnd={this.props.animEnd}>
            </div>
        )
    }
}

let ID_COUNTER = 0;
class Rain extends React.Component{
    constructor(props) {
        super(props);
        this._Rect = this.props.rect;

        this.state = {
            redList: [],
        };
    }

    _getRandomPosition() {
        return Math.floor(Math.random() * this._Rect.w);
    }

    _addRed() {
        let obj = {
            x: this._getRandomPosition(),
            key: ID_COUNTER++,
            speed: Math.floor(Math.random() * 5) + 2,
        }
        let red_list = [...this.state.redList]
        red_list.unshift(obj);
        this.setState({redList: red_list});

        // setTimeout(()=>{
        //     this.setState((preState, props) => {
        //         let red_list = [...preState.redList]
        //         red_list.splice(red_list.indexOf(obj), 1);
        //         return {redList: red_list}
        //     })
        // }, 10000)
    }

    componentDidMount() {
        this._addRed();
        setInterval(() => {
            this._addRed();
        }, 500);
    }

    render() {
        return(
            <div key={"rain_root"}>
                {this.state.redList.map((item, index) => {
                    return (
                        <RedPack 
                        key={item.key} 
                        id={item.key} 
                        x={item.x}
                        speed={item.speed}
                        animEnd={ ()=>{ 
                                    this.setState((preState, props) => {
                                        let red_list = [...preState.redList]
                                        red_list.splice(red_list.indexOf(item), 1);
                                        return {redList: red_list}
                                    })
                                }
                        }/>
                    )
                })}
            </div>
        )
    }
}

export default Rain;