"use client";

import { useTheme } from "next-themes";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { format, subDays } from "date-fns";
import { BorderBeam } from "@/components/magicui/border-beam";

interface ActivityChartProps {
  data: { date: string; count: number }[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  const { theme } = useTheme();

  // If no data is provided, generate a flat 30-day empty chart for visual placeholder
  const chartData = data.length > 0 ? data : Array.from({ length: 30 }).map((_, i) => ({
    date: format(subDays(new Date(), 29 - i), "MMM dd"),
    count: 0
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="col-span-1 lg:col-span-4"
    >
      <Card className="h-full relative overflow-hidden group glass-subtle border-white/5 transition-all duration-300 card-hover group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
          <BorderBeam size={400} duration={15} delay={1} />
        </div>
        
        {/* Glowing orbs on hover */}
        <div className="absolute -right-20 -top-20 w-48 h-48 bg-primary/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
        <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-chart-2/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
        
        <CardHeader className="relative z-10 pb-0">
          <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors duration-300">Review Activity</CardTitle>
          <CardDescription>
            Code reviews conducted over the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 pt-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--muted-foreground)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  minTickGap={30}
                  dy={10}
                />
                <YAxis 
                  stroke="var(--muted-foreground)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  allowDecimals={false}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 41, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: 'var(--foreground)',
                    boxShadow: '0 10px 40px -10px rgba(99,102,241,0.3)',
                    padding: '12px'
                  }}
                  itemStyle={{ color: 'var(--primary)', fontWeight: 600 }}
                  labelStyle={{ color: 'var(--muted-foreground)', marginBottom: '4px', fontSize: '12px' }}
                  cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '3 3', opacity: 0.5 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="var(--primary)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
