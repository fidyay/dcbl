// Import dependencies
import DOMElementTemplate from "../DOMElementTemplate/DOMElementTemplate";
import type { DOMElementPropsType } from "../DOMElementTemplate/DOMElementTemplate";
import ComponentManager from "../Components/ComponentManager";
import Component from "../Components/Component";
import RemoveFields from "../typeManipulation/removeField";

// Define types
export type DOMElementType = keyof HTMLElementTagNameMap;

export type childrenType =
  | DOMElementTemplate<DOMElementType>
  | string
  | ComponentManager<Component<any, any>>
  | null
  | Array<
      | DOMElementTemplate<DOMElementType>
      | string
      | ComponentManager<Component<any, any>>
      | null
    >;

// Utility type to get component props, excluding 'children'
type GetComponentPropsType<C extends typeof Component<any, any>> = RemoveFields<
  ConstructorParameters<C>[0],
  "children"
>;

// Utility type to extract children types from the component's props
type GetComponentChildrenType<C extends typeof Component<any, any>> =
  "children" extends keyof ConstructorParameters<C>[0]
    ? ConstructorParameters<C>[0]["children"] extends Array<childrenType>
      ? ConstructorParameters<C>[0]["children"]
      : [ConstructorParameters<C>[0]["children"]]
    : [];

/**
 * Function overload: Create an element for a DOM element.
 * @param el - Tag name (e.g., 'div', 'span').
 * @param props - Attributes of the DOM element.
 * @param children - Children of the element.
 * @returns - A DOMElementTemplate instance.
 */
function createElement<E extends DOMElementType>(
  el: E,
  props: JSX.IntrinsicElements[E],
  ...children: childrenType[]
): DOMElementTemplate<E>;

/**
 * Function overload: Create a component manager for a component.
 * @param comp - Component's class.
 * @param props - Component's props.
 * @param children - Children of the component.
 * @returns - A ComponentManager instance.
 */
function createElement<C extends typeof Component<any, any>>(
  comp: C,
  props: GetComponentPropsType<C>,
  ...children: GetComponentChildrenType<C>
): ComponentManager<InstanceType<C>>;

/**
 * Main createElement function: Handles both DOM elements and Components.
 * @param type - Either a DOM element type or a Component class.
 * @param props - Props for the DOM element or Component.
 * @param children - Children for the DOM element or Component.
 * @returns - Either a DOMElementTemplate or a ComponentManager instance.
 */
function createElement(
  type: DOMElementType | typeof Component,
  props:
    | JSX.IntrinsicElements[DOMElementType]
    | GetComponentPropsType<typeof Component<any, any>>,
  ...children:
    | childrenType[]
    | GetComponentChildrenType<typeof Component<any, any>>
) {
  // Handle creation of DOM elements
  if (typeof type === "string") {
    const domElProps = {
      ...props,
      children
    } as DOMElementPropsType<DOMElementType>;

    return new DOMElementTemplate(type, domElProps);
  }
  // Handle creation of Component instances
  else {
    const compProps = { ...props, children } as ConstructorParameters<
      typeof Component
    >[0];
    const ComponentConstructor = type as new (
      props: ConstructorParameters<typeof Component<any, any>>[0]
    ) => Component;

    const componentInstance = new ComponentConstructor(compProps);
    const componentManager = new ComponentManager(componentInstance);

    componentInstance.manager = componentManager;
    return componentManager;
  }
}

export default createElement;

/* what was refactored
Key Changes:
Commenting: Added more specific comments to explain what each section does.
Type Usage: Extracted common logic for getting Component props and children into named types for clarity.
Overloading Clarity: The two createElement overloads clearly define handling for DOM elements vs components, improving readability.
This refactoring enhances clarity, organization, and scalability of the code.
*/
