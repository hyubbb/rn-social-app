import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import Avatar from "@/components/Avatar";
import { hp, wp } from "@/helpers/commons";
import { theme } from "@/constants/themes";
import { useAuth } from "@/contexts/AuthContext";
import { UserType } from "@/types";
import RichTextEditor from "@/components/RichTextEditor";
import { useLocalSearchParams, useRouter } from "expo-router";
import Icon from "@/assets/icons";
import Button from "@/components/Button";
import * as ImagePicker from "expo-image-picker";
import { getSupabaseFileUrl } from "@/service/imageService";
import { ImagePickerAsset } from "expo-image-picker";
import { ResizeMode, Video } from "expo-av";
import { createOrUpdatePost } from "@/service/postService";
import { RichEditor } from "react-native-pell-rich-editor";

type PostData = {
  id?: string;
  file: string | ImagePickerAsset | null;
  body: string;
  user_id: string;
};

const newPost = () => {
  const { user: userData } = useAuth();
  const user = userData as UserType;
  const bodyRef = useRef<string>("");
  const editorRef = useRef<RichEditor | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<PostData["file"]>(null);
  const { data } = useLocalSearchParams(); // 직렬화된 데이터를 받아옴
  const post = data ? JSON.parse(decodeURIComponent(data as string)) : null; // 역직렬화

  useEffect(() => {
    if (post && post.id) {
      bodyRef.current = post.body as string;
      setFile(post.file as PostData["file"]);

      setTimeout(() => {
        editorRef.current?.setContentHTML(post.body as string);
      }, 500);
    }
  }, []);

  const onPick = async (isImage: boolean) => {
    let mediaConfig: any = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    };

    // isImage가 false면 비디오
    if (!isImage) {
      mediaConfig = {
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
      };
    }
    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const isLocalFile = (file: any) => {
    if (typeof file == "object") return true;
  };

  const getFileType = (file: any) => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.type;
    }

    // check image or video for remote file
    if (file.includes("postImage")) {
      return "Image";
    }
    return "Video";
  };

  const getFileUri = (file: any) => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.uri;
    }
    return getSupabaseFileUrl(file)?.uri;
  };

  const onSubmit = async () => {
    if (!bodyRef.current && !file) {
      Alert.alert("게시글 작성 실패", "내용을 입력해주세요.");
      return;
    }

    let data: PostData = {
      file: file,
      body: bodyRef.current,
      user_id: user?.id,
    };

    if (post && post.id) {
      data.id = post.id as string;
    }

    setLoading(true);
    const result = await createOrUpdatePost(data);
    setLoading(false);
    if (result.success) {
      setFile(null);
      bodyRef.current = "";
      editorRef.current?.setContentHTML("");
      router.back();
    } else {
      Alert.alert("Post", result.msg);
    }
  };

  const onPress = () => {
    editorRef.current?.blurContentEditor();
  };

  const handleEditorFocus = () => {
    // ScrollView를 최상단으로 스크롤
    scrollViewRef.current?.scrollTo({ y: 350, animated: true });
  };

  return (
    <ScreenWrapper bg='white'>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.container}>
          <Header title='게시글 작성' />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
          >
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.scrollView}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps='handled'
            >
              {/* avatar */}
              <View style={styles.header}>
                <Avatar
                  uri={user?.image || ""}
                  size={hp(6)}
                  rounded={theme.radius.xl}
                />
                <View style={{ gap: 3 }}>
                  <Text style={styles.userName}>{user?.name}</Text>
                  <Text style={styles.publicText}>Public</Text>
                </View>
              </View>
              {file && (
                <View style={styles.file}>
                  {getFileType(file) == "video" ? (
                    <Video
                      source={{ uri: getFileUri(file) }}
                      resizeMode={ResizeMode.COVER}
                      useNativeControls
                      isLooping
                      style={{ flex: 1 }}
                    />
                  ) : (
                    <Image
                      source={{ uri: getFileUri(file) }}
                      resizeMode='contain'
                      style={{ flex: 1 }}
                    />
                  )}
                  <Pressable
                    style={styles.closeIcon}
                    onPress={() => setFile(null)}
                  >
                    <Icon name='trash-outline' size={22} color='white' />
                  </Pressable>
                </View>
              )}
              <View style={styles.media}>
                <View style={styles.mediaIcons}>
                  <Pressable
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRightWidth: 1,
                      borderColor: theme.colors.gray,
                    }}
                    onPress={() => onPick(true)}
                  >
                    <Icon
                      name='image-outline'
                      size={40}
                      color={theme.colors.text}
                    />
                  </Pressable>
                  <Pressable
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => onPick(false)}
                  >
                    <Icon
                      name='videocam-outline'
                      size={40}
                      color={theme.colors.text}
                    />
                  </Pressable>
                </View>
              </View>

              <View style={styles.textEditor}>
                <RichTextEditor
                  editorRef={editorRef}
                  onChange={(body) => (bodyRef.current = body)}
                  onFocus={handleEditorFocus}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
          <Button
            buttonStyle={{ height: hp(6.2) }}
            title={post && post.id ? "수정" : "게시"}
            loading={loading}
            hasShadow={false}
            onPress={onSubmit}
          />
        </View>
      </TouchableWithoutFeedback>
    </ScreenWrapper>
  );
};

export default newPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
    gap: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  userName: {
    fontSize: hp(2),
    fontWeight: theme.fonts.semiBold,
    color: theme.colors.text,
  },
  publicText: {
    fontSize: hp(1.7),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textLight,
  },
  scrollView: {
    gap: 20,
  },
  textEditor: {
    position: "relative",
    // height: hp(33),
  },
  file: {
    width: "100%",
    height: hp(30),
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  media: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    padding: 10,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
  },
  mediaIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  addImageText: {
    fontSize: hp(1.8),
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    backgroundColor: theme.colors.rose,
    borderRadius: theme.radius.lg,
  },
});
