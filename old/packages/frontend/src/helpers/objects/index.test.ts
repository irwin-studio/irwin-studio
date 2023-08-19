import {deepPreservativeMerge} from '.';

describe('deepPreservativeMerge()', () => {
    it('should override values', () => {
        const target = {a: 1, b: 'hello', c: true};
        const source = {a: 5, b: 'goodbye', c: false};
        const result = deepPreservativeMerge(target, source);

        expect(result).toEqual(source);
    });

    it('should override nestedvalues', () => {
        const target = {values: {a: 1, b: 'hello', c: true}};
        const source = {values: {a: 5, b: 'goodbye', c: false}};
        const result = deepPreservativeMerge(target, source);

        expect(result).toEqual(source);
    });

    it('should keep values that are missing in source', () => {
        const target = {a: 1, b: 'hello', c: true};
        const source = {a: 5, b: 'goodbye'};
        const result = deepPreservativeMerge(target, source);

        expect(result).toEqual({...source, c: true});
    });

    it('should should not add extra values from source', () => {
        const target = {a: 1, b: 'hello', c: true};
        const source = {a: 5, b: 'goodbye', c: false, extraValue: 0.4};
        const result = deepPreservativeMerge(target, source);

        expect('extraValue' in result).toEqual(false);
        expect(result).toEqual({a: 5, b: 'goodbye', c: false});
    });

    it('should combine multiple nested values', () => {
        const target = {
            a: {hello: true, goodbye: false},
            b: {address: 'factory road', number: 420},
        };
        const source = {
            a: {otherGreeting: 'yup yup yup', goodbye: true},
            b: {address: 'terracotta road'},
        };

        const result = deepPreservativeMerge(target, source);

        expect(result).toEqual({
            a: {hello: true, goodbye: true},
            b: {address: 'terracotta road', number: 420},
        });
    });

    it('should not modify orignal values', () => {
        const original = {a: 'hello', location: {country: 'Australia', state: 'Vic'}};

        const target = JSON.parse(JSON.stringify(original));
        const source = {location: {state: 'NSW'}};
        const result = deepPreservativeMerge(target, source);

        expect(result).toEqual({a: 'hello', location: {country: 'Australia', state: 'NSW'}});
        expect(JSON.stringify(target)).toEqual(JSON.stringify(original));
    });

    it('should only override non-objects with undefined', () => {
        // test that objects are not overidden
        let source: any = {a: {hello: true}, b: [1, 2, 3]};
        let target: any = {a: undefined, b: 'hello'};
        let result = deepPreservativeMerge(source, target);
        expect(result).toEqual(source);

        source = {a: {hello: true}, b: 'hello'};
        target = {a: undefined, b: undefined};
        result = deepPreservativeMerge(source, target);
        expect(result).toEqual({
            a: source.a,
            b: undefined,
        });
    });
});
