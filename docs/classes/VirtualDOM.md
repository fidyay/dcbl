[dcbl](../README.md) / [Exports](../modules.md) / VirtualDOM

# Class: VirtualDOM

Class of the virtual dom.

## Table of contents

### Constructors

- [constructor](VirtualDOM.md#constructor)

### Properties

- [DOMRoot](VirtualDOM.md#domroot)

### Methods

- [changeTree](VirtualDOM.md#changetree)
- [checkProps](VirtualDOM.md#checkprops)
- [createTree](VirtualDOM.md#createtree)
- [createTreeFromRoot](VirtualDOM.md#createtreefromroot)
- [runComponentWillUnmount](VirtualDOM.md#runcomponentwillunmount)

## Constructors

### constructor

• **new VirtualDOM**()

## Properties

### DOMRoot

• **DOMRoot**: `HTMLElement`

The root of the UI controlled by instance of a [VirtualDOM](VirtualDOM.md) class. It is set when the virtual dom is created.

#### Defined in

[VirtualDOM/VirtualDOM.ts:20](https://github.com/fidyay/dcbl/blob/6d857d5/VirtualDOM/VirtualDOM.ts#L20)

## Methods

### changeTree

▸ **changeTree**(`oldTree`, `newTree`, `parent`, `childIndex?`): `void`

Changes the UI to the new tree.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `oldTree` | `TreeType` | the old tree's element. |
| `newTree` | `TreeType` | the new tree's element. |
| `parent` | `HTMLElement` | the parent DOM element. |
| `childIndex?` | `number` | index in childNodes of parent DOM element. |

#### Returns

`void`

#### Defined in

[VirtualDOM/VirtualDOM.ts:123](https://github.com/fidyay/dcbl/blob/6d857d5/VirtualDOM/VirtualDOM.ts#L123)

___

### checkProps

▸ **checkProps**(`oldProps`, `newProps`, `oldElementTemplate?`): `boolean`

Checks props of an element. If element is an instance of [DOMElementTemplate](DOMElementTemplate.md) class, it changes the attributes of a DOM element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `oldProps` | `any` | old props object. |
| `newProps` | `any` | new props object. |
| `oldElementTemplate?` | [`DOMElementTemplate`](DOMElementTemplate.md)<keyof `HTMLElementTagNameMap`\> | optianal parameter of an old [DOMElementTemplate's](DOMElementTemplate.md) instance, which stores the link to DOM element. |

#### Returns

`boolean`

- true if props were changed, false otherwise.

#### Defined in

[VirtualDOM/VirtualDOM.ts:41](https://github.com/fidyay/dcbl/blob/6d857d5/VirtualDOM/VirtualDOM.ts#L41)

___

### createTree

▸ **createTree**(`child`, `parent?`, `childIndex?`): `void`

Creates new DOM element tree and pushes inside to parent DOM element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `child` | `TreeType` | the tree element. |
| `parent?` | `HTMLElement` | the parent element. If it's not set, the [DOMRoot](VirtualDOM.md#domroot) is used. |
| `childIndex?` | `number` | index in childNodes of parent element. |

#### Returns

`void`

#### Defined in

[VirtualDOM/VirtualDOM.ts:223](https://github.com/fidyay/dcbl/blob/6d857d5/VirtualDOM/VirtualDOM.ts#L223)

___

### createTreeFromRoot

▸ **createTreeFromRoot**(`rootElement`, `rootDOMElement?`): `void`

Creates virtual dom tree from given tree element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rootElement` | `TreeType` | root element. |
| `rootDOMElement?` | `HTMLElement` | root DOM element, saves it to [DOMRoot](VirtualDOM.md#domroot). If it's not provided, creates div with an id attribute set to "decibel-root". |

#### Returns

`void`

#### Defined in

[VirtualDOM/VirtualDOM.ts:287](https://github.com/fidyay/dcbl/blob/6d857d5/VirtualDOM/VirtualDOM.ts#L287)

___

### runComponentWillUnmount

▸ **runComponentWillUnmount**(`tree`): `void`

Runs [componentWillUnmount](Component.md#componentwillunmount) methods of all components inside the tree.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tree` | `TreeType` | element tree. |

#### Returns

`void`

#### Defined in

[VirtualDOM/VirtualDOM.ts:24](https://github.com/fidyay/dcbl/blob/6d857d5/VirtualDOM/VirtualDOM.ts#L24)
