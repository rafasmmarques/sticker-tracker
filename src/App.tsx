import { useMemo, useState } from "react";
import { AppHero } from "./components/AppHero";
import { AppNavbar } from "./components/AppNavbar";
import { BackToTopButton } from "./components/BackToTopButton";
import { CollectionStats } from "./components/CollectionStats";
import { CollectionToolbar } from "./components/CollectionToolbar";
import { StickerGrid } from "./components/StickerGrid";
import { useToast } from "./hooks/useToast";
import { useAuth } from "./hooks/useAuth";
import { useStickerCatalog } from "./hooks/useStickerCatalog";
import { useStickerCollection } from "./hooks/useStickerCollection";
import {
  calculateCollectionSummary,
  filterStickersByCode,
  getStickersWithoutQuantity,
} from "./utils/collection";
import "./index.css";

function App() {
  const [search, setSearch] = useState("");
  const { showToast } = useToast();
  const { user } = useAuth();
  const { stickers } = useStickerCatalog();

  const {
    collection,
    isSyncing,
    saveCollection,
    increaseStickerQuantity,
    decreaseStickerQuantity,
  } = useStickerCollection(user?.id);

  const filteredStickers = useMemo(() => {
    return filterStickersByCode(stickers, search);
  }, [stickers, search]);

  const missingStickers = useMemo(() => {
    return getStickersWithoutQuantity(stickers, collection);
  }, [stickers, collection]);

  const summary = useMemo(() => {
    return calculateCollectionSummary(stickers, collection, stickers.length);
  }, [stickers, collection]);

  async function handleSaveCollection() {
    try {
      const result = await saveCollection();

      if (result === "cloud") {
        showToast({
          title: "Coleção salva.",
          description: "Suas figurinhas foram sincronizadas na nuvem.",
          variant: "success",
        });

        return;
      }

      showToast({
        title: "Coleção salva neste navegador.",
        description:
          "Entre ou crie uma conta para sincronizar entre dispositivos.",
        variant: "info",
      });
    } catch {
      showToast({
        title: "Não foi possível salvar na nuvem.",
        description: "Sua coleção continua salva neste navegador.",
        variant: "error",
      });
    }
  }

  async function copyMissingStickers() {
    const missingList = missingStickers
      .map((sticker) => sticker.displayCode)
      .join(", ");

    const text = missingList
      ? `Figurinhas que faltam na minha coleção: ${missingList}`
      : "Completei minha coleção!";

    await navigator.clipboard.writeText(text);

    showToast({
      title: "Lista copiada.",
      description: "Agora é só colar no WhatsApp ou mandar para seus amigos.",
      variant: "success",
    });
  }

  return (
    <main id="top" className="app-shell">
      <AppNavbar user={user} />

      <AppHero
        onSaveCollection={handleSaveCollection}
        isSavingCollection={isSyncing}
      />

      <CollectionStats summary={summary} />

      <CollectionToolbar
        search={search}
        onSearchChange={setSearch}
        onCopyMissingStickers={copyMissingStickers}
      />

      <StickerGrid
        stickers={filteredStickers}
        collection={collection}
        onIncreaseQuantity={increaseStickerQuantity}
        onDecreaseQuantity={decreaseStickerQuantity}
      />

      <BackToTopButton />
    </main>
  );
}

export default App;
