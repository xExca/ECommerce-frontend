import { StatCard } from "@/components/dashboard/StatCard";

export default function DashboardPage() {
  return (
    <div className="h-full w-full grid grid-rows-[auto_1fr] gap-4">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-stretch">
        <StatCard icon="mdi:email-outline" label="Emails Sent" value="12,361" change={14} />
        <StatCard icon="mdi:cash-register" label="Sales Obtained" value="431,225" change={21} />
        <StatCard icon="mdi:account-plus-outline" label="New Clients" value="32,441" change={5} />
        <StatCard icon="mdi:traffic-light" label="Traffic Received" value="1,325,134" change={43} />
      </div>


      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 h-full">
        <div className="col-span-1 md:col-span-2 xl:col-span-2 h-full">
          <div className="bg-white shadow-sm h-full rounded-lg p-8">
            <div className="text-3xl font-semibold">Test 5</div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 xl:col-span-2 xl:col-start-3 h-full">
          <div className="bg-white shadow-sm h-full rounded-lg p-8">
            <div className="text-3xl font-semibold">Test 6</div>
          </div>
        </div>
      </div>
    </div>
  );
}