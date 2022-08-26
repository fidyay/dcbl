interface ParametersProps {
    [prop: string]: any
}

interface ElementProps {
    children: Child[],
    [prop: string]: any
}

interface DecibelElement {
    type: string,
    props: ElementProps
}

type Child = DecibelElement | string

export const createElement = (type: string, props: ParametersProps | null, ...children: Child[]): DecibelElement => {
    const elementProps = props ? {...props, children} : {children} as ElementProps
    return {
        type,
        props: elementProps
    }
}