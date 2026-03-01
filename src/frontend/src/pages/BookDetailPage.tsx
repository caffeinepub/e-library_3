import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Heart,
  Loader2,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { StarRating } from "../components/StarRating";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddFavorite,
  useAddReview,
  useGetAverageRating,
  useGetBookById,
  useGetChaptersByBookId,
  useGetFavorites,
  useGetReadingProgress,
  useGetReviewsByBookId,
  useRemoveFavorite,
} from "../hooks/useQueries";

export function BookDetailPage() {
  const { bookId } = useParams({ from: "/books/$bookId" });
  const id = BigInt(bookId);

  const { identity } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const { data: book, isLoading: bookLoading } = useGetBookById(id);
  const { data: chapters, isLoading: chaptersLoading } =
    useGetChaptersByBookId(id);
  const { data: reviews, isLoading: reviewsLoading } =
    useGetReviewsByBookId(id);
  const { data: rating } = useGetAverageRating(id);
  const { data: favorites } = useGetFavorites();
  const { data: progress } = useGetReadingProgress(id);

  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const addReview = useAddReview();

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const isFavorited = favorites?.some(
    (fid) => fid.toString() === id.toString(),
  );

  const sortedChapters = [...(chapters || [])].sort((a, b) =>
    Number(a.order - b.order),
  );

  const progressChapterIndex =
    progress !== null && progress !== undefined ? Number(progress) : null;
  const continueChapter =
    progressChapterIndex !== null && sortedChapters[progressChapterIndex]
      ? sortedChapters[progressChapterIndex]
      : sortedChapters[0];

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in to save favorites");
      return;
    }
    if (isFavorited) {
      await removeFavorite.mutateAsync(id);
      toast.success("Removed from favorites");
    } else {
      await addFavorite.mutateAsync(id);
      toast.success("Added to favorites");
    }
  };

  const handleSubmitReview = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in to leave a review");
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("Please write a comment");
      return;
    }
    await addReview.mutateAsync({
      bookId: id,
      rating: BigInt(reviewRating),
      comment: reviewComment,
    });
    toast.success("Review submitted!");
    setReviewComment("");
    setReviewRating(5);
  };

  if (bookLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
          <Skeleton className="w-48 h-64 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl mb-4">Book not found</h1>
        <Link to="/">
          <Button className="font-ui">Back to Library</Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-ui text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Library
      </Link>

      {/* Book header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-6 md:gap-10 mb-10"
      >
        {/* Cover */}
        <div className="shrink-0 mx-auto sm:mx-0">
          <div className="w-44 h-60 rounded-lg overflow-hidden shadow-book">
            <img
              src={book.coverUrl}
              alt={`Cover of ${book.title}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Badge
            variant="secondary"
            className="mb-3 font-ui text-xs tracking-wide"
          >
            {book.genre}
          </Badge>

          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 leading-tight">
            {book.title}
          </h1>

          <p className="font-ui text-muted-foreground mb-4 text-base">
            by{" "}
            <span className="text-foreground font-medium">{book.author}</span>
          </p>

          {rating !== null && rating !== undefined && (
            <div className="flex items-center gap-2 mb-5">
              <StarRating value={rating} size="md" />
              <span className="font-ui text-sm text-muted-foreground">
                {rating.toFixed(1)} / 5
                {reviews?.length
                  ? ` · ${reviews.length} ${reviews.length === 1 ? "review" : "reviews"}`
                  : ""}
              </span>
            </div>
          )}

          <p className="font-body text-base leading-relaxed text-foreground/80 mb-6 max-w-prose">
            {book.description}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {continueChapter && (
              <Link
                to="/books/$bookId/read/$chapterId"
                params={{
                  bookId: book.id.toString(),
                  chapterId: continueChapter.id.toString(),
                }}
              >
                <Button className="font-ui bg-forest text-primary-foreground hover:bg-forest/90 gap-2">
                  <BookOpen className="w-4 h-4" />
                  {progressChapterIndex !== null && progressChapterIndex > 0
                    ? "Continue Reading"
                    : "Start Reading"}
                </Button>
              </Link>
            )}

            <Button
              variant="outline"
              onClick={handleToggleFavorite}
              disabled={addFavorite.isPending || removeFavorite.isPending}
              className={`font-ui gap-2 ${isFavorited ? "border-sienna text-sienna hover:bg-sienna/10" : ""}`}
            >
              <Heart
                className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`}
              />
              {isFavorited ? "Saved" : "Save"}
            </Button>
          </div>
        </div>
      </motion.div>

      <Separator className="my-8" />

      {/* Chapters */}
      <section aria-labelledby="chapters-heading" className="mb-10">
        <h2
          id="chapters-heading"
          className="font-display text-2xl font-semibold mb-5"
        >
          Chapters
        </h2>

        {chaptersLoading ? (
          <div className="space-y-2">
            {["ch-sk-1", "ch-sk-2", "ch-sk-3", "ch-sk-4"].map((k) => (
              <Skeleton key={k} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : sortedChapters.length === 0 ? (
          <p className="text-muted-foreground font-ui text-sm">
            No chapters available yet.
          </p>
        ) : (
          <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
            {sortedChapters.map((chapter, i) => (
              <Link
                key={chapter.id.toString()}
                to="/books/$bookId/read/$chapterId"
                params={{
                  bookId: book.id.toString(),
                  chapterId: chapter.id.toString(),
                }}
                className="flex items-center justify-between px-5 py-4 hover:bg-secondary transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <span className="font-ui text-sm font-medium text-muted-foreground w-6">
                    {i + 1}
                  </span>
                  <span className="font-display text-base font-medium group-hover:text-forest transition-colors">
                    {chapter.title}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-forest transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </section>

      <Separator className="my-8" />

      {/* Reviews */}
      <section aria-labelledby="reviews-heading">
        <h2
          id="reviews-heading"
          className="font-display text-2xl font-semibold mb-5"
        >
          Reviews
        </h2>

        {/* Existing reviews */}
        {reviewsLoading ? (
          <div className="space-y-4 mb-8">
            {["rev-sk-1", "rev-sk-2"].map((k) => (
              <Skeleton key={k} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="space-y-4 mb-8">
            {reviews.map((review, i) => (
              <motion.div
                key={`${review.userId.toString()}-${i}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-lg p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-ui font-semibold text-muted-foreground">
                      {review.userId.toString().slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-ui text-sm text-muted-foreground">
                      {review.userId.toString().slice(0, 12)}…
                    </span>
                  </div>
                  <StarRating value={Number(review.rating)} size="sm" />
                </div>
                <p className="font-body text-sm text-foreground/80 leading-relaxed">
                  {review.comment}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground font-ui text-sm mb-8">
            No reviews yet. Be the first to share your thoughts!
          </p>
        )}

        {/* Add review form */}
        {isLoggedIn ? (
          <div className="bg-secondary/50 rounded-lg p-6 border border-border">
            <h3 className="font-display text-lg font-semibold mb-4">
              Write a Review
            </h3>

            <div className="mb-4">
              <span
                id="rating-label"
                className="block font-ui text-sm text-muted-foreground mb-2"
              >
                Your rating
              </span>
              <div aria-labelledby="rating-label">
                <StarRating
                  value={reviewRating}
                  size="lg"
                  interactive
                  onChange={setReviewRating}
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="review-comment"
                className="block font-ui text-sm text-muted-foreground mb-2"
              >
                Your thoughts
              </label>
              <Textarea
                id="review-comment"
                placeholder="What did you think of this book?"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                className="font-body resize-none"
              />
            </div>

            <Button
              onClick={handleSubmitReview}
              disabled={addReview.isPending || !reviewComment.trim()}
              className="font-ui bg-forest text-primary-foreground hover:bg-forest/90"
            >
              {addReview.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Star className="w-4 h-4 mr-2" />
              )}
              {addReview.isPending ? "Submitting…" : "Submit Review"}
            </Button>
          </div>
        ) : (
          <div className="bg-secondary/30 rounded-lg p-6 text-center border border-border border-dashed">
            <p className="font-ui text-sm text-muted-foreground">
              <button
                type="button"
                className="text-forest hover:underline font-medium"
                onClick={() => {
                  /* trigger from header */
                }}
              >
                Log in
              </button>{" "}
              to leave a review
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
