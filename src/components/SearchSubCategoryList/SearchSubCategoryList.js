import SearchSubCategory from '../SearchSubCategory/SearchSubCategory';

export default function SearchSubCategoryList({ subCategories, category }) {
  const displaySubCategoires = subCategories.map((subCat) => (
    <SearchSubCategory
      subCategoryName={subCat['name']}
      key={subCat['id']}
      id={subCat['id']}
      category={category}
    />
  ));

  return (
    <ul style={{ padding: '0' }} data-testid="Search-SubCategoryList">
      {displaySubCategoires}
    </ul>
  );
}
