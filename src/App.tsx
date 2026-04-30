import { useMemo, useState } from 'react';
import { AppHero } from './components/AppHero';
import { CollectionStats } from './components/CollectionStats';
import { CollectionToolbar } from './components/CollectionToolbar';
import { StickerGrid } from './components/StickerGrid';
import { stickers, TOTAL_STICKERS } from './data/stickers';
import { useStickerCollection } from './hooks/useStickerCollection';
import {
  calculateCollectionSummary,
  filterStickersByCode,
  getStickersWithoutQuantity
} from './utils/collection';
import './index.css';

function App() {
  const [search, setSearch] = useState('');

  const {
    collection,
    increaseStickerQuantity,
    decreaseStickerQuantity,
    clearCollection
  } = useStickerCollection();

  const filteredStickers = useMemo(() => {
    return filterStickersByCode(stickers, search);
  }, [search]);

  const missingStickers = useMemo(() => {
    return getStickersWithoutQuantity(stickers, collection);
  }, [collection]);

  const summary = useMemo(() => {
    return calculateCollectionSummary(stickers, collection, TOTAL_STICKERS);
  }, [collection]);

  async function copyMissingStickers() {
    const missingList = missingStickers.map((sticker) => sticker.code).join(', ');

    const text = missingList
      ? `Figurinhas que faltam na minha coleção: ${missingList}`
      : 'Completei minha coleção!';

    await navigator.clipboard.writeText(text);

    window.alert('Lista copiada!');
  }

  return (
    <main className="app-shell">
      <AppHero onClearCollection={clearCollection} />

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
    </main>
  );
}

export default App;