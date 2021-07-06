import { Link } from 'react-router-dom';
import slugiy from 'slugify';

import classes from '../SearchCategory/SearchCategory.module.css';

export default function SearchSubCategory({ category, subCategoryName, id }) {
  const styles = [classes.SearchCategory, classes.SearchCategory__subCategory];
  return (
    <li style={{ listStyle: 'none' }}>
      <Link
        to={{
          pathname: `results/${category}/${slugiy(subCategoryName)}`,
          state: { subCategory: subCategoryName, id, category, wger: true },
        }}
        className={styles.join(' ')}
        data-testid={`SearchSubCategory-${subCategoryName}`}
      >
        {subCategoryName}
      </Link>
    </li>
  );
}
