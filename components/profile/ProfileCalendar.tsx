import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ProfileHeader from "./ProfileHeader";
import { PostWithUserAndComments, UserType } from "@/types";
import ScreenWrapper from "../ScreenWrapper";

type ProfileCalendarProps = {
  userData: UserType;
  router: any;
  currentUser: UserType;
  posts: PostWithUserAndComments[];
  setFilterType: (v: "calendar" | "list") => void;
};

const ProfileCalendar = ({
  userData,
  router,
  currentUser,
  posts,
  setFilterType,
}: ProfileCalendarProps) => {
  return (
    <>
      <ProfileHeader
        user={userData}
        router={router}
        currentUser={currentUser?.id}
        posts={posts}
        setFilterType={(v: "calendar" | "list") => setFilterType(v)}
      />
      <Text>ProfileCalendar</Text>
    </>
  );
};

export default ProfileCalendar;

const styles = StyleSheet.create({});
