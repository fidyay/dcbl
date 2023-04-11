import type {
  childrenType,
  DOMElementType
} from "../createElement/createElement";
export type DOMElementPropsType<T extends DOMElementType> =
  JSX.IntrinsicElements[T] & { children?: childrenType[] };

/**
 * A class specified for a template of a DOM element used later in virtual DOM to implement or change actual DOM element
 */
class DOMElementTemplate<T extends DOMElementType> {
  /** Index in parent DOM element */
  public indexInParent!: number;
  /** Link to element in DOM */
  public DOMEl!: HTMLElement;
  /** DOM element tag name */
  public type: T;
  /** Element props */
  public props: DOMElementPropsType<T>;
  /**
   * Creates a {@link DOMElementTemplate} instance.
   * @param type - a tag name
   * @param props - props object
   */
  constructor(type: T, props: DOMElementPropsType<T> = {}) {
    this.type = type;
    this.props = props;
  }
}

export default DOMElementTemplate;
