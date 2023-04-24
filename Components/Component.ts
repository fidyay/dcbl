import ComponentManager from "./ComponentManager";
import { TreeType } from "../VirtualDOM/VirtualDOM";

export type BasicPropsAndStateInterface = object;

type settingStateFunction<S, P> = (state: S, props: P) => S | Promise<S>;

/**
 * The base class for components of UI.
 */
abstract class Component<
  P extends BasicPropsAndStateInterface = BasicPropsAndStateInterface,
  S extends BasicPropsAndStateInterface = BasicPropsAndStateInterface
> {
  /** Props of a component, component gets them from the parent element, component rerenders when there is a change in props. */
  props: P;
  /** State of a component. Each component has unique state. When state changes, component rerenders. */
  state!: S;
  /**
   * Creates a {@link Component} instance, saves props to component and sets default state if other wasn't provided.
   * @param props - props from parent.
   */
  constructor(props: P) {
    this.props = props;
    if (!this.state) {
      const defaultState = {};
      this.state = defaultState as S;
    }
  }
  /** Object of a {@link ComponentManager} class, which controls the component. It is not expected to be used by the consumer of a library. */
  private _manager?: ComponentManager<this>;
  /** Setter of a {@link Component._manager | _manager} property. Virtual dom sets it automaticly */
  set manager(m: ComponentManager<this>) {
    this._manager = m;
  }
  /** Sets new state to component and then rerenders it. Resetting the method to other value will break the library.
   * @param newState - new state object or syncronous or asyncronous function that sets new state.
   */
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
  /** Method that return the component's element tree. User should implement the method himself. */
  abstract render(): TreeType;
  /** Runs after the UI was created. By default does nothing. */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  componentDidMount() {}
  /**
   * Runs when virtual dom checks wether the component should rerender on props change. By default checks every field of an props object with Object.is method.
   * @param oldProps - old props object.
   * @param newProps - new props object, it will be set to the {@link Component.props | props} property.
   * @returns - true if UI should update, false otherwise.
   */
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
  /** Runs after component rerenders. By default does nothing. */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  componentDidUpdate() {}
  /** Runs when component is going to be deleted from the UI. By default does nothing. */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  componentWillUnmount() {}
}
export default Component;
