import { subtract } from "./subtract.js";

test("properly subtracts two numbers", () => {
    expect(subtract(5, 3)).toBe(2);
    expect(subtract(-1, -1)).toBe(0);
    expect(subtract(0, 0)).toBe(0);
    expect(subtract(10, 5)).toBe(5);
    expect(subtract(3, 5)).toBe(-2);
    }
);

test("handles non-numeric inputs", () => {
    expect(subtract("5", 3)).toBe(2); // coerces string to number
    expect(subtract(null, 3)).toBe(-3); // null is coerced to 0
    expect(subtract(undefined, 3)).toBe(NaN); // undefined results in NaN
    expect(subtract({}, 3)).toBe(NaN); // object results in NaN
});