import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import { fetchNotifications } from "@/service/NotificationService";
import { useRouter } from "expo-router";
import NotificationItem from "@/components/NotificationItem";
import { hp, wp } from "@/helpers/commons";
import { theme } from "@/constants/themes";
import useUserStore from "@/store/userStore";

const Notification = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { user } = useUserStore((state: any) => state);
  const router = useRouter();

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    const res = await fetchNotifications(user?.id as string);
    if (res.success) {
      setNotifications(res.data);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title='알림' />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
        >
          {notifications.map((item) => (
            <NotificationItem key={item.id} item={item} router={router} />
          ))}

          {notifications.length === 0 && (
            <Text style={styles.noNotifications}>알림이 없습니다.</Text>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listStyle: {
    paddingVertical: 20,
    gap: 15,
  },
  noNotifications: {
    fontSize: hp(2),
    fontWeight: theme.fonts.bold,
    color: theme.colors.textDark,
    textAlign: "center",
  },
});
