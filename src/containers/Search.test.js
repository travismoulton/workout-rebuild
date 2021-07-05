import { render, screen, waitFor, act } from "@testing-library/react";

import Search from "./Search/Search";
import { searchUtils as utils } from "./Search/searchUtils";
import mock from "./Search/mock";

describe("<Search>", () => {
  test("calls the wger api 3 times", async () => {
    const { mockCategories, mockMuscles, mockEquipment } = mock;

    const fetchCategories = jest
      .spyOn(utils, "fetchCategories")
      .mockImplementation(jest.fn(() => Promise.resolve(mockCategories)));

    const fetchMuscles = jest
      .spyOn(utils, "fetchMuscles")
      .mockImplementation(jest.fn(() => Promise.resolve(mockMuscles)));

    const fetchEquipment = jest
      .spyOn(utils, "fetchEquipment")
      .mockImplementation(jest.fn(() => Promise.resolve(mockEquipment)));

    render(<Search />);

    await waitFor(() => {
      expect(fetchCategories).toBeCalledTimes(1);
      expect(fetchMuscles).toBeCalledTimes(1);
      expect(fetchEquipment).toBeCalledTimes(1);
    });
  });

  test("renders Exercise Category Div", async () => {
    const { mockCategories, mockMuscles, mockEquipment } = mock;

    jest
      .spyOn(utils, "fetchCategories")
      .mockImplementation(jest.fn(() => Promise.resolve(mockCategories)));

    jest
      .spyOn(utils, "fetchMuscles")
      .mockImplementation(jest.fn(() => Promise.resolve(mockMuscles)));

    jest
      .spyOn(utils, "fetchEquipment")
      .mockImplementation(jest.fn(() => Promise.resolve(mockEquipment)));

    render(<Search />);

    const exerciseCategories = screen.getByTestId("Exercise Category");

    await waitFor(() => expect(exerciseCategories).toBeInTheDocument());
  });
});
