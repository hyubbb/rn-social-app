import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Calendar from "./calendar";
import { PostWithUserAndComments } from "@/types";
import Header from "@/components/Header";
import { useLocalSearchParams } from "expo-router";
// import Calendar from "@/components/calendar";
// App.js나 다른 상위 컴포넌트에서
const Dialy = () => {
  const { userId } = useLocalSearchParams();
  const [posts, setPosts] = useState<PostWithUserAndComments[]>([]);

  return (
    <ScreenWrapper>
      <Header title='Monthly' />
      <Calendar userId={userId as string} posts={posts} />
    </ScreenWrapper>
  );
};

export default Dialy;
