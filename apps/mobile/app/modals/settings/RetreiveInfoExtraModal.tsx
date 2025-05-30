import { View, Text, Modal, Pressable } from 'react-native'
import React, { useContext } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import GlobalContext from '@config/GlobalContext';

interface RetreiveInfoInformationModalProps {
    isRetreiveInfoExtraModalVisible: boolean;
    setIsRetreiveInfoExtraModalVisible: (isVisible: boolean) => void;
    setIsRetreiveInfoModalVisible: (isVisible: boolean) => void;
}

const RetreiveInfoInformationModal: React.FC<RetreiveInfoInformationModalProps> = ({ 
    isRetreiveInfoExtraModalVisible, 
    setIsRetreiveInfoExtraModalVisible, 
    setIsRetreiveInfoModalVisible
}) => {

    const {t} = useTranslation();

    const {iphoneModel} = useContext(GlobalContext);
            
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isRetreiveInfoExtraModalVisible}
            onRequestClose={() => {
                setIsRetreiveInfoExtraModalVisible(!isRetreiveInfoExtraModalVisible);
            }}
            >
                <View style={tw`w-[85%] h-full justify-center items-center self-center`}>
                    <Pressable style={tw`bg-gray-50 w-full ${iphoneModel.includes('SE') ? 'h-[35%]' : 'h-[25%]'} rounded-2xl pt-3 px-2`}>
                        
                        <View style={tw`w-full flex flex-row justify-between`}>
                            
                            <Pressable onPress={() => {
                                setIsRetreiveInfoModalVisible(true)
                                setIsRetreiveInfoExtraModalVisible(false)
                            }}>
                                <Ionicons name='return-down-back-outline' size={35} color='#3b82f6'/>
                                
                            </Pressable>
                            
                        </View>

                        <Text style={tw`text-xl font-medium text-center mt-3`}>{t('retreive-info-information')}</Text>
                        
                    </Pressable>
                </View>
        </Modal>
    )
}

export default RetreiveInfoInformationModal