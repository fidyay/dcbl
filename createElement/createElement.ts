import DOMElementTemplate from "./DOMElementTemplate/DOMElementTemplate";
import type RemoveField from "../typeManipulation/removeField";
import type {
  DOMElementType,
  DOMElementPropsType
} from "./DOMElementTemplate/DOMElementTemplate";

export type childrenType =
  | DOMElementTemplate<keyof HTMLElementTagNameMap>
  | string;

function createElement<T extends DOMElementType>(
  type: T,
  props: RemoveField<DOMElementPropsType<T>, "children">,
  children: childrenType[] = []
): DOMElementTemplate<T> {
  // ts cannot transfer type RemoveField<DOMElementPropsType<T>, "children"> to DOMElementPropsType<T>
  const elementProps = {
    ...props,
    children
  } as unknown as DOMElementPropsType<T>;
  const el = new DOMElementTemplate(type, elementProps);
  return el;
}

export default createElement;
