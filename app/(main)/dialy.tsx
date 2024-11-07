import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Calendar from "./calendar";
import { PostWithUserAndComments } from "@/types";
import Header from "@/components/Header";
import { fetchPostDaily, fetchPostDetails } from "@/service/postService";
import { useLocalSearchParams } from "expo-router";
// import Calendar from "@/components/calendar";
// App.js나 다른 상위 컴포넌트에서
const Dialy = () => {
  const { userId } = useLocalSearchParams();
  const [posts, setPosts] = useState<PostWithUserAndComments[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // const posts = usePostStore((state: any) => state.posts);

  // useEffect(() => {
  //   const fetchPost = async () => {
  //     const result = await fetchPostDaily(
  //       userId as string,
  //       currentMonth.getFullYear(),
  //       currentMonth.getMonth() + 1
  //     );

  //     setPosts(result.data);
  //   };
  //   fetchPost();
  // }, [userId, currentMonth]);

  return (
    <ScreenWrapper>
      <Header title='Monthly' />
      <Calendar userId={userId as string} posts={posts} />
    </ScreenWrapper>
  );
};

export default Dialy;
