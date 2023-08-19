import {Coordinates, subtract, add} from '.';

describe('location', () => {
    describe('add()', () => {
        it('should add cooridinates', () => {
            const a: Coordinates = {x: -1, y: 10, z: -20};
            const b: Coordinates = {x: 1, y: 10, z: -20};

            expect(add(a, b)).toMatchObject({x: 0, y: 20, z: -40});
            expect(add(b, a)).toMatchObject({x: 0, y: 20, z: -40});
        });
    });

    describe('subtract()', () => {
        it('should subtract cooridinates', () => {
            const a: Coordinates = {x: 1, y: -1, z: 1};
            const b: Coordinates = {x: 1, y: 1, z: -1};

            expect(subtract(a, b)).toMatchObject({x: 0, y: -2, z: 2});
            expect(subtract(b, a)).toMatchObject({x: 0, y: 2, z: -2});
        });
    });
});
