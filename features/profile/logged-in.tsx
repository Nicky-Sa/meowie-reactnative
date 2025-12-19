import { Text } from "react-native";
import { Image } from "expo-image";
import { User } from "@/entities/user";

type Props = {
  user: User;
};

export const LoggedIn = ({ user }: Props) => {
  return (
    <>
      <Image
        source={
          "https://meowie-public.s3.eu-central-1.amazonaws.com/default-profile.png"
        }
        style={{
          width: 100,
          height: 100,
          borderRadius: 9999,
        }}
        contentFit="cover"
        cachePolicy="disk"
      />
      <Text className={"body-b2 text-neutral-10-default"}>
        Welcome to your profile
      </Text>
      <Text className={"title-t1-strong text-neutral-10-default"}>
        {user.email}
      </Text>
    </>
  );
};
