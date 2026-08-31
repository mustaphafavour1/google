export function getNivoPalette(dark: boolean) {
  return {
    axisColor: dark ? "#8f8579" : "#a3a3a3",
    gridColor: dark ? "#2e2620" : "#f2f2f2",
    tooltipBg: dark ? "#241d19" : "#ffffff",
    tooltipText: dark ? "#ece6e0" : "#404040",
  };
}

export function getNivoTheme(dark: boolean) {
  const { axisColor, gridColor, tooltipBg, tooltipText } = getNivoPalette(dark);
  return {
    axis: {
      ticks: { text: { fontSize: 10, fill: axisColor } },
      legend: { text: { fontSize: 10, fill: axisColor } },
    },
    grid: { line: { stroke: gridColor, strokeWidth: 1 } },
    tooltip: {
      container: {
        fontSize: 11,
        borderRadius: 8,
        border: `1px solid ${gridColor}`,
        background: tooltipBg,
        color: tooltipText,
        boxShadow: "0 4px 16px rgb(35 25 15 / 0.14)",
      },
    },
    text: { fontSize: 10, fill: axisColor },
  };
}
