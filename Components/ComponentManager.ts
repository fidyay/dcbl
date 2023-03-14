import Component from "./Component";
class ComponentManager<C extends Component<any, any>> {
  componentChildren: ComponentManager<Component>[] = [];
  component: C;
  constructor(component: C) {
    this.component = component;
    component.manager = this;
  }
  rerenderComponent() {
    return;
  }
}

export default ComponentManager;
