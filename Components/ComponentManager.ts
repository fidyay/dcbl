import Component from "./Component";
import VirtualDOM from "../VirtualDOM/VirtualDOM";
import { childrenType } from "../createElement/createElement";
class ComponentManager<C extends Component<any, any>> {
  componentChildTree!: childrenType;
  VD!: VirtualDOM;
  component: C;
  constructor(component: C) {
    this.component = component;
    component.manager = this;
  }
  rerenderComponent() {
    const newTree = this.component.render();
    return;
  }
}

export default ComponentManager;
