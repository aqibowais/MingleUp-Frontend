const ThemePreview = ({ theme }) => {
  return (
    <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={theme}>
      <div className="absolute inset-0 grid grid-cols-4 gap-1 p-1">
        <div className="rounded bg-primary"></div>
        <div className="rounded bg-secondary"></div>
        <div className="rounded bg-accent"></div>
        <div className="rounded bg-neutral"></div>
      </div>
    </div>
  );
};

export default ThemePreview;
