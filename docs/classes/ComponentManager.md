[dcbl](../README.md) / [Exports](../modules.md) / ComponentManager

# Class: ComponentManager<C\>

Controls one of the [Component's](Component.md) instances. It is not intended to be used outside of element trees.

## Type parameters

| Name | Type |
| :------ | :------ |
| `C` | extends [`Component`](Component.md)<`any`, `any`\> |

## Table of contents

### Constructors

- [constructor](ComponentManager.md#constructor)

### Properties

- [VD](ComponentManager.md#vd)
- [component](ComponentManager.md#component)
- [componentChildTree](ComponentManager.md#componentchildtree)
- [indexInParent](ComponentManager.md#indexinparent)
- [parentNode](ComponentManager.md#parentnode)

### Methods

- [rerenderComponent](ComponentManager.md#rerendercomponent)

## Constructors

### constructor

• **new ComponentManager**<`C`\>(`component`)

Creates the instance of [ComponentManager](ComponentManager.md). Sets the component instance to [component](ComponentManager.md#component) field.
And also sets the created object to the [component's manager property](Component.md#_manager) using the setter.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `C` | extends [`Component`](Component.md)<`any`, `any`, `C`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `component` | `C` | the instance of [Component](Component.md). |

#### Defined in

[Components/ComponentManager.ts:22](https://github.com/fidyay/dcbl/blob/6d857d5/Components/ComponentManager.ts#L22)

## Properties

### VD

• **VD**: [`VirtualDOM`](VirtualDOM.md)

The [VirtualDOM's](VirtualDOM.md) instance. It is set automaticaly by virtual dom.

#### Defined in

[Components/ComponentManager.ts:14](https://github.com/fidyay/dcbl/blob/6d857d5/Components/ComponentManager.ts#L14)

___

### component

• **component**: `C`

The [Component's](Component.md) instance. It is set automaticaly when the [ComponentManager's](ComponentManager.md) instance is created.

#### Defined in

[Components/ComponentManager.ts:16](https://github.com/fidyay/dcbl/blob/6d857d5/Components/ComponentManager.ts#L16)

___

### componentChildTree

• **componentChildTree**: `TreeType`

The previous tree generated by [Component's](Component.md) instance. It is used by virtual dom to compare trees.

#### Defined in

[Components/ComponentManager.ts:10](https://github.com/fidyay/dcbl/blob/6d857d5/Components/ComponentManager.ts#L10)

___

### indexInParent

• **indexInParent**: `number`

Index in child nodes of parent DOM element. It is set automaticaly by virtual dom.

#### Defined in

[Components/ComponentManager.ts:8](https://github.com/fidyay/dcbl/blob/6d857d5/Components/ComponentManager.ts#L8)

___

### parentNode

• **parentNode**: `HTMLElement`

Parent DOM element. It is set automaticaly by virtual dom.

#### Defined in

[Components/ComponentManager.ts:12](https://github.com/fidyay/dcbl/blob/6d857d5/Components/ComponentManager.ts#L12)

## Methods

### rerenderComponent

▸ **rerenderComponent**(): `void`

Rerenders the component's UI. And after that call the [componentDidUpdate](Component.md#componentdidupdate) method.

#### Returns

`void`

#### Defined in

[Components/ComponentManager.ts:27](https://github.com/fidyay/dcbl/blob/6d857d5/Components/ComponentManager.ts#L27)