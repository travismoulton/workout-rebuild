import { useState, useEffect } from 'react';
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
  const history = useHistory();

  useEffect(() => {
    document.title = 'Search For Exercises';
  }, []);

  useEffect(() => {
    if (!exerciseCategories && !muscles && !equipment) {
      const { fetchCategories, fetchMuscles, fetchEquipment } = utils;

      fetchCategories().then((categories) => setExerciseCategories(categories));
      fetchMuscles().then((muscles) => setMuscles(muscles));
      fetchEquipment().then((equipment) => setEquipment(equipment));
    }
  }, [exerciseCategories, muscles, equipment]);

  useEffect(() => {
    if (exerciseCategories && muscles && equipment && !loaded) setLoaded(true);
  }, [loaded, exerciseCategories, muscles, equipment]);

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
