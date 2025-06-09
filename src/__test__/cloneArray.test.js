import { cloneArray } from "./cloneArray.js";

test("clones an array", () => {
    const array=[1, 2, 3];
    expect(cloneArray(array)).toEqual(array); //it should clone the array, have the same elements
    expect(cloneArray(array)).not.toBe(array); //it should not be the same reference, craetes a new array
    expect(cloneArray(array)).toEqual([1, 2, 3]); //it should have the same elements
});

