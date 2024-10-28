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
        <View style={{ gap: 20 }}>
          <Text style={styles.title}> Link up</Text>

          <Text style={styles.subTitle}>
            Where every thought finds a home and every image tells a story
          </Text>
        </View>
        {/* footer */}
        <View style={styles.footer}>
          <Button
            title='Getting Started'
            onPress={() => router.push("/signUp")}
          />
          <View style={styles.buttonTextContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
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
    justifyContent: "space-around",
    backgroundColor: "white",
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
