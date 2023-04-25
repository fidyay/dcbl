[dcbl](../README.md) / [Exports](../modules.md) / DOMElementTemplate

# Class: DOMElementTemplate<T\>

A class specified for a template of a DOM element used later in virtual DOM to implement or change actual DOM element

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `DOMElementType` |

## Table of contents

### Constructors

- [constructor](DOMElementTemplate.md#constructor)

### Properties

- [DOMEl](DOMElementTemplate.md#domel)
- [indexInParent](DOMElementTemplate.md#indexinparent)
- [props](DOMElementTemplate.md#props)
- [type](DOMElementTemplate.md#type)

## Constructors

### constructor

• **new DOMElementTemplate**<`T`\>(`type`, `props?`)

Creates a [DOMElementTemplate](DOMElementTemplate.md) instance.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends keyof `HTMLElementTagNameMap` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `T` | a tag name |
| `props` | `DOMElementPropsType`<`T`\> | props object |

#### Defined in

[DOMElementTemplate/DOMElementTemplate.ts:25](https://github.com/fidyay/dcbl/blob/6d857d5/DOMElementTemplate/DOMElementTemplate.ts#L25)

## Properties

### DOMEl

• **DOMEl**: `HTMLElement`

Link to element in DOM

#### Defined in

[DOMElementTemplate/DOMElementTemplate.ts:15](https://github.com/fidyay/dcbl/blob/6d857d5/DOMElementTemplate/DOMElementTemplate.ts#L15)

___

### indexInParent

• **indexInParent**: `number`

Index in parent DOM element

#### Defined in

[DOMElementTemplate/DOMElementTemplate.ts:13](https://github.com/fidyay/dcbl/blob/6d857d5/DOMElementTemplate/DOMElementTemplate.ts#L13)

___

### props

• **props**: `DOMElementPropsType`<`T`\>

Element props

#### Defined in

[DOMElementTemplate/DOMElementTemplate.ts:19](https://github.com/fidyay/dcbl/blob/6d857d5/DOMElementTemplate/DOMElementTemplate.ts#L19)

___

### type

• **type**: `T`

DOM element tag name

#### Defined in

[DOMElementTemplate/DOMElementTemplate.ts:17](https://github.com/fidyay/dcbl/blob/6d857d5/DOMElementTemplate/DOMElementTemplate.ts#L17)
