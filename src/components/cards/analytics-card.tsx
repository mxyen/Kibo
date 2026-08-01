"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalyticsCard({
  title,
  data,
  color = "var(--color-primary)",
}: {
  title: string;
  data: number[];
  color?: string;
}) {
  const max = Math.max(...data, 1);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-32 items-end gap-2">
          {data.map((v, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${(v / max) * 100}%` }}
              transition={{ delay: i * 0.06, type: "spring", duration: 0.5, bounce: 0.2 }}
              className="flex-1 rounded-t-md"
              style={{ background: color, opacity: 0.15 + (v / max) * 0.85 }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
