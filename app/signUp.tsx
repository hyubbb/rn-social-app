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

const signUp = () => {
  const router = useRouter();
  const nameRef = useRef<string | null>(null);
  const emailRef = useRef<string | null>(null);
  const passwordRef = useRef<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!nameRef.current || !passwordRef.current || !emailRef.current) {
      Alert.alert("회원가입", "모든 필드를 입력해주세요");
      return;
    }

    let name = nameRef.current.trim();
    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();

    setLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { name },
      },
    });

    setLoading(false);

    console.log("error : ", error);

    if (error) {
      Alert.alert("회원가입", error.message);
    }
  };

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar barStyle='dark-content' />
      <View style={styles.container}>
        <BackButton router={router} />
        {/* welcome */}
        <View>
          <Text style={styles.welcomeText}>회원가입</Text>
        </View>
        {/* form */}
        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
            회원가입을 위해 모든 필드를 입력해주세요
          </Text>
          <Input
            icon={<Icon name='person-outline' size={26} />}
            placeholder='아이디'
            onChangeText={(value: string) => (nameRef.current = value)}
          />
          <Input
            icon={<Icon name='mail' size={26} />}
            placeholder='이메일'
            onChangeText={(value: string) => (emailRef.current = value)}
          />
          <Input
            icon={<Icon name='lock-open-outline' size={26} />}
            placeholder='비밀번호'
            secureTextEntry={true}
            onChangeText={(value: string) => (passwordRef.current = value)}
          />
          {/* button */}
          <Button title='회원가입' loading={loading} onPress={onSubmit} />
        </View>
        {/* footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText]}>이미 계정이 존재 하다면?</Text>
          <Pressable onPress={() => router.push("/login")}>
            <Text
              style={[
                styles.footerText,
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
    </ScreenWrapper>
  );
};

export default signUp;

const styles = StyleSheet.create({
  container: { flex: 1, gap: 45, paddingHorizontal: wp(5) },
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
