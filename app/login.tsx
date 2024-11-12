import {
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { theme } from "@/constants/themes";
import Icon from "@/assets/icons";
import ScreenWrapper from "@/components/ScreenWrapper";
import BackButton from "@/components/BackButton";
import { hp, wp } from "@/helpers/commons";
import { useRouter } from "expo-router";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { supabase } from "@/lib/supabase";

const login = () => {
  const router = useRouter();
  const emailRef = useRef<string | null>(null);
  const passwordRef = useRef<string | null>(null);
  const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Login", "Please enter all fields");
      return;
    }
    let email = emailRef?.current;
    let password = passwordRef?.current;

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Login", error.message);
    }
  };

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar barStyle='dark-content' />
      <View style={styles.container}>
        <BackButton router={router} />
        {/* welcome */}
        <View>
          <Text style={styles.welcomeText}>Hello,</Text>
          <Text style={styles.welcomeText}>환영합니다 !</Text>
        </View>
        {/* form */}
        <View style={styles.form}>
          <Input
            icon={<Icon name='mail' size={26} />}
            placeholder='admin@gmail.com 으로 로그인 하세요'
            onChangeText={(value: string) => (emailRef.current = value)}
            keyboardType='email-address'
          />
          <Input
            icon={<Icon name='lock-open-outline' size={26} />}
            placeholder='admin1'
            secureTextEntry={true}
            onChangeText={(value: string) => (passwordRef.current = value)}
          />
          <Text style={styles.forgotPassword}>
            비밀번호가 기억이 나지 않는다면 ?
          </Text>
          {/* button */}
          <Button title='Login' loading={loading} onPress={onSubmit} />
        </View>
        {/* footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText]}>계정 생성</Text>
          <Pressable onPress={() => router.push("/signUp")}>
            <Text
              style={[
                styles.footerText,
                {
                  color: theme.colors.primaryDark,
                  fontWeight: theme.fonts.semiBold,
                },
              ]}
            >
              Sign Up
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default login;

const styles = StyleSheet.create({
  container: { flex: 1, gap: 45 },
  welcomeText: {
    fontSize: wp(6),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  form: {
    gap: 25,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: theme.fonts.semiBold,
    color: theme.colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
});
