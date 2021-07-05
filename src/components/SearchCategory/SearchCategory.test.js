import { render, screen } from "@testing-library/react";

import SearchCategory from "./SearchCategory";

describe("<SearchCategory />", () => {
  test("renders propery", () => {
    const props = {
      clicked: jest.fn(),
      categoryName: "Test Category",
      categoryOpen: true,
    };

    render(<SearchCategory {...props} />);

    const exampleTitle = screen.getByTestId("Test Category");

    expect(exampleTitle).toBeInTheDocument();
  });
});
