import { customRender, waitFor, fireEvent } from '../../shared/testUtils';

//1: Test that noRoutineName error is cleared after a routine name is put in -- CREATEROUTINE
//2: Test that if the routine title changes and the nameTaken error is present, that it is removed -- CREATEROUTINE
//3: Test that noWorkouts error is cleared if a workout is added -- CREATEROTUINE

//1: Test that if there are no workouts it sets the noWorkouts error and does not push a routine
//2: Test that if the form is invalid it throws a error and does not make an api call
//3: Test that if the name is taken that it throws an error and does not make an api call
//4: Test that if all checks pass, it calls createRoutine with the expected object if shouldCreateRoutine is true
//5: Test that if all checks pass, it calls updateRoutine with the expected object if shouldCreateRoutine is false
//6: Test the call to redirectToMyProfile
