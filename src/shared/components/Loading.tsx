/** Loading — spinner / placeholder chung. */
export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center gap-3">
        <span className="w-8 h-8 border-3 border-slate-200 border-t-primary rounded-full animate-spin" />
        <span className="text-sm text-slate-500 font-medium">Đang tải...</span>
      </div>
    </div>
  );
}
