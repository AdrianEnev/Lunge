import { View, Text, TouchableOpacity, SafeAreaView, TouchableWithoutFeedback, Keyboard, ScrollView, TextInput, Pressable, Button, Dimensions } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import tw from 'twrnc'
import BottomNavigationBar from '@components/BottomNavigationBar';
import { Ionicons } from '@expo/vector-icons';
import generateID from '@use/settings/add/useGenerateID';
import saveWorkoutEdits from '@use/workouts/save/useSaveWorkoutEdits';
import startWorkout from '@use/workouts/start/useStartWorkout';
import { BlurView } from 'expo-blur';
import SetIntensityModal from '@modals/workouts/SetIntensityModal';
import saveWorkoutEditsLocally from '@use/workouts/save/useSaveWorkoutEditsLocally';
import GlobalContext from '@config/GlobalContext';
import saveWorkoutEditsFromFolderLocally from '@use/workouts/save/useSaveWorkoutEditsFromFolderLocally';
import DeleteExerciseModal from '@modals/workouts/DeleteExerciseModal';
import startWorkoutInFolder from '@use/workouts/start/useStartWorkoutInFolder';
import { useTranslation } from 'react-i18next';

const ViewWorkout = ({route, navigation}: any) => {

    const { exercises, workout, workoutTitle, folder } = route.params;

    const {internetConnected, iphoneModel} = useContext(GlobalContext)

    const [newWorkoutTitle, setNewWorkoutTitle] = useState('');

    const [pageNumber, setPageNumber] = useState(0);
    const [newExercises, setNewExercises] = useState<any>([...exercises]);
    const [userInputs, setUserInputs] = useState<any>(newExercises.map((exercise: any) => ({
        ...exercise,
        sets: exercise.sets.map((set: any) => ({...set, reps: set.reps, weight: set.weight}))
    })));

    const [saveChangesRan, setSaveChangesRan] = useState(false);

    const addSet = () => {
        const updatedExercises = [...newExercises];
        const updatedUserInputs = [...userInputs];
        const currentExerciseIndex = updatedExercises.findIndex((exercise: any) => exercise.exerciseIndex === pageNumber + 1);
        
        if (currentExerciseIndex !== -1) {
            if (updatedExercises[currentExerciseIndex].sets.length < 9) { // Check if the number of sets is less than 20
                const newSet = {
                    id: generateID(),
                    reps: "",
                    weight: ""
                };
                updatedExercises[currentExerciseIndex].sets.push(newSet);
                updatedUserInputs[currentExerciseIndex].sets.push({...newSet}); // Clone newSet to avoid direct reference
                
                setNewExercises(updatedExercises);
                setUserInputs(updatedUserInputs); // Ensure userInputs is also updated
            } else {
                console.log("Maximum number of sets reached");
            }
        }
    }

    const removeSet = (exerciseIndex: number, setId: string) => {

        const updatedExercises = [...newExercises];
        const updatedUserInputs = [...userInputs];
        const currentExerciseIndex = updatedExercises.findIndex((exercise: any) => exercise.exerciseIndex === exerciseIndex);

        const currentExercise = updatedExercises.find((exercise: any) => exercise.exerciseIndex === exerciseIndex);
      
        if (currentExercise && currentExercise.sets.length === 1) {
            if (pageNumber == 0) {
                return;
            }
        }
    
        if (currentExerciseIndex !== -1) {
            updatedExercises[currentExerciseIndex].sets = updatedExercises[currentExerciseIndex].sets.filter((set: any) => set.id !== setId);
            updatedUserInputs[currentExerciseIndex].sets = updatedUserInputs[currentExerciseIndex].sets.filter((set: any) => set.id !== setId);
            
            setNewExercises(updatedExercises);
            setUserInputs(updatedUserInputs); // Ensure userInputs is also updated
        }

        if (currentExercise) {
            currentExercise.sets.forEach((set: any, index: any) => {
                set.setIndex = index + 1;
            });
        }
    }

    const saveChanges = async () => {

        if (saveChangesRan) {
            return;
        }

        setSaveChangesRan(true);

        if (folder) {
            await saveWorkoutEditsFromFolderLocally(workout, userInputs, newExercises, newWorkoutTitle, folder);
        }else{
            await saveWorkoutEditsLocally(workout, userInputs, newExercises, newWorkoutTitle);
        }

        if (internetConnected) {
            saveWorkoutEdits(workout, userInputs, newExercises, newWorkoutTitle);
        }

        setSaveChangesRan(false);
        navigation.navigate('Workouts');
        
    }
    
    const addExercise = () => {
        
        if (newExercises.length < 9) {
            // Get the last exercise title
            const lastExercise = newExercises[newExercises.length - 1];
            let newTitle;
    
            // Check if the last exercise title matches the pattern "Упражнение + number"
            if (lastExercise && /^Упражнение \d+$/.test(lastExercise.title)) {
                // Extract the number from the last exercise title and increment it
                const lastExerciseNumber = parseInt(lastExercise.title.split(' ')[1], 10);
                newTitle = "Упражнение " + (lastExerciseNumber + 1);
            } else {
                // If no match, default to the normal title generation
                newTitle = "Упражнение " + (newExercises.length + 1);
            }
    
            // Create a new set and exercise object
            const newSet = {
                id: generateID(),
                reps: "",
                weight: "" 
            };
    
            const newExercise = {
                id: generateID(),
                title: newTitle,
                exerciseIndex: newExercises.length + 1,
                sets: [newSet]
            };
    
            // Update the state with the new exercise
            setNewExercises([...newExercises, newExercise]);
            setUserInputs([...userInputs, { ...newExercise, sets: [newSet] }]);
    
            // Update pageNumber to the newly added exercise
            setPageNumber(newExercises.length);
    
            //console.log(newExercises);
        }
    };

    const handleContentSizeChange = (event: any) => {
        const { height } = event.nativeEvent.contentSize;
        const lineHeight = 20;
        const lines = height / lineHeight;
    
        if (lines >= 2) {
          // If content spans 2 or more lines, add bottom margin
          setTextInputStyle(tw`text-xl text-blue-500 font-medium max-w-[85%] min-h-16 max-h-32 ml-3 mb-3`);
        } else {
          // No bottom margin needed for single line
          setTextInputStyle(tw`text-xl text-blue-500 font-medium max-w-[85%] min-h-16 max-h-32 ml-3 mb-[-10px]`);
        }
    };

    const updateExerciseTitle = (exerciseId: string, title: string) => {
    
        // Use newExercises instead of exercises to ensure we're updating the latest state
        const newExercisesUpdated = newExercises.map((exercise: any) => 
            exercise.id.toString() === exerciseId.toString() 
            ? { ...exercise, title } 
            : exercise
        );
        setNewExercises(newExercisesUpdated);
    
        // Ensure userInputs is also updated based on newExercisesUpdated to keep the state consistent
        const updatedUserInputs = userInputs.map((input: any) => 
            input.id.toString() === exerciseId.toString() 
            ? { ...input, title } 
            : input
        );
        setUserInputs(updatedUserInputs);

        //console.log(newExercises)
        //console.log(userInputs)
    };

    const [textInputStyle, setTextInputStyle] = useState({});

    const getDimensions = () => {
        const {width} = Dimensions.get('window')
        return width;
    }

    const [isSetIntensityModalVisible, setIsSetIntensityModalVisible] = useState(false)
    const [currentSelectedSet, setCurrentSelectedSet] = useState(0);

    const [intensityBoxSelected, setIntensityBoxSelected] = useState(0);

    const setSetIntensity = (setIntensityNumber: number) => {
        // Find the current exercise based on the pageNumber
        const updatedExercises = [...newExercises];
        const updatedUserInputs = [...userInputs];
    
        const currentExerciseIndex = updatedExercises.findIndex(
            (exercise: any) => exercise.exerciseIndex === pageNumber + 1
        );
    
        if (currentExerciseIndex !== -1) {
            // Assign the setIntensityNumber to the current selected set in both arrays
            updatedExercises[currentExerciseIndex].sets[currentSelectedSet - 1].intensity = setIntensityNumber;
            updatedUserInputs[currentExerciseIndex].sets[currentSelectedSet - 1].intensity = setIntensityNumber;
    
            // Update the state with the modified arrays
            setNewExercises(updatedExercises);
            setUserInputs(updatedUserInputs);
        }
    };

    const deleteExercise = (exerciseId: any) => {
        //console.log('before deletion');
        ///console.log(newExercises);
    
        const updatedExercises = newExercises.filter((ex: any) => ex.id !== exerciseId);
        const updatedUserInputs = userInputs.filter((input: any) => input.id !== exerciseId);
    
        // Re-index the remaining exercises
        updatedExercises.forEach((exercise: any, index: number) => {
            exercise.exerciseIndex = index + 1; 
        });
    
        updatedUserInputs.forEach((input: any, index: number) => {
            input.exerciseIndex = index + 1;
        });
    
        //console.log('after deletion');
        //console.log(updatedExercises);
    
        setNewExercises(updatedExercises);
        setUserInputs(updatedUserInputs);
    
        // Find the index of the deleted exercise
        const deletedIndex = newExercises.findIndex((ex: any) => ex.id === exerciseId);

        // Ne znam tva zashto raboti ama bez nego se minava nazad vmesto napred pri iztrivane na 1voto uprajnenie
        if (pageNumber == 0 && updatedExercises.length > 0) {
            return;
        }

        if (pageNumber > deletedIndex) {
            setPageNumber(pageNumber - 1);
        } else if (pageNumber === deletedIndex) {
            // If the deleted exercise is the current one
            if (updatedExercises.length > 0) {
                // Set pageNumber to the last exercise if any exercises remain
                setPageNumber(updatedExercises.length - 1);
            } else {
                // If no exercises are left, set pageNumber to 0 (or keep it at 0 for an empty state)
                setPageNumber(0);
            }
        }
    
        console.log('deleted exercise');
    };
    

    const [isDeleteExerciseModalVisible, setIsDeleteExerciseModalVisible] = useState(false);
    const [currentExerciseId, setCurrentExerciseId] = useState('');

    const startWorkoutFunction = async () => {
        if (folder && !saveChangesRan) {
            startWorkoutInFolder(workout, folder, navigation)
        }else if (!saveChangesRan){
            startWorkout(workout, navigation);
        }
    }

    const removeExercise = (index: number) => {
        const updatedExercises = [...newExercises];
        const updatedUserInputs = [...userInputs];

        // Remove the exercise from both newExercises and userInputs
        updatedExercises.splice(index, 1);
        updatedUserInputs.splice(index, 1);

        // Update the state
        setNewExercises(updatedExercises);
        setUserInputs(updatedUserInputs);

        // Adjust pageNumber to prevent it from being out of bounds
        if (index >= updatedExercises.length) {
            setPageNumber(Math.max(0, updatedExercises.length - 1));
        }
    };

    useEffect(() => {
        const currentExercise = newExercises[pageNumber];
        
        if (currentExercise && currentExercise.sets.length === 0) {
            if (pageNumber != 0) {
                removeExercise(pageNumber);
            }
            
        }
    }, [pageNumber, newExercises]);

    const {t} = useTranslation();

    return (
        <>

        { (isSetIntensityModalVisible || isDeleteExerciseModalVisible) && (
                <BlurView
                    style={tw`absolute w-full h-full z-10`}
                    intensity={50}
                    tint='dark'
                />
            )}

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={tw`w-full h-full bg-white`}>

                    <SetIntensityModal 
                    
                        isSetIntensityModalVisible={isSetIntensityModalVisible}
                        setIsSetIntensityModalVisible={setIsSetIntensityModalVisible}
                        setNumber={currentSelectedSet}
                        intensityBoxSelected={intensityBoxSelected}
                        setIntensityBoxSelected={setIntensityBoxSelected}
                        setSetIntensity={setSetIntensity}

                    />

                    <DeleteExerciseModal 
                    
                        isDeleteExerciseModalVisible={isDeleteExerciseModalVisible}
                        setIsDeleteExerciseModalVisible={setIsDeleteExerciseModalVisible}
                        deleteExercise={deleteExercise}
                        currentExerciseId={currentExerciseId}
                    />

                    <TextInput 
                        style={tw`text-2xl font-bold mx-3 mb-5 max-w-[81%]`}
                        keyboardType='default'
                        multiline={true}
                        numberOfLines={2}
                        maxLength={50}
                        placeholder={workoutTitle}
                        placeholderTextColor='#93c5fd'
                        defaultValue={workoutTitle}
                        onChangeText={(text) => setNewWorkoutTitle(text)}
                    />

                    <View style={tw`flex flex-col gap-y-1`}>
                        {newExercises.map((exercise: any, index: any) => {
                            if (exercise.exerciseIndex === pageNumber + 1) {
                                return (
                                    <View key={exercise.id} style={tw`w-full h-[82%]`}>

                                        <TextInput 
                                            style={textInputStyle}
                                            keyboardType='default'
                                            multiline={true}
                                            numberOfLines={2}
                                            maxLength={50}
                                            placeholder={exercise.title}
                                            placeholderTextColor='#94a3b8'
                                            defaultValue={exercise.title}
                                            onChangeText={(text) => {
                                                updateExerciseTitle(exercise.id, text)
                                            }}
                                            onContentSizeChange={handleContentSizeChange}
                                        />

                                        <ScrollView style={tw`h-[75%] w-full mb-3`}>
                                            <View style={tw`flex-1`}>
                                                {exercise.sets.sort((a: any, b: any) => a.setIndex - b.setIndex).map((set: any, mapIndex: any) => {

                                                    // Get the intensity value
                                                    const intensity = set.intensity;  
                                                    
                                                    // Determine the background color based on the intensity value
                                                    let backgroundColor = 'bg-neutral-100';
                                                    let textColor = 'text-black';
                                                    if (intensity === 1) {
                                                        backgroundColor = 'bg-green-500';
                                                        textColor = 'text-white';
                                                    } else if (intensity === 2) {
                                                        backgroundColor = 'bg-yellow-400';
                                                        textColor = 'text-white';
                                                    } else if (intensity === 3) {
                                                        backgroundColor = 'bg-red-500';
                                                        textColor = 'text-white';
                                                    }

                                                    return (
                                                        (
                                                            <View key={set.id} style={tw`ml-3`}>
                                                                <View style={tw`flex flex-row gap-x-2`}>
                                                                    
                                                                    <View style={tw`flex flex-col`}>
                                                                        <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>{t('set')}</Text>
        
                                                                        <Pressable style={tw`w-10 h-10 ${backgroundColor} rounded-xl flex items-center justify-center`}
                                                                            onPress={() => {
                                                                                setIsSetIntensityModalVisible(true);
                                                                                setCurrentSelectedSet(mapIndex + 1);
                                                                                setIntensityBoxSelected(0);
                                                                            }}
                                                                        >
                                                                            <Text style={tw`text-base font-medium ${textColor}`}>{mapIndex + 1}</Text>
                                                                        </Pressable>
                                                                    </View>
        
                                                                    <View style={tw`flex flex-row gap-x-2 mb-3`}>
        
                                                                        <View style={tw`${iphoneModel.includes('Pro') || iphoneModel.includes('Plus') ? "w-[39.3%]" : iphoneModel.includes('SE') ? "w-[37.2%]" : "w-[37.8%]"}`}>
                                                                            <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>{getDimensions() > 400 ? t('reps') : t('reps-short')}</Text>
        
                                                                            <TextInput
                                                                                style={tw`bg-neutral-100 rounded-xl p-2 w-full h-10 `}
                                                                                keyboardType='number-pad'
                                                                                maxLength={4}
                                                                                placeholder={set.reps === "" ? t('reps') : set.reps.toString()}
                                                                                placeholderTextColor='#94a3b8'
                                                                                value={userInputs[index].sets[mapIndex].reps}
                                                                                onChangeText={(text) => {
                                                                                    let updatedInputs = [...userInputs];
                                                                                    updatedInputs[index].sets[mapIndex].reps = text;
                                                                                    setUserInputs(updatedInputs);
                                                                                }}
                                                                            />
                                                                        </View>
        
                                                                        <View style={tw`w-[39%]`}>
                                                                            <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>
                                                                                {t('weight')}
                                                                            </Text>
        
                                                                            <TextInput
                                                                                style={tw`bg-neutral-100 rounded-xl p-2 w-full h-10`}
                                                                                keyboardType='number-pad'
                                                                                maxLength={4}
                                                                                placeholder={set.weight === "" ? t('weight') : set.weight.toString() + ' kg'}
                                                                                placeholderTextColor='#94a3b8'
                                                                                value={userInputs[index].sets[mapIndex].weight}
                                                                                onChangeText={(text) => {
                                                                                    let updatedInputs = [...userInputs];
                                                                                    updatedInputs[index].sets[mapIndex].weight = text;
                                                                                    setUserInputs(updatedInputs);
                                                                                }}
                                                                            />
                                                                        </View>

                                                                        <Pressable style={tw`absolute ${iphoneModel.includes('SE') ? "right-6" : "right-7"} w-10 h-6 bg-white shadow-sm border border-gray-200 rounded-2xl flex items-center justify-center ${newExercises.length == 1 ? 'hidden' : ''}`}
                                                                            onPress={() => {
                                                                                setIsDeleteExerciseModalVisible(true)
                                                                                setCurrentExerciseId(exercise.id)
                                                                            }} 
                                                                        >
                                                                            <Ionicons name='close' size={20} color='black' />
                                                                        </Pressable>
        
                                                                        <TouchableOpacity style={tw`bg-[#fd354a] rounded-2xl w-10 h-10 flex items-center justify-center ${mapIndex != 0 ? '' : 'mt-[30px]'}`} 
                                                                            onPress={() => removeSet(exercise.exerciseIndex, set.id)}
                                                                            >
                                                                                <Ionicons name='close' size={36} color='white' />
                                                                            </TouchableOpacity>
        
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        ))}
                                                    )
                                                } 
                                            </View>
                                        </ScrollView>
                                    </View>
                                );
                            }
                        })}
                    </View>
                    
                    <BottomNavigationBar
                        currentPage='View-Workout'
                        navigation={navigation}
                        workoutActions={{

                            forwardButton: () => {
                                setPageNumber((pageNumber + 1) % newExercises.length)
                            },
                            backButton: () => {
                                setPageNumber((pageNumber - 1 + newExercises.length) % newExercises.length)
                            },
                            addSetButton: addSet,
                            saveViewWorkoutChanges: saveChanges,
                            viewWorkoutAddExercise: addExercise,
                            startWorkout: () => startWorkoutFunction()
                        }}
                        savedWorkoutInfo={{
                            viewSavedWorkoutNumberOfExercises: newExercises.length,
                        }}
                        
                    />
                    
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </>
    );
}

export default ViewWorkout