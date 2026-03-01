import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Book, Chapter, Review } from "../backend.d";
import { useActor } from "./useActor";

// ─── Books ────────────────────────────────────────────────────────────────────

export function useListAllBooks() {
  const { actor, isFetching } = useActor();
  return useQuery<Book[]>({
    queryKey: ["books"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllBooks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBookById(id: bigint | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<Book | null>({
    queryKey: ["book", id?.toString()],
    queryFn: async () => {
      if (!actor || id === undefined) return null;
      return actor.getBookById(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

export function useSearchBooks(keyword: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Book[]>({
    queryKey: ["books-search", keyword],
    queryFn: async () => {
      if (!actor) return [];
      if (!keyword.trim()) return actor.listAllBooks();
      return actor.searchBooks(keyword);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFilterByGenre(genre: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Book[]>({
    queryKey: ["books-genre", genre],
    queryFn: async () => {
      if (!actor) return [];
      if (!genre || genre === "All") return actor.listAllBooks();
      return actor.filterByGenre(genre);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddBook() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (book: Book) => {
      if (!actor) throw new Error("Not connected");
      return actor.addBook(book);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useUpdateBook() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, book }: { id: bigint; book: Book }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateBook(id, book);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useDeleteBook() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteBook(id);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

// ─── Chapters ─────────────────────────────────────────────────────────────────

export function useGetChaptersByBookId(bookId: bigint | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<Chapter[]>({
    queryKey: ["chapters", bookId?.toString()],
    queryFn: async () => {
      if (!actor || bookId === undefined) return [];
      return actor.getChaptersByBookId(bookId);
    },
    enabled: !!actor && !isFetching && bookId !== undefined,
  });
}

export function useGetChapterById(id: bigint | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<Chapter | null>({
    queryKey: ["chapter", id?.toString()],
    queryFn: async () => {
      if (!actor || id === undefined) return null;
      return actor.getChapterById(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

export function useAddChapter() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (chapter: Chapter) => {
      if (!actor) throw new Error("Not connected");
      return actor.addChapter(chapter);
    },
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({
        queryKey: ["chapters", variables.bookId.toString()],
      });
    },
  });
}

export function useUpdateChapter() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, chapter }: { id: bigint; chapter: Chapter }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateChapter(id, chapter);
    },
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({
        queryKey: ["chapters", variables.chapter.bookId.toString()],
      });
      void qc.invalidateQueries({
        queryKey: ["chapter", variables.id.toString()],
      });
    },
  });
}

export function useDeleteChapter() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      bookId: _bookId,
    }: { id: bigint; bookId: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteChapter(id);
    },
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({
        queryKey: ["chapters", variables.bookId.toString()],
      });
    },
  });
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export function useGetReviewsByBookId(bookId: bigint | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<Review[]>({
    queryKey: ["reviews", bookId?.toString()],
    queryFn: async () => {
      if (!actor || bookId === undefined) return [];
      return actor.getReviewsByBookId(bookId);
    },
    enabled: !!actor && !isFetching && bookId !== undefined,
  });
}

export function useGetAverageRating(bookId: bigint | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<number | null>({
    queryKey: ["rating", bookId?.toString()],
    queryFn: async () => {
      if (!actor || bookId === undefined) return null;
      return actor.getAverageRating(bookId);
    },
    enabled: !!actor && !isFetching && bookId !== undefined,
  });
}

export function useAddReview() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bookId,
      rating,
      comment,
    }: {
      bookId: bigint;
      rating: bigint;
      comment: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addReview(bookId, rating, comment);
    },
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({
        queryKey: ["reviews", variables.bookId.toString()],
      });
      void qc.invalidateQueries({
        queryKey: ["rating", variables.bookId.toString()],
      });
    },
  });
}

// ─── Favorites ────────────────────────────────────────────────────────────────

export function useGetFavorites() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint[]>({
    queryKey: ["favorites"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFavorites();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddFavorite() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (bookId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.addFavorite(bookId);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useRemoveFavorite() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (bookId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeFavorite(bookId);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

// ─── Reading Progress ─────────────────────────────────────────────────────────

export function useGetReadingProgress(bookId: bigint | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<bigint | null>({
    queryKey: ["progress", bookId?.toString()],
    queryFn: async () => {
      if (!actor || bookId === undefined) return null;
      return actor.getReadingProgress(bookId);
    },
    enabled: !!actor && !isFetching && bookId !== undefined,
  });
}

export function useUpdateReadingProgress() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bookId,
      chapterIndex,
    }: {
      bookId: bigint;
      chapterIndex: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateReadingProgress(bookId, chapterIndex);
    },
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({
        queryKey: ["progress", variables.bookId.toString()],
      });
    },
  });
}

// ─── User / Admin ─────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAssignCallerUserRole() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      principal,
      role,
    }: {
      principal: string;
      role: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      // Import Principal dynamically
      const { Principal } = await import("@icp-sdk/core/principal");
      const p = Principal.fromText(principal);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return actor.assignCallerUserRole(p, role as any);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["isAdmin"] });
      void qc.invalidateQueries({ queryKey: ["userRole"] });
    },
  });
}
