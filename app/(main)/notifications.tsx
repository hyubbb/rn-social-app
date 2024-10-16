import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";

const Notification = () => {
  return (
    <ScreenWrapper>
      <Header title='알림' />
      <Text>Notification</Text>
    </ScreenWrapper>
  );
};

export default Notification;

const styles = StyleSheet.create({});
