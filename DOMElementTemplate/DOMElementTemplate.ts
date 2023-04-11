import type {
  childrenType,
  DOMElementType
} from "../createElement/createElement";
export type DOMElementPropsType<T extends DOMElementType> =
  JSX.IntrinsicElements[T] & { children?: childrenType[] };

/**
 * A class specified for a template of a DOM element used later in virtual DOM to implement or change actual DOM element
 *
 * @field indexInParent - index in child nodes of parent DOM element
 * @field DOMEl - link to a DOM element created by virtual DOM
 * @field type - a tag name
 * @field props - props of an element
 */
class DOMElementTemplate<T extends DOMElementType> {
  public indexInParent!: number;
  public DOMEl!: HTMLElement;
  public type: T;
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
