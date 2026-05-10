import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import type { Sticker, StickerCollection } from "../types/sticker";
import { getStickerQuantity } from "../utils/collection";

function getContrastColor(hexColor: string | null): string {
  if (!hexColor) return "var(--color-ink)";

  const hex = hexColor.replace("#", "");
  if (hex.length !== 6) return "var(--color-ink)";

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "var(--color-ink)" : "#ffffff";
}

const FIFA_TO_ISO: Record<string, string> = {
  BRA: "br",
  GER: "de",
  USA: "us",
  MEX: "mx",
  JPN: "jp",
  FRA: "fr",
  ENG: "gb",
  ESP: "es",
  ITA: "it",
  POR: "pt",
  NED: "nl",
  BEL: "be",
  ARG: "ar",
  COL: "co",
  URU: "uy",
  CHI: "cl",
  PER: "pe",
  ECU: "ec",
  CAN: "ca",
  AUS: "au",
  KOR: "kr",
  RSA: "za",
  SEN: "sn",
  CMR: "cm",
  NGA: "ng",
  GHA: "gh",
  CIV: "ci",
  MAR: "ma",
  EGY: "eg",
  TUN: "tn",
  ALG: "dz",
  SDN: "sd",
  QAT: "qa",
  UAE: "ae",
  KSA: "sa",
  IRN: "ir",
  IRQ: "iq",
  TUR: "tr",
  AUT: "at",
  SUI: "ch",
  ROU: "ro",
  POL: "pl",
  UKR: "ua",
  RUS: "ru",
  CRO: "hr",
  SRB: "rs",
  DEN: "dk",
  SWE: "se",
  NOR: "no",
  FIN: "fi",
  ISL: "is",
  SCO: "gb-sct",
  WAL: "gb-wls",
  NIR: "gb-nir",
  IRL: "ie",
  CZE: "cz",
  SVK: "sk",
  HUN: "hu",
  GRE: "gr",
  BUL: "bg",
  SVN: "si",
  BIH: "ba",
  MNE: "me",
  ALB: "al",
  GEO: "ge",
  ARM: "am",
  AZE: "az",
  KAZ: "kz",
  UZB: "uz",
  TKM: "tm",
  KGZ: "kg",
  TJK: "tj",
  NZL: "nz",
  PAN: "pa",
  JAM: "jm",
  HAI: "ht",
  CRC: "cr",
  HON: "hn",
  GUA: "gt",
  PAR: "py",
  BOL: "bo",
  VEN: "ve",
  TRI: "tt",
  BRU: "bn",
  SIN: "sg",
  MAS: "my",
  IDN: "id",
  THA: "th",
  VNM: "vn",
  PHI: "ph",
  IND: "in",
  CHN: "cn",
  HKG: "hk",
  TPE: "tw",
  PRK: "kp",
  CYP: "cy",
  MLT: "mt",
  LUX: "lu",
  AND: "ad",
  MON: "mc",
  SMR: "sm",
  LIE: "li",
  GIB: "gi",
  FRO: "fo",
  CPV: "cv",
  JOR: "jo",
  COD: "cd",
  CGO: "cg",
  CUW: "cw",
};

type StickerListProps = {
  stickers: Sticker[];
  collection: StickerCollection;
  onIncreaseQuantity: (stickerId: number) => void;
  onDecreaseQuantity: (stickerId: number) => void;
  showOnlyMissing?: boolean;
  showOnlyRepeated?: boolean;
};

export function StickerList({
  stickers,
  collection,
  onIncreaseQuantity,
  onDecreaseQuantity,
  showOnlyMissing = false,
  showOnlyRepeated = false,
}: StickerListProps) {
  return (
    <section className="flex flex-col gap-0.5" aria-label="Lista condensada">
      {stickers.map((sticker) => {
        const quantity = getStickerQuantity(collection, sticker.id);
        const isHidden =
          (showOnlyMissing && quantity > 0) ||
          (showOnlyRepeated && quantity < 2);
        
        return <StickerRowWithFade 
          key={sticker.id} 
          sticker={sticker} 
          quantity={quantity}
          isHidden={isHidden}
          team={sticker.team}
          onIncreaseQuantity={onIncreaseQuantity}
          onDecreaseQuantity={onDecreaseQuantity}
        />
      })}
    </section>
  );
}

type StickerRowWithFadeProps = {
  sticker: Sticker;
  quantity: number;
  isHidden: boolean;
  team?: Sticker["team"];
  onIncreaseQuantity: (stickerId: number) => void;
  onDecreaseQuantity: (stickerId: number) => void;
};

function StickerRowWithFade({
  sticker,
  quantity,
  isHidden,
  team,
  onIncreaseQuantity,
  onDecreaseQuantity,
}: StickerRowWithFadeProps) {
  const [showRow, setShowRow] = useState(true);

  useEffect(() => {
    if (isHidden && showRow) {
      const timer = setTimeout(() => {
        setShowRow(false);
      }, 400);
      return () => clearTimeout(timer);
    }

    if (!isHidden && !showRow) {
      const timer = setTimeout(() => {
        setShowRow(true);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [isHidden, showRow]);

  if (!showRow) return null;

  const fifaCode = team?.fifaCode?.toUpperCase() ?? null;
  const isoCode = fifaCode ? FIFA_TO_ISO[fifaCode]?.toLowerCase() : null;
  const flagCode = isoCode ?? team?.countryCode?.toLowerCase() ?? null;
  const primaryColor = team?.primaryColor ?? null;
  const secondaryColor = team?.secondaryColor ?? null;

  const rowClasses = isHidden
    ? "flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg min-h-12 sticker-row--hidden"
    : quantity > 0
      ? "flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg min-h-12"
      : "flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg min-h-12";

  let bgStyle: CSSProperties | undefined;
  
  if (sticker.groupCode === "FWC" || sticker.groupCode === "PAN") {
    bgStyle = {
      background: "linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 50%, #d0d0d0 100%)",
    } as CSSProperties;
  } else if (sticker.groupCode === "CC") {
    bgStyle = {
      background:
        "linear-gradient(135deg, #e41f26 0%, #8d1117 46%, #050505 100%)",
    } as CSSProperties;
  } else if (primaryColor || secondaryColor) {
    bgStyle = {
      "--team-primary": primaryColor,
      "--team-secondary": secondaryColor,
      "--team-text": getContrastColor(primaryColor),
      background: primaryColor 
        ? `linear-gradient(135deg, ${primaryColor}20 0%, ${secondaryColor}30 100%)`
        : undefined,
    } as CSSProperties;
  }
  const codeClasses =
    sticker.groupCode === "CC"
      ? "text-sm font-bold text-white"
      : "text-sm font-bold text-[var(--color-ink)]";

  return (
    <div className={rowClasses} style={bgStyle}>
      <div className="min-w-8 h-7 flex items-center justify-center rounded-md bg-white/70 text-sm font-extrabold text-[var(--color-navy)]">{quantity}</div>

      <div className="flex-1 flex items-center gap-2 min-w-0">
        {flagCode && (
          <img
            src={`https://flagcdn.com/w80/${flagCode}.png`}
            alt={team?.name ?? ""}
            className="w-7 h-5 object-contain rounded-sm flex-shrink-0"
            loading="lazy"
          />
        )}
        <span className={codeClasses}>{sticker.displayCode}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className="w-8 h-8 rounded-full text-lg font-bold flex items-center justify-center bg-white text-red-600 hover:bg-red-500 hover:text-white transition disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`Remover ${sticker.displayCode}`}
          disabled={quantity === 0}
          onClick={() => onDecreaseQuantity(sticker.id)}
        >
          −
        </button>
        <button
          type="button"
          className="w-8 h-8 rounded-full text-lg font-bold flex items-center justify-center bg-white text-green-600 hover:bg-green-500 hover:text-white transition"
          aria-label={`Adicionar ${sticker.displayCode}`}
          onClick={() => onIncreaseQuantity(sticker.id)}
        >
          +
        </button>
      </div>
    </div>
  );
}
