import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';

import wgerData from '../../../shared/wgerData';
import Input from '../../../components/UI/Input/Input';
import { addExercise } from '../../../store/workoutSlice';
import { selectAllFavorites } from '../../../store/favoritesSlice';
import { favoriteSelectMenuUtils as utils } from './favoriteSelectMenuUtils';

export default function FavoritesSelectMenu(props) {
  const { isError, toggleError, toggleLoaded, clearSelect } = props;

  const favorites = useSelector(selectAllFavorites);
  const { uid, accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [favoritesAsExercises, setFavoritesAsExercises] = useState([]);
  const [favoritesAsSelectOptions, setFavoritesAsSelectOptions] = useState([]);

  const [addFromFavorites, setAddFromFavorites] = useState({
    elementType: 'select',
    elementConfig: {
      options: [],
    },
    value: 0,
    label: 'Add exercise from favorites',
    validation: {
      required: false,
    },
    valid: true,
    touched: false,
    id: 4,
    className: 'CreateWorkoutSelect',
  });

  const filterFavorites = useCallback(
    (arr, res) => {
      for (const key in res) {
        const exercise = favorites.filter(
          (fav) => fav.exerciseId.toString() === res[key].id.toString()
        )[0];

        if (exercise) arr.push(res[key]);
      }
    },
    [favorites]
  );

  useEffect(() => {
    let arr = [];
    const { fetchMasterExerciseList, fetchCustomExercises } = utils;

    (async () => {
      if (favorites)
        if (favorites.length && !favoritesAsExercises.length && !isError) {
          const masterExerciseList = await fetchMasterExerciseList();
          const customExercises = await fetchCustomExercises(uid, accessToken);

          filterFavorites(arr, { ...masterExerciseList, ...customExercises });
          setFavoritesAsExercises(arr);
        }
    })();
  }, [
    favorites,
    favoritesAsExercises,
    uid,
    accessToken,
    filterFavorites,
    isError,
    toggleError,
  ]);

  // Filters out duplicate categories
  const getExerciseCategories = useCallback(() => {
    const categories = favoritesAsExercises.map((fav) => fav.category);

    return Array.from(new Set(categories));
  }, [favoritesAsExercises]);

  useEffect(() => {
    // After favoritesAsExercises has been created, create an array of objects to
    // be used as select options inside the Add from favroites dropdown
    if (favoritesAsExercises.length && !favoritesAsSelectOptions.length) {
      const categories = getExerciseCategories();

      const groupedOptions = categories.map((category) =>
        favoritesAsExercises.filter(
          (favorite) => favorite.category === category
        )
      );

      const finalOptions = categories.map((category, i) => ({
        label: wgerData.exerciseCategoryList[category],
        options: groupedOptions[i].map((exercise) => ({
          label: exercise.name,
          value: exercise.id,
        })),
      }));

      setFavoritesAsSelectOptions(finalOptions);
      toggleLoaded();
    }
  }, [
    favoritesAsExercises,
    favoritesAsSelectOptions,
    getExerciseCategories,
    toggleLoaded,
  ]);

  useEffect(() => {
    if (isError) toggleLoaded();
  }, [toggleLoaded, isError]);

  useEffect(() => {
    if (
      favoritesAsSelectOptions.length &&
      !addFromFavorites.elementConfig.options.length
    )
      setAddFromFavorites({
        ...addFromFavorites,
        elementConfig: {
          ...addFromFavorites.elementConfig,
          options: [{ value: 0, label: null }, ...favoritesAsSelectOptions],
        },
      });
  }, [addFromFavorites, favoritesAsSelectOptions]);

  useEffect(() => {
    if (clearSelect) {
      setAddFromFavorites({ ...addFromFavorites, value: null });
    }
  }, [clearSelect, addFromFavorites]);

  const setAddFromFavoritesValue = (val) => {
    let returnVal;
    const optionGroups = addFromFavorites.elementConfig.options;

    optionGroups.forEach((group) => {
      if (group.options) {
        const matchingOption = group.options.filter(
          (option) => option.value === val
        );
        if (matchingOption.length) returnVal = matchingOption[0];
      }
    });

    return returnVal;
  };

  const addExerciseFromFavorites = (e) => {
    const exercise = favoritesAsExercises.filter(
      (fav) => fav.id === e.value
    )[0];

    if (exercise)
      dispatch(
        addExercise({
          name: exercise.name,
          id: `${exercise.id}-${nanoid()}`,
          sets: [{ weight: 0, reps: 0 }],
          focus: 'reps',
        })
      );

    setAddFromFavorites({
      ...addFromFavorites,
      value: setAddFromFavoritesValue(e.value),
    });
  };

  return favoritesAsExercises.length ? (
    <Input
      elementType={addFromFavorites.elementType}
      elementConfig={addFromFavorites.elementConfig}
      label={addFromFavorites.label}
      value={addFromFavorites.value}
      changed={addExerciseFromFavorites}
      classname={addFromFavorites.className}
      wrapperClass="WorkoutDetailsSelectWrapper"
      selectId="favoriteSelectMenu"
    />
  ) : null;
}
