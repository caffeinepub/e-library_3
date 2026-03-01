import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import type { Book } from "../backend.d";
import { BookCard } from "../components/BookCard";
import { BookCardSkeleton } from "../components/BookCardSkeleton";
import { useActor } from "../hooks/useActor";
import { useListAllBooks } from "../hooks/useQueries";
import { SAMPLE_BOOKS, SAMPLE_CHAPTERS } from "../utils/seedData";

const PAGE_SIZE = 12;
const SKELETON_KEYS = Array.from({ length: 12 }, (_, i) => `skel-${i}`);

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [page, setPage] = useState(1);
  const [isSeeding, setIsSeeding] = useState(false);

  const { actor } = useActor();
  const { data: books, isLoading, isFetched } = useListAllBooks();

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Seed data on first load
  useEffect(() => {
    if (!actor || !isFetched || isSeeding) return;
    if (books && books.length === 0) {
      setIsSeeding(true);
      const seed = async () => {
        try {
          for (let i = 0; i < SAMPLE_BOOKS.length; i++) {
            const bookData = SAMPLE_BOOKS[i];
            const bookId = BigInt(i + 1);
            const book: Book = { id: bookId, ...bookData };
            await actor.addBook(book);

            const chapters = SAMPLE_CHAPTERS[bookData.title] ?? [];
            for (const ch of chapters) {
              await actor.addChapter({
                id: BigInt(0),
                bookId,
                ...ch,
              });
            }
          }
        } catch {
          // Seeding may fail if already seeded; ignore
        } finally {
          setIsSeeding(false);
        }
      };
      void seed();
    }
  }, [actor, books, isFetched, isSeeding]);

  // Reset page when filter changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset on filter change
  useEffect(() => setPage(1), [debouncedQuery, selectedGenre]);

  // Extract genres
  const genres = useMemo(() => {
    if (!books) return ["All"];
    const unique = Array.from(new Set(books.map((b) => b.genre))).sort();
    return ["All", ...unique];
  }, [books]);

  // Filter books client-side
  const filteredBooks = useMemo(() => {
    if (!books) return [];
    let list = books;
    if (selectedGenre !== "All") {
      list = list.filter((b) => b.genre === selectedGenre);
    }
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.genre.toLowerCase().includes(q),
      );
    }
    return list;
  }, [books, selectedGenre, debouncedQuery]);

  const visibleBooks = filteredBooks.slice(0, page * PAGE_SIZE);
  const hasMore = visibleBooks.length < filteredBooks.length;

  const showLoading = isLoading || isSeeding;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-forest py-20 md:py-28">
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, oklch(0.98 0.01 78) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, oklch(0.58 0.14 42) 0%, transparent 40%)`,
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-gold" />
              <span className="font-ui text-sm tracking-[0.15em] uppercase text-primary-foreground/70">
                Digital Library
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-none mb-6">
              Stories that <em className="not-italic text-gold">endure</em>
            </h1>

            <p className="font-body text-lg text-primary-foreground/75 mb-8 max-w-lg leading-relaxed">
              A curated collection of books across every genre, available to
              read anywhere, on any device. No subscriptions. No algorithms.
              Just literature.
            </p>

            {/* Search bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search titles, authors, genres…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 bg-card border-border text-foreground placeholder:text-muted-foreground font-ui rounded-lg shadow-lg"
                aria-label="Search books"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <main className="container mx-auto px-4 py-10">
        {/* Genre filters */}
        <motion.fieldset
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 mb-8 border-0 p-0 m-0"
        >
          <legend className="sr-only">Filter by genre</legend>
          {genres.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-1.5 rounded-full text-sm font-ui font-medium transition-all duration-200 ${
                selectedGenre === genre
                  ? "bg-forest text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
              aria-pressed={selectedGenre === genre}
            >
              {genre}
            </button>
          ))}
        </motion.fieldset>

        {/* Results info */}
        {!showLoading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-ui text-muted-foreground">
              {debouncedQuery || selectedGenre !== "All" ? (
                <>
                  {filteredBooks.length}{" "}
                  {filteredBooks.length === 1 ? "book" : "books"} found
                  {debouncedQuery && (
                    <>
                      {" "}
                      for &ldquo;
                      <strong className="text-foreground">
                        {debouncedQuery}
                      </strong>
                      &rdquo;
                    </>
                  )}
                </>
              ) : (
                <>{books?.length ?? 0} books in the collection</>
              )}
            </p>
          </div>
        )}

        {/* Book grid */}
        {showLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {SKELETON_KEYS.map((k) => (
              <BookCardSkeleton key={k} />
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
                <BookOpen className="w-9 h-9 text-muted-foreground" />
              </div>
              <h2 className="font-display text-2xl font-semibold mb-2">
                No books found
              </h2>
              <p className="text-muted-foreground font-body max-w-sm">
                {debouncedQuery
                  ? `No books match "${debouncedQuery}". Try a different search term.`
                  : "No books in this genre yet. Check back soon."}
              </p>
              <Button
                variant="outline"
                className="mt-6 font-ui"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedGenre("All");
                }}
              >
                Clear filters
              </Button>
            </motion.div>
          </AnimatePresence>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {visibleBooks.map((book, i) => (
                <BookCard key={book.id.toString()} book={book} index={i} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-10">
                <Button
                  variant="outline"
                  className="font-ui px-8"
                  onClick={() => setPage((p) => p + 1)}
                >
                  Load more books
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
