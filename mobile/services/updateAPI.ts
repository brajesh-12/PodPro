import authApi from "@/axios/interceptors";
import multipartAPI from "@/axios/multipartAPI";
import { Alert } from "react-native";

const UP_API = {

  updateName: async (name: string) => {
    try {
      const response = await authApi.put('/auth/update/name', {
        userName: name,
      });

      const user = response.data.user;
      console.log(response.data?.message);
      return user;

    } catch (error) {
      console.log("Error updating userName:", error);
    }
  },

  updateProfilePic: async (file: any) => {
    try {
      const formFile = new FormData();

      if (!file) {
        return Alert.alert("Please choose the image.");
      }

      if (file?.startsWith('http')) {
        formFile.append("profilePic", file);
      } else if (file) {
        formFile.append("profilePic", {
          uri: file,
          name: 'profilePic.jpg',
          type: 'image/jpeg'
        } as any);
      }

      const response = await multipartAPI.put('/auth/update/image', formFile);

      const user = response.data.user;

      console.log(response.data?.message);

      return user;

    } catch (error: any) {
      console.log("Error updating profilePic:", error);
      Alert.alert("Error", "Something went wrong");
    }
  },

  updatePlaylistText: async (id: any, body: any) => {
    try {
      const response = await authApi.patch(`playlists/update/${id}`, {
        title: body.title,
        description: body.description
      });

      console.log(response.data.message);

    } catch (error) {
      console.log("Error updating playlist text:", error);
      Alert.alert("Error", "Something went wrong");
    }
  },

  updatePlaylistCover: async (id: any, file: any) => {
    try {
      const formData = new FormData();

      if (!file) {
        return Alert.alert("Please choose the image");
      }

      formData.append("image", {
        uri: file,
        name: "cover.jpg",
        type: "image/jpeg"
      } as any);

      const response = await multipartAPI.patch(`playlists/update/cover/${id}`, formData);

      console.log(response.data.message);

    } catch (error) {
      console.log("Error updating playlist cover:", error);
      Alert.alert("Error", "Something went wrong");
    }
  }
}

export default UP_API;