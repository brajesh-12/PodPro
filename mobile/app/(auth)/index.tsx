import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import useAuthStore from '@/store/useAuthStore';
import axios from 'axios';
import * as secureStorage from 'expo-secure-store';
// import { handleAxiosErrorWithAlert } from '@/axios/handleError';

const Login = () => {
  const router = useRouter();

  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");

  const {setAuth} = useAuthStore();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password
      });
      const data = response.data;

      setAuth(data.user, data.tokens.accessToken);
      await secureStorage.setItemAsync('refreshToken', data.tokens.refreshToken);

    } catch (error:any) {
      console.log(error.response.data?.message)
      if(error.response.status === 400) {
        Alert.alert("Error", error.response.data?.message);
      } 
      else {
        Alert.alert("Error", "An unexpected system error occurred.");
      }
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center"
      }}
    >

      <View
        style={{
          paddingHorizontal: 16,
          marginBottom: 20,
          gap: 12
        }}
      >
        <TextInput
          placeholder='Email Address'
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            height: 50,
            width: "100%",
            borderWidth: 1,
            paddingLeft: 12
          }}
        />

        <TextInput
          placeholder='Password'
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
          style={{
            height: 50,
            width: "100%",
            borderWidth: 1,
            paddingLeft: 12
          }}
        />

        <TouchableOpacity
          style={{
            height: 40,
            width: 353,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "black",
            borderRadius: 4
          }}
          onPress={handleLogin}
        >
          <Text
            style={{
              color: "white"
            }}
          >
            Login
          </Text>
        </TouchableOpacity>

      </View>
      <TouchableOpacity
        onPress={() => router.navigate('/(auth)/signup')}
      >
        <Text>
          Signup
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default Login;