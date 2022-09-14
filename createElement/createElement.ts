import ClassComponent from "../ClassComponent/ClassComponent";
export interface ParametersProps {
  [prop: string]: unknown;
}

interface ElementProps {
  children: Child[];
  [prop: string]: unknown;
}

export interface DecibelElement {
  type: string;
  props: ElementProps;
}

type Child = DecibelElement | string;

const createElement = (
  type: string | (new (props: ElementProps) => ClassComponent),
  props: ParametersProps | null,
  ...children: Child[]
): DecibelElement | ClassComponent => {
  const elementProps = props
    ? { ...props, children }
    : ({ children } as ElementProps);
  if (typeof type === "string") {
    return {
      type,
      props: elementProps
    };
  }
  return new type(elementProps);
};

export default createElement;
