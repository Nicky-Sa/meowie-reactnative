import { ForwardRefExoticComponent, RefAttributes } from "react";
import Svg, { SvgProps } from "react-native-svg";
import { tailwind } from "@/lib/utils";

type Props = {
  i: ForwardRefExoticComponent<SvgProps & RefAttributes<Svg>>;
} & SvgProps;

export const Icon = ({ i: IconComponent, ...props }: Props) => {
  return (
    <IconComponent
      height={24}
      width={24}
      color={tailwind.theme.textColor.neutral[10].default}
      {...props} // will override the default values
    />
  );
};
