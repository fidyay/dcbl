type SetField<Type, Field extends string, newType> = {
  [Property in keyof Type]: Property extends Field ? newType : Type[Property];
};
export default SetField;
