import createElement, {
  childrenType,
  DOMElementType
} from "./createElement/createElement";
import Component from "./Components/Component";
import DOMElementTemplate from "./DOMElementTemplate/DOMElementTemplate";
import ComponentManager from "./Components/ComponentManager";

type excludedFields =
  | "addEventListener"
  | "appendChild"
  | "attributes"
  | "NamedNodeMap"
  | "blur"
  | "childElementCount"
  | "childNodes"
  | "NodeList"
  | "children"
  | "HTMLCollection"
  | "classList"
  | "click"
  | "clientHeight"
  | "clientLeft"
  | "clientTop"
  | "clientWidth"
  | "cloneNode"
  | "closest"
  | "compareDocumentPosition"
  | "contains"
  | "contentEditable"
  | "firstChild"
  | "firstElementChild"
  | "focus"
  | "getAttribute"
  | "getAttributeNode"
  | "getBoundingClientRect"
  | "getElementsByClassName"
  | "getElementsByTagName"
  | "hasAttribute"
  | "hasAttributes"
  | "hasChildNodes"
  | "innerHTML"
  | "innerText"
  | "insertAdjacentElement"
  | "insertAdjacentHTML"
  | "insertAdjacentText"
  | "insertBefore"
  | "isContentEditable"
  | "isDefaultNamespace"
  | "isEqualNode"
  | "isSameNode"
  | "isSupported"
  | "Deprecated"
  | "lastChild"
  | "lastElementChild"
  | "matches"
  | "namespaceURI"
  | "nextSibling"
  | "nextElementSibling"
  | "nodeName"
  | "nodeType"
  | "nodeValue"
  | "normalize"
  | "offsetHeight"
  | "offsetWidth"
  | "offsetLeft"
  | "offsetParent"
  | "offsetTop"
  | "outerHTML"
  | "outerText"
  | "ownerDocument"
  | "parentNode"
  | "parentElement"
  | "previousSibling"
  | "previousElementSibling"
  | "querySelector"
  | "querySelectorAll"
  | "remove"
  | "removeAttribute"
  | "removeAttributeNode"
  | "removeChild"
  | "removeEventListener"
  | "replaceChild"
  | "scrollHeight"
  | "scrollIntoView"
  | "scrollLeft"
  | "scrollTop"
  | "scrollWidth"
  | "setAttribute"
  | "setAttributeNode"
  | "tagName"
  | "textContent";

type OptionateAndRemove<Type, Fields> = {
  [Property in keyof Type as Exclude<Property, Fields>]?: Type[Property];
};

type MakeIETypes<Type> = {
  [Element in keyof Type]: OptionateAndRemove<Type[Element], excludedFields> & {
    children?: childrenType;
  };
};

declare global {
  createElement = typeof createElement;
  namespace JSX {
    type Element =
      | DOMElementTemplate<DOMElementType>
      | ComponentManager<Component<any, any>>;

    type ElementClass = Component;

    type IntrinsicElements = MakeIETypes<HTMLElementTagNameMap>;

    interface ElementAttributesProperty {
      props; // specify the property name to use
    }

    interface ElementChildrenAttribute {
      children; // specify children name to use
    }
  }
}
