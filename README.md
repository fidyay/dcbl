# dcbl

A declarative component based library for javascript web applications.
Create components, which define the structure of your web applications and that changes with the change of state of your components and extend component's functionality with the lifecycle methods. Also library comes with JSX support.
[See documentation.](https://github.com/fidyay/dcbl/blob/master/docs/docs.md)

### Installation

    npm install dcbl

### Code example

    import { VirtualDOM, createElement, Component } from "dcbl";

    interface ClickerState {
      clicks: number;
    }

    // extending basic component class
    class Clicker extends Component<any, ClickerState> {
      // initialazing state in constructor
      constructor() {
        super({});
        this.state = { clicks: 0 };
      }
      // rendering the button element and provide props to it
      render() {
        return <button onclick={this.addOne}>{String(this.state.clicks)}</button>;
      }
      // method which is provided to button element as event listener
      addOne = () => {
        this.setState({ clicks: this.state.clicks + 1 });
      }
      // changing title of document after the component updated
      componentDidUpdate() {
        document.title = `clicks: ${this.state.clicks}`;
      }
    }

    // creating new virtual dom
    const vd = new VirtualDOM();
    // generating DOM tree from virtual dom
    vd.createTreeFromRoot(
      <Clicker />,
      document.querySelector("body") as HTMLBodyElement
    );
