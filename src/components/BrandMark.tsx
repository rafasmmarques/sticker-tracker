import logo from "../assets/brand/logo.svg";

type BrandMarkProps = {
  variant?: "hero" | "card";
};

export function BrandMark({ variant = "card" }: BrandMarkProps) {
  return (
    <div className={`brand-mark brand-mark--${variant}`}>
      <img src={logo} alt="" aria-hidden="true" />
    </div>
  );
}
