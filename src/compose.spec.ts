import { compose } from "./compose";

describe("compose", () =>
{
  describe("When passed one function", () =>
  {
    const identity = <T extends any>(x: T): T => x;

    it("Yields the same function", () =>
    {
      expect(compose(identity)(1)).toBe(1);
    });
  });

  describe("When passed more than one function", () =>
  {
    it("Composes the functions from left to right.", () =>
    {
      const subtractOne = (x: number) => 1 - x;
      const multiplyTwo = (x: number) => 2 * x;

      expect(compose(multiplyTwo, subtractOne)(3)).toBe(-5);
    });
  });
});