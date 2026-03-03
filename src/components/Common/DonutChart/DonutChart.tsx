import React from "react";

interface DonutChartProps {
  percentage: number;
  label?: string;
  textPosition?: "rigth" | "bottom";
}

const DonutChart: React.FC<DonutChartProps> = ({ percentage, label, textPosition = "rigth" }) => {
  const radius: number = 40;
  const stroke: number = 10;
  const normalizedRadius: number = radius - stroke / 2;
  const circumference: number = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset: number = circumference - (percentage / 100) * circumference;

  const color: string = percentage < 30 ? "#e74c3c" : "#2ecc71"; // red or green
  const flexDirection = textPosition === "rigth" ? "row" : "column";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexDirection: flexDirection }}>
      <svg height={radius * 2} width={radius * 2} style={{ transform: "rotate(-90deg)" }}>
        <circle stroke="#e6e6e6" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{
            strokeDashoffset,
            transition: "stroke-dashoffset 0.5s ease",
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fill="#2c3e50"
          fontSize="16px"
          fontWeight={700}
          transform={`rotate(90, ${radius}, ${radius})`}
        >
          {percentage}%
        </text>
      </svg>
      {label && <span style={{ fontWeight: "bold", color: "#2c3e50" }}>{label}</span>}
    </div>
  );
};

export default DonutChart;
