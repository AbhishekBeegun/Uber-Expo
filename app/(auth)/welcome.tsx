import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Swiper from "react-native-swiper";
import { useRef, useState } from "react";
import { onboarding } from "@/constants";
import CustomButton from "@/components/CustomButton";

const OnBoarding = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const IsLastSlide = activeIndex === onboarding.length - 1;
  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white">
      <TouchableOpacity
        onPress={() => {
          router.replace("/(auth)/sign-up");
        }}
        className="w-full flex items-end justify-end p-5"
      >
        <Text className="text-black text-md font-JakartaBold">Skip</Text>
      </TouchableOpacity>

      <Swiper
        ref={swiperRef}
        loop={false}
        dot={
          <View className="w-[32px] h-[5px] mx-1 bg-gray-100 rounded-full" />
        }
        activeDot={
          <View className="w-[32px] h-[5px] mx-1 bg-blue-300 rounded-full" />
        }
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((item, index) => (
          <View key={item.id} className="flex items-center justify-center p-5">
            <Image
              source={item.image}
              className="w-full h-[280px]"
              resizeMode="contain"
            />
            <View className="flex flex-col items-center justify-center w-full mt-10 mx-10">
              <Text className="text-black text-2xl font-JakartaBold text-center">
                {item.title}
              </Text>
              <Text className="text-md font-JakartaSemiBold text-center text-[#858585] mt-3">
                {item.description}
              </Text>
            </View>
          </View>
        ))}
      </Swiper>

      <CustomButton
        onPress={() =>
          IsLastSlide
            ? router.replace("/(auth)/sign-up")
            : swiperRef?.current?.scrollBy(1)
        }
        title={IsLastSlide ? "Get Started" : "Next"}
        IconLeft={undefined}
        IconRight={undefined}
        className="w-11/12 mt-10 mb-5"
      />
    </SafeAreaView>
  );
};
export default OnBoarding;
