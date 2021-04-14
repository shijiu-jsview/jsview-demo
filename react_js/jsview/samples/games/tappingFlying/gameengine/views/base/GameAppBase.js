/**
 * Created by luocf on 2020/5/12.
 */
import { FocusBlock } from "../../../../../../utils/JsViewReactTools/BlockDefine";
import Game from "../../common/Game";

class GameAppBase extends FocusBlock {
  constructor(props) {
    super(props);
    Game.state.current = this;
  }

  restart() {
    // override
  }
}

export default GameAppBase;
