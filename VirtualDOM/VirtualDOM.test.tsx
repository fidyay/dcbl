import VirtualDOM from "./VirtualDOM";
import Component from "../Components/Component";
import createElement from "../createElement/createElement";

class Button extends Component {
  props!: { onClickListener: () => void };
  constructor(props: { onClickListener: () => void }) {
    super(props);
  }
  render() {
    return <button onclick={this.props.onClickListener}>+1</button>;
  }
}

class Clicker extends Component {
  state: { clicks: number };
  constructor() {
    super({});
    this.state = { clicks: 0 };
  }
  render() {
    return (
      <div>
        Clicks: {String(this.state.clicks)}
        <Button onClickListener={this.onClickListener} />
      </div>
    );
  }
  onClickListener() {
    this.setState({ clicks: this.state.clicks + 1 });
  }
}

const link = <a href="https://google.com">Google</a>;

const textNode = "sample text";

describe("testing tree creation", () => {
  let vd: VirtualDOM;
  beforeEach(() => (vd = new VirtualDOM()));
  afterEach(() => (document.body.innerHTML = ""));
  test("creates text node", () => {
    vd.createTreeFromRoot(textNode);
    expect(document.body).toMatchSnapshot();
  });
  test("creates anchor element", () => {
    vd.createTreeFromRoot(link);
    expect(document.body).toMatchSnapshot();
  });
  test("inserts component tree", () => {
    vd.createTreeFromRoot(<Clicker />);
    expect(document.body).toMatchSnapshot();
  });
});
