import { View, Text, TouchableOpacity, TextInput, Alert, Pressable } from 'react-native'
import { useRouter } from 'expo-router';
import { useState } from 'react';
import useAuthStore from '@/store/useAuthStore';
import axios from 'axios';
import * as secureStorage from 'expo-secure-store';
import { ArrowLeft } from 'lucide-react-native';

const Signup = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ReEnterPassword, setReEnterPassword] = useState("");

  const { setAuth } = useAuthStore();

  const handleSignup = async () => {
    try {
      if(password !== ReEnterPassword) {
        throw new Error('ReEnterPassword not match');
      }

      const response = await axios.post('http://localhost:3000/api/auth/signup', {
        email,
        password,
      });

      const data = response.data;

      setAuth(data.user, data.tokens.accessToken);
      await secureStorage.setItemAsync('refreshToken', data.tokens.refreshToken);
      router.navigate({
        pathname: '/(auth)/setup/PickProfileImage'
      });

    } catch (error: any) {
      console.log("Error signing up:", error);
      if (error.response?.status === 400) {
        Alert.alert("Error", error.response.data?.message);

      } else if (error.message) {
        Alert.alert("Error", error.message);
      }
       else {
        Alert.alert("Error", "An unexpected system error occurred");
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center"
      }}
    >

      {/* header */}
      <View
        style={{
          height: 48,
          paddingHorizontal: 16,
          marginBottom: 32,
          justifyContent: "center"
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            height: 32,
            width: 32,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ArrowLeft size={22} />
        </Pressable>

      </View>

      <View
        style={{
          paddingHorizontal: 16,
          marginBottom: 20,
          gap: 12
        }}
      >

        {/* Email Address */}
        <TextInput
          placeholder='Email'
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

        {/* confirm password */}
        <TextInput
          placeholder='Re-enter Password'
          value={ReEnterPassword}
          onChangeText={setReEnterPassword}
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
          onPress={handleSignup}
        >
          <Text
            style={{
              color: "white"
            }}
          >
            Signup
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  )
}

export default Signup;