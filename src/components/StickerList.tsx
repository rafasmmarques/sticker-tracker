import type { CSSProperties } from "react";
import type { Sticker, StickerCollection } from "../types/sticker";
import { getStickerQuantity } from "../utils/collection";

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
};

export function StickerList({
  stickers,
  collection,
  onIncreaseQuantity,
  onDecreaseQuantity,
  showOnlyMissing = false,
}: StickerListProps) {
  return (
    <section className="sticker-list" aria-label="Lista condensada">
      {stickers.map((sticker) => {
        const quantity = getStickerQuantity(collection, sticker.id);
        const isHidden = showOnlyMissing && quantity > 0;
        const team = sticker.team;

        const fifaCode = team?.fifaCode?.toUpperCase() ?? null;
        const isoCode = fifaCode ? FIFA_TO_ISO[fifaCode]?.toLowerCase() : null;
        const flagCode = isoCode ?? team?.countryCode?.toLowerCase() ?? null;
        const primaryColor = team?.primaryColor ?? null;
        const secondaryColor = team?.secondaryColor ?? null;

        return (
          <div
            key={sticker.id}
            className={`sticker-row ${quantity > 0 ? "sticker-row--owned" : ""} ${isHidden ? "sticker-row--hidden" : ""}`}
            style={
              primaryColor || secondaryColor
                ? {
                    "--team-primary": primaryColor,
                    "--team-secondary": secondaryColor,
                  } as CSSProperties
                : undefined
            }
          >
            <div className="sticker-row__qty">{quantity}</div>

            <div className="sticker-row__info">
              {flagCode && (
                <img
                  src={`https://flagcdn.com/w80/${flagCode}.png`}
                  alt={team?.name ?? ""}
                  className="sticker-row__flag"
                  loading="lazy"
                />
              )}
              <span className="sticker-row__code">{sticker.displayCode}</span>
            </div>

            <div className="sticker-row__actions">
              <button
                type="button"
                className="sticker-row__btn sticker-row__btn--remove"
                aria-label={`Remover ${sticker.displayCode}`}
                disabled={quantity === 0}
                onClick={() => onDecreaseQuantity(sticker.id)}
              >
                −
              </button>

              <button
                type="button"
                className="sticker-row__btn sticker-row__btn--add"
                aria-label={`Adicionar ${sticker.displayCode}`}
                onClick={() => onIncreaseQuantity(sticker.id)}
              >
                +
              </button>
            </div>
          </div>
        );
      })}
    </section>
  );
}