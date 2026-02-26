import { render, fireEvent } from "@testing-library/react-native";
import { Button } from "./button";

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: "light" },
}));

describe("Button", () => {
  it("renders text correctly", () => {
    const { getByText } = render(<Button>Click Me</Button>);
    expect(getByText("Click Me")).toBeVisible();
  });

  it("calls onPress when pressed", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button onPress={onPressMock}>Clickable</Button>,
    );

    fireEvent.press(getByText("Clickable"));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
