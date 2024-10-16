import {
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { onLogout } from "@/service/AuthService";
import { hp, wp } from "@/helpers/commons";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import { theme } from "@/constants/themes";
import Icon from "@/assets/icons";
import Avatar from "@/components/Avatar";
import { UserType } from "@/types";

type UserHeaderProps = {
  user: UserType;
  router: any;
  handleLogout: () => void;
};

const Profile = () => {
  const { user } = useAuth();
  const userData = user as UserType;
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      {
        text: "취소",
        onPress: () => console.log("modal cancelled"),
        style: "cancel",
      },
      {
        text: "로그아웃",
        onPress: () => onLogout(),
        style: "destructive",
      },
    ]);
  };

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar barStyle='dark-content' />
      <UserHeader user={userData} router={router} handleLogout={handleLogout} />
    </ScreenWrapper>
  );
};

const UserHeader = ({ user, router, handleLogout }: UserHeaderProps) => {
  return (
    <View style={styles.header}>
      <View>
        <Header title='Profile' mb={20} />
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Icon name='power-outline' size={25} color={theme.colors.rose} />
        </Pressable>
      </View>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Avatar
            uri={user?.image || ""}
            size={hp(12)}
            rounded={theme.radius.xxl * 1.4}
          />
          <Pressable
            style={styles.editIcon}
            onPress={() => router.push("/editProfile")}
          >
            <Icon
              name='create-outline'
              size={20}
              color={theme.colors.textDark}
            />
          </Pressable>
        </View>
        {/* useName and address */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name}</Text>
          {/* <Text style={styles.userAddress}>{user?.address}</Text> */}
        </View>
        {/* email, phone, bio */}
        <View style={styles.info}>
          <View style={styles.infoItem}>
            <Icon
              name='mail-outline'
              size={20}
              color={theme.colors.textLight}
            />
            <Text style={styles.infoText}>{user?.email}</Text>
          </View>

          {user?.phoneNumber && (
            <View style={styles.infoItem}>
              <Icon
                name='call-outline'
                size={20}
                color={theme.colors.textLight}
              />
              <Text style={styles.infoText}>{user?.phoneNumber}</Text>
            </View>
          )}

          {user?.bio && <Text style={styles.infoText}>{user?.bio}</Text>}
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: wp(4),
    flex: 1,
  },
  container: {
    flex: 1,
    gap: 20,
  },
  logoutButton: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "#ffe8e8",
    padding: 5,
    borderRadius: theme.radius.sm,
  },
  avatarContainer: {
    height: hp(12),
    alignItems: "center",
  },
  editIcon: {
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
    gap: 15,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    height: hp(3),
    gap: 10,
  },
  infoText: {
    fontSize: hp(2),
    color: theme.colors.textLight,
  },
});
