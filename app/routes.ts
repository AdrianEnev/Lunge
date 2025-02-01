import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [

    index("routes/Home.tsx"), 
    route('contact', 'routes/Contact.tsx'),
    
    //route("account", 'routes/Account/Account.tsx', [
    route('account', 'routes/Account/Account.tsx'),
    route('login', 'routes/Account/AccountLogin.tsx'),
    route('register', 'routes/Account/AccountRegister.tsx'),
    //]),

    route('info', 'routes/Info.tsx'),
    route('settings', 'routes/Settings.tsx'),

    route('workouts', 'routes/Workouts.tsx'),
    route('food-log', 'routes/FoodLog.tsx'),
    route('statistics', 'routes/Statistics.tsx'),
    route('friends', 'routes/Friends.tsx'),

    /*route('about', 'routes/about.tsx'),

    ...prefix('test', [
        route('post/:postId', 'routes/post.tsx'),
    ]),

    // nested roiutesd
    layout('routes/dashboard.tsx', [
        route('finances', 'routes/finances.tsx'),
        route('personalInfo', 'routes/personalInfo.tsx')
    ]),*/

] satisfies RouteConfig;
