import { useState, useEffect } from "react";

import SearchCategory from "../../components/SearchCategory/SearchCategory";
import { searchUtils as utils } from "./searchUtils";
import classes from "./Search.module.css";

export default function Search() {
  const [subCategories, setSubCategories] = useState([]);
  const [exerciseCategories, setExerciseCategories] = useState([]);
  const [muscles, setMuscles] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [categoryOpen, setCategoryOpen] = useState(null);

  useEffect(() => {
    if (!exerciseCategories.length && !muscles.length && !equipment.length) {
      utils
        .fetchCategories()
        .then((categories) => setExerciseCategories(categories));

      utils.fetchMuscles().then((muscles) => setMuscles(muscles));
      utils.fetchEquipment().then((equipment) => setEquipment(equipment));
    }
  }, [exerciseCategories, muscles, equipment]);

  return (
    <>
      <h1 className={classes.Header}>Select a category to search</h1>
      <div className={classes.Search}>
        <SearchCategory
          categoryName={"Exercise Category"}
          clicked={() => {}}
          categoryOpen={categoryOpen === "exercisecategory"}
        />
        <SearchCategory
          categoryName={"Muscle"}
          clicked={() => {}}
          categoryOpen={categoryOpen === "muscle"}
        />
        <SearchCategory
          categoryName={"Equipment"}
          clicked={() => {}}
          categoryOpen={categoryOpen === "equipment"}
        />
      </div>
    </>
  );
}
