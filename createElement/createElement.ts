import DOMElementTemplate from "../DOMElementTemplate/DOMElementTemplate";
import type { DOMElementPropsType } from "../DOMElementTemplate/DOMElementTemplate";
import ComponentManager from "../Components/ComponentManager";
import Component from "../Components/Component";
import RemoveFields from "../typeManipulation/removeField";

export type DOMElementType = keyof HTMLElementTagNameMap;

export type childrenType =
  | DOMElementTemplate<DOMElementType>
  | string
  | ComponentManager<Component>
  | Array<
      DOMElementTemplate<DOMElementType> | string | ComponentManager<Component>
    >;

type GetComponentPropsType<C extends typeof Component> = RemoveFields<
  ConstructorParameters<C>[0],
  "children"
>;
type GetComponentChildrenType<C extends typeof Component> =
  "children" extends keyof ConstructorParameters<C>[0]
    ? ConstructorParameters<C>[0]["children"] extends Array<childrenType>
      ? ConstructorParameters<C>[0]["children"]
      : [ConstructorParameters<C>[0]["children"]]
    : [];

function createElement<E extends DOMElementType>(
  el: E,
  props: JSX.IntrinsicElements[E],
  ...children: childrenType[]
): DOMElementTemplate<E>;
function createElement<C extends typeof Component<any, any>>(
  comp: C,
  props: GetComponentPropsType<C>,
  ...children: GetComponentChildrenType<C>
): ComponentManager<InstanceType<C>>;
function createElement(
  type: DOMElementType | typeof Component,
  props:
    | JSX.IntrinsicElements[DOMElementType]
    | GetComponentPropsType<typeof Component>,
  ...children: childrenType[] | GetComponentChildrenType<typeof Component>
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
      props: ConstructorParameters<typeof Component>[0]
    ) => Component;
    const comp = new constr(compProps);
    const cm = new ComponentManager(comp);
    comp.manager = cm;
    return cm;
  }
}

export default createElement;
