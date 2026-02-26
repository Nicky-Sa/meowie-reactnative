import { render } from "@testing-library/react-native";
import { Chip } from "./chip";

describe("Chip", () => {
  it("renders text correctly", () => {
    const { getByText } = render(<Chip text="Action" />);
    expect(getByText("Action")).toBeVisible();
  });
});
