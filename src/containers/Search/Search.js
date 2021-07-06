import { useState, useEffect } from 'react';

import SearchCategory from '../../components/SearchCategory/SearchCategory';
import SearchSubCategory from '../../components/SearchSubCategory/SearchSubCategory';
import { searchUtils as utils } from './searchUtils';
import classes from './Search.module.css';

export default function Search() {
  const [subCategories, setSubCategories] = useState([]);
  const [exerciseCategories, setExerciseCategories] = useState(null);
  const [muscles, setMuscles] = useState(null);
  const [equipment, setEquipment] = useState(null);
  // const [loaded, setLoaded] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(null);

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

  const displaySubCategoires = subCategories.map((subCat) => (
    <SearchSubCategory
      subCategoryName={subCat['name']}
      key={subCat['id']}
      id={subCat['id']}
      category={categoryOpen}
    />
  ));

  return (
    <>
      <h1 className={classes.Header}>Select a category to search</h1>
      <div className={classes.Search}>
        <SearchCategory
          categoryName={'Exercise Category'}
          clicked={() => controlSubCategories('exercisecategory')}
          categoryOpen={categoryOpen === 'exercisecategory'}
        />
        {categoryOpen === 'exercisecategory' && (
          <ul
            className={classes.SubCategoryList}
            data-testid="Search-SubCategoryList"
          >
            {displaySubCategoires}
          </ul>
        )}

        <SearchCategory
          categoryName={'Muscle'}
          clicked={() => controlSubCategories('muscle')}
          categoryOpen={categoryOpen === 'muscle'}
        />
        {categoryOpen === 'muscle' && (
          <ul
            className={classes.SubCategoryList}
            data-testid="Search-SubCategoryList"
          >
            {displaySubCategoires}
          </ul>
        )}

        <SearchCategory
          categoryName={'Equipment'}
          clicked={() => controlSubCategories('equipment')}
          categoryOpen={categoryOpen === 'equipment'}
        />
        {categoryOpen === 'equipment' && (
          <ul
            className={classes.SubCategoryList}
            data-testid="Search-SubCategoryList"
          >
            {displaySubCategoires}
          </ul>
        )}
      </div>
    </>
  );
}
