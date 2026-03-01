import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { BookOpen, Heart } from "lucide-react";
import { motion } from "motion/react";
import { BookCard } from "../components/BookCard";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetFavorites, useListAllBooks } from "../hooks/useQueries";

export function FavoritesPage() {
  const { identity, login } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const { data: favoriteIds, isLoading: favLoading } = useGetFavorites();
  const { data: allBooks, isLoading: booksLoading } = useListAllBooks();

  const isLoading = favLoading || booksLoading;

  const favoriteBooks =
    allBooks?.filter((book) =>
      favoriteIds?.some((fid) => fid.toString() === book.id.toString()),
    ) ?? [];

  if (!isLoggedIn) {
    return (
      <main className="container mx-auto px-4 py-20 text-center max-w-lg">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
          <Heart className="w-9 h-9 text-muted-foreground" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-3">Your Favorites</h1>
        <p className="font-body text-muted-foreground mb-8">
          Log in to save books you love and access them anytime.
        </p>
        <Button
          onClick={login}
          className="font-ui bg-forest text-primary-foreground hover:bg-forest/90"
        >
          Log in to view favorites
        </Button>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-6 h-6 text-sienna fill-current" />
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            Favorites
          </h1>
        </div>
        <p className="font-ui text-sm text-muted-foreground">
          {isLoading
            ? "Loading…"
            : `${favoriteBooks.length} ${favoriteBooks.length === 1 ? "book" : "books"} saved`}
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {[
            "fav-sk-1",
            "fav-sk-2",
            "fav-sk-3",
            "fav-sk-4",
            "fav-sk-5",
            "fav-sk-6",
          ].map((k) => (
            <div
              key={k}
              className="rounded-lg overflow-hidden bg-card shadow-book"
            >
              <Skeleton className="aspect-[3/4] w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-16 rounded-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : favoriteBooks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
            <BookOpen className="w-9 h-9 text-muted-foreground" />
          </div>
          <h2 className="font-display text-2xl font-semibold mb-2">
            No favorites yet
          </h2>
          <p className="text-muted-foreground font-body max-w-sm mb-6">
            Explore the library and save books that interest you — they&apos;ll
            appear here.
          </p>
          <Link to="/">
            <Button className="font-ui bg-forest text-primary-foreground hover:bg-forest/90">
              Browse the Library
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {favoriteBooks.map((book, i) => (
            <BookCard key={book.id.toString()} book={book} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}
