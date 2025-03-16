import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Button,
} from "react-native";
import { useAuth } from "../../hooks/Auth/authContext";
import apiClient from "../../hooks/ApiRequest/apiClient";
import { useRoute } from "@react-navigation/native";
import { Rating, AirbnbRating } from "react-native-ratings";

const { height } = Dimensions.get("window"); // Get screen height
const ButtonFunction = () => {
  const route = useRoute<any>();
  const bookID = route.params.idBook;
  const { user } = useAuth();
  const [like, setLike] = useState(false);
  const [modalVote, setModalVote] = useState(false);
  const [rating, setRating] = useState(5);

  const checkBookInFavourite = async () => {
    try {
      const response = await apiClient.get(
        `accounts/${bookID}/favourite/${user?.id}`
      );
      if (response.data === true) {
        setLike(true);
      } else {
        setLike(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const addToFavourite = async () => {
    try {
      await apiClient.post("accounts/add", {
        userId: user?.id,
        bookId: bookID,
      });
      checkBookInFavourite();
    } catch (error) { }
  };
  useEffect(() => {
    checkBookInFavourite();
  }, []);


  const rateBook = async () => {
    try {
      await apiClient.post("books/rating", {
        bookId: bookID,
        valueRate: rating
      })

    } catch (error) {

    } finally {
      setModalVote(false);
    }
  }
  // console.log(user)
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalVote(true)}
        style={[styles.button, { width: "48%", backgroundColor: "#ff3860" }]}
      >
        <View style={styles.touch}>
          <Ionicons name="star" color={"white"} />
          <Text style={styles.functionText}>Đánh giá</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { width: "48%", backgroundColor: "#bd10e0" }]}
        onPress={addToFavourite}
      >
        {like ? (
          <View style={[styles.touch]}>
            <Ionicons name="thumbs-up" color={"white"} />
            <Text style={[styles.functionText]}>Đã Thích</Text>
          </View>
        ) : (
          <View style={styles.touch}>
            <Ionicons name="thumbs-up" color={"white"} />
            <Text style={styles.functionText}>Thích</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal visible={modalVote} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setModalVote(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modal}>
                <AirbnbRating
                  defaultRating={rating}
                  onFinishRating={setRating}
                  size={30}
                  reviews={[
                    "Tệ",
                    "Không hay",
                    "Bình thường",
                    "Tốt",
                    "Tuyệt vời",
                  ]}
                />
                <View style={styles.buttonContainer}>
                  <Button
                    title="Đánh giá"
                    onPress={() => rateBook()}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default ButtonFunction;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    columnGap: 5,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
    padding: 10,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    height: 40,
    borderColor: "transparent",
    borderRadius: 5,
    marginBottom: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  touch: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 5,
  },
  functionText: {
    color: "white",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    width: 300,
    height: height * 0.2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    columnGap: 10,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
});
