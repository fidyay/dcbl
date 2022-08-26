import { createElement } from "./createElement"

test('Creates a div element', () => {
    expect(createElement('div', {}, 'Hello, World')).toEqual({
        type: 'div',
        props: {
            children: ['Hello, World']
        }
    })
})

test('Creates link with shref', () => {
    expect(createElement('a', {href: 'https://ru.wikipedia.org/'}, 'Wikipedia')).toEqual({
        type: 'a',
        props: {
            href: 'https://ru.wikipedia.org/',
            children: ['Wikipedia']
        }
    })
})

test('Can create element trees', () => {
   const p1 = createElement('p', {style: {color: 'red'}}, 'Some text')
   const p2 = createElement('p', {}, 'Some text 2')
   const div = createElement('div', {}, p1, p2, 'End')
   expect(div).toEqual({
        type: 'div',
        props: {
            children: [
                {
                    type: 'p',
                    props: {
                        style: {color: 'red'},
                        children: [
                            'Some text'
                        ]
                    }
                },
                {
                    type: 'p',
                    props: {
                        children: [
                            'Some text 2'
                        ]
                    }
                },
                'End'
            ]
        }
   })
})