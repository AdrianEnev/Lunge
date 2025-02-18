export const changeDailyGoal = async (nutrient: string, dailyGoals: any[], newValue: any) => {
    const dailyGoal = dailyGoals[0]; // Assuming dailyGoals is an array with one object

    if (dailyGoal.hasOwnProperty(nutrient)) {
        dailyGoal[nutrient] = newValue;

        localStorage.setItem('dailyGoals', JSON.stringify(dailyGoal));
    } else {
        throw new Error('Invalid nutrient');
    }
}