import { PieChart, Pie, Cell } from 'recharts';

interface GaugeChartProps {
  percentage: number;
}

export default function GaugeChart({ percentage }: GaugeChartProps) {
  // Data for the gauge segments
  const data = [
    { name: 'Low', value: 33, color: '#22c55e' },      // Green
    { name: 'Medium', value: 34, color: '#eab308' },   // Yellow
    { name: 'High', value: 33, color: '#ef4444' },     // Red
  ];

  // Calculate needle rotation based on percentage
  const needleRotation = -90 + (percentage / 100) * 180;

  return (
    <div className="relative w-64 h-40 mx-auto">
      <PieChart width={256} height={160}>
        <Pie
          data={data}
          cx={128}
          cy={128}
          startAngle={180}
          endAngle={0}
          innerRadius={70}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>

      {/* Needle */}
      <div
        className="absolute bottom-0 left-1/2 w-1 h-20 bg-gray-800 origin-bottom transition-transform duration-1000 ease-out"
        style={{
          transform: `translateX(-50%) rotate(${needleRotation}deg)`,
        }}
      >
        <div className="absolute -top-1 -left-1.5 w-4 h-4 bg-gray-800 rounded-full"></div>
      </div>

      {/* Center Point */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-gray-800 rounded-full"></div>

      {/* Percentage Display */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <span
          className={`text-4xl font-bold ${
            percentage >= 70 ? 'text-red-500' : percentage >= 40 ? 'text-yellow-500' : 'text-green-500'
          }`}
        >
          {percentage}%
        </span>
      </div>

      {/* Labels */}
      <div className="absolute bottom-0 w-full flex justify-between px-8 text-xs text-gray-400">
        <span>Bajo</span>
        <span>Medio</span>
        <span>Alto</span>
      </div>
    </div>
  );
}
