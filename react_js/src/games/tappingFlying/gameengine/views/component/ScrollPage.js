/**
 * Created by luocf on 2020/5/14.
 */
import React from 'react';
import Game from "../../common/Game"

class ScrollPage extends React.Component {
    constructor(props) {
        super(props);
        this.Math = Game.Math;
    }
    play() {
        //need override
    }

    pause() {
        //need override
    }

    stop() {
        //need override
    }

    destroy() {
        //need override
    }

    componentWillUnmount() {
        //释放资源，包括timer、碰撞对象等
        this.destroy();
    }
}

export default ScrollPage;