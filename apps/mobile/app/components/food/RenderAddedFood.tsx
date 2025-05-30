import { View, Text, Pressable } from 'react-native';
import React from 'react';
import tw from "twrnc";
import Ionicons from '@expo/vector-icons/Ionicons';

const RenderAddedFood = ({item, navigation, date}: any) => {

    const dateOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    const time = item?.date ? new Date(item.date).toLocaleTimeString([], dateOptions) : ''; // Convert date string to Date object

    return (
        <Pressable style={tw`w-full h-14 bg-white py-1`} onPress={() => navigation.navigate("Food-Info", {food: item, time: time, unformattedDate: date})}>
            <View style={tw`flex flex-row justify-between`}>

                <View style={tw`flex flex-row`}>

                    <View style={tw`w-16 h-10 bg-[#fd1c47] rounded-xl flex items-center justify-center mr-2`}>
                        <Text style={tw`text-lg font-medium text-white`} ellipsizeMode='tail' numberOfLines={1}>{time}</Text>
                    </View>
                    
                    <View style={tw`flex flex-row justify-start items-center max-w-[75%]`}>
                        <Text style={tw`text-lg font-medium`} ellipsizeMode='tail' numberOfLines={1}>{item.title}</Text>
                    </View>
                </View>

                <View style={tw`flex justify-center`}>
                    <Ionicons name='chevron-forward' size={24} color='#6b7280' />
                </View>

            </View>
        </Pressable>
    )
}

export default RenderAddedFood;