export function RubixLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid grid-cols-3 gap-0.5">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="w-2 h-2 bg-[#FFE314]" />
        ))}
      </div>
      <span className="text-[#033500] text-2xl font-bold">rubix</span>
    </div>
  );
}