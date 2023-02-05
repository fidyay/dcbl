type RemoveFields<Type, Fields> = {
  [Property in keyof Type as Exclude<Property, Fields>]: Type[Property];
};
export default RemoveFields;
