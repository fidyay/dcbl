import VirtualDOM, { TreeType } from "./VirtualDOM";
import Component from "../Components/Component";
import createElement, { childrenType } from "../createElement/createElement";
import ComponentManager from "../Components/ComponentManager";
import DOMElementTemplate from "../DOMElementTemplate/DOMElementTemplate";

// making mock functions

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

class AddContent extends Component {
  render() {
    return <p>Add content.</p>;
  }
}
class Addvertisement extends Component<
  { children: ComponentManager<AddContent> },
  { seen: boolean }
> {
  constructor(props: { children: ComponentManager<AddContent> }) {
    super(props);
    this.state.seen = false;
  }
  render() {
    return (
      <div>
        {this.state.seen ? <p>You seen this add.</p> : this.props.children}
      </div>
    );
  }

  async seeAdd() {
    await this.setState({ seen: true });
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

describe("lifecycle methods", () => {
  let vd: VirtualDOM;
  beforeEach(() => (vd = new VirtualDOM()));
  afterEach(() => (document.body.innerHTML = ""));
  test("component did mount listener", () => {
    const cm = (<Clicker />) as ComponentManager<Clicker>;
    const mock = jest.spyOn(cm.component, "componentDidMount");
    vd.createTreeFromRoot(cm);
    expect(mock).toBeCalledTimes(1);
  });
  test("component checks props", async () => {
    const root = (<Clicker />) as ComponentManager<Clicker>;
    vd.createTreeFromRoot(root);
    const button = (
      (root.componentChildTree as DOMElementTemplate<"div">).props
        .children as childrenType[]
    )[2] as ComponentManager<Button>;
    const mock = jest.spyOn(button.component, "shouldComponentUpdate");
    await root.component.onClickListener();
    expect(mock).toBeCalledTimes(1);
  });
  test("components run update listener", async () => {
    const root = (<Clicker />) as ComponentManager<Clicker>;
    vd.createTreeFromRoot(root);
    const mock = jest.spyOn(Component.prototype, "componentDidUpdate");
    await root.component.onClickListener();
    expect(mock).toBeCalledTimes(2);
  });
  test("components run unmount listener", async () => {
    const root = (<TodoList />) as ComponentManager<TodoList>;
    vd.createTreeFromRoot(root);
    const todoLast = root.component.state.todos[3];
    const mock = jest.spyOn(todoLast.component, "componentWillUnmount");
    await todoLast.component.props.completeTodo();
    expect(mock).toBeCalledTimes(1);
  });
  test("components run unmount listener when replacing", async () => {
    const addContent = (<AddContent />) as ComponentManager<AddContent>;
    const add = (
      <Addvertisement>{addContent}</Addvertisement>
    ) as ComponentManager<Addvertisement>;
    vd.createTreeFromRoot(add);
    const mock = jest.spyOn(addContent.component, "componentWillUnmount");
    await add.component.seeAdd();
    expect(mock).toBeCalledTimes(1);
  });
});
