import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { motion } from "motion/react";
import type { Book } from "../backend.d";
import { useGetAverageRating } from "../hooks/useQueries";
import { StarRating } from "./StarRating";

interface BookCardProps {
  book: Book;
  index?: number;
}

export function BookCard({ book, index = 0 }: BookCardProps) {
  const { data: rating } = useGetAverageRating(book.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
    >
      <Link
        to="/books/$bookId"
        params={{ bookId: book.id.toString() }}
        className="group block"
      >
        <div className="relative overflow-hidden rounded-lg bg-card shadow-book transition-all duration-300 group-hover:shadow-book-hover group-hover:-translate-y-1">
          {/* Cover image */}
          <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
            <img
              src={book.coverUrl}
              alt={`Cover of ${book.title}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/20 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-card/90 rounded-full p-3">
                <BookOpen className="w-5 h-5 text-forest" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <Badge
              variant="secondary"
              className="mb-2 text-xs font-ui font-medium tracking-wide"
            >
              {book.genre}
            </Badge>

            <h3 className="font-display text-base font-semibold leading-tight text-card-foreground line-clamp-2 mb-1 group-hover:text-forest transition-colors">
              {book.title}
            </h3>

            <p className="text-xs font-ui text-muted-foreground mb-2">
              {book.author}
            </p>

            {rating !== null && rating !== undefined && (
              <div className="flex items-center gap-1.5">
                <StarRating value={rating} size="sm" />
                <span className="text-xs text-muted-foreground font-ui">
                  {rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
