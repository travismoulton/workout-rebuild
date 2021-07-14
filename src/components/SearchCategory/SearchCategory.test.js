import { customRender, screen } from '../../shared/testUtils'


import SearchCategory from "./SearchCategory";

describe("<SearchCategory />", () => {
  test("renders propery", () => {
    const props = {
      clicked: jest.fn(),
      categoryName: "Test Category",
      categoryOpen: true,
    };

    customRender(<SearchCategory {...props} />);

    const exampleTitle = screen.getByTestId("Test Category");

    expect(exampleTitle).toBeInTheDocument();
  });
});
