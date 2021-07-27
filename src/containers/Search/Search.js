import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import SearchCategory from '../../components/SearchCategory/SearchCategory';
import SearchSubCategoryList from '../../components/SearchSubCategoryList/SearchSubCategoryList';
import Spinner from '../../components/UI/Spinner/Spinner';
import { searchUtils as utils } from './searchUtils';
import classes from './Search.module.css';

export default function Search() {
  const [subCategories, setSubCategories] = useState([]);
  const [exerciseCategories, setExerciseCategories] = useState(null);
  const [muscles, setMuscles] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(null);
  const [showCustomOption, setShowCustomOption] = useState(null);
  const [error, setError] = useState({
    isError: false,
    message: (
      <p style={{ color: 'red' }}>
        Sorry, we're having trouble right now. please refresh the page or try
        again later
      </p>
    ),
  });

  const history = useHistory();

  const { user, uid, accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = 'Search For Exercises';
  }, []);

  useEffect(() => {
    if (user && showCustomOption === null) {
      utils
        .fetchCustomExercises(uid, accessToken)
        .then((exercises) => setShowCustomOption(exercises ? true : false))
        .catch(() => setError({ ...error, isError: true }));
    }
  }, [user, uid, accessToken, showCustomOption, error]);

  useEffect(() => {
    if (!user && showCustomOption) setShowCustomOption(false);
  }, [user, showCustomOption]);

  useEffect(() => {
    if (!exerciseCategories && !muscles && !equipment) {
      const { fetchCategories, fetchMuscles, fetchEquipment } = utils;

      fetchCategories().then((categories) => setExerciseCategories(categories));
      fetchMuscles().then((muscles) => setMuscles(muscles));
      fetchEquipment().then((equipment) => setEquipment(equipment));
    }
  }, [exerciseCategories, muscles, equipment]);

  useEffect(() => {
    const wgerReady = exerciseCategories && muscles && equipment;
    if (!loaded && wgerReady)
      if ((user && showCustomOption !== null) || !user) setLoaded(true);
  }, [loaded, exerciseCategories, muscles, equipment, showCustomOption, user]);

  const closeSubCategories = () => {
    setCategoryOpen(null);
    setSubCategories([]);
  };

  const openSubCategory = (category) => {
    setCategoryOpen(category);

    switch (category) {
      case 'exercisecategory':
        return setSubCategories(exerciseCategories);
      case 'muscle':
        return setSubCategories(muscles);
      case 'equipment':
        return setSubCategories(equipment);
      default:
        setSubCategories([]);
    }
  };

  const controlSubCategories = (category) => {
    categoryOpen === category
      ? closeSubCategories()
      : openSubCategory(category);
  };

  const getCustomExercises = () => {
    history.push({
      pathname: '/results/my-custom-exercises',
      state: { isCustom: true },
    });
  };

  const subCategoryList = (
    <SearchSubCategoryList
      category={categoryOpen}
      subCategories={subCategories}
    />
  );

  return !loaded ? (
    <Spinner />
  ) : (
    <>
      <h1 className={classes.Header}>Select a category to search</h1>
      <div className={classes.Search}>
        <SearchCategory
          categoryName={'Exercise Category'}
          clicked={() => controlSubCategories('exercisecategory')}
          categoryOpen={categoryOpen === 'exercisecategory'}
        />
        {categoryOpen === 'exercisecategory' && subCategoryList}

        <SearchCategory
          categoryName={'Muscle'}
          clicked={() => controlSubCategories('muscle')}
          categoryOpen={categoryOpen === 'muscle'}
        />
        {categoryOpen === 'muscle' && subCategoryList}

        <SearchCategory
          categoryName={'Equipment'}
          clicked={() => controlSubCategories('equipment')}
          categoryOpen={categoryOpen === 'equipment'}
        />
        {categoryOpen === 'equipment' && subCategoryList}

        {showCustomOption && (
          <SearchCategory
            categoryName={'My custom exercises'}
            clicked={getCustomExercises}
          />
        )}
      </div>
    </>
  );
}
