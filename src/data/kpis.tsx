import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { Progress, Chip } from "@heroui/react";
import { KPI } from "@/types/kpi";

export const kpis: KPI[] = [
  // 1️⃣ Quote Close Rate
  {
    title: "Quote Close Rate",
    visual: (
      <ResponsiveContainer width="100%" height={100}>
        <PieChart>
          <Pie
            data={[
              { name: "Closed", value: 68 },
              { name: "Open", value: 32 },
            ]}
            innerRadius={35}
            outerRadius={45}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
          >
            <Cell fill="#17c964" />
            <Cell fill="#3f3f46" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    ),
    value: "68% ↑",
    delta: "+4% vs last week",
    description:
      "How often your bids turn into jobs — tells you if pricing is competitive.",
  },

  // 2️⃣ Average Profit Margin
  {
    title: "Average Profit Margin",
    visual: (
      <Progress
        value={34}
        color="success"
        className="w-full max-w-xs mt-2"
        aria-label="Average Profit Margin"
      />
    ),
    value: "34%",
    description:
      "True financial health — every contractor wants to see this first.",
  },

  // 3️⃣ Board Feet Sprayed (This Month)
  {
    title: "Board Feet Sprayed (This Month)",
    visual: (
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart
          data={Array.from({ length: 30 }, (_, i) => ({
            day: `${i + 1}`,
            value: Math.floor(5000 + Math.random() * 15000), // demo data
          }))}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorFoam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#17c964" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#17c964" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickCount={6} // keeps labels readable
            tick={{ fill: "var(--color-foreground)", fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            tick={{ fill: "var(--color-foreground)", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(24, 24, 27, 0.9)", // glassy dark gray
              border: "1px solid rgba(63,63,70,0.4)", // subtle border
              borderRadius: "8px",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
            labelStyle={{
              color: "#fafafa",
              fontWeight: 600,
              fontSize: "0.8rem",
              marginBottom: "2px",
            }}
            itemStyle={{
              color: "#d4d4d8",
              fontSize: "0.8rem",
            }}
            cursor={{ stroke: "#a78bfa", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#17c964"
            fillOpacity={1}
            fill="url(#colorFoam)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    ),
    value: "78,400 bdft",
    description: "Production volume — total board feet sprayed this month.",
  },

  // 4️⃣ Average Job Value
  {
    title: "Average Job Value",
    visual: (
      <div className="flex items-center justify-center text-3xl font-bold text-success">
        $8,200
      </div>
    ),
    value: "$8,200",
    description:
      "Shows the average deal size — useful for forecasting.",
  },

  // 5️⃣ Material Cost Ratio
  {
    title: "Material Cost Ratio",
    visual: (
      <Chip
        color="success"
        variant="flat"
        className="text-md font-semibold"
      >
        27%
      </Chip>
    ),
    value: "27%",
    description:
      "Tracks foam cost vs total job price; if it spikes, pricing or yield is off.",
  },
];
