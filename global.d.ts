import type { DOMElementPropsType } from "./createElement/DOMElementTemplate/DOMElementTemplate";
import type Optionate from "./typeManipulation/optionate";
import type RemoveFields from "./typeManipulation/removeFields";

type MakeIETypes<Elements> = {
  [Property in keyof Elements]: Optionate<
    RemoveFields<Elements[Property]>,
    "addEventListener" | "removeEventListener" | "children"
  >;
};

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface IntrinsicElements extends MakeIETypes<HTMLElementTagNameMap> {}

    interface ElementAttributesProperty {
      props; // specify the property name to use
    }

    interface ElementChildrenAttribute {
      children; // specify children name to use
    }
  }
}
