function sum(a, b) {
  return a + b;
}

function helper(){
    return "This is a helper function";
} //it is not used in the tests, so in coverrage it will not be counted and it shows us that we defined test , but not used in tests, => remaining to test

export { sum, helper };