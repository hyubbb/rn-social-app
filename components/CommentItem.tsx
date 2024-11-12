import {
  Alert,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { CommentType } from "@/types";
import Avatar from "./Avatar";
import { theme } from "@/constants/themes";
import { hp } from "@/helpers/commons";
import Icon from "@/assets/icons";
import moment from "moment";

const CommentItem = ({
  comment,
  canDelete = false,
  highlight = false,
  onDelete,
}: {
  comment: CommentType;
  canDelete: boolean;
  highlight: boolean;
  onDelete: (id: string) => Promise<void>;
}) => {
  if (!comment) return null;
  const createdAt = moment(comment?.created_at).format("MMM D");

  const handleDelete = () => {
    Alert.alert("삭제", "댓글을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => onDelete(comment?.id!),
      },
    ]);
  };

  return (
    <View key={comment.id} style={styles.comment}>
      <Avatar
        uri={comment?.user?.image ?? null}
        style={{ marginTop: 5 }}
        size={hp(5)}
      />
      <View style={[styles.commentContent, highlight && styles.highlight]}>
        <View style={styles.commentHeader}>
          <View style={styles.commentInfo}>
            <Text
              style={{
                fontSize: hp(2),
                fontWeight: theme.fonts.medium,
                color: theme.colors.textDark,
              }}
            >
              {comment?.user?.name}
            </Text>
            <Text
              style={{
                fontWeight: theme.fonts.medium,
                color: theme.colors.textLight,
              }}
            >
              {createdAt}
            </Text>
          </View>
          {canDelete && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Icon name='trash-outline' size={20} color={theme.colors.rose} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.commentText}>{comment.text}</Text>
      </View>
    </View>
  );
};

export default CommentItem;

const styles = StyleSheet.create({
  comment: {
    flexDirection: "row",
    gap: 5,
  },
  commentContent: {
    flex: 1,
    backgroundColor: theme.colors.darkLight,
    borderRadius: theme.radius.sm,
    padding: 10,
    paddingHorizontal: 13,
    gap: 7,
  },
  commentHeader: {
    justifyContent: "space-between",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  commentInfo: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  commentText: {
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
  },
  deleteButton: {},
  highlight: {
    backgroundColor: "white",
    borderWidth: 0.2,

    borderColor: theme.colors.dark,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
