import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { hp, wp } from "@/helpers/commons";
import Header from "@/components/Header";
import { theme } from "@/constants/themes";
import { useAuth } from "@/contexts/AuthContext";
import { UserType } from "@/types";
import { getUserImageSrc, uploadImage } from "@/service/imageService";
import Icon from "@/assets/icons";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { updateUserData } from "@/service/userService";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const EditProfile = () => {
  // 사용자 인증 컨텍스트에서 사용자 데이터 가져오기
  const { user: userData, setUserData } = useAuth();
  const currentUser = userData as UserType;

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: "",
    phoneNumber: "",
    image: null as string | null,
    bio: "",
    address: "",
  });

  const router = useRouter();

  // 초기 유저 데이터 설정
  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name || "",
        phoneNumber: currentUser.phoneNumber || "",
        image: currentUser.image || null,
        bio: currentUser.bio || "",
        address: currentUser.address || "",
      });
    }
  }, [currentUser]);

  // 이미지 선택 함수
  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUser({ ...user, image: result.assets[0].uri });
    }
  };

  // 프로필 업데이트 함수
  const onSubmit = async () => {
    let userData = { ...user };
    let { name, phoneNumber, address, bio, image } = userData;

    if (!name || !phoneNumber || !address || !bio) {
      Alert.alert("확인", "항목을 입력해주세요.");
      return;
    }
    setLoading(true);

    // 이미지 업로드 처리
    if (typeof image === "string") {
      let imageRes = await uploadImage("profiles", image);
      if (imageRes.success) {
        userData.image = imageRes?.data as string;
      } else {
        userData.image = null;
      }
    }

    // 사용자 데이터 업데이트
    const { success, data, msg } = await updateUserData(
      currentUser.id,
      userData
    );
    setLoading(false);

    // 업데이트 결과 처리
    if (success) {
      console.log("수정 Success : ", data);
      setUserData({ ...currentUser, ...(data as UserType) });
      router.back();
    } else {
      Alert.alert("오류", msg);
    }
  };

  // 이미지 소스 설정
  let imageSource =
    user.image && typeof user.image == "object"
      ? user.image
      : getUserImageSrc(user.image || "");

  // 컴포넌트 렌더링
  return (
    <ScreenWrapper bg={"white"}>
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title='Edit Profile' />
          {/* form */}
          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image source={imageSource} style={styles.avatar} />
              <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                <Icon
                  name='camera-outline'
                  size={20}
                  color={theme.colors.text}
                />
              </Pressable>
            </View>
            <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
              정보를 입력하세요
            </Text>
            <Input
              icon={
                <Icon
                  name='person-outline'
                  size={20}
                  color={theme.colors.text}
                />
              }
              placeholder='이름을 입력하세요.'
              value={user.name}
              onChangeText={(value: string) =>
                setUser({ ...user, name: value })
              }
            />
            <Input
              icon={
                <Icon name='call-outline' size={20} color={theme.colors.text} />
              }
              placeholder='전화번호를 입력하세요.'
              value={user.phoneNumber}
              onChangeText={(value: string) =>
                setUser({ ...user, phoneNumber: value })
              }
            />

            <Input
              icon={
                <Icon
                  name='location-outline'
                  size={20}
                  color={theme.colors.text}
                />
              }
              placeholder='주소를 입력하세요.'
              value={user.address}
              onChangeText={(value: string) =>
                setUser({ ...user, address: value })
              }
            />
            <Input
              placeholder='자기소개를 입력하세요.'
              value={user.bio}
              onChangeText={(value: string) => setUser({ ...user, bio: value })}
              containerStyles={styles.bio}
              multiline={true}
            />

            <Button title='저장' onPress={onSubmit} loading={loading} />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default EditProfile;

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
    flex: 1,
  },
  form: {
    gap: 15,
  },
  avatarContainer: {
    height: hp(12),
    alignItems: "center",
  },
  avatar: {
    height: hp(12),
    width: hp(12),
    borderRadius: theme.radius.xxl,
    borderWidth: 1,
    borderColor: theme.colors.darkLight,
  },
  cameraIcon: {
    position: "absolute",
    width: wp(8),
    height: hp(4),
    justifyContent: "center",
    alignItems: "center",
    right: wp(32),
    bottom: 0,
    backgroundColor: "white",
    padding: 4,
    borderRadius: theme.radius.xxl,
    shadowColor: theme.colors.textLight,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    elevation: 7,
  },
  userInfo: {
    gap: 4,
    alignItems: "center",
  },
  userName: {
    fontSize: hp(3),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
  },
  userAddress: {
    fontSize: hp(1.5),
    color: theme.colors.textLight,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    fontSize: hp(1.5),
    color: theme.colors.textLight,
  },
  bio: {
    height: hp(15),
    alignItems: "flex-start",
    paddingVertical: 10,
  },
});
