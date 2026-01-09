import { Card } from "@/components/ui/card";
import { Icon } from "@iconify/react";

type StatCardProps = {
  icon: string;             
  label: string;             
  value: string | number;    
  change: number;           
};

export function StatCard({ icon, label, value, change }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <Card className="p-4 rounded-lg shadow flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="md:text-xs lg:text-sm xl:text-lg xl:font-medium uppercase text-muted-foreground">{label}</p>
          <p className="text-lg lg:text-xl xl:text-3xl font-bold mt-1">{value}</p>
        </div>

        <div className="w-10 h-10 lg:w-14 lg:h-14 xl:w-18 xl:h-18 rounded-full flex items-center justify-center bg-yellow-500 text-white shadow">
          <Icon icon={icon} className="w-6 h-6 lg:w-10 lg:h-10 xl:w-12 xl:h-12" />
        </div>
      </div>
      
      <p className="md:text-[12px] lg:text-[12px] xl:text-[16px] text-muted-foreground flex items-center gap-2">
        <span className={`${isPositive ? "text-green-600" : "text-red-600"} flex items-center gap-1`}>
          <Icon
            icon={isPositive ? "mdi:arrow-up" : "mdi:arrow-down"}
            className="lg:w-4 lg:h-4 xl:w-14 xl-w14"
          />
          {Math.abs(change)}%
        </span>
        <span className="text-nowrap">Since last week</span>
      </p>
    </Card>
  );
}
