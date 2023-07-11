import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Category, Row } from "./types";

ChartJS.register(ArcElement, Tooltip, Legend);

const BACKGROUND_COLORS = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(255, 206, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(255, 159, 64, 0.2)",
];
const BORDER_COLORS = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
];

export default function Charts({
  categories,
  calculateTotal,
}: {
  categories: Category[];
  calculateTotal: (rows: Row[], isInverted?: boolean) => number;
}) {
  const [isIncome, setIsIncome] = useState(false);
  const [chartData, setChartData] = useState({
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    let filteredCategories: Category[] = [];
    if (isIncome) {
      filteredCategories = categories.filter((category) => {
        const categoryTotal = calculateTotal(
          category.rows.filter((row) => row.show),
          category.isInverted
        );
        return categoryTotal > 0;
      });
    } else {
      filteredCategories = categories.filter((category) => {
        const categoryTotal = calculateTotal(
          category.rows.filter((row) => row.show),
          category.isInverted
        );
        return categoryTotal < 0;
      });
    }
    if (filteredCategories.length === 0) return;

    const categoryNames = filteredCategories.map((category) => category.name);
    const categoryTotals = filteredCategories.map((category) =>
      calculateTotal(
        category.rows.filter((row) => row.show),
        category.isInverted
      )
    );
    const backgroundColors = filteredCategories.map(
      (_, i) => BACKGROUND_COLORS[i % BACKGROUND_COLORS.length]
    );
    const borderColors = filteredCategories.map(
      (_, i) => BORDER_COLORS[i % BORDER_COLORS.length]
    );
    const newChartData = {
      labels: categoryNames,
      datasets: [
        {
          label: "$",
          data: categoryTotals,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    };
    setChartData({ ...newChartData });
  }, [calculateTotal, categories, isIncome]);

  return (
    <div className="bg-base-100">
      <div className="p-2">
        <select
          className="select select-bordered select-sm w-full max-w-xs"
          onChange={(e) => setIsIncome(e.target.value === "Income")}
          defaultValue={"Expenses"}
        >
          <option>Expenses</option>
          <option>Income</option>
        </select>
      </div>
      <Doughnut data={chartData} />
    </div>
  );
}
