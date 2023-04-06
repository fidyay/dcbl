import Component from "./Component";
import VirtualDOM from "../VirtualDOM/VirtualDOM";
import { TreeType } from "../VirtualDOM/VirtualDOM";
class ComponentManager<C extends Component<any, any>> {
  indexInParent!: number;
  componentChildTree!: TreeType;
  parentNode!: HTMLElement;
  VD!: VirtualDOM;
  component: C;
  constructor(component: C) {
    this.component = component;
    component.manager = this;
  }
  rerenderComponent() {
    const newTree = this.component.render();
    if (this.VD) {
      this.VD.changeTree(
        this.componentChildTree,
        newTree,
        this.parentNode,
        this.indexInParent
      );
    }
    this.componentChildTree = newTree;
  }
}

export default ComponentManager;
