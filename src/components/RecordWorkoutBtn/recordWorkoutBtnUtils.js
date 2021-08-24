import axios from '../../shared/axiosInstances/firebase';

export const recordWorkoutBtnUtils = {
  submitRecordedWorkout: async function (uid, accessToken, workoutData) {
    await axios.post(
      `recordedWorkouts/${uid}.json?auth=${accessToken}`,
      workoutData
    );
  },
};
