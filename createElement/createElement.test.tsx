import createElement, { childrenType } from "./createElement";
import Component from "../Components/Component";
import DOMElementTemplate from "../DOMElementTemplate/DOMElementTemplate";
import ComponentManager from "../Components/ComponentManager";

describe("checks without JSX", () => {
  const el = createElement("a", { href: "https://google.com" }, "Text");
  test("element type is correct", () => {
    expect(el.type).toBe("a");
  });
  test("link is correct", () => {
    expect(el.props.href).toBe("https://google.com");
  });
  test("child is a Text", () => {
    const children = el.props.children as childrenType[];
    expect(children[0]).toBe("Text");
  });

  type Props = {
    maxNumber: number;
  };
  class Button extends Component<Props> {
    constructor(props: Props) {
      super(props);
    }
    render() {
      return createElement(
        "button",
        { onclick: () => console.log(this.props.maxNumber) },
        "Button"
      );
    }
  }
  const comp = createElement(Button, { maxNumber: 1 });
  test("creates component", () => {
    expect(comp.component).toBeInstanceOf(Button);
  });
  const renderedOutput =
    comp.component.render() as DOMElementTemplate<"button">;
  test("renders button", () => {
    expect(renderedOutput.type).toBe("button");
  });
  test("props are valid", () => {
    expect(comp.component.props.maxNumber).toBe(1);
  });
});

describe("checks with jsx", () => {
  const el = (<a href="https://google.com">Text</a>) as DOMElementTemplate<"a">;
  test("element type is correct", () => {
    expect(el.type).toBe("a");
  });
  test("link is correct", () => {
    expect(el.props.href).toBe("https://google.com");
  });
  test("child is a Text", () => {
    const children = el.props.children as childrenType[];
    expect(children[0]).toBe("Text");
  });

  type Props = {
    maxNumber: number;
  };
  class Button extends Component<Props> {
    constructor(props: Props) {
      super(props);
    }
    render() {
      return createElement(
        "button",
        { onclick: () => console.log(this.props.maxNumber) },
        "Button"
      );
    }
  }
  const comp = (<Button maxNumber={1} />) as ComponentManager<Button>;
  test("creates component", () => {
    expect(comp.component).toBeInstanceOf(Button);
  });
  const renderedOutput =
    comp.component.render() as DOMElementTemplate<"button">;
  test("renders button", () => {
    expect(renderedOutput.type).toBe("button");
  });
  test("props are valid", () => {
    expect(comp.component.props.maxNumber).toBe(1);
  });
});
// TODO typings for JSX components and JSX tests
// TODO test state functionality in Components and maybe add lifecycle methods
