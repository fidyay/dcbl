import ClassComponent from "./ClassComponent";
import createElement from "../createElement/createElement";

describe("ClassComponents are changing their state", () => {
  class Button extends ClassComponent {
    state: { value: number };
    constructor() {
      super();
      this.state = { value: 1 };
    }
    render() {
      return createElement("div", null, String(this.state.value));
    }
    increaseNumber() {
      this.setState({ value: this.state.value + 1 });
    }
    setNumber(n: number) {
      this.setState({ value: n });
    }
    setRandomNumber(max: number) {
      this.setState(() => {
        const value = Math.floor(Math.random() * max);
        return { value };
      });
    }
    async setRandomNumberAsync(max: number) {
      await this.setState(async () => {
        await new Promise((res) => {
          setTimeout(res, 100);
        });
        const value = Math.floor(Math.random() * max);
        return { value };
      });
    }
  }
  test("Button component's method 'render' works", () => {
    const button = new Button();
    expect(button.render()).toEqual({
      type: "div",
      props: {
        children: ["1"]
      }
    });
  });
  test("Button component increases its number value", () => {
    const button = new Button();
    button.increaseNumber();
    expect(button.render()).toEqual({
      type: "div",
      props: {
        children: ["2"]
      }
    });
  });
  test("Button component sets value to specified", () => {
    const button = new Button();
    button.setNumber(5);
    expect(button.render()).toEqual({
      type: "div",
      props: {
        children: ["5"]
      }
    });
  });
  test("Button component's setState works with functions", () => {
    const button = new Button();
    const number = 7;
    button.setRandomNumber(number);
    expect(Number(button.render().props.children[0])).toBeLessThan(number);
  });
  test("Button component's setState works with async functions", async () => {
    const button = new Button();
    const number = 5;
    await button.setRandomNumberAsync(number);
    expect(Number(button.render().props.children[0])).toBeLessThan(number);
  });
});
