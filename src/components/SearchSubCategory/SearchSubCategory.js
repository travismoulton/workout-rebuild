import { Link } from 'react-router-dom';
import slugiy from 'slugify';

import classes from '../SearchCategory/SearchCategory.module.css';

export default function SearchSubCategory({ category, subCategoryName, id }) {
  const styles = [classes.SearchCategory, classes.SearchCategory__subCategory];
  return (
    <li
      style={{ listStyle: 'none' }}
      data-testid={`SearchSubCategory-${subCategoryName}`}
    >
      <Link
        to={{
          pathname: `results/${category}/${slugiy(subCategoryName)}`,
          state: {
            subCategory: subCategoryName,
            id,
            category,
            wger: true,
            isCustom: false,
          },
        }}
        className={styles.join(' ')}
      >
        {subCategoryName}
      </Link>
    </li>
  );
}
