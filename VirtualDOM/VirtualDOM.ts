import ComponentManager from "../Components/ComponentManager";
import DOMElementTemplate, {
  DOMElementPropsType
} from "../DOMElementTemplate/DOMElementTemplate";
import { childrenType, DOMElementType } from "../createElement/createElement";
import Component from "../Components/Component";
import { Styles } from "../global";

type EventType = (this: Element, ev: Event) => any;
class VirtualDOM {
  DOMRoot!: HTMLElement;
  checkProps(
    oldProps: any,
    newProps: any,
    oldElementTemplate?: DOMElementTemplate<DOMElementType>
  ) {
    const oldPropsKeys = Object.keys(oldProps);
    const newPropsKeys = Object.keys(newProps);
    const allPropsKeys = new Set([...oldPropsKeys, ...newPropsKeys]);
    let changed = false;
    for (const prop of allPropsKeys) {
      if (prop === "style" && oldElementTemplate) {
        const oldStyles = oldProps.style;
        const newStyles = newProps.style;
        const allStyles = new Set([
          ...Object.keys(oldStyles),
          ...Object.keys(newStyles)
        ]) as Set<keyof Styles>;
        for (const style of allStyles) {
          if (!Object.is(newStyles[style], oldStyles[style])) {
            if (newStyles[style] === undefined && oldStyles[style]) {
              delete oldStyles[style];
              /* 
                According to MDN documentation a style declaration is reset by setting it to null or an empty string,
                but typescript does not allow it in either way.
              */
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              oldElementTemplate.DOMEl.style[style] = null;
            } else {
              oldStyles[style] = newStyles[style];
              oldElementTemplate.DOMEl.style[style] = newStyles[style];
            }
          }
        }
      } else if (!Object.is(newProps[prop], oldProps[prop])) {
        changed = true;
        // deleting props
        if (newProps[prop] === undefined && oldProps[prop]) {
          if (oldElementTemplate) {
            const attr = prop as keyof DOMElementPropsType<DOMElementType>;
            if (attr.slice(0, 2) === "on") {
              const event = attr.slice(2) as keyof HTMLElementEventMap;
              const eventListener = oldProps[attr] as EventType;
              oldElementTemplate.DOMEl.removeEventListener(
                event,
                eventListener
              );
            } else {
              oldElementTemplate.DOMEl.removeAttribute(attr);
            }
          }
          delete oldProps[prop];
        } else {
          // setting other values
          if (oldElementTemplate) {
            const attr = prop as keyof DOMElementPropsType<DOMElementType>;
            if (attr.slice(0, 2) === "on") {
              const event = attr.slice(2) as keyof HTMLElementEventMap;
              const oldEventListener = oldProps[attr] as EventType;
              const newEventListener = newProps[attr] as EventType;
              oldElementTemplate.DOMEl.removeEventListener(
                event,
                oldEventListener
              );
              oldElementTemplate.DOMEl.addEventListener(
                event,
                newEventListener
              );
            } else {
              oldElementTemplate.DOMEl.setAttribute(attr, newProps[attr]);
            }
          }
          oldProps[prop] = newProps[prop];
        }
      }
    }
    return changed;
  }
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
