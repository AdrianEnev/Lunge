export const getUserLoginInfo = async (user: any) => {

    const userId = user.uid;

    // Retreives user info from the database and stores it in local storage - later cleared on logout
    fetch(`/api/users/${userId}`)
        .then((res) => res.json()) // Return the parsed JSON
        .then(async (data) => {

            if (data.language) localStorage.setItem('language', data.language);
            if (data.workouts) localStorage.setItem('workouts', data.workouts);
            if (data.savedWorkouts) localStorage.setItem('savedWorkouts', data.savedWorkouts);
            if (data.foodDays) localStorage.setItem('foodDays', data.foodDays);
            if (data.friends) localStorage.setItem('friends', data.friends);
            if (data.statistics) localStorage.setItem('statistics', data.statistics);
            if (data.username) localStorage.setItem('username', data.username);
            if (data.dailyGoals) localStorage.setItem('dailyGoals', data.dailyGoals);
            
        })
        .catch((error) => {
            console.error("Error fetching data:", error); // Handle errors
        });
}