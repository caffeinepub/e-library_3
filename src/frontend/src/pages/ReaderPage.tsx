import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetBookById,
  useGetChapterById,
  useGetChaptersByBookId,
  useUpdateReadingProgress,
} from "../hooks/useQueries";

export function ReaderPage() {
  const { bookId, chapterId } = useParams({
    from: "/books/$bookId/read/$chapterId",
  });
  const id = BigInt(bookId);
  const cid = BigInt(chapterId);

  const { identity } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const { data: book } = useGetBookById(id);
  const { data: chapter, isLoading: chapterLoading } = useGetChapterById(cid);
  const { data: chapters } = useGetChaptersByBookId(id);
  const updateProgress = useUpdateReadingProgress();

  const sortedChapters = [...(chapters || [])].sort((a, b) =>
    Number(a.order - b.order),
  );

  const currentIndex = sortedChapters.findIndex(
    (c) => c.id.toString() === cid.toString(),
  );
  const prevChapter =
    currentIndex > 0 ? sortedChapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < sortedChapters.length - 1
      ? sortedChapters[currentIndex + 1]
      : null;

  const progressPercent =
    sortedChapters.length > 0
      ? Math.round(((currentIndex + 1) / sortedChapters.length) * 100)
      : 0;

  const updateProgressMutate = updateProgress.mutate;

  // Save reading progress when chapter loads
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional - trigger on chapterId change
  useEffect(() => {
    if (!isLoggedIn || currentIndex < 0) return;
    updateProgressMutate({
      bookId: id,
      chapterIndex: BigInt(currentIndex),
    });
  }, [chapterId, isLoggedIn, currentIndex, id, updateProgressMutate]);

  // Scroll to top on chapter change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional - trigger on chapterId change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [chapterId]);

  return (
    <div className="min-h-screen bg-background">
      {/* Reader top bar */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center justify-between h-14 gap-4">
            {/* Back to book */}
            <Link
              to="/books/$bookId"
              params={{ bookId: bookId }}
              className="flex items-center gap-1.5 text-sm font-ui text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{book?.title ?? "Back"}</span>
              <span className="sm:hidden">Back</span>
            </Link>

            {/* Progress */}
            {sortedChapters.length > 0 && (
              <div className="flex-1 flex items-center gap-2 max-w-xs">
                <Progress value={progressPercent} className="h-1.5" />
                <span className="text-xs font-ui text-muted-foreground shrink-0">
                  {progressPercent}%
                </span>
              </div>
            )}

            {/* Chapter nav */}
            <div className="flex items-center gap-1 shrink-0">
              {prevChapter ? (
                <Link
                  to="/books/$bookId/read/$chapterId"
                  params={{
                    bookId: bookId,
                    chapterId: prevChapter.id.toString(),
                  }}
                >
                  <Button variant="ghost" size="sm" className="font-ui px-2">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-ui px-2"
                  disabled
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}

              <span className="text-xs font-ui text-muted-foreground px-1">
                {currentIndex + 1} / {sortedChapters.length}
              </span>

              {nextChapter ? (
                <Link
                  to="/books/$bookId/read/$chapterId"
                  params={{
                    bookId: bookId,
                    chapterId: nextChapter.id.toString(),
                  }}
                >
                  <Button variant="ghost" size="sm" className="font-ui px-2">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-ui px-2"
                  disabled
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reading area */}
      <main className="container mx-auto px-4 max-w-2xl py-12 pb-24">
        {chapterLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/2 mx-auto mb-8" />
            {["p-sk-1", "p-sk-2", "p-sk-3", "p-sk-4", "p-sk-5", "p-sk-6"].map(
              (k) => (
                <Skeleton key={k} className="h-5 w-full" />
              ),
            )}
          </div>
        ) : !chapter ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-xl mb-2">Chapter not found</h2>
            <Link to="/books/$bookId" params={{ bookId: bookId }}>
              <Button className="font-ui mt-4">Back to Book</Button>
            </Link>
          </div>
        ) : (
          <motion.article
            key={cid.toString()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            aria-label={`Chapter: ${chapter.title}`}
          >
            {/* Chapter header */}
            <header className="text-center mb-12">
              <p className="font-ui text-sm text-muted-foreground mb-2 tracking-widest uppercase">
                Chapter {currentIndex + 1}
              </p>
              <h1 className="font-display text-3xl md:text-4xl font-bold">
                {chapter.title}
              </h1>
              <div className="mt-6 flex justify-center">
                <div className="w-16 h-px bg-sienna" />
              </div>
            </header>

            {/* Chapter content */}
            <div className="prose-reader">
              {chapter.content.split("\n\n").map((paragraph, paraIdx) => {
                // Handle italics formatting (*text*)
                const parts = paragraph.split(/(\*[^*]+\*)/g);
                // Use paragraph content hash as key for stable identity
                const paraKey = `para-${paraIdx}-${paragraph.slice(0, 20).replace(/\s/g, "_")}`;
                return (
                  <p key={paraKey}>
                    {parts.map((part, partIdx) => {
                      const partKey = `${paraKey}-part-${partIdx}`;
                      if (part.startsWith("*") && part.endsWith("*")) {
                        return <em key={partKey}>{part.slice(1, -1)}</em>;
                      }
                      return part;
                    })}
                  </p>
                );
              })}
            </div>

            {/* Chapter end navigation */}
            <div className="mt-16 pt-10 border-t border-border">
              <div className="flex items-center justify-between gap-4">
                {prevChapter ? (
                  <Link
                    to="/books/$bookId/read/$chapterId"
                    params={{
                      bookId: bookId,
                      chapterId: prevChapter.id.toString(),
                    }}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      className="font-ui w-full sm:w-auto justify-start gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="truncate max-w-[140px]">
                        {prevChapter.title}
                      </span>
                    </Button>
                  </Link>
                ) : (
                  <div />
                )}

                {nextChapter ? (
                  <Link
                    to="/books/$bookId/read/$chapterId"
                    params={{
                      bookId: bookId,
                      chapterId: nextChapter.id.toString(),
                    }}
                    className="flex-1 flex justify-end"
                  >
                    <Button className="font-ui bg-forest text-primary-foreground hover:bg-forest/90 w-full sm:w-auto justify-end gap-2">
                      <span className="truncate max-w-[140px]">
                        {nextChapter.title}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link
                    to="/books/$bookId"
                    params={{ bookId: bookId }}
                    className="flex-1 flex justify-end"
                  >
                    <Button className="font-ui bg-sienna text-primary-foreground hover:bg-sienna/90 w-full sm:w-auto gap-2">
                      <BookOpen className="w-4 h-4" />
                      Finish & Return
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.article>
        )}
      </main>
    </div>
  );
}
