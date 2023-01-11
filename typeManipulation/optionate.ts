type Optionate<Type> = {
  [Property in keyof Type]?: Type[Property];
};

export default Optionate;
