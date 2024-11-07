import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { PostWithUserAndComments, UserType } from "@/types";
import Header from "../Header";
import Icon from "@/assets/icons";
import { theme } from "@/constants/themes";
import Avatar from "../Avatar";
import { hp, wp } from "@/helpers/commons";
import { onLogout } from "@/service/AuthService";
import { createChatRoom, fetchChat } from "@/service/MessageService";
import Loading from "../Loading";

type UserHeaderProps = {
  user: UserType;
  router: any;
  currentUser: string | undefined;
  posts: PostWithUserAndComments[];
  setFilterType: (type: "calendar" | "list") => void;
};

const ProfileHeader = ({
  user,
  router,
  currentUser,
  setFilterType,
}: UserHeaderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const firstChat = async () => {
    setIsLoading(true);
    // 채팅이 없으면 첫메시지라는것인데
    // 그럼 채팅방이 존재하지 않기때문에 채팅방을 만들어주는 코드작성
    let data = {
      userId: currentUser as string,
      otherUserId: user?.id as string,
    };

    // profile에서 눌렀을때, 방의정보를 가져왔는데 없을때는 create, 아니면 router
    let res = await fetchChat(data);
    if (res.success) {
      if (res.data.length == 0) {
        // 채팅방이 없으면 채팅방을 만들어줌
        let res = await createChatRoom(data);
        if (res.success) {
          router.push({
            pathname: "/message",
            params: {
              otherUserId: user?.id,
              roomId: res.data.id,
            },
          });
        }
      } else {
        router.push({
          pathname: "/message",
          params: {
            otherUserId: user?.id,
            roomId: res.data[0].room_id,
          },
        });
      }
      setIsLoading(false);
    }
  };

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
  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.header}>
      <View>
        <Header title={`${user?.name}`} mb={20} />
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Icon name='power-outline' size={25} color={theme.colors.rose} />
        </Pressable>
      </View>
      <View style={styles.container}>
        <View style={styles.userInfoContainer}>
          <View style={styles.avatarContainer}>
            <Avatar
              uri={user?.image || ""}
              size={hp(12)}
              rounded={theme.radius.xxl * 1.4}
            />
            {user?.id == currentUser ? (
              // 내 프로필일 경우
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
            ) : (
              // 타인의 프로필일 경우
              <Pressable style={styles.editIcon} onPress={() => firstChat()}>
                <Icon
                  name='chatbubble-outline'
                  size={20}
                  color={theme.colors.textDark}
                />
              </Pressable>
            )}
          </View>
          {/* useName and address */}
          <View style={styles.userInfo}>
            {/* <Text style={styles.userName}>{user?.name}</Text> */}
            {/* <Text style={styles.userAddress}>{user?.address}</Text> */}
            {/* email, phone, bio */}
            <View style={styles.info}>
              <Icon
                name='mail-outline'
                size={20}
                color={theme.colors.textLight}
              />
              <Text style={styles.infoText}>{user?.email}</Text>
            </View>
            {user?.phoneNumber && (
              <View style={styles.info}>
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
        <View
          style={{
            flexDirection: "row",
            gap: 10,
          }}
        >
          <Pressable
            onPress={() => setFilterType("list")}
            style={[
              styles.filterIcon,
              {
                borderRightWidth: 1,
                borderColor: theme.colors.darkLight,
              },
            ]}
          >
            <View>
              <Icon
                name='list-outline'
                size={20}
                color={theme.colors.textLight}
              />
            </View>
          </Pressable>
          <Pressable
            onPress={() => setFilterType("calendar")}
            style={styles.filterIcon}
          >
            <View>
              <Icon
                name='calendar-outline'
                size={20}
                color={theme.colors.textLight}
              />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  header: {
    flex: 1,
  },
  container: {
    flex: 1,
    gap: 20,
  },
  userInfoContainer: {
    flexDirection: "row",
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
    gap: 10,
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
    // alignItems: "center",
    // justifyContent: "flex-start",
    // alignItems: "flex-start",
    gap: 5,
  },

  infoText: {
    fontSize: hp(2),
    color: theme.colors.textLight,
  },
  filterIcon: {
    padding: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
