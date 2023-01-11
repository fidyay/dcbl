import type { childrenType } from "../createElement";
import type Optionate from "../../typeManipulation/optionate";
import type SetField from "../../typeManipulation/setField";
export type DOMElementType = keyof HTMLElementTagNameMap;
export type DOMElementPropsType<T extends DOMElementType> = Optionate<
  SetField<HTMLElementTagNameMap[T], "children", childrenType[]>
>;

class DOMElementTemplate<T extends DOMElementType> {
  public type: T;
  public props: DOMElementPropsType<T>;
  constructor(type: T, props: DOMElementPropsType<T> = {}) {
    this.type = type;
    this.props = props;
  }
}

export default DOMElementTemplate;
