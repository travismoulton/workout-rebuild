import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchActiveRoutine } from '../../store/actions';

const SubmitRoutineBtn = (props) => {
  const [error, setError] = useState({ isError: false, code: '', msg: '' });
  const [shouldBeActiveRoutine, setShouldBeActiveRoutine] = useState(false);
  const { activeRoutine } = useSelector((state) => state.favorites);
  const { uid, accessToken } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (props.valid && error.code === 'noRoutineName')
      setError({ isError: false, msg: '', code: null });
  }, [props.valid, error]);

  useEffect(() => {
    if (props.containsWorkout() && error.code === 'noWorkouts')
      setError({ isError: false, code: '', msg: '' });
  }, [props, error]);

  const checkForPreviousNameUse = async () => {
    let nameTaken = false;
    await axios
      .get(
        `https://workout-81691-default-rtdb.firebaseio.com/routines/${uid}.json?auth=${accessToken}`
      )
      .then((res) => {
        for (const key in res.data) {
          if (res.data[key].title === props.title) {
            setError({
              ...error,
              isError: true,
              msg: (
                <p>
                  That routine name is already taken, please try a different
                  name
                </p>
              ),
              code: 'nameTaken',
            });
            nameTaken = true;
          }
        }
      });

    return nameTaken;
  };

  useEffect(() => {
    setShouldBeActiveRoutine(props.isActiveRoutine || !activeRoutine);
  }, [props.isActiveRoutine, activeRoutine]);

  const redirectToMyProfile = () => {
    props.history.push({
      pathname: '/my-profile',
      state: {
        message: props.createNewRoutine ? 'Routine created' : 'Routine Updated',
      },
    });
  };

  const onSubmit = async () => {
    if (!props.containsWorkout()) {
      setError({
        isError: true,
        code: 'noWorkouts',
        msg: <p>A routine must contain at least one workout</p>,
      });
      return;
    }

    if (!props.valid) {
      setError({
        isError: true,
        code: 'noRoutineName',
        msg: <p>A routine must have a title</p>,
      });
      return;
    }

    if (
      props.createNewRoutine ||
      (props.titleChanged && !props.originalTitleEntact)
    )
      if (await checkForPreviousNameUse()) return;

    await axios({
      method: props.createNewRoutine ? 'post' : 'put',
      url: props.createNewRoutine
        ? `https://workout-81691-default-rtdb.firebaseio.com/routines/${uid}.json?auth=${accessToken}`
        : `https://workout-81691-default-rtdb.firebaseio.com/routines/${uid}/${props.firebaseId}.json?auth=${accessToken}`,
      timeout: 5000,
      data: {
        title: props.title,
        workouts: props.workouts,
        activeRoutine: shouldBeActiveRoutine,
      },
    })
      .then(() => {
        if (shouldBeActiveRoutine)
          dispatch(fetchActiveRoutine(uid, accessToken));
        redirectToMyProfile();
      })
      .catch((err) =>
        setError({
          ...error,
          isError: true,
          code: 'axios',
          msg: (
            <p style={{ color: 'red' }}>
              We weren't able to create this workout, please try agian
            </p>
          ),
        })
      );
  };

  return (
    <>
      <button
        className="GlobalBtn-1"
        onClick={onSubmit}
        style={{ width: '20rem', marginTop: '2rem' }}
      >
        {props.createNewRoutine ? 'Create new routine' : 'Edit routine'}
      </button>
      {error.isError ? error.msg : null}
    </>
  );
};

export default SubmitRoutineBtn;
