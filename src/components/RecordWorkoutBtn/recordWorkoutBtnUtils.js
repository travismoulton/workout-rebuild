import axios from '../../shared/axiosInstances/firebase';

export const recordWorkoutBtnUtils = {
  submitRecordedWorkout: async function (uid, accessToken, workoutData) {
    const { data } = await axios.post(
      `recordedWorkouts/${uid}.json?auth=${accessToken}`,
      workoutData
    );

    // data.name is the firebaseId for the record, will be dispathed to the userProfile store
    return data.name;
  },
};
