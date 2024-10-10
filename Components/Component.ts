import ComponentManager from "./ComponentManager";
import { TreeType } from "../VirtualDOM/VirtualDOM";

export type BasicPropsAndStateInterface = object;

type SetStateFunction<S, P> = (state: S, props: P) => S | Promise<S>;

/**
 * The base class for UI components.
 */
abstract class Component<
  P extends BasicPropsAndStateInterface = BasicPropsAndStateInterface,
  S extends BasicPropsAndStateInterface = BasicPropsAndStateInterface
> {
  /** Props passed from the parent element. Component rerenders when props change. */
  public props: P;

  /** Unique state for the component. Component rerenders when the state changes. */
  public state!: S;

  /** A reference to the {@link ComponentManager}, which manages this component's lifecycle. Not meant for public use. */
  private _manager?: ComponentManager<this>;

  /**
   * Creates a {@link Component} instance.
   * Initializes props and sets the default state if none is provided.
   * @param props - Props passed from the parent.
   */
  constructor(props: P) {
    this.props = props;
    if (!this.state) {
      this.state = {} as S; // Initialize with an empty state if not provided
    }
  }

  /** Setter for the manager, used internally by the virtual DOM. */
  set manager(manager: ComponentManager<this>) {
    this._manager = manager;
  }

  /**
   * Updates the component's state and triggers a rerender.
   * The state can be updated synchronously or asynchronously.
   * @param newState - New state object or a function that returns the new state.
   */
  protected async setState(newState: S | SetStateFunction<S, P>) {
    if (typeof newState === "object") {
      this.state = newState;
    } else if (typeof newState === "function") {
      const updatedState = newState(this.state, this.props);
      this.state =
        updatedState instanceof Promise ? await updatedState : updatedState;
    }
    this._manager?.rerenderComponent();
  }

  /**
   * Abstract method that should be implemented by subclasses to define the UI structure.
   * @returns The component's element tree.
   */
  abstract render(): TreeType;

  /** Lifecycle method that runs after the component has been mounted in the DOM. Default is a no-op. */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  componentDidMount() {}

  /**
   * Determines if the component should rerender when its props change.
   * Compares all prop fields using the `Object.is` method by default.
   * @param oldProps - The previous props object.
   * @param newProps - The new props object.
   * @returns `true` if the component should update, `false` otherwise.
   */
  shouldComponentUpdate(oldProps: P, newProps: P): boolean {
    const oldKeys = Object.keys(oldProps) as Array<keyof P>;
    const newKeys = Object.keys(newProps) as Array<keyof P>;
    const allKeys = new Set<keyof P>([...oldKeys, ...newKeys]);

    for (const key of allKeys) {
      if (!Object.is(oldProps[key], newProps[key])) {
        return true;
      }
    }
    return false;
  }

  /** Lifecycle method that runs after the component has updated. Default is a no-op. */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  componentDidUpdate() {}

  /** Lifecycle method that runs before the component is removed from the DOM. Default is a no-op. */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  componentWillUnmount() {}
}

export default Component;
