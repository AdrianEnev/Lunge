import { View, Text, Pressable } from 'react-native'
import React, { useRef, useState } from 'react'
import tw from 'twrnc'
import { BlurView } from 'expo-blur';
import AddFoodChangeNutrientModal from '@modals/food/AddFoodChangeNutrientModal';
import Slider from '@react-native-community/slider';

const AddFoodNutrientsComponent = (
    { 
        name, 
        setName, 
        calories, 
        grams, 
        protein, 
        carbs, 
        fat, 
        setCalories, 
        setGrams, 
        setProtein, 
        setCarbs, 
        setFat,
        translation
    }: 
    { 
        name: string, 
        setName: any, 
        calories: any, 
        grams: any, 
        protein: any, 
        carbs: any, 
        fat: any, 
        setCalories: any, 
        setGrams: any, 
        setProtein: any, 
        setCarbs: any, 
        setFat: any,
        translation: any
    }
) => {

    const [isChangeValueModalVisible, setIsChangeValueModalVisible] = useState(false);
    const [selectedNutrient, setSelectedNutrient] = useState('');

    const [nutrientPosition, setNutrientPosition] = useState({ top: 0, left: 0 });

    const nameRef = useRef(null)
    const calorieRef = useRef(null);
    const proteinRef = useRef(null);
    const carbRef = useRef(null);
    const fatRef = useRef(null);

    // Calculate the position of the modal to show up by getting the clicked nutrient box position
    const handlePress = (nutrient: string, ref: any) => {
        ref.current.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
            setSelectedNutrient(nutrient);
            setNutrientPosition({ top: py, left: px });
            setIsChangeValueModalVisible(true);
        });
    };

    return (

        <>
            { isChangeValueModalVisible && (
                <BlurView
                    style={tw`absolute w-full h-full z-10`}
                    intensity={50}
                    tint='dark'
                />
            )}

            <View style={tw`flex-1`}>

                <AddFoodChangeNutrientModal
                    nutrient={selectedNutrient}
                    oldValue={selectedNutrient === 'Calories' ? calories : selectedNutrient === 'Protein' ? protein : selectedNutrient === 'Carbs' ? carbs : selectedNutrient === 'Fat' ? fat : name}
                    setName={setName}
                    setCalories={setCalories}
                    setProtein={setProtein}
                    setCarbs={setCarbs}
                    setFat={setFat}
                    isAddFoodChangeNutrientModalVisible={isChangeValueModalVisible}
                    setIsAddFoodChangeNutrientModalVisible={setIsChangeValueModalVisible}
                    position={nutrientPosition}
                />
                
                <View style={tw`w-[94.5%] h-[20%] mx-3 mt-2 flex flex-row justify-between flex-wrap gap-y-3`}>

                    <Pressable ref={nameRef} style={tw`w-[100%] h-[70%] bg-[#9263fa] rounded-xl`} onPress={() => {
                        handlePress('Food Name', nameRef)
                    }}>

                        <Text style={tw`text-2xl text-white font-medium text-center my-1 mt-1`}>{translation('food-name')}</Text>

                        <View style={tw`flex-1 items-center justify-center mb-4`}>
                            <Text style={tw`text-4xl text-white font-medium text-center`}>{name}</Text>
                        </View>

                    </Pressable>


                    <Pressable ref={calorieRef} style={tw`w-[49%] h-full bg-[#3f8aff] rounded-xl`} onPress={() => {
                        handlePress('Calories', calorieRef)
                    }}>

                        <Text style={tw`text-2xl text-white font-medium text-center mt-1`}>{translation('calories')}</Text>

                        <View style={tw`flex-1 items-center justify-center mb-4`}>
                            <Text style={tw`text-4xl text-white font-medium text-center`}>{!calories ? '0' : calories}kcal</Text>
                        </View>

                    </Pressable>

                    <Pressable ref={proteinRef} style={tw`w-[49%] h-full bg-[#fd3e54] rounded-xl`} onPress={() => {
                        handlePress('Protein', proteinRef)
                    }}>

                        <Text style={tw`text-2xl text-white font-medium text-center mt-1`}>{translation('protein')}</Text>

                        <View style={tw`flex-1 items-center justify-center mb-4`}>
                            <Text style={tw`text-4xl text-white font-medium text-center`}>{!protein ? '0' : protein}{translation('grams-short')}</Text>
                        </View>

                    </Pressable>

                    <Pressable ref={carbRef} style={tw`w-[49%] h-full bg-[#0fbf8f] rounded-xl`} onPress={() => {
                        handlePress('Carbs', carbRef)
                    }}>

                        <Text style={tw`text-2xl text-white font-medium text-center mt-1`}>{translation('carbs')}</Text>

                        <View style={tw`flex-1 items-center justify-center mb-4`}>
                            <Text style={tw`text-4xl text-white font-medium text-center`}>{!carbs ? '0' : carbs}{translation('grams-short')}</Text>
                        </View>

                    </Pressable>
                    
                    <Pressable ref={fatRef} style={tw`w-[49%] h-full bg-[#ffca2c] rounded-xl`} onPress={() => {
                        handlePress('Fat', fatRef)
                    }}>

                        <Text style={tw`text-2xl text-white font-medium text-center mt-1`}>{translation('fat')}</Text>

                        <View style={tw`flex-1 items-center justify-center mb-4`}>
                            <Text style={tw`text-4xl text-white font-medium text-center`}>{!fat ? '0' : fat}{translation('grams-short')}</Text>
                        </View>

                    </Pressable>

                    <View style={tw`w-full h-12 flex flex-col`}>

                        <View style={tw`flex flex-row justify-between`}>
                            <Text style={tw`text-xl font-medium text-gray-500`}>{translation('grams-2')}</Text>
                            <Text style={tw`text-xl font-medium text-gray-500 mr-1`}>{grams}</Text>
                        </View>
                        

                        <Slider
                            style={tw`w-full h-12 mt-[-4px]`}
                            value={grams}
                            onValueChange={(value) => setGrams(Math.round(value))}
                            minimumValue={0}
                            maximumValue={1000}
                            minimumTrackTintColor="#6b7280"
                            maximumTrackTintColor="#6b7280"
                        />
                    </View>

                </View>

            </View>
        </>
    )
}

export default AddFoodNutrientsComponent