import { getSupabaseFileUrl } from "@/service/imageService";
import { fetchPostDaily } from "@/service/postService";
import { PostWithUserAndComments } from "@/types";
import { ResizeMode, Video } from "expo-av";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  useWindowDimensions,
} from "react-native";
import RenderHTML from "react-native-render-html";

type CalendarProps = {
  // posts: { photo: string | ImagePickerAsset; created_at: string }[];
  posts: PostWithUserAndComments[];
  userId: string;
};

const Calendar = ({ posts: postData, userId }: CalendarProps) => {
  const [posts, setPosts] = useState<PostWithUserAndComments[]>(postData);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const router = useRouter();
  const { width } = useWindowDimensions();
  useEffect(() => {
    const fetchPost = async () => {
      const result = await fetchPostDaily(
        userId as string,
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1
      );
      setPosts(result.data);
    };
    fetchPost();
  }, [userId, currentMonth]);

  // 달의 모든 날짜를 생성하는 함수
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1); // 1. 해당 월의 첫째 날
    const lastDay = new Date(year, month + 1, 0); // 2. 해당 월의 마지막 날 - day를 0으로 설정하면 이전 달의 마지막 날을 반환
    const daysInMonth = lastDay.getDate(); // 3. 해당 월의 날짜 수
    const startingDay = firstDay.getDay(); // 4. 해당 월의 첫째 날의 요일
    let days = [];

    // 이전 달의 날짜들로 채우기
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // 현재 달의 날짜들 채우기
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  // 월 이동 함수
  const changeMonth = (increment: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
  };

  // 날짜에 사진이 있는지 확인하는 함수
  const getPostForDate = (day: number | null) => {
    if (!day) return null;
    const dateString = `${currentMonth.getFullYear()}-${(
      currentMonth.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

    const post = posts.find(
      (post) => post.created_at?.slice(0, 10) === dateString
    );

    return post;
  };

  const postDetail = (day: number | null) => {
    if (!day) return;
    const data = getPostForDate(day);
    if (!data?.id) return;
    router.push({
      pathname: "/postDetails",
      params: {
        postId: data?.id as string,
      },
    });
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <View style={styles.container}>
      {/* 월 네비게이션 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Text style={styles.navigationButton}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Text style={styles.navigationButton}>{">"}</Text>
        </TouchableOpacity>
      </View>

      {/* 요일 표시 */}
      <View style={styles.weekDays}>
        {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
          <Text key={index} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>

      {/* 달력 그리드 */}
      <View style={styles.calendar}>
        {days.map((day, index) => {
          return (
            <Pressable
              style={styles.dayContainer}
              key={index}
              onPress={() => postDetail(day)}
            >
              {day && (
                <View style={styles.dayContent}>
                  {getPostForDate(day)?.file ? (
                    getPostForDate(day)?.file.includes("postImages") ? (
                      <>
                        <Text style={styles.dayText}>{day}</Text>
                        <Image
                          source={getSupabaseFileUrl(
                            getPostForDate(day)?.file as string
                          )}
                          style={styles.thumbnail}
                        />
                      </>
                    ) : (
                      <>
                        <Text style={[styles.dayText]}>{day}</Text>
                        <Video
                          source={getSupabaseFileUrl(
                            getPostForDate(day)?.file as string
                          )}
                          style={[styles.thumbnail]}
                          resizeMode={ResizeMode.COVER}
                        />
                      </>
                    )
                  ) : getPostForDate(day)?.body ? (
                    <>
                      <Text style={[styles.dayText, { color: "black" }]}>
                        {day}
                      </Text>
                      <View
                        style={{
                          flex: 1,
                          height: "100%",
                          width: "100%",
                          backgroundColor: "white",
                          paddingTop: 20,
                        }}
                      >
                        <RenderHTML
                          contentWidth={width}
                          source={{ html: getPostForDate(day)?.body || "" }}
                        />
                      </View>
                    </>
                  ) : (
                    <Text style={[styles.dayText, { color: "black" }]}>
                      {day}
                    </Text>
                  )}
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  navigationButton: {
    fontSize: 24,
    padding: 10,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  weekDay: {
    width: 40,
    textAlign: "center",
  },
  calendar: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
  },
  dayContainer: {
    width: `${100 / 7.5}%`,
    aspectRatio: 3 / 4,
    justifyContent: "center",
    position: "relative",
    borderRadius: 10,
    backgroundColor: "#e2e2e2",
  },
  dayContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    position: "absolute",
    zIndex: 10,
    padding: 2,
    color: "white",
    fontWeight: "bold",
    left: 0,
    top: 0,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
});

export default Calendar;
