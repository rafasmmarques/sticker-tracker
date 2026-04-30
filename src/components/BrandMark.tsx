type BrandMarkProps = {
  variant?: "hero" | "card";
};

export function BrandMark({ variant = "card" }: BrandMarkProps) {
  return (
    <div className={`brand-mark brand-mark--${variant}`} aria-hidden="true">
      <svg viewBox="0 0 180 180" role="img" focusable="false">
        <rect
          className="brand-mark__tile"
          x="18"
          y="18"
          width="144"
          height="144"
          rx="34"
        />

        <path
          className="brand-mark__stripe brand-mark__stripe--red"
          d="M26 126C56 102 82 100 112 114C128 121 140 122 154 114"
        />

        <path
          className="brand-mark__stripe brand-mark__stripe--blue"
          d="M26 104C54 82 84 80 112 94C130 103 142 101 154 91"
        />

        <path
          className="brand-mark__stripe brand-mark__stripe--green"
          d="M30 142C60 124 88 124 116 136C132 143 144 143 156 134"
        />

        <circle className="brand-mark__ball" cx="90" cy="78" r="24" />

        <path
          className="brand-mark__ball-line"
          d="M90 54C102 64 107 78 102 94M90 54C78 64 73 78 78 94M68 78H112"
        />

        <text className="brand-mark__year" x="90" y="137" textAnchor="middle">
          26
        </text>
      </svg>
    </div>
  );
}
