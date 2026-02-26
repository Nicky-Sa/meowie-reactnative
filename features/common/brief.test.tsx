import { render } from "@testing-library/react-native";
import { Brief } from "./brief";

describe("Brief", () => {
  it("renders first and second line of text", () => {
    const { getByText } = render(
      <Brief
        imageUrl="https://blurha.sh/assets/images/news/1.jpg"
        firstLine="First Line"
        secondLine="Second Line"
        size="md"
      />,
    );

    expect(getByText("First Line")).toBeVisible();
    expect(getByText("Second Line")).toBeVisible();
  });
});
