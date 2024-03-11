import { Category, Row } from "./types";

export const getCategories = (allRows: Row[]): Category[] => {
  const newCategories: Category[] = [];

  // Get parent category names (Parent::Child::Child2)
  const categoryNames = allRows.reduce((acc: string[], row) => {
    const categoryName = row.category.split("::")[0];
    if (!acc.includes(categoryName)) {
      acc.push(categoryName);
    }
    return acc;
  }, []);

  categoryNames.forEach((categoryName) => {
    newCategories.push({
      name: categoryName,
      rows: allRows.filter((row) => row.category.startsWith(categoryName)),
      isInverted: false,
    });
  });

  return newCategories;
}