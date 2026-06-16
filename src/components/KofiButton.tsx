import { KOFI_URL } from "../constants/support";

export function KofiButton() {
  return (
    <a
      className="app-footer__kofi"
      href={KOFI_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      Gostou do projeto? <br /> Que tal me ajudar com um cafézinho? ☕
    </a>
  );
}
