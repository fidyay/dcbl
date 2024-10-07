// Import necessary types
import type {
  childrenType,
  DOMElementType
} from "../createElement/createElement";

// Define a type for DOM element properties, including children
export type DOMElementPropsType<T extends DOMElementType> =
  JSX.IntrinsicElements[T] & { children?: childrenType[] };

/**
 * Class representing a template for a DOM element, used in the virtual DOM.
 * The template can later be used to create or update actual DOM elements.
 */
class DOMElementTemplate<T extends DOMElementType> {
  /** Index position of this element within its parent DOM element */
  public indexInParent!: number;

  /** Reference to the actual DOM element when rendered */
  public DOMEl!: HTMLElement;

  /** The tag name for this DOM element (e.g., 'div', 'span') */
  public type: T;

  /** The props associated with this DOM element, including attributes and children */
  public props: DOMElementPropsType<T>;

  /**
   * Creates an instance of {@link DOMElementTemplate}.
   * @param type - The tag name for the DOM element.
   * @param props - The properties of the DOM element (attributes, children, etc.).
   */
  constructor(type: T, props: DOMElementPropsType<T> = {}) {
    this.type = type;
    this.props = props;
  }
}

export default DOMElementTemplate;

/*
what was refactored
Key Changes:
Clarity in Comments: Expanded and clarified comments, ensuring they explain the purpose of each class property and the constructor more thoroughly.
Simplified Imports: Grouped imports and clarified the type import to reflect its role more clearly.
Code Structure: Cleaned up unnecessary lines and kept the overall file concise while maintaining clarity.
This refactored version is now easier to read and understand for anyone working with or maintaining the code.
*/
