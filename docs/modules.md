[dcbl](README.md) / Exports

# dcbl

## Table of contents

### Classes

- [Component](classes/Component.md)
- [ComponentManager](classes/ComponentManager.md)
- [DOMElementTemplate](classes/DOMElementTemplate.md)
- [VirtualDOM](classes/VirtualDOM.md)

### Functions

- [createElement](modules.md#createelement)

## Functions

### createElement

▸ **createElement**<`E`\>(`el`, `props`, `...children`): [`DOMElementTemplate`](classes/DOMElementTemplate.md)<`E`\>

Creates an element of virtual dom

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends keyof `HTMLElementTagNameMap` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `el` | `E` | tag name. |
| `props` | `MakeIETypes`<`HTMLElementTagNameMap`\>[`E`] | DOM element's attributes. |
| `...children` | `childrenType`[] | children of an element. |

#### Returns

[`DOMElementTemplate`](classes/DOMElementTemplate.md)<`E`\>

- [DOMElementTemplate's](classes/DOMElementTemplate.md) instance.

#### Defined in

[createElement/createElement.ts:39](https://github.com/fidyay/dcbl/blob/6d857d5/createElement/createElement.ts#L39)

▸ **createElement**<`C`\>(`comp`, `props`, `...children`): [`ComponentManager`](classes/ComponentManager.md)<`InstanceType`<`C`\>\>

Creates a component manager.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `C` | extends `Object` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `comp` | `C` | - |
| `props` | `RemoveFields`<`ConstructorParameters`<`C`\>[``0``], ``"children"``\> | component's props. |
| `...children` | `GetComponentChildrenType`<`C`\> | children of the component. |

#### Returns

[`ComponentManager`](classes/ComponentManager.md)<`InstanceType`<`C`\>\>

- [ComponentManager's](classes/ComponentManager.md) instance.

#### Defined in

[createElement/createElement.ts:51](https://github.com/fidyay/dcbl/blob/6d857d5/createElement/createElement.ts#L51)
