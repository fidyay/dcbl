import ComponentManager from "../Components/ComponentManager";
import DOMElementTemplate from "../DOMElementTemplate/DOMElementTemplate";
import { childrenType, DOMElementType } from "../createElement/createElement";
import Component from "../Components/Component";
import Optionate from "../typeManipulation/optionate";
import RemoveFields from "../typeManipulation/removeField";
import { Styles } from "../global";

type EventType = (this: Element, ev: Event) => any;
class VirtualDOM {
  DOMRoot!: HTMLElement;
  createTree(child: childrenType, parent?: HTMLElement) {
    if (!parent) parent = this.DOMRoot;
    if (typeof child === "string") {
      const textNode = document.createTextNode(child);
      parent.append(textNode);
    } else if (child instanceof DOMElementTemplate) {
      const el = document.createElement(child.type);
      const propsArr = Object.keys(child.props) as (keyof typeof child.props)[];
      for (const attr of propsArr) {
        if (attr.slice(0, 2) === "on") {
          const event = attr.slice(2);
          const eventListener = child.props[attr] as EventType;
          el.addEventListener(event, eventListener);
        } else if (attr === "children" && child.props.children) {
          const children = child.props.children.flat();
          for (const child of children) {
            this.createTree(child, el);
          }
        } else if (attr === "style") {
          const styles = child.props[attr] as Styles;
          const stylesKeys = Object.keys(styles) as (keyof Styles)[];
          for (const style of stylesKeys) {
            const elStyles = el.style as unknown as { [key: string]: string };
            elStyles[style] = styles[style] as string;
          }
        } else {
          el.setAttribute(attr, child.props[attr] as any);
        }
        parent.append(el);
        child.DOMEl = el;
      }
    } else if (child instanceof ComponentManager) {
      child.VD = this;
      const treeTemplate = child.component.render();
      this.createTree(treeTemplate, parent);
    }
  }
  createTreeFromRoot(
    rootElement:
      | string
      | DOMElementTemplate<DOMElementType>
      | ComponentManager<Component<any, any>>,
    rootDOMElement?: HTMLElement
  ) {
    if (!rootDOMElement) {
      rootDOMElement = document.createElement("div");
      rootDOMElement.id = "decibel-root";
      document.body.append(rootDOMElement);
    }
    this.DOMRoot = rootDOMElement;
    this.createTree(rootElement);
  }
}

export default VirtualDOM;
