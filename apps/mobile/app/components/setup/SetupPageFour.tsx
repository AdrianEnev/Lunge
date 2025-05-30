import { View, Text, Pressable } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import tw from 'twrnc';
import { Picker } from 'react-native-wheel-pick';
import GlobalContext from '@config/GlobalContext';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

const SetupPageFour = ({ heightType, setHeightType, height, setHeight, setWeightType, setWeight, weight }: any) => {

    const [pickerData, setPickerData] = useState<number[]>([]);
    const [tempHeight, setTempHeight] = useState(170);
    const { iphoneModel } = useContext(GlobalContext);

    useEffect(() => {
        const data: number[] = [];
        for (let i = 120; i <= 220; i++) {
            data.push(i);
        }
        setPickerData(data);
    }, []);

    const cmToFeetInches = (cm: number) => {
        const totalInches = cm * 0.393701;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        return { feet, inches };
    };

    const feetInchesToCm = (feet: number, inches: number) => {
        return Math.round((feet * 12 + inches) * 2.54);
    };

    const currentLanguage = i18next.language;
    const { t } = useTranslation();

    return (
        <View style={tw`flex flex-col ${iphoneModel.includes('Pro') || iphoneModel.includes('Plus') ? "mt-[10%]" : iphoneModel.includes('SE') ? "mt-4" : "mt-[15%]"} h-full`}>
            <View style={tw`mx-5`}>
                <Text style={tw`font-medium text-2xl text-center`}>{t('setup-height')}</Text>
                {currentLanguage === 'en' ? 
                     <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>This will <Text style={tw`font-bold`}>only</Text> be used to calculate your daily BMR!</Text> : currentLanguage == "bg" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Това ще бъде използвано <Text style={tw`font-bold`}>само</Text> за изчисляване на твоят дневен BMR!</Text> ) : currentLanguage == "de" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Dies wird <Text style={tw`font-bold`}>nur</Text> verwendet, um Ihren täglichen BMR zu berechnen!</Text> ) : currentLanguage == "fr" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Cela sera <Text style={tw`font-bold`}>uniquement</Text> utilisé pour calculer votre BMR quotidien!</Text> ) : currentLanguage == "ru" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Это будет <Text style={tw`font-bold`}>только</Text> использоваться для расчета вашего ежедневного BMR!</Text> ) : currentLanguage == "it" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Questo sarà <Text style={tw`font-bold`}>solo</Text> utilizzato per calcolare il tuo BMR giornaliero!</Text> ) : currentLanguage == "es" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Esto se <Text style={tw`font-bold`}>solo</Text> utilizará para calcular tu BMR diario!</Text>
                ) : null}
            </View>

            <View style={tw`flex flex-row w-full mx-3 mt-[7%]`}>
                <Pressable
                    style={tw`w-[47.5%] h-14 border border-gray-300 rounded-l-[25px] flex items-center justify-center`}
                    onPress={() => {
                        if (heightType === "CM") return;
                        setHeightType('CM');
                        setHeight(feetInchesToCm(height.feet, height.inches));
                        setWeightType('KG');
                        setWeight(Math.round(weight / 2.20462));
                    }}
                >
                    <Text style={tw`font-medium text-xl ${heightType === 'CM' ? 'text-[#fd3e4b]' : 'text-black'}`}>CM</Text>
                </Pressable>

                <Pressable
                    style={tw`w-[47.5%] h-14 border border-gray-300 rounded-r-[25px] flex items-center justify-center`}
                    onPress={() => {
                        if (heightType === "FT") return;
                        setHeightType('FT');
                        setHeight(cmToFeetInches(height));
                        setWeightType('LB');
                        setWeight(Math.round(weight * 2.20462));
                    }}
                >
                    <Text style={tw`font-medium text-xl ${heightType === 'FT' ? 'text-[#fd3e4b]' : 'text-black'}`}>FT</Text>
                </Pressable>
            </View>

            <View style={tw`flex flex-row gap-x-1 justify-center mt-[7%]`}>
                {heightType === 'CM' ? (
                    <>
                        <Text style={tw`font-medium text-5xl`}>{height}</Text>
                        <Text style={tw`text-gray-500 text-xl font-medium mt-[12px]`}>cm</Text>
                    </>
                ) : (
                    <>
                        <Text style={tw`font-medium text-5xl`}>{height.feet}'</Text>
                        <Text style={tw`font-medium text-5xl`}>{height.inches}"</Text>
                    </>
                )}
            </View>

            <View style={tw`flex-1 items-center mt-[5%]`}>
                <View style={tw`w-[37%] ${iphoneModel.includes('SE') ? "h-[55%]" : "h-[60%]"} bg-gray-200 rounded-[47px] flex items-center pt-3`}>
                    <Picker
                        style={tw`h-1/2 w-full bg-gray-200 rounded-[47px] ${!iphoneModel.includes('SE') ? "mt-[50%]" : ""}`}
                        selectedValue={heightType === 'CM' ? height : tempHeight}
                        pickerData={pickerData}
                        onValueChange={(value: number) => {
                            if (heightType === 'CM') {
                                setHeight(value);
                                setTempHeight(value);
                            } else {
                                setHeight(cmToFeetInches(value));
                            }
                        }}
                    />
                </View>
            </View>
        </View>
    );
};

export default SetupPageFour;
