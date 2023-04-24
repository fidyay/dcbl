import ComponentManager from "../Components/ComponentManager";
import DOMElementTemplate, {
  DOMElementPropsType
} from "../DOMElementTemplate/DOMElementTemplate";
import { DOMElementType } from "../createElement/createElement";
import Component from "../Components/Component";
import { Styles } from "../global";

type EventType = (this: Element, ev: Event) => any;

export type TreeType =
  | string
  | DOMElementTemplate<DOMElementType>
  | ComponentManager<Component<any, any>>
  | null;

/** Class of the virtual dom. */
class VirtualDOM {
  /** The root of the UI controlled by instance of a {@link VirtualDOM} class. It is set when the virtual dom is created. */
  DOMRoot!: HTMLElement;
  /** Runs {@link Component.componentWillUnmount | componentWillUnmount} methods of all components inside the tree.
   * @param tree - element tree.
   */
  runComponentWillUnmount(tree: TreeType) {
    if (tree instanceof ComponentManager) {
      tree.component.componentWillUnmount();
      this.runComponentWillUnmount(tree.componentChildTree);
    } else if (tree instanceof DOMElementTemplate) {
      const children = tree.props.children?.flat();
      for (const child of children as TreeType[]) {
        this.runComponentWillUnmount(child);
      }
    }
  }
  /** Checks props of an element. If element is an instance of {@link DOMElementTemplate} class, it changes the attributes of a DOM element.
   * @param oldProps - old props object.
   * @param newProps - new props object.
   * @param oldElementTemplate - optianal parameter of an old {@link DOMElementTemplate | DOMElementTemplate's} instance, which stores the link to DOM element.
   * @returns - true if props were changed, false otherwise.
   */
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
              /* 
                According to MDN documentation a style declaration is reset by setting it to null or an empty string,
                but typescript does not allow it in either way.
              */
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              oldElementTemplate.DOMEl.style[style] = null;
            } else {
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
            } else if (attr !== "children") {
              oldElementTemplate.DOMEl.removeAttribute(attr);
            }
          }
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
            } else if (attr !== "children") {
              const attrName = attr === "className" ? "class" : attr;
              oldElementTemplate.DOMEl.setAttribute(attrName, newProps[attr]);
            }
          }
        }
      }
    }
    return changed;
  }
  /**
   * Changes the UI to the new tree.
   * @param oldTree - the old tree's element.
   * @param newTree - the new tree's element.
   * @param parent - the parent DOM element.
   * @param childIndex - index in childNodes of parent DOM element.
   */
  changeTree(
    oldTree: TreeType,
    newTree: TreeType,
    parent: HTMLElement,
    childIndex?: number
  ) {
    // node replacement
    if (
      typeof oldTree !== typeof newTree ||
      (oldTree === null && newTree !== null) ||
      (oldTree !== null && newTree === null) ||
      (oldTree === "" && newTree !== "") ||
      (oldTree !== "" && newTree === "") ||
      (oldTree instanceof DOMElementTemplate &&
        newTree instanceof ComponentManager) ||
      (oldTree instanceof ComponentManager &&
        newTree instanceof DOMElementTemplate)
    ) {
      if (oldTree instanceof ComponentManager) {
        this.runComponentWillUnmount(oldTree);
      }
      this.createTree(newTree, parent, childIndex);
    } else if (typeof oldTree === "string" && typeof newTree === "string") {
      if (oldTree !== newTree) {
        this.createTree(newTree, parent, childIndex);
      }
    } else if (typeof oldTree === "object" && typeof newTree === "object") {
      if (
        oldTree instanceof DOMElementTemplate &&
        newTree instanceof DOMElementTemplate
      ) {
        newTree.DOMEl = oldTree.DOMEl;
        if (oldTree.type !== newTree.type) {
          this.createTree(newTree, parent, childIndex);
        } else {
          // mutating dom elements
          this.checkProps(oldTree.props, newTree.props, oldTree);
          // handling children
          let oldChildren: TreeType[] | null = null;
          let newChildren: TreeType[] | null = null;
          if (oldTree.props.children)
            oldChildren = oldTree.props.children.flat();
          if (newTree.props.children)
            newChildren = newTree.props.children.flat();
          let childrenLength = 0;
          if (oldChildren || newChildren) {
            if (!oldChildren && newChildren) {
              childrenLength = newChildren.length;
            } else if (oldChildren && !newChildren) {
              childrenLength = oldChildren.length;
            } else if (oldChildren && newChildren) {
              if (oldChildren.length >= newChildren.length)
                childrenLength = oldChildren.length;
              else childrenLength = newChildren.length;
            }
            for (let i = 0, childIndex = 0; i < childrenLength; i++) {
              const oldcChild = (oldChildren as TreeType[])[i] || null;
              const newChild = (newChildren as TreeType[])[i] || null;
              this.changeTree(oldcChild, newChild, oldTree.DOMEl, childIndex);
              if (oldcChild) childIndex++;
            }
          }
        }
      } else if (
        oldTree instanceof ComponentManager &&
        newTree instanceof ComponentManager
      ) {
        const oldComponent = oldTree.component;
        const newComponent = newTree.component;
        if (oldComponent.constructor !== newComponent.constructor) {
          this.runComponentWillUnmount(oldTree);
          this.createTree(newTree, parent, childIndex);
        } else {
          newComponent.state = oldComponent.state;
          newTree.componentChildTree = oldTree.componentChildTree;
          if (
            oldComponent.shouldComponentUpdate(
              oldTree.component.props,
              newTree.component.props
            )
          ) {
            const newChildTree = newComponent.render();
            newTree.componentChildTree = newChildTree;
            this.changeTree(
              oldTree.componentChildTree,
              newTree.componentChildTree,
              parent,
              childIndex
            );
            newComponent.componentDidUpdate();
          }
        }
      }
    }
  }
  /** Creates new DOM element tree and pushes inside to parent DOM element.
   * @param child - the tree element.
   * @param parent - the parent element. If it's not set, the {@link VirtualDOM.DOMRoot | DOMRoot} is used.
   * @param childIndex - index in childNodes of parent element.
   */
  createTree(child: TreeType, parent?: HTMLElement, childIndex?: number) {
    if (!parent) parent = this.DOMRoot;
    if (!Number.isInteger(childIndex)) {
      childIndex = parent.childNodes.length;
    }
    const elInPlace: ChildNode | undefined =
      parent.childNodes[childIndex as number];
    if (child === null) {
      if (elInPlace) {
        elInPlace.remove();
      }
    } else if (typeof child === "string") {
      const textNode = document.createTextNode(child);
      if (elInPlace) {
        parent.replaceChild(textNode, elInPlace);
      } else {
        parent.append(textNode);
      }
    } else if (child instanceof DOMElementTemplate) {
      child.indexInParent = childIndex as number;
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
          const attrName = attr === "className" ? "class" : attr;
          el.setAttribute(attrName, child.props[attr] as any);
        }
        if (elInPlace) {
          parent.replaceChild(el, elInPlace);
        } else {
          parent.append(el);
        }
        child.DOMEl = el;
      }
    } else if (child instanceof ComponentManager) {
      child.indexInParent = childIndex as number;
      child.VD = this;
      const treeTemplate = child.component.render();
      child.componentChildTree = treeTemplate;
      this.createTree(treeTemplate, parent, childIndex);
      child.component.componentDidMount();
    }
  }
  /**
   * Creates virtual dom tree from given tree element.
   * @param rootElement - root element.
   * @param rootDOMElement - root DOM element, saves it to {@link VirtualDOM.DOMRoot | DOMRoot}. If it's not provided, creates div with an id attribute set to "decibel-root".
   */
  createTreeFromRoot(rootElement: TreeType, rootDOMElement?: HTMLElement) {
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
