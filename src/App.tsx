import { useMemo, useState } from "react";
import { Routes, Route } from "react-router";
import { AppHero } from "./components/AppHero";
import { AppNavbar } from "./components/AppNavbar";
import { BackToTopButton } from "./components/BackToTopButton";
import { CollectionStats } from "./components/CollectionStats";
import { CollectionToolbar } from "./components/CollectionToolbar";
import { StickerGrid } from "./components/StickerGrid";
import { StickerList } from "./components/StickerList";
import { AppFooter } from "./components/AppFooter";
import { PublicTradePage } from "./pages/PublicTradePage";
import { TradeLinkSearch } from "./components/trade/TradeLinkSearch";
import { showToast } from "./utils/toast";
import { useAuth } from "./hooks/useAuth";
import { useStickerCatalog } from "./hooks/useStickerCatalog";
import { useStickerCollection } from "./hooks/useStickerCollection";
import { useMediaQuery } from "./hooks/useMediaQuery";
import {
  calculateCollectionSummary,
  filterStickersByCode,
  getStickersWithoutQuantity,
  getRepeatedStickers,
} from "./utils/collection";
import "./index.css";

function App() {
  const [search, setSearch] = useState("");
  const [showOnlyMissing, setShowOnlyMissing] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showMarkAllDialog, setShowMarkAllDialog] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isCondensedMode, setIsCondensedMode] = useState(isMobile);

  const { user } = useAuth();
  const { stickers } = useStickerCatalog();

  const {
    collection,
    isSyncing,
    saveCollection,
    increaseStickerQuantity,
    decreaseStickerQuantity,
    markAllStickers,
    clearCollection,
    importMissingList,
    importRepeatedList,
    applyTrade,
  } = useStickerCollection(user?.id);

  const allStickerIds = useMemo(() => stickers.map((s) => s.id), [stickers]);
  const stickerCodeMap = useMemo(
    () =>
      new Map(
        stickers.map((s) => [s.id, s.displayCode] as [number, string])
      ),
    [stickers]
  );

  const handleImportMissingList = (missingCodes: string[]) => {
    importMissingList(missingCodes, stickerCodeMap);
  };

  const handleImportRepeatedList = (repeatedCodes: string[]) => {
    importRepeatedList(repeatedCodes, stickerCodeMap);
  };

  const filteredStickers = useMemo(() => {
    let result = filterStickersByCode(stickers, search);

    // Não filtrar mais por showOnlyMissing - componentes controlam visibilidade via isHidden

    if (selectedGroup) {
      if (selectedGroup === "specials") {
        result = result.filter(
          (sticker) =>
            sticker.isSpecial ||
            sticker.specialFinish === "introduction" ||
            sticker.specialFinish === "museum" ||
            sticker.specialFinish === "special"
        );
      } else {
        result = result.filter(
          (sticker) => sticker.team?.fifaCode === selectedGroup
        );
      }
    }

    return result;
  }, [stickers, search, selectedGroup, collection]);

  const missingStickers = useMemo(() => {
    return getStickersWithoutQuantity(stickers, collection);
  }, [stickers, collection]);

  const repeatedStickers = useMemo(() => {
    return getRepeatedStickers(stickers, collection);
  }, [stickers, collection]);

  const groups = useMemo(() => {
    const groupMap = new Map<string, { fifaCode: string; name: string }[]>();

    stickers.forEach((sticker) => {
      const groupLetter = sticker.team?.groupLetter;
      const fifaCode = sticker.team?.fifaCode;
      const teamName = sticker.team?.name;
      if (groupLetter && fifaCode && teamName) {
        const existing = groupMap.get(groupLetter) ?? [];
        if (!existing.some((t) => t.fifaCode === fifaCode)) {
          existing.push({ fifaCode, name: teamName });
          groupMap.set(groupLetter, existing);
        }
      }
    });

    return Array.from(groupMap.entries())
      .map(([letter, teams]) => ({ letter, teams }))
      .sort((a, b) => a.letter.localeCompare(b.letter));
  }, [stickers]);

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

  async function copyToClipboard(type: "missing" | "repeated") {
    const targetList = type === "missing" ? missingStickers : repeatedStickers;
    const codeList = targetList.map((sticker) => sticker.displayCode).join(", ");

    const prefix =
      type === "missing"
        ? "Figurinhas que faltam na minha coleção:"
        : "Figurinhas repetidas na minha coleção:";

    const text = codeList
      ? `${prefix} ${codeList}`
      : type === "missing"
      ? "Completei minha coleção!"
      : "Não tenho figurinhas repetidas.";

    await navigator.clipboard.writeText(text);

    showToast({
      title:
        type === "missing"
          ? "Lista de faltantes copiada."
          : "Lista de repetidas copiada.",
      description: "Agora é só colar no WhatsApp ou mandar para seus amigos.",
      variant: "success",
    });
  }

  return (
    <Routes>
      <Route
        path="/trocas/:username"
        element={
          <PublicTradePage
            userId={user?.id}
            collection={collection}
            applyTrade={applyTrade}
          />
        }
      />
      <Route
        path="*"
        element={
          <main id="top" className="app-shell">
            <AppNavbar
              user={user}
              search={search}
              onSearchChange={setSearch}
              showOnlyMissing={showOnlyMissing}
              onShowOnlyMissingChange={setShowOnlyMissing}
              selectedGroup={selectedGroup}
              onGroupChange={setSelectedGroup}
              groups={groups}
              onExportList={copyToClipboard}
              onOpenImportDialog={() => setShowImportDialog(true)}
              onClearCollection={clearCollection}
              isCondensedMode={isCondensedMode}
              onCondensedModeChange={setIsCondensedMode}
            />

            <AppHero
              onSaveCollection={handleSaveCollection}
              isSavingCollection={isSyncing}
              onOpenMarkAllDialog={() => setShowMarkAllDialog(true)}
            />

            <CollectionStats summary={summary} />

            <TradeLinkSearch />

            <CollectionToolbar
              onMarkAllStickers={() => markAllStickers(allStickerIds)}
              allStickersCount={allStickerIds.length}
              onImportMissingList={handleImportMissingList}
              onImportRepeatedList={handleImportRepeatedList}
              showImportDialog={showImportDialog}
              onCloseImportDialog={() => setShowImportDialog(false)}
              showMarkAllDialog={showMarkAllDialog}
              onShowMarkAllDialogChange={setShowMarkAllDialog}
              showToast={showToast}
            />

            {isCondensedMode ? (
              <StickerList
                stickers={filteredStickers}
                collection={collection}
                onIncreaseQuantity={increaseStickerQuantity}
                onDecreaseQuantity={decreaseStickerQuantity}
                showOnlyMissing={showOnlyMissing}
              />
            ) : (
              <StickerGrid
                stickers={filteredStickers}
                collection={collection}
                onIncreaseQuantity={increaseStickerQuantity}
                onDecreaseQuantity={decreaseStickerQuantity}
                showOnlyMissing={showOnlyMissing}
              />
            )}

            <BackToTopButton />

            <AppFooter
              developerName="Rafael Marques"
              pixKey="61981141486"
            />
          </main>
        }
      />
    </Routes>
  );
}

export default App;