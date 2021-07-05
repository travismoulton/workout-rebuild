import classes from "./SearchCategory.module.css";

export default function SearchCategory({
  clicked,
  categoryName,
  categoryOpen,
}) {
  const divClasses = [
    classes.SearchCategory,
    classes.SearchCategory__mainCategory,
  ];

  const arrowClasses = [
    categoryOpen ? "ArrowDownWhite" : "ArrowRightWhite",
    classes.Arrow,
  ];

  return (
    <div
      className={divClasses.join(" ")}
      onClick={clicked}
      data-testid={categoryName}
    >
      {categoryName}
      <span className={arrowClasses.join(" ")}></span>
    </div>
  );
}
