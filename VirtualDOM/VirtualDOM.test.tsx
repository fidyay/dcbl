import VirtualDOM, { TreeType } from "./VirtualDOM";
import Component from "../Components/Component";
import createElement from "../createElement/createElement";
import ComponentManager from "../Components/ComponentManager";

class List extends Component {
  render() {
    return (
      <ul>
        {["1", "2", "3"].map((str) => (
          <li>{str}</li>
        ))}
      </ul>
    );
  }
}

class Button extends Component {
  props!: { onClickListener: () => void };
  constructor(props: { onClickListener: () => void }) {
    super(props);
  }
  render() {
    return (
      <button style={{ color: "#fff" }} onclick={this.props.onClickListener}>
        +1
      </button>
    );
  }
}

class Link extends Component<any, { visited: boolean }> {
  constructor() {
    super({});
    this.state = {
      visited: false
    };
  }
  render() {
    return (
      <a
        className={this.state.visited ? "link_visited" : "link_unvisited"}
        onclick={this.onClickListener}
        disabled={this.state.visited}
        style={{
          color: this.state.visited ? "#ccc" : "#fff",
          display: "block"
        }}
      >
        Link to somewhere
      </a>
    );
  }
  async onClickListener() {
    await this.setState({ visited: true });
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
  async onClickListener() {
    await this.setState({ clicks: this.state.clicks + 1 });
  }
}

class Todo extends Component<{
  children: number;
  completeTodo: () => Promise<any>;
}> {
  constructor(props: { children: number; completeTodo: () => Promise<any> }) {
    super(props);
  }
  render() {
    return (
      <li onclick={this.props.completeTodo}>{String(this.props.children)}</li>
    );
  }
}

class TodoList extends Component<any, { todos: ComponentManager<Todo>[] }> {
  constructor() {
    super({});
    const todos: ComponentManager<Todo>[] = [];
    for (let i = 0; i < 4; i++) {
      const todo = (
        <Todo
          completeTodo={async () => {
            const newArr = [...this.state.todos];
            newArr.splice(i, 1);
            await this.setState({ todos: newArr });
          }}
        >
          {i}
        </Todo>
      ) as ComponentManager<Todo>;
      todos.push(todo);
    }
    this.state = { todos };
  }
  render() {
    return <ul>{this.state.todos}</ul>;
  }
}

class ClickToWin extends Component<any, { won: boolean }> {
  constructor() {
    super({});
    this.state.won = false;
  }
  render() {
    return (
      <div>
        <header>Click to win</header>
        {this.state.won ? (
          <span>You won</span>
        ) : (
          <button onclick={this.win}>Win!</button>
        )}
        <footer>Lorem ipsum</footer>
      </div>
    );
  }
  async win() {
    await this.setState({ won: true });
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
    vd.createTreeFromRoot(<Clicker />, document.body);
    expect(document.body).toMatchSnapshot();
  });
  test("inserts array of elements", () => {
    vd.createTreeFromRoot(<List />, document.body);
    expect(document.body).toMatchSnapshot();
  });
});

describe("testing tree changing", () => {
  let vd: VirtualDOM;
  beforeEach(() => (vd = new VirtualDOM()));
  afterEach(() => (document.body.innerHTML = ""));
  test("changes text in DOM", async () => {
    const cm = (<Clicker />) as ComponentManager<Clicker>;
    vd.createTreeFromRoot(cm);
    expect(document.body).toMatchSnapshot();
    await cm.component.onClickListener();
    expect(document.body).toMatchSnapshot();
    await cm.component.onClickListener();
    expect(document.body).toMatchSnapshot();
  });
  test("changes in props are checked", () => {
    const props1 = {
      a: 1,
      b: 2
    };
    const props2 = {
      a: 1,
      b: 3
    };
    expect(vd.checkProps(props1, props2)).toBe(true);
    const props3 = {
      a: 1,
      b: 2
    };
    const props4 = {
      a: 1,
      b: 2
    };
    expect(vd.checkProps(props3, props4)).toBe(false);
  });
  test("VD changes the attributes", async () => {
    const cm = (<Link />) as ComponentManager<Clicker>;
    vd.createTreeFromRoot(cm);
    expect(document.body).toMatchSnapshot();
    await cm.component.onClickListener();
    expect(document.body).toMatchSnapshot();
  });
  test("VD replaces the element", async () => {
    const cm = (<ClickToWin />) as ComponentManager<ClickToWin>;
    vd.createTreeFromRoot(cm);
    expect(document.body).toMatchSnapshot();
    await cm.component.win();
    expect(document.body).toMatchSnapshot();
  });
  test("VD deletes the elements", async () => {
    const cm = (<TodoList />) as ComponentManager<TodoList>;
    vd.createTreeFromRoot(cm);
    expect(document.body).toMatchSnapshot();
    const todoLast = cm.component.state.todos[3];
    await todoLast.component.props.completeTodo();
    expect(document.body).toMatchSnapshot();
    const todoSecond = cm.component.state.todos[1];
    await todoSecond.component.props.completeTodo();
    expect(document.body).toMatchSnapshot();
    const todoFirst = cm.component.state.todos[0];
    await todoFirst.component.props.completeTodo();
    expect(document.body).toMatchSnapshot();
  });
});
