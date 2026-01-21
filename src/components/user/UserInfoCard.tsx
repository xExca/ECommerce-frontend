
type UserInfoCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
}

const UserInfoCard = ({ title, description, children }: UserInfoCardProps) => {
  return (
    <div className="px-6 pb-6 pt-2 md:px-12 md:pb-8">
      <div className="flex flex-col md:flex-row md:gap-10">
        <div className="md:w-1/3 mb-6 md:mb-0">
          <h2 className="text-base font-semibold text-slate-900">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        </div>
        <div className="md:w-2/3 h-88 space-y-4 rounded-1xl border bg-slate-50/70 p-6 flex flex-col relative">
          {children}
        </div>
      </div>
    </div>
  );
}

export default UserInfoCard