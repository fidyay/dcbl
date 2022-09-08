import {
  DecibelElement,
  ParametersProps
} from "../createElement/createElement";

abstract class Component {
  protected props: ParametersProps;
  abstract render(): DecibelElement;
  constructor(props: ParametersProps = {}) {
    this.props = props;
  }
}

export default Component;
