import Component from "./Component";
import ComponentManager from "./ComponentManager";
import createElement from "../createElement/createElement";
import DOMElementTemplate from "../DOMElementTemplate/DOMElementTemplate";

describe("testing components state implementation", () => {
  interface Props {
    href: string;
    visits: number;
  }
  interface State {
    visits: number;
  }
  let checking: "object" | "function" | "async" | undefined;
  class Link extends Component {
    state: State;
    props!: Props;
    constructor(props: Props) {
      super(props);
      this.state = {
        visits: props.visits
      };
    }
    render() {
      const href = this.props.href as string;
      return createElement(
        "a",
        {
          href,
          onclick: () => {
            if (checking === "object") {
              this.objectChange();
            } else if (checking === "function") {
              this.functionChange();
            }
          }
        },
        String(this.state.visits)
      );
    }
    objectChange() {
      this.setState({ visits: this.state.visits + 1 });
    }
    functionChange() {
      const change = (state: State, props: Props): State => {
        const visits = state.visits + 1;
        return { visits };
      };
      this.setState(change);
    }
    async asyncChange() {
      const change = async (state: State, props: Props): Promise<State> => {
        await new Promise((res, rej) => {
          setTimeout(res, 100);
        });
        const visits = state.visits + 1;
        return { visits };
      };
      await this.setState(change);
    }
  }
  let link: Link;
  let cm: ComponentManager<Link>;
  let el: DOMElementTemplate<"a">;
  let click: () => void;
  beforeEach(() => {
    link = new Link({ href: "https://google.com", visits: 0 });
    cm = new ComponentManager(link);
    link.manager = cm;
    el = link.render();
    click = el.props.onclick as () => void;
    checking = undefined;
  });
  test("updates state synchronously with object passed", () => {
    checking = "object";
    click();
    expect(link.state.visits).toBe(1);
  });
  test("updates state synchronously with function passed", () => {
    checking = "function";
    click();
    expect(link.state.visits).toBe(1);
  });
  test("updates state asynchronously with async function passed", async () => {
    checking = "async";
    await link.asyncChange();
    expect(link.state.visits).toBe(1);
  });
});
