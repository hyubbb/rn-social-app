import React from "react";
import { Tabs } from "expo-router";
import Icon from "@/assets/icons";
import { theme } from "@/constants/themes";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "home";
          if (route.name === "home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "messageList") {
            iconName = focused ? "chatbubble" : "chatbubble-outline";
          } else {
          }
          // You can return any component that you like here!
          return (
            <Icon name={iconName} size={size} color={theme.colors.primary} />
          );
        },
        tabBarLabel: () => null,
        tabBarStyle: {
          height: 85,
        },
      })}
    >
      <Tabs.Screen
        name='home'
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name='messageList'
        options={{
          title: "Messages",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
