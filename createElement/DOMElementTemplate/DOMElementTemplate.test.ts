import DOMElementTemplate from "./DOMElementTemplate";

describe("DOM element template constructor tests", () => {
  test("creates div element template", () => {
    const div = new DOMElementTemplate("div");
    expect(div).toEqual({ type: "div", props: {} });
  });

  test("creates button with onclick handler", () => {
    const onClickHandler = () => console.log(1);
    const button = new DOMElementTemplate("button", {
      onclick: onClickHandler,
      children: ["Press 1"]
    });
    expect(button).toEqual({
      type: "button",
      props: {
        onclick: onClickHandler,
        children: ["Press 1"]
      }
    });
  });

  test("creates unordered list template", () => {
    const button = new DOMElementTemplate("ul", {
      children: [
        new DOMElementTemplate("li", { children: ["1"] }),
        new DOMElementTemplate("li", { children: ["2"] })
      ]
    });
    expect(button).toEqual({
      type: "ul",
      props: {
        children: [
          new DOMElementTemplate("li", { children: ["1"] }),
          new DOMElementTemplate("li", { children: ["2"] })
        ]
      }
    });
  });
});
