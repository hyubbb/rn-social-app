import { theme } from "@/constants/themes";
import React from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
const RichTextEditor = ({
  editorRef,
  onChange,
  onFocus,
}: {
  editorRef: React.MutableRefObject<RichEditor | null>;
  onChange: (body: string) => void;
  onFocus: () => void;
}) => {
  return (
    <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
      <View style={{ minHeight: 285 }}>
        <RichToolbar
          actions={[
            actions.setStrikethrough,
            actions.removeFormat,
            actions.setBold,
            actions.setItalic,
            actions.blockquote,
            actions.alignLeft,
            actions.alignCenter,
            actions.alignRight,
            actions.code,
            actions.line,
          ]}
          iconMap={{
            [actions.heading1]: ({ tintColor }: { tintColor: string }) => (
              <Text style={{ color: tintColor }}>H1</Text>
            ),
            [actions.heading4]: ({ tintColor }: { tintColor: string }) => (
              <Text style={{ color: tintColor }}>H4</Text>
            ),
          }}
          style={styles.richBar}
          flatContainerStyle={styles.flatStyle}
          selectedIconTintColor={theme.colors.primaryDark}
          editor={editorRef}
          disabled={false}
        />

        <RichEditor
          ref={editorRef}
          containerStyle={styles.richEditor}
          editorStyle={styles.contentStyle}
          placeholder='내용을 입력해주세요.'
          onChange={onChange}
          onFocus={onFocus}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RichTextEditor;

const styles = StyleSheet.create({
  richBar: {
    borderTopRightRadius: theme.radius.xl,
    borderTopLeftRadius: theme.radius.xl,
    backgroundColor: theme.colors.gray,
  },
  richEditor: {
    minHeight: 240,
    flex: 1,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderBottomLeftRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
    borderColor: theme.colors.gray,
    padding: 5,
  },
  contentStyle: {
    color: theme.colors.textDark,
  },
  flatStyle: {
    paddingHorizontal: 0,
    gap: 3,
  },
});
