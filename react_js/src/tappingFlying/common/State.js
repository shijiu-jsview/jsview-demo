/**
 * Created by luocf on 2020/5/11.
 */
import { createMemoryHistory } from 'history';

const globalHistory = createMemoryHistory();

class State {
    static add(state) {
        State.list.push(state);
    }
    
    static start(name) {
        for(let i=0; i<State.list.length; i++) {
            if (State.list[i].name === name) {
                let path = State.list[i].path;
                console.log("State start path:"+path);
                globalHistory.push(path);
                State.current.changeFocus(path, false);
                break;
            }
        }
    }

    static restart() {
        if (State.current && State.current.restart) {
            State.current.restart();
        }
    }
}
State.globalHistory = globalHistory;
State.list = [];
State.current = null;
State.focusControl = null;
export default State