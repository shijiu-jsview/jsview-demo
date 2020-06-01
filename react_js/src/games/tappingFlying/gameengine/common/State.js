/**
 * Created by luocf on 2020/5/11.
 */
class State {
    static add(state) {
        State.list.push(state);
    }

    static start(name,not_need_load) {
        for(let i=0; i<State.list.length; i++) {
            if (State.list[i].name === name) {
                let path = State.list[i].path;
                console.log("State start path:"+path);
                if (!not_need_load) {
                    State.globalHistory.push(path);
                }
                break;
            }
        }
    }

    static preload(name) {
        for(let i=0; i<State.list.length; i++) {
            if (State.list[i].name === name) {
                let path = State.list[i].path;
                console.log("State preload path:"+path);
                State.globalHistory.push(path);
                break;
            }
        }
    }
    static restart() {
        if (State.current && State.current.restart) {
            State.current.restart();
        }
    }

    static close() {
        //恢复现场
        State.start("Boot");
        if (State.goHome) {
            State.goHome();
        }
    }
}

State.list = [];
State.current = null;
State.focusControl = null;
State.goHome = null;
State.globalHistory = null;
export default State