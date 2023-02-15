import createElement, { childrenType } from "./createElement";
import Component from "../Components/Component";

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
  class Button extends Component {
    constructor(props: { maxNumber: number }) {
      super(props);
    }
    render(): childrenType {
      return createElement(
        "button",
        { onclick: () => this.props.maxNumber },
        "Button"
      );
    }
  }
  const comp = createElement(Button, { maxNumber: 5 });
});
