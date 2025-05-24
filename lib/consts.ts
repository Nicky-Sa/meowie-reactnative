import { tailwind } from "@/lib/utils";

export const buttonVariants = {
  primary: {
    backgroundColor: [
      tailwind.theme.backgroundColor.neutral["1"].default,
      tailwind.theme.backgroundColor.neutral["7"].default,
    ],
    borderColor: tailwind.theme.borderColor.neutral["7"].default,
  },
  secondary: {
    backgroundColor: [
      tailwind.theme.backgroundColor.neutral[11].default,
      tailwind.theme.backgroundColor.neutral[12].default,
    ],
    borderColor: tailwind.theme.borderColor.neutral[3].default,
  },
  ghost: {
    backgroundColor: ["transparent", "transparent"],
    borderColor: "transparent",
  },
  outline: {
    backgroundColor: ["transparent", "transparent"],
    borderColor: tailwind.theme.borderColor.neutral[3].default,
  },
} as const;

export const buttonSizes = {
  full: {
    borderRadius: Number(tailwind.theme.borderRadius.xl),
    paddingVertical: Number(tailwind.theme.spacing["4"]),
    paddingRight: Number(tailwind.theme.spacing["4"]),
    paddingLeft: Number(tailwind.theme.spacing["4"]),
    iconOffset: 8,
  },
  lg: {
    borderRadius: Number(tailwind.theme.borderRadius.xl),
    paddingVertical: Number(tailwind.theme.spacing["4"]),
    paddingRight: Number(tailwind.theme.spacing["6"]),
    paddingLeft: Number(tailwind.theme.spacing["6"]),
    iconOffset: 8,
  },
  md: {
    borderRadius: Number(tailwind.theme.borderRadius.xl),
    paddingVertical: Number(tailwind.theme.spacing["3"]),
    paddingRight: Number(tailwind.theme.spacing["4"]),
    paddingLeft: Number(tailwind.theme.spacing["4"]),
    iconOffset: 4,
  },
  sm: {
    borderRadius: Number(tailwind.theme.borderRadius.lg),
    paddingVertical: Number(tailwind.theme.spacing["2"]),
    paddingRight: Number(tailwind.theme.spacing["3"]),
    paddingLeft: Number(tailwind.theme.spacing["3"]),
    iconOffset: 4,
  },
  unset: {
    borderRadius: 0,
    paddingVertical: 0,
    paddingRight: 0,
    paddingLeft: 0,
    iconOffset: 0,
  },
};
