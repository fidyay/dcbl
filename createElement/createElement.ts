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
  type: string,
  props: ParametersProps | null,
  ...children: Child[]
): DecibelElement => {
  const elementProps = props
    ? { ...props, children }
    : ({ children } as ElementProps);
  return {
    type,
    props: elementProps
  };
};

export default createElement;
