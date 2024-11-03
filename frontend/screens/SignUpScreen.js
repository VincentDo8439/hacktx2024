import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { register } = useAuth();

  const handleRegister = async () => {
    if (email === "" || password === "" || username === "") {
      Alert.alert("Email and/or password fields are empty. Try again");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Password needs to be longer than 6 characters");
      return;
    }
    console.log("Email: " + email + ", Password:" + password);
    const result = await register(email, password);

    if (!result.success) {
      Alert.alert("Failed to create an account", result.message); // Use the error message
      setEmail("");
      setPassword("");
      setUsername("");
    } else {
      try {
        const response = await fetch(
          "http://10.147.21.188:8000/user/create_user",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              username: username,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          Alert.alert(
            "Success",
            `User created successfully. User ID: ${data.user_id}`
          );
          setEmail("");
          setPassword("");
          setUsername("");
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Tab" }],
            })
          );
        } else {
          Alert.alert("Error", data.message || "Failed to create user");
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while creating the user");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Sign up</Text>
      <View style={styles.inputContainer}>
        <Text> Email: </Text>
        <TextInput value={email} style={styles.input} onChangeText={setEmail} />
      </View>
      <View style={styles.inputContainer}>
        <Text> Username: </Text>
        <TextInput
          value={username}
          style={styles.input}
          onChangeText={setUsername}
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
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRegister}>
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

export default SignUpScreen;
