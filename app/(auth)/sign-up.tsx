import { View, Image, ScrollView, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import { useState } from "react";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import OAuth from "@/components/OAuth";
import { useSignUp } from "@clerk/clerk-expo";
import Modal from "react-native-modal";
import { fetchAPI } from "@/lib/fetch";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      Alert.alert("Error from clerk");
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (completeSignUp.status === "complete") {
        // console.log(completeSignUp.status, "Running");
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: completeSignUp.createdUserId,
          }),
        });

        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({ ...verification, state: "success" });
      } else {
        setVerification({
          ...verification,
          state: "failed",
          error: "Verification failed",
        });
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        state: "failed",
        // error: err.errors[0].longMessage,
        error: "Not good",
      });
    }
  };
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text
            className={"text-xl font-JakartaSemiBold absolute bottom-8 left-5"}
          >
            Create Your Account
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label={"Name"}
            placeholder={"Enter your name"}
            icon={icons.person}
            value={form.name}
            onChangeText={(value) =>
              setForm({
                ...form,
                name: value,
              })
            }
          />
          <InputField
            label={"Email"}
            placeholder={"Enter your email"}
            icon={icons.email}
            value={form.email}
            onChangeText={(value) =>
              setForm({
                ...form,
                email: value,
              })
            }
          />
          <InputField
            label={"Password"}
            placeholder={"Enter your password"}
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) =>
              setForm({
                ...form,
                password: value,
              })
            }
          />

          <CustomButton
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-6"
          />

          <OAuth />

          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-5"
          >
            <Text>Already have an account? </Text>
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>

        {/*Verification modal*/}
        <Modal
          isVisible={verification.state === "pending"}
          onModalHide={() =>
            setVerification({ ...verification, state: "success" })
          }
        >
          <View className={"bg-white px-7 py-9 rounded-2xl min-h-[300px]"}>
            <Text className={"text-2xl font-JakartaBold text-center mb-2"}>
              Verification
            </Text>

            <Text className={"l font-JakartaBold text-center mb-5"}>
              Verification Code sent to {form.email}
            </Text>

            <InputField
              label={"Code"}
              icon={icons.lock}
              placeholder={"Enter 6 Digit Code Here"}
              value={verification.code}
              keyboardType={"numeric"}
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
            />
            {verification.error && (
              <Text className={"text-red-500 text-sm mt-1"}>
                {verification.error}
              </Text>
            )}

            <CustomButton
              title={"Verify Email"}
              onPress={onPressVerify}
              className={"mt-5 bg-success-500"}
            />
          </View>
        </Modal>
        <Modal isVisible={verification.state === "success"}>
          <View className={"bg-white px-7 py-9 rounded-2xl min-h-[300px]"}>
            <Image
              source={images.check}
              className={"w-[100px] h-[100px] mx-auto my-5"}
            />

            <Text className={"text-3xl font-JakartaBold text-center"}>
              Verified
            </Text>

            <Text
              className={
                "text-base text-gray-400 font-JakartaSemiBold text-center mt-2"
              }
            >
              You have successfully verified your account
            </Text>

            <CustomButton
              title={"Browse Home"}
              onPress={() => {
                setVerification({ ...verification, state: "default" });
                router.push("/(root)/(tabs)/home");
              }}
              className={"mt-8"}
            />
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};
export default SignUp;
