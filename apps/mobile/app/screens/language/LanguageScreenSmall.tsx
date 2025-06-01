import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import tw from 'twrnc'
import { Picker } from 'react-native-wheel-pick'
import AsyncStorage from '@react-native-async-storage/async-storage'
import GlobalContext from '@config/GlobalContext'

const LanguageScreenSmall = (
    { setLocalLanguageSet, iphoneModel }: 
    { setLocalLanguageSet: (value: boolean) => void, iphoneModel: string }) => 
{

    const [language, setLanguage] = useState('Български')
    const languagesEN = [ 
        "Български", 'English', "Français", "Deutsch", "Русский", "Italiano", "Español"
    ] 

    const finishButtonClicked = async () => {
        const languageShort = language === 'English' ? 'en' : language === 'Български' ? 'bg' : language === 'Français' ? 'fr' : language === 'Deutsch' ? 'de' : language === 'Русский' ? 'ru' : language === 'Italiano' ? 'it' : language === 'Español' ? 'es' : 'en';
        await AsyncStorage.setItem(`language`, languageShort);
        setLocalLanguageSet(true);
    }

    //console.log(iphoneModel)
    //console.log('small screen')
    
    return (
        <View style={tw`flex-1 flex-col bg-white`}>

            <View style={tw`w-full h-24 bg-[#fd1c47] absolute top-0 justify-center items-center pt-8`}>
                <Text style={tw`text-2xl text-white font-bold`}>Lunge</Text>
            </View>
            
            <View style={tw`flex-1 items-center justify-center mt-[10%]`}>

                <View style={tw`mx-5 mb-5`}>
                    <Text style={tw`font-medium text-xl text-center`}>Какъв език предпочиташ?</Text>
                    <Text style={tw`font-medium text-base text-gray-500 mt-3 text-center`}>Това може да бъде променено по-късно!</Text>
                </View>

                <View style={tw`w-48 h-64 bg-gray-200 rounded-[47px] flex items-center pt-3`}>

                    <Text style={tw`font-medium text-2xl mt-2 mb-3`}>{language}</Text>
                    <View style={tw`w-full h-[2px] rounded-full bg-gray-300`}></View>

                    <Picker
                        style={tw`h-full w-full bg-gray-200 rounded-[47px]`}
                        selectedValue={language}
                        pickerData={languagesEN}
                        onValueChange={(value: any) => { setLanguage(value) }}
                    />

                </View>
            </View>

            <View style={tw`mx-2 mb-3`}>
                <TouchableOpacity style={tw`w-full h-16 bg-[#fd1c47] rounded-2xl flex justify-center items-center shadow-md border border-gray-200 mb-4`}
                    onPress={() => finishButtonClicked()}>

                    <Text style={tw`text-2xl text-white font-medium`}>Готово</Text>

                </TouchableOpacity>
            </View>
        </View>
    )
}

export default LanguageScreenSmall