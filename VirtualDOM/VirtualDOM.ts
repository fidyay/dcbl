import ComponentManager from "../Components/ComponentManager";
import DOMElementTemplate, {
  DOMElementPropsType
} from "../DOMElementTemplate/DOMElementTemplate";
import { DOMElementType } from "../createElement/createElement";
import Component from "../Components/Component";
import type { Styles } from "../global.d";

type EventType = (this: Element, ev: Event) => any;

export type TreeType =
  | string
  | DOMElementTemplate<DOMElementType>
  | ComponentManager<Component<any, any>>
  | null;

/**
 * Class representing the virtual DOM.
 * Manages and updates the UI by comparing virtual DOM trees.
 */
class VirtualDOM {
  /** The root of the UI controlled by the virtual DOM instance. */
  public DOMRoot!: HTMLElement;

  /**
   * Recursively calls `componentWillUnmount` on all components in the tree.
   * @param tree - The element tree to traverse.
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

  /**
   * Compares and updates the DOM element's props, handling attributes and styles.
   * @param oldProps - Previous props of the element.
   * @param newProps - New props of the element.
   * @param oldElementTemplate - Optional reference to the old DOM element template.
   * @returns `true` if props were changed, `false` otherwise.
   */
  checkProps(
    oldProps: any,
    newProps: any,
    oldElementTemplate?: DOMElementTemplate<DOMElementType>
  ): boolean {
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

        // Handle style changes
        for (const style of allStyles) {
          if (!Object.is(newStyles[style], oldStyles[style])) {
            if (newStyles[style] === undefined && oldStyles[style]) {
              oldElementTemplate.DOMEl.style[style as any] = ""; // Reset style
            } else {
              oldElementTemplate.DOMEl.style[style as any] = newStyles[style];
            }
          }
        }
      } else if (!Object.is(newProps[prop], oldProps[prop])) {
        changed = true;

        // Handle attribute/event prop changes
        if (
          newProps[prop] === undefined &&
          oldProps[prop] &&
          oldElementTemplate
        ) {
          const attr = prop as keyof DOMElementPropsType<DOMElementType>;
          if (attr.startsWith("on")) {
            const event = attr
              .slice(2)
              .toLowerCase() as keyof HTMLElementEventMap;
            const eventListener = oldProps[attr] as EventType;
            oldElementTemplate.DOMEl.removeEventListener(event, eventListener);
          } else if (attr !== "children") {
            oldElementTemplate.DOMEl.removeAttribute(attr);
          }
        } else if (oldElementTemplate) {
          const attr = prop as keyof DOMElementPropsType<DOMElementType>;
          if (attr.startsWith("on")) {
            const event = attr
              .slice(2)
              .toLowerCase() as keyof HTMLElementEventMap;
            const oldEventListener = oldProps[attr] as EventType;
            const newEventListener = newProps[attr] as EventType;
            oldElementTemplate.DOMEl.removeEventListener(
              event,
              oldEventListener
            );
            oldElementTemplate.DOMEl.addEventListener(event, newEventListener);
          } else if (attr !== "children") {
            const attrName = attr === "className" ? "class" : attr;
            oldElementTemplate.DOMEl.setAttribute(attrName, newProps[attr]);
          }
        }
      }
    }

    return changed;
  }

  /**
   * Updates the UI by comparing and updating the old and new virtual DOM trees.
   * @param oldTree - The old virtual DOM tree.
   * @param newTree - The new virtual DOM tree.
   * @param parent - The parent DOM element.
   * @param childIndex - Optional index in the parent's child nodes.
   */
  changeTree(
    oldTree: TreeType,
    newTree: TreeType,
    parent: HTMLElement,
    childIndex?: number
  ) {
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
          this.checkProps(oldTree.props, newTree.props, oldTree);
          this.handleChildren(oldTree, newTree);
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

  /**
   * Handles updating or recreating child elements when comparing virtual DOM trees.
   * @param oldTree - The old DOM element template.
   * @param newTree - The new DOM element template.
   */
  private handleChildren(
    oldTree: DOMElementTemplate<DOMElementType>,
    newTree: DOMElementTemplate<DOMElementType>
  ) {
    const oldChildren = oldTree.props.children?.flat() || [];
    const newChildren = newTree.props.children?.flat() || [];
    const maxLength = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0, childIndex = 0; i < maxLength; i++) {
      const oldChild = oldChildren[i] || null;
      const newChild = newChildren[i] || null;
      this.changeTree(oldChild, newChild, oldTree.DOMEl, childIndex);
      if (oldChild !== null && newChild !== null) {
        childIndex++;
      }
    }
  }

  /**
   * Creates a new DOM element tree and appends it to the parent element.
   * @param child - The tree element to create.
   * @param parent - The parent DOM element.
   * @param childIndex - Optional index in the parent's child nodes.
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
        if (attr.startsWith("on")) {
          const event = attr.slice(2).toLowerCase();
          const eventListener = child.props[attr] as EventType;
          el.addEventListener(event, eventListener);
        } else if (attr === "children" && child.props.children) {
          const children = child.props.children.flat();
          for (const childEl of children) {
            this.createTree(childEl, el);
          }
        } else if (attr === "style") {
          const styles = child.props[attr] as Styles;
          for (const style in styles) {
            (el.style as any)[style] = styles[style as keyof Styles];
          }
        } else {
          const attrName = attr === "className" ? "class" : attr;
          el.setAttribute(attrName, child.props[attr] as string);
        }
      }

      if (elInPlace) {
        parent.replaceChild(el, elInPlace);
      } else {
        parent.append(el);
      }

      child.DOMEl = el;
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
   * Creates a virtual DOM tree from the root element.
   * @param rootElement - The root virtual DOM element.
   * @param rootDOMElement - The root DOM element to attach to, creates a div with id "decibel-root" if not provided.
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
