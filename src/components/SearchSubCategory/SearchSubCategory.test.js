import { MemoryRouter } from "react-router-dom";

import { customRender, screen } from "../../shared/testUtils";
import SearchSubCategory from "./SearchSubCategory";

describe("<SearchSubCategory />", () => {
  test("renders", () => {
    const props = {
      id: 1,
      category: "Test Category",
      subCategoryName: "Test SubCategory",
    };
    customRender(
      <MemoryRouter history={{ location: "" }}>
        <SearchSubCategory {...props} />
      </MemoryRouter>
    );

    const element = screen.getByTestId("SearchSubCategory-Test SubCategory");

    expect(element).toBeInTheDocument();
  });
});
