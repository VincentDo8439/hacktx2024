import { React, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";

export default function ProfileScreen() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://10.147.21.188:8000/user/get_user?user_id=${user.uid}`
        );
        const data = await response.json();
        if (response.ok) {
          setUserData(data.user_data);
        } else {
          setError(data.message || "Failed to retrieve user data");
        }
      } catch (error) {
        setError("An error occurred while fetching user data");
      }
    };

    fetchUserData();
  }, []);

  if (!userData && !error) {
    return (
      <View style={styles.centered}>
        <Text>Loading user information...</Text>
      </View>
    );
  }

  if (userData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>{userData.username}</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
