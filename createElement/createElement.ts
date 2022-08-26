interface Props {
    [prop: string]: any
}

interface DecibelElement {
    type: string,
    props: {
        children: Child[],
        [prop: string]: any
    }
}

type Child = DecibelElement | string

export const createElement = (type: string, props: Props, ...children: Child[]): DecibelElement => {
    return {
        type,
        props: {
            ...props,
            children
        }
    }
}