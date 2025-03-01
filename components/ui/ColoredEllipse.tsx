import Svg, {
  Defs,
  Ellipse,
  FeBlend,
  FeFlood,
  FeGaussianBlur,
  Filter,
  G,
} from "react-native-svg";
import { Dimensions } from "react-native";

type Props = {
  color: string;
};

export const ColoredEllipse = ({ color }: Props) => {
  const { width, height } = Dimensions.get("window");
  const ellipseWidth = width * 0.9; // 90% of the screen width
  const ellipseHeight = height * 0.2; // 20% of the screen height

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <Defs>
        <Filter
          id="filter_blur"
          x="0"
          y="0"
          width={width}
          height={height}
          filterUnits="userSpaceOnUse"
        >
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <FeGaussianBlur
            stdDeviation="100"
            result="effect1_foregroundBlur_2394_1424"
          />
        </Filter>
      </Defs>
      <G filter="url(#filter_blur)">
        <Ellipse
          cx={ellipseWidth / 2}
          cy={ellipseHeight / 2}
          rx={ellipseWidth / 2}
          ry={ellipseHeight / 2}
          fill={color}
        />
      </G>
    </Svg>
  );
};
