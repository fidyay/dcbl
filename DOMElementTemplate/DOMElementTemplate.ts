import type {
  childrenType,
  DOMElementType
} from "../createElement/createElement";
export type DOMElementPropsType<T extends DOMElementType> =
  JSX.IntrinsicElements[T] & { children?: childrenType[] };

class DOMElementTemplate<T extends DOMElementType> {
  public DOMEl!: HTMLElement;
  public type: T;
  public props: DOMElementPropsType<T>;
  constructor(type: T, props: DOMElementPropsType<T> = {}) {
    this.type = type;
    this.props = props;
  }
}

export default DOMElementTemplate;
