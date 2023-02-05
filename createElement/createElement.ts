import DOMElementTemplate from "./DOMElementTemplate/DOMElementTemplate";
import type { DOMElementPropsType } from "./DOMElementTemplate/DOMElementTemplate";

export type DOMElementType = keyof HTMLElementTagNameMap;

export type childrenType =
  | DOMElementTemplate<keyof HTMLElementTagNameMap>
  | string;

function createElement<T extends DOMElementType>(
  type: T,
  props: JSX.IntrinsicElements[T],
  children: childrenType[] = []
): DOMElementTemplate<T> {
  // ts cannot transfer type RemoveFields<DOMElementPropsType<T>, "children"> to DOMElementPropsType<T>
  const elementProps = {
    ...props,
    children
  } as unknown as DOMElementPropsType<T>;
  const el = new DOMElementTemplate(type, elementProps);
  return el;
}

export default createElement;
