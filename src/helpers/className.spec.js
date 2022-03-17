import className from './className';

describe('Given the function `className`', () => {
    describe('When an object is passed', () => {
        it('should return a concatenated string of all the property keys with truthy values', () => {
            const obj = {
                'class_a': true,
                'class_b': false,
                'class_c': 1,
                'class_d': ''
            };

            expect(className(obj)).toBe('class_a class_c');
        });
    });
});