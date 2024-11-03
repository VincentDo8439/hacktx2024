import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { CommonActions } from "@react-navigation/native";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const result = await login(email, password);
      if (!result.success) {
        Alert.alert("Login failed", result.message); // Use the error message
      } else {
        setEmail("");
        setPassword("");
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Tab" }],
          })
        );
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
      Alert.alert(
        "Login failed",
        "An error occurred during login. Please try again later."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <View style={styles.inputContainer}>
        <Text> Email: </Text>
        <TextInput
          value={email}
          style={styles.input}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text> Password: </Text>
        <TextInput
          value={password}
          secureTextEntry={true}
          style={styles.input}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text>Sign up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogin}>
        <Text>Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: "4%",
    display: "flex",
    marginBottom: "6%",
    width: "92%",
    marginHorizontal: "10%",
    borderColor: "#111111",
    borderRadius: "10%",
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#939393",
    width: "100%",
    paddingHorizontal: "2%",
    paddingVertical: "4.5%",
  },
});

export default LoginScreen;
