import { childrenType } from "../createElement/createElement";
import ComponentManager from "./ComponentManager";

export type BasicPropsAndStateInterface = Record<string, unknown>;

type settingStateFunction<S, P> = (state: S, props: P) => S | Promise<S>;

abstract class Component<
  // eslint-disable-next-line @typescript-eslint/ban-types
  P extends BasicPropsAndStateInterface = {},
  // eslint-disable-next-line @typescript-eslint/ban-types
  S extends BasicPropsAndStateInterface = {}
> {
  props: P;
  state!: S;
  constructor(props: P) {
    this.props = props;
    if (!this.state) {
      const defaultState = {};
      this.state = defaultState as S;
    }
  }
  private _manager?: ComponentManager;
  set manager(m: ComponentManager) {
    this._manager = m;
  }
  protected async setState(newState: S | settingStateFunction<S, P>) {
    if (typeof newState === "object") {
      this.state = newState;
    } else if (typeof newState === "function") {
      const updatedState = newState(this.state, this.props);
      if (updatedState instanceof Promise) {
        this.state = await updatedState;
      } else {
        this.state = updatedState;
      }
    }
    this._manager?.rerenderComponent();
  }
  abstract render(): childrenType;
}
export default Component;
