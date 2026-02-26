import { render } from "@testing-library/react-native";
import { Divider } from "./divider";

describe("Divider", () => {
  it("renders without crashing", () => {
    const { root } = render(<Divider />);
    expect(root).toBeTruthy();
  });
});
