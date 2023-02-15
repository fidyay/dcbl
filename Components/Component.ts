import { childrenType } from "../createElement/createElement";
import ComponentManager from "./ComponentManager";

export interface BasicPropsAndStateInterface {
  [key: string]: unknown;
}

abstract class Component {
  props: BasicPropsAndStateInterface;
  state: BasicPropsAndStateInterface = {};
  constructor(props: BasicPropsAndStateInterface) {
    this.props = props;
  }
  private _manager?: ComponentManager;
  set manager(m: ComponentManager) {
    this._manager = m;
  }
  protected async setState(
    newState:
      | BasicPropsAndStateInterface
      | ((
          state: BasicPropsAndStateInterface,
          props: BasicPropsAndStateInterface
        ) => BasicPropsAndStateInterface)
  ) {
    if (typeof newState !== "function") {
      this.state = newState;
    } else {
      if (newState.constructor.name === "AsyncFunction") {
        this.state = await newState(this.state, this.props);
      } else {
        this.state = newState(this.state, this.props);
      }
    }
    this._manager?.rerenderComponent();
  }
  abstract render(): childrenType;
}
export default Component;
