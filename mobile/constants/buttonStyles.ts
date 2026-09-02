import { StyleSheet } from "react-native";

const ButtonStyle = StyleSheet.create({
  backbutton: {
    justifyContent: "center",
    paddingLeft: 8,

    borderTopWidth: 0.6,
    borderBottomWidth: 0.6,
    borderRightWidth: 0.8,
    borderLeftWidth: 0.8,
    borderRadius: 24,
    borderTopColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomColor: "rgba(255, 255, 255, 0.7)",
    borderLeftColor: "rgba(255, 255, 255, 0.8)",
    borderRightColor: "rgba(255, 255, 255, 0.8)"
  },

  singleButton: {
    backgroundColor: "rgb(255, 255, 255, 0.04)",
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.8)",
    borderBottomColor: "rgba(255, 255, 255, 0.8)",
    borderLeftColor: "rgba(255, 255, 255, 0.9)",
    borderRightColor: "rgba(255, 255, 255, 0.9)"
  },

  buttonGroup: {
    paddingLeft: 4,
    borderTopWidth: 0.8,
    borderBottomWidth: 0.8,
    borderLeftWidth: 0.6,
    borderRightWidth: 0.6,
    borderTopColor: "rgba(255, 255, 255, 0.9)",
    borderBottomColor: "rgba(255, 255, 255, 0.9)",
    borderLeftColor: "rgba(255, 255, 255, 0.8)",
    borderRightColor: "rgba(255, 255, 255, 0.8)"
  }
});

export default ButtonStyle;