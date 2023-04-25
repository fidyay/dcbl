import DOMElementTemplate from "../DOMElementTemplate/DOMElementTemplate";
import type { DOMElementPropsType } from "../DOMElementTemplate/DOMElementTemplate";
import ComponentManager from "../Components/ComponentManager";
import Component from "../Components/Component";
import RemoveFields from "../typeManipulation/removeField";

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

type GetComponentPropsType<C extends typeof Component<any, any>> = RemoveFields<
  ConstructorParameters<C>[0],
  "children"
>;
type GetComponentChildrenType<C extends typeof Component<any, any>> =
  "children" extends keyof ConstructorParameters<C>[0]
    ? ConstructorParameters<C>[0]["children"] extends Array<childrenType>
      ? ConstructorParameters<C>[0]["children"]
      : [ConstructorParameters<C>[0]["children"]]
    : [];

/**
 * Creates an element of virtual dom
 * @param el - tag name.
 * @param props - DOM element's attributes.
 * @param children - children of an element.
 * @returns - {@link DOMElementTemplate | DOMElementTemplate's} instance.
 */
function createElement<E extends DOMElementType>(
  el: E,
  props: JSX.IntrinsicElements[E],
  ...children: childrenType[]
): DOMElementTemplate<E>;
/**
 * Creates a component manager.
 * @param comp - component's class.
 * @param props - component's props.
 * @param children - children of the component.
 * @returns - {@link ComponentManager | ComponentManager's} instance.
 */
function createElement<C extends typeof Component<any, any>>(
  comp: C,
  props: GetComponentPropsType<C>,
  ...children: GetComponentChildrenType<C>
): ComponentManager<InstanceType<C>>;
function createElement(
  type: DOMElementType | typeof Component,
  props:
    | JSX.IntrinsicElements[DOMElementType]
    | GetComponentPropsType<typeof Component<any, any>>,
  ...children:
    | childrenType[]
    | GetComponentChildrenType<typeof Component<any, any>>
) {
  if (typeof type === "string") {
    const domElProps = {
      ...props,
      children
    } as DOMElementPropsType<DOMElementType>;
    const el = new DOMElementTemplate(type, domElProps);
    return el;
  } else {
    const compProps = { ...props, children } as ConstructorParameters<
      typeof Component
    >[0];
    const constr = type as new (
      props: ConstructorParameters<typeof Component<any, any>>[0]
    ) => Component;
    const comp = new constr(compProps);
    const cm = new ComponentManager(comp);
    comp.manager = cm;
    return cm;
  }
}

export default createElement;
