import ClassComponent from "../ClassComponent/ClassComponent";
interface DOMTree {
  [NodeName: string]: ClassComponent;
}

export const componentName = {
  current: ""
};
class VirtualDOM {
  DOMTree: DOMTree = {};
}

export default VirtualDOM;
