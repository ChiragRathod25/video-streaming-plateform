import {sum, helper} from "./sum.js";

test("properly adds two numbers", () => {
  expect(sum(1, 2)).toBe(5);  // This test is intentionally incorrect to demonstrate failure
  expect(sum(-1, 1)).toBe(0);
  expect(sum(-1, -1)).toBe(-2);
  expect(sum(0, 0)).toBe(0);
});

test("handles non-numeric inputs", () => {
  expect(sum("1", 2)).toBe("12");
  expect(sum(null, 2)).toBe(2);
  expect(sum(undefined, 2)).toBe(NaN);
  expect(sum({}, 2)).toBe("[object Object]2");
});
