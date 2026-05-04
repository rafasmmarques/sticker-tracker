import type { Sticker } from "../types/sticker";

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

type StickerCardProps = {
  sticker: Sticker;
  quantity: number;
  onIncreaseQuantity: (stickerId: number) => void;
  onDecreaseQuantity: (stickerId: number) => void;
};

export function StickerCard({
  sticker,
  quantity,
  onIncreaseQuantity,
  onDecreaseQuantity,
}: StickerCardProps) {
  const repeatedQuantity = Math.max(quantity - 1, 0);
  const team = sticker.team;

  const fifaCode = team?.fifaCode?.toUpperCase() ?? null;
  const isoCode = fifaCode ? FIFA_TO_ISO[fifaCode]?.toLowerCase() : null;
  const flagCode = isoCode ?? team?.countryCode?.toLowerCase() ?? null;
  const primaryColor = team?.primaryColor ?? null;
  const secondaryColor = team?.secondaryColor ?? null;

  return (
    <article className="sticker-item">
      <div
        className={[
          "sticker-card",
          quantity > 0 ? "sticker-card--owned" : "",
        ].join(" ")}
        style={
          primaryColor || secondaryColor
            ? {
                "--team-primary": primaryColor,
                "--team-secondary": secondaryColor,
              } as React.CSSProperties
            : undefined
        }
      >
        <span className="sticker-card__number">{sticker.displayCode}</span>

<div className="sticker-card__art">
          {flagCode ? (
            <img
              src={`https://flagcdn.com/w160/${flagCode}.png`}
              alt={team?.name ?? ""}
              className="sticker-card__flag"
              loading="lazy"
            />
          ) : null}
        </div>

        <div className="sticker-card__footer">
          <strong>{getStickerStatus(quantity)}</strong>

          {repeatedQuantity > 0 && (
            <span>
              {repeatedQuantity} repetida{repeatedQuantity > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      <div className="sticker-card__actions">
        <button
          className="quantity-button quantity-button--remove"
          type="button"
          aria-label={`Remover figurinha ${sticker.displayCode}`}
          disabled={quantity === 0}
          onClick={() => onDecreaseQuantity(sticker.id)}
        >
          −
        </button>

        <div
          className="quantity-indicator"
          aria-label={`Quantidade da figurinha ${sticker.displayCode}`}
        >
          {quantity}
        </div>

        <button
          className="quantity-button quantity-button--add"
          type="button"
          aria-label={`Adicionar figurinha ${sticker.displayCode}`}
          onClick={() => onIncreaseQuantity(sticker.id)}
        >
          +
        </button>
      </div>
    </article>
  );
}

function getStickerStatus(quantity: number): string {
  if (quantity === 0) {
    return "Falta";
  }

  if (quantity === 1) {
    return "Tenho";
  }

  return `${quantity}x`;
}
