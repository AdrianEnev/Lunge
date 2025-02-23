import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/Home.tsx"), 
    route('contact', 'routes/Contact.tsx'),
    route('account', 'routes/Account/Account.tsx'),
    route('login', 'routes/Account/AccountLogin.tsx'),
    route('register', 'routes/Account/AccountRegister.tsx'),
    route('info', 'routes/Info.tsx'),
    route('settings', 'routes/Settings.tsx'),
    route('workouts', 'routes/Workouts/Workouts.tsx'),
    route('workouts/workout/:workoutId', 'routes/Workouts/ViewWorkout.tsx'),
    route('workouts/saved/', 'routes/SavedWorkouts/SavedWorkouts.tsx'),
    route('workouts/saved/:savedWorkoutId', 'routes/SavedWorkouts/ViewSavedWorkout.tsx'),
    route('food-log', 'routes/Food/FoodLog.tsx'),
    route('food-log/:foodDate', 'routes/Food/FoodDay.tsx'),
    route('statistics', 'routes/Statistics.tsx'),
    route('friends', 'routes/Friends.tsx'),
] satisfies RouteConfig;