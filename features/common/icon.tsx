import { ForwardRefExoticComponent, RefAttributes } from "react";
import Svg, { SvgProps } from "react-native-svg";
import { tailwind } from "@/lib/tailwind";

export type SvgImage = ForwardRefExoticComponent<SvgProps & RefAttributes<Svg>>;

type Props = {
  i: SvgImage;
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
