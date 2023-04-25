[dcbl](../README.md) / [Exports](../modules.md) / Component

# Class: Component<P, S\>

The base class for components of UI.

## Type parameters

| Name | Type |
| :------ | :------ |
| `P` | extends `BasicPropsAndStateInterface` = `BasicPropsAndStateInterface` |
| `S` | extends `BasicPropsAndStateInterface` = `BasicPropsAndStateInterface` |

## Table of contents

### Constructors

- [constructor](Component.md#constructor)

### Properties

- [\_manager](Component.md#_manager)
- [props](Component.md#props)
- [state](Component.md#state)

### Accessors

- [manager](Component.md#manager)

### Methods

- [componentDidMount](Component.md#componentdidmount)
- [componentDidUpdate](Component.md#componentdidupdate)
- [componentWillUnmount](Component.md#componentwillunmount)
- [render](Component.md#render)
- [setState](Component.md#setstate)
- [shouldComponentUpdate](Component.md#shouldcomponentupdate)

## Constructors

### constructor

• **new Component**<`P`, `S`\>(`props`)

Creates a [Component](Component.md) instance, saves props to component and sets default state if other wasn't provided.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `P` | extends `object` = `object` |
| `S` | extends `object` = `object` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `P` | props from parent. |

#### Defined in

[Components/Component.ts:23](https://github.com/fidyay/dcbl/blob/1a6081b/Components/Component.ts#L23)

## Properties

### \_manager

• `Private` `Optional` **\_manager**: [`ComponentManager`](ComponentManager.md)<[`Component`](Component.md)<`P`, `S`\>\>

Object of a [ComponentManager](ComponentManager.md) class, which controls the component. It is not expected to be used by the consumer of a library.

#### Defined in

[Components/Component.ts:31](https://github.com/fidyay/dcbl/blob/1a6081b/Components/Component.ts#L31)

___

### props

• **props**: `P`

Props of a component, component gets them from the parent element, component rerenders when there is a change in props.

#### Defined in

[Components/Component.ts:16](https://github.com/fidyay/dcbl/blob/1a6081b/Components/Component.ts#L16)

___

### state

• **state**: `S`

State of a component. Each component has unique state. When state changes, component rerenders.

#### Defined in

[Components/Component.ts:18](https://github.com/fidyay/dcbl/blob/1a6081b/Components/Component.ts#L18)

## Accessors

### manager

• `set` **manager**(`m`): `void`

Setter of a [_manager](Component.md#_manager) property. Virtual dom sets it automaticly

#### Parameters

| Name | Type |
| :------ | :------ |
| `m` | [`ComponentManager`](ComponentManager.md)<`this`\> |

#### Returns

`void`

#### Defined in

[Components/Component.ts:33](https://github.com/fidyay/dcbl/blob/1a6081b/Components/Component.ts#L33)

## Methods

### componentDidMount

▸ **componentDidMount**(): `void`

Runs after the UI was created. By default does nothing.

#### Returns

`void`

#### Defined in

[Components/Component.ts:56](https://github.com/fidyay/dcbl/blob/1a6081b/Components/Component.ts#L56)

___

### componentDidUpdate

▸ **componentDidUpdate**(): `void`

Runs after component rerenders. By default does nothing.

#### Returns

`void`

#### Defined in

[Components/Component.ts:78](https://github.com/fidyay/dcbl/blob/1a6081b/Components/Component.ts#L78)

___

### componentWillUnmount

▸ **componentWillUnmount**(): `void`

Runs when component is going to be deleted from the UI. By default does nothing.

#### Returns

`void`

#### Defined in

[Components/Component.ts:81](https://github.com/fidyay/dcbl/blob/1a6081b/Components/Component.ts#L81)

___

### render

▸ `Abstract` **render**(): `TreeType`

Method that return the component's element tree. User should implement the method himself.

#### Returns

`TreeType`

#### Defined in

[Components/Component.ts:53](https://github.com/fidyay/dcbl/blob/1a6081b/Components/Component.ts#L53)

___

### setState

▸ `Protected` **setState**(`newState`): `Promise`<`void`\>

Sets new state to component and then rerenders it. Resetting the method to other value will break the library.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `newState` | `S` \| `settingStateFunction`<`S`, `P`\> | new state object or syncronous or asyncronous function that sets new state. |

#### Returns

`Promise`<`void`\>

#### Defined in

[Components/Component.ts:39](https://github.com/fidyay/dcbl/blob/1a6081b/Components/Component.ts#L39)

___

### shouldComponentUpdate

▸ **shouldComponentUpdate**(`oldProps`, `newProps`): `boolean`

Runs when virtual dom checks wether the component should rerender on props change. By default checks every field of an props object with Object.is method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `oldProps` | `P` | old props object. |
| `newProps` | `P` | new props object, it will be set to the [props](Component.md#props) property. |

#### Returns

`boolean`

- true if UI should update, false otherwise.

#### Defined in

[Components/Component.ts:63](https://github.com/fidyay/dcbl/blob/1a6081b/Components/Component.ts#L63)
