import express from 'express';
const userRouter = express.Router();
import getUserInfo, { getUsername } from '@services/getUserInfo';
import validateUserId from '@services/validateUserId';
import EntityNotFoundError from '@custom_errors/EntityNotFoundError';
import syncNutrients from '@services/handleSyncing/syncNutrients';
import syncWorkouts from '@services/handleSyncing/syncWorkouts';
import syncFoodDays from '@services/handleSyncing/syncFoodDays';
import syncSavedWorkouts from '@services/handleSyncing/syncSavedWorkouts';
import syncWorkoutsInFolders from '@services/handleSyncing/syncWorkoutsInFolders';
import changeLanguage from '@services/changeLanguage';
import deleteAccount from '@services/mobile/account/deleteAccount';
import changeUsername from '@services/mobile/account/changeUsername';
import updateDailyGoals from '@services/mobile/food/updateDailyGoals';
import getLungeCoins from '@services/mobile/account/lungeCoins/getLungeCoins';
import addLungeCoins from '@services/mobile/account/lungeCoins/addLungeCoins';
import decrementLungeCoins from '@services/mobile/account/lungeCoins/decrementLungeCoins';
import retreiveWorkouts from '@services/handleRetreiving/retreiveWorkouts';
import retreiveSavedWorkouts from '@services/handleRetreiving/retreiveSavedWorkouts';
import retreiveFoodDays from '@services/handleRetreiving/retreiveFoodDays';
import registerUser from '@services/mobile/account/registerUser';
import loginUser from '@services/mobile/account/loginUser';

userRouter.get('/', (req, res) => {
    res.json({ message: 'Users list' });
});

userRouter.post('/registerUser', async (req, res) => {
    
    const { username, newUser } = req.body;

    const result = await registerUser(username, newUser);
    res.json({ message: result });

})

// Gets all kinds of user info (workouts, food, language, etc.)
// Currently only being used for the web app
userRouter.get('/:userId', async (req, res) => {

    const userId: string = req.params.userId;

    await validateUserId(userId);

    const userInfo = await getUserInfo(userId);

    if (!userInfo) {
        throw new EntityNotFoundError('User not found!')
    }
    
    res.json(userInfo);
    
});

userRouter.get('/:userId/loginUser', async (req, res) => {
    
    const userId: string = req.params.userId;
    await validateUserId(userId);

    const result = await loginUser(userId);
    res.json(result);

})

// Sync user info
// Compares local info on mobile app to firebase info and fixes any missmatches
userRouter.put('/:userId/sync', async (req, res) => {

    // TODO: add "checkUsernamesMatch" from a seperate function to here

    const userId: string = req.params.userId;

    await validateUserId(userId);

    const {
        localWorkouts = [],
        localSavedWorkouts = [],
        localFolders = [],
        localFoodDays = [],
        localNutrients = [],
    } = req.body || {};

    await syncWorkouts(userId, localWorkouts);
    await syncSavedWorkouts(userId, localSavedWorkouts);
    await syncWorkoutsInFolders(userId, localFolders);
    await syncFoodDays(userId, localFoodDays);
    syncNutrients(userId, localNutrients);
    
    res.status(204).send();

})

// Retreive user info for mobile app
userRouter.put('/:userId/retreive', async (req, res) => {

    const userId: string = req.params.userId;
    await validateUserId(userId);

    const {
        asyncStorageWorkouts,
        asyncStorageFoodDayKeys,
        asyncStorageSavedWorkouts,
    } = req.body || {};

    const missingWorkouts = await retreiveWorkouts(asyncStorageWorkouts, userId);
    const missingFoodDays = await retreiveFoodDays(asyncStorageFoodDayKeys, userId);
    const missingSavedWorkouts = await retreiveSavedWorkouts(asyncStorageSavedWorkouts, userId);

    const missingData = {
        missingWorkouts: missingWorkouts || [],
        missingSavedWorkouts: missingSavedWorkouts || [],
        missingFoodDays: missingFoodDays || [],
    }
    res.json(missingData);
    
})

// Deletes account assuming no sub-documents or collections exist
// Used to delete account that has yet not verified email
userRouter.delete('/:userId', async (req, res) => {

    const userId: string = req.params.userId;
    const isVerified = req.query.isVerified as string;

    await validateUserId(userId);

    await deleteAccount(userId, Boolean(isVerified));
    res.status(204).send();
})

// Updates username of user
userRouter.put('/:userId/username', async (req, res) => {

    const userId: string = req.params.userId;
    const username = req.query.username as string;
    const newUsername = req.query.newUsername as string;

    await validateUserId(userId);

    // Result returns specific message if username is taken/NSFW/too short/...
    const result = await changeUsername(username, newUsername, userId);
    res.json({message: result || 'Username successfully changed.' })

})

// Gets username of user
// Used for basic username retreival or to check if asyncstorage username matches firebase on
userRouter.get('/:userId/username', async (req, res) => {

    const userId: string = req.params.userId;
    await validateUserId(userId);

    // Returns 
    const result = await getUsername(userId);
    res.json(result)

})

// Changes language of user in database
userRouter.put('/:userId/language', async (req, res) => {

    const userId: string = req.params.userId;
    await validateUserId(userId);

    const language = req.query.language as string;

    await changeLanguage(language, userId);
    res.status(204).send();

})

// Updates daily macronutrient goals for user
userRouter.put('/:userId/dailyGoals', async (req, res) => {

    const userId: string = req.params.userId;
    await validateUserId(userId);

    const { newNutrients } = req.body || {};

    await updateDailyGoals(newNutrients, userId);
    res.status(204).send();

});

// Retreive lunge coins for user
userRouter.get('/:userId/lungeCoins', async (req, res) => {

    const userId: string = req.params.userId;
    await validateUserId(userId);

    const amount = await getLungeCoins(userId);
    res.json(amount);
    
})

// Add lunge coins to specific user
userRouter.post('/:userId/lungeCoins', async (req, res) => {

    const userId: string = req.params.userId;
    await validateUserId(userId);

    const amount = req.query.amount as string;
    await addLungeCoins(Number(amount), userId);
    res.status(204).send();

})

// Decrement lunge coins from user
userRouter.delete('/:userId/lungeCoins', async (req, res) => {

    const userId: string = req.params.userId;
    await validateUserId(userId);

    const amount = req.query.amount as string;
    await decrementLungeCoins(Number(amount), userId);
    res.status(204).send();

})

export default userRouter;