import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { hp, wp } from "@/helpers/commons";
import { theme } from "@/constants/themes";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
const welcome = () => {
  const router = useRouter();

  return (
    <ScreenWrapper bg='white'>
      <StatusBar barStyle='dark-content' />
      <View style={styles.container}>
        {/* welcome image */}
        <Image
          style={styles.welcomeImage}
          source={require("../assets/images/welcome.png")}
          resizeMode='contain'
        />
        {/* title */}
        <View style={{ gap: 20, marginBottom: hp(5) }}>
          <Text style={styles.title}> SNS + CHAT</Text>
        </View>
        {/* footer */}
        <View style={styles.footer}>
          <Button title='Sign Up' onPress={() => router.push("/signUp")} />
          <View style={styles.buttonTextContainer}>
            <Text style={styles.loginText}>이미 계정이 존재 하다면?</Text>
            <Pressable onPress={() => router.push("/login")}>
              <Text
                style={[
                  styles.loginText,
                  {
                    color: theme.colors.primaryDark,
                    fontWeight: theme.fonts.semiBold,
                  },
                ]}
              >
                Login
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "white",
    marginBottom: hp(5),
  },
  welcomeImage: {
    width: wp(70),
    height: wp(100),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: "center",
    fontWeight: theme.fonts.extraBold as "800",
  },
  subTitle: {
    textAlign: "center",
    paddingHorizontal: wp(10),
    fontSize: hp(1.7),
    color: theme.colors.text,
  },
  footer: {
    gap: 30,
    width: "100%",
  },
  buttonTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  loginText: {
    textAlign: "center",
    fontSize: hp(1.7),
    color: theme.colors.text,
  },
});
