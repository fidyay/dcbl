import {
  DecibelElement,
  ParametersProps
} from "../createElement/createElement";

interface State {
  [key: string]: unknown;
}

type newStateFunction = (
  state: State,
  props: ParametersProps
) => Promise<State> | State;
abstract class ClassComponent {
  protected props: ParametersProps;
  protected state: State = {};
  constructor(props: ParametersProps = {}) {
    this.props = props;
  }
  // setState expects state object or sync or async function that return new state object to be passed
  protected async setState(newState: State | newStateFunction) {
    if (typeof newState === "function") {
      this.state = await newState(this.state, this.props);
    } else if (typeof newState === "object") {
      this.state = newState;
    }
    this.render();
  }
  abstract render(): DecibelElement;
}

export default ClassComponent;
