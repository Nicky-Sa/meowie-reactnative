import { ViewProps } from "react-native";

export type WithTestID<Props> = Props & Pick<ViewProps, "testID">;
