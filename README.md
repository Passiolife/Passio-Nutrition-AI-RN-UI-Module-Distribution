# React Native Passio Nutrition-AI UI/UX SDK

<img src='./media/header.png'>




## Minimum Requirements

|    Platform         | Minimum Requirements | 
|-------------|---------|
| **Android** | SDK 26+ |
| **iOS**     | 13.0+   |

# Installation

#### Step 1: Create an .npmrc file in the root of your project with the following lines replacing GITHUB_ACCESS_TOKEN with the token you've created.
```sh
//npm.pkg.github.com/:_authToken=GITHUB_ACCESS_TOKEN
@passiolife:registry=https://npm.pkg.github.com
```

#### Step 2: Open terminal
```sh
yarn add @passiolife/nutrition-ai-ui-ux
```

#### Step 3: add react-native.config.js at root
```sh
module.exports = {
  dependencies: {
    'lottie-react-native': {},
    'lottie-ios': {},
    '@react-native-community/slider': {},
    '@passiolife/nutritionai-react-native-sdk-v3': {},
    '@react-native-community/datetimepicker': {},
    'react-native-reanimated': {},
    'react-native-gesture-handler': {},
    'luxon': {},
    'react-native-safe-area-context': {},
    'react-native-linear-gradient': {},
    'react-native-svg': {},
    'react-native-sqlite-storage': {},
    '@react-native-voice/voice': {},
    '@notifee/react-native': {},
    '@react-native-async-storage/async-storage': {},
  },
};
```

#### Step 4: require  @react-native-async-storage/async-storage
```sh
yarn add  @react-native-async-storage/async-storage
```


#### Step 5: require  add react-native-screens
```sh
yarn add react-native-screens
```

#### Step 6: For Android, add this implementation line to the dependencies section on app/build.gradle file.
```sh
dependencies {
    // Add this line below for Passio SDK library
    implementation files("$rootDir/../node_modules/@passiolife/nutritionai-react-native-sdk-v3/android/libs/passiolib-release.aar")
    ...
}
```

## Permission

#### IOS Permission 

```
 Privacy - NSCameraUsageDescription
 Privacy - NSSpeechRecognitionUsageDescription
 Privacy - NSMicrophoneUsageDescription
```

####  Android Permission

```
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.CAMERA" />
  <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
```


# Usage example



## Using Internal Services


``` JS
import React from 'react';
import {
  BrandingProvider,
  NutritionNavigator,
  ServicesProvider,
  usePassioConfig,
} from '@passiolife/nutrition-ai-ui-ux';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {

  const { isReady } = usePassioConfig({ key: "YOUR_PASSIO_KEY" });

  if (!isReady) {
    return <Loading />;
  }


  return (
    <ServicesProvider>
      <BrandingProvider>
        <NavigationContainer>
          <NutritionNavigator />
        </NavigationContainer>
      </BrandingProvider>
    </ServicesProvider>
  );
}



```

## Using External Services

#### Step 1: If you'd like to include your data service, follow the steps below. Otherwise, skip to the next step


`NutritionDataService` used for Return a function to store or retrieve data through a REST API, local database, or Firebase, etc

```js

export const dataService: NutritionDataService = {
  /**
   * Retrieves the patient profile.
   * @returns A `Promise` resolving to the patient profile.
   */
  getPatientProfile: () => getPatientProfile(),

  /**
   * Saves a food log.
   * @param foodLog - The food log to save.
   * @returns A `Promise` that resolves when the operation is complete.
   */
  async saveFoodLog(foodLog: FoodLog): Promise<void> {
    return saveFoodLog(foodLog);
  },

  /**
   * Retrieves food logs.
   * @returns A `Promise` resolving to an array of food logs.
   */
  async getFoodLogs(): Promise<FoodLog[]> {
    return getFoodLogs();
  },

  /**
   * Deletes a food log.
   * @param uuid - The UUID of the food log to delete.
   * @returns A `Promise` that resolves when the operation is complete.
   */
  async deleteFoodLog(uuid: string): Promise<void> {
    return deleteFoodLog(uuid);
  },

  /**
   * Deletes a recipe.
   * @param uuid - The UUID of the recipe to delete.
   * @returns A `Promise` that resolves when the operation is complete.
   */
  async deleteRecipe(uuid: string): Promise<void> {
    return deleteRecipe(uuid);
  },

  /**
   * Deletes a favorite food item.
   * @param uuid - The UUID of the favorite food item to delete.
   * @returns A `Promise` that resolves when the operation is complete.
   */
  async deleteFavoriteFoodItem(uuid: string): Promise<void> {
    return deleteFavoriteFoodItem(uuid);
  },

  /**
   * Retrieves meal logs within a specified date range.
   * @param startDate - The start date of the range.
   * @param endDate - The end date of the range.
   * @returns A `Promise` resolving to an array of meal logs.
   */
  async getMealLogs(startDate: Date, endDate: Date): Promise<FoodLog[]> {
    return getMealLogs(startDate, endDate);
  },

  /**
   * Saves a favorite food item.
   * @param favoriteFoodItem - The favorite food item to save.
   * @returns A `Promise` that resolves when the operation is complete.
   */
  async saveFavoriteFoodItem(favoriteFoodItem: FavoriteFoodItem): Promise<void> {
    return saveFavoriteFoodItem(favoriteFoodItem);
  },

  /**
   * Retrieves favorite food items.
   * @returns A `Promise` resolving to an array of favorite food items.
   */
  async getFavoriteFoodItems(): Promise<FavoriteFoodItem[]> {
    return getFavoriteFoodItems();
  },

  /**
   * Saves a nutrition profile.
   * @param nutritionProfile - The nutrition profile to save.
   * @returns A `Promise` that resolves when the operation is complete.
   */
  saveNutritionProfile(nutritionProfile: NutritionProfile): Promise<void> {
    return saveNutritionProfile(nutritionProfile);
  },

  /**
   * Saves a recipe.
   * @param recipe - The recipe to save.
   * @returns A `Promise` that resolves when the operation is complete.
   */
  async saveRecipe(recipe: Recipe): Promise<void> {
    return saveRecipe(recipe);
  },

  /**
   * Retrieves recipes.
   * @returns A `Promise` resolving to an array of recipes.
   */
  async getRecipes(): Promise<Recipe[]> {
    return getRecipes();
  },

  /**
   * Retrieves the nutrition profile.
   * @returns A `Promise` resolving to the nutrition profile, or `undefined` if not found.
   */
  async getNutritionProfile(): Promise<NutritionProfile | undefined> {
    return getNutritionProfile();
  },

  /**
   * Retrieves water logs within a specified date range.
   * @param startDate - The start date of the range.
   * @param endDate - The end date of the range.
   * @returns A `Promise` resolving to an array of water logs.
   */
  async getWaters(startDate: Date, endDate: Date): Promise<Water[]> {
    return getWaters(startDate, endDate);
  },

  /**
   * Deletes a water log.
   * @param uuid - The UUID of the water log to delete.
   * @returns A `Promise` that resolves when the operation is complete.
   */
  async deleteWater(uuid: string): Promise<void> {
    return deleteWater(uuid);
  },

  /**
   * Deletes a weight log.
   * @param uuid - The UUID of the weight log to delete.
   * @returns A `Promise` that resolves when the operation is complete.
   */
  async deleteWeight(uuid: string): Promise<void> {
    return deleteWeight(uuid);
  },

  /**
   * Retrieves weight logs within a specified date range.
   * @param startDate - The start date of the range.
   * @param endDate - The end date of the range.
   * @returns A `Promise` resolving to an array of weight logs.
   */
  async getWeight(startDate: Date, endDate: Date): Promise<Weight[]> {
    return getWeight(startDate, endDate);
  },
};
 ```

 #### Step: 2 If you're want to apply your theme, you can use the following, although it's in experimental mode. otherwise you can skip to next step

Nutrition-UX SDK also provide  Branding into BrandingProvider.

```js
  // you can change primary color form here
 export const branding: Branding = {
  primaryColor: 'rgba(79, 70, 229, 1)',
  backgroundColor: 'rgba(249, 250, 251, 1)',
  black: 'rgba(0, 0, 0, 1)',
  text: 'rgba(17, 24, 39, 1)',
  border: 'rgba(229, 231, 235, 1)',
  calories: 'rgba(245, 158, 11, 1)',
  carbs: 'rgba(14, 165, 233, 1)',
  error: 'rgba(239, 68, 68, 1)',
  fat: 'rgba(139, 92, 246, 1)',
  font: 'Passio-Regular',
  gray300: 'rgba(209, 213, 219, 1)',
  gray500: 'rgba(107, 114, 128, 1)',
  indigo50: 'rgba(238, 242, 255, 1)',
  proteins: 'rgba(16, 185, 129, 1)',
  purple: 'rgba(79, 70, 229, 1)',
  searchBody: 'rgba(242, 245, 251, 1)',
  secondaryText: 'rgba(107, 114, 128, 1)',
  white: 'white',
  };
```

#### Step:3 : If you're want to check some log event then provide analytic service, although it's in experimental mode. 

```js
  export  const analyticsService: AnalyticsService = {
    logEvent(event: string) {
      console.log(`Analytics: ${event}`); // eslint-disable-line no-console
    },
  };
```


``` JS
import React from 'react';
import {
  BrandingProvider,
  NutritionNavigator,
  ServicesProvider,
} from '@passiolife/nutrition-ai-ui-ux';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {

  const services: Services = {
    dataService,
    analyticsService,
  };

    const { isReady } = usePassioConfig({ key: "YOUR_PASSIO_KEY" });

  if (!isReady) {
    return <Loading />;
  }


  return (
    <ServicesProvider services={services}>
      <BrandingProvider branding={branding}>
        <NavigationContainer>
          <NutritionNavigator />
        </NavigationContainer>
      </BrandingProvider>
    </ServicesProvider>
  );
}

```


# Use `PassioScreens` as `Stack` without navigation container

```js
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { PassioScreens } from '@passiolife/nutrition-ai-ui-ux';

const Stack = createNativeStackNavigator();
enableScreens();

export const AppNavigator = () => {

  return (
    <>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ gestureEnabled: false, animation: 'simple_push' }}
            initialRouteName={'PassioScreens'}
            <Stack.Screen
              options={{ headerShown: false }}
              name={'PassioScreens'}
              component={PassioScreens}
            />
          </Stack.Navigator>
        </NavigationContainer>
    </>
  );
};

```

#### NutritionDataService callback functions: 

| Callback     |  Argument     | Return       | Description    |                                                                                                                           
| ------------------------ | ---------- | ------------------------------------------------------------------| -----------------------------------------------|
| saveNutritionProfile   | NutritionProfile | void |  This function provides you `NutritionProfile` object for save nutrition profile|
| saveFoodLog            | FoodLog | void |  This function provide you  `FoodLog` for save food log|
| saveFavoriteFoodItem   | FavoriteFoodItem | void |  This function provides you  `FavoriteFoodItem` object for save favortie food item|
| saveRecipe             | Recipe | void |  This function provides you `Recipe` object for save recipe |
| deleteRecipe           | uuID | void |  This function provide you delete recipe  `uuid` for delete recipe|
| deleteFoodLog          | uuID  | void |  This function provide you delete foodLog `uuid` for delete food log|
| getNutritionProfile    | - | NutritionProfile or undefined | You have to provide `NutritionProfile or undefined` to this funciton |
| getFoodLogs            | - | FoodLog |  You have to provide `FoodLog` to this funciton |
| getFavoriteFoodItems   | - | FavoriteFoodItem[]  | You have to provide `FavoriteFoodItem[]` to this funciton |
| getMealLogs            | startDate: Date, endDate: Date| FoodLog[]| You have to provide `FoodLog[]` between this start data and end date  to this funciton|
| getPatientProfile      | void | PatientProfile | You have to provide `PatientProfile` to this funciton|
| getRecipes             | void | Recipe[] | You have to provide `Recipe[]` to this funciton|



## Contributing

To begin development, clone the project and check out the develop branch.

Create a new branch from develop for your assigned ticket with the format `feature/my-ticket-#5` where `my-ticket` is a few words describing the feature and `#5` is the Github issue number. Please make sure you have moved the ticket to the "In Progress" column in Github.

As you develop your feature, run the example app to test and debug your code.

Once your work is complete, verify that you have met all acceptance criteria on the ticket and have sufficient tests to cover the behavior. Then you may create a pull request back to the develop branch which will be reviewed and subsequently approved and merged.


### ⚠️ Issue

If your project not runnable in IOS then follow below steps

- removed podfile.lock
- remove pods
- remove node_modules in example
- remove node_modules in root 
- remove derived data
- remove library cache 
- restart system
- yarn at root
- open xcode