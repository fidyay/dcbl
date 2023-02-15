import Component from "./Component";
class ComponentManager {
  componentChildren: ComponentManager[] = [];
  component: Component;
  constructor(component: Component) {
    this.component = component;
    component.manager = this;
  }
  rerenderComponent() {
    return;
  }
}

export default ComponentManager;
