export function getNivoPalette(dark: boolean) {
  return {
    axisColor: dark ? "#8993A8" : "#94A3B8",
    gridColor: dark ? "#202839" : "#F1F5F9",
    tooltipBg: dark ? "#111727" : "#FFFFFF",
    tooltipText: dark ? "#E7ECF5" : "#1E293B",
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
        boxShadow: "0 4px 16px rgb(15 23 42 / 0.14)",
      },
    },
    text: { fontSize: 10, fill: axisColor },
  };
}
