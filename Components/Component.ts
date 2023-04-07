import ComponentManager from "./ComponentManager";
import { TreeType } from "../VirtualDOM/VirtualDOM";

export type BasicPropsAndStateInterface = object;

type settingStateFunction<S, P> = (state: S, props: P) => S | Promise<S>;

abstract class Component<
  P extends BasicPropsAndStateInterface = BasicPropsAndStateInterface,
  S extends BasicPropsAndStateInterface = BasicPropsAndStateInterface
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
  private _manager?: ComponentManager<this>;
  set manager(m: ComponentManager<this>) {
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
  abstract render(): TreeType;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  componentDidMount() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  shouldComponentUpdate(oldProps: P, newProps: P) {
    let shouldUpdate = false;
    const oldKeys = Object.keys(oldProps) as Array<keyof P>;
    const newKeys = Object.keys(newProps) as Array<keyof P>;
    const allProps = new Set<keyof P>([...oldKeys, ...newKeys]);
    for (const prop of allProps) {
      if (!Object.is(oldProps[prop], newProps[prop])) {
        shouldUpdate = true;
        break;
      }
    }
    return shouldUpdate;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  componentDidUpdate() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  componentWillUnmount() {}
}
export default Component;
