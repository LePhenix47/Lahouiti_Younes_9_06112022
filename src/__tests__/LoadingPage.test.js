/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import LoadingPage from "../views/LoadingPage.js";

describe("Given I am connected on app (as an Employee or an HR admin)", () => {
  //Test: done and SUCCESSFUL ✅
  describe("When LoadingPage is called", () => {
    test("Then, it should render Loading...", () => {
      const html = LoadingPage();
      document.body.innerHTML = html;
      expect(screen.getAllByText("Loading...")).toBeTruthy();
    });
  });
});
