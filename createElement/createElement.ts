import DOMElementTemplate from "./DOMElementTemplate/DOMElementTemplate";
import type { DOMElementPropsType } from "./DOMElementTemplate/DOMElementTemplate";
import ComponentManager from "../Components/ComponentManager";
import Component, {
  BasicPropsAndStateInterface
} from "../Components/Component";
import RemoveFields from "../typeManipulation/removeField";

export type DOMElementType = keyof HTMLElementTagNameMap;

export type childrenType =
  | DOMElementTemplate<keyof HTMLElementTagNameMap>
  | string
  | ComponentManager
  | Array<
      | DOMElementTemplate<keyof HTMLElementTagNameMap>
      | string
      | ComponentManager
    >;

type GetComponentPropsType<C extends typeof Component> = RemoveFields<
  ConstructorParameters<C>[0],
  "children"
>;
type GetComponentChildrenType<C extends typeof Component> =
  ConstructorParameters<C>[0]["children"] extends Array<childrenType>
    ? ConstructorParameters<C>[0]["children"]
    : ConstructorParameters<C>[0]["children"][];

function createElement<T extends DOMElementType>(
  type: T,
  props: JSX.IntrinsicElements[T],
  ...children: childrenType[]
): DOMElementTemplate<T>;
function createElement<C extends typeof Component>(
  type: C,
  props: GetComponentPropsType<C>,
  ...children: GetComponentChildrenType<C>
): ComponentManager;
function createElement<C extends typeof Component>(
  type: string | C,
  props: GetComponentPropsType<C> | JSX.IntrinsicElements[DOMElementType],
  ...children: childrenType[] | GetComponentChildrenType<C>
) {
  if (typeof type === "string") {
    const elementProps = {
      ...props,
      children
    } as unknown as DOMElementPropsType<DOMElementType>;
    const elType = type as DOMElementType;
    const el = new DOMElementTemplate(elType, elementProps);
    return el;
  } else {
    // ts thinks that type is an abstract class
    const cstr = type as unknown as new (
      props: BasicPropsAndStateInterface
    ) => Component;
    const component = new cstr({ ...props, children }) as Component;
    return new ComponentManager(component);
  }
}

export default createElement;
