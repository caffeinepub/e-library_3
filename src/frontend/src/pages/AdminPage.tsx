import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  UserCog,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Book, Chapter } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddBook,
  useAddChapter,
  useAssignCallerUserRole,
  useDeleteBook,
  useDeleteChapter,
  useGetChaptersByBookId,
  useIsCallerAdmin,
  useListAllBooks,
  useUpdateBook,
  useUpdateChapter,
} from "../hooks/useQueries";

// ─── Types ───────────────────────────────────────────────────────────────────

interface BookFormData {
  title: string;
  author: string;
  genre: string;
  description: string;
  coverUrl: string;
}

interface ChapterFormData {
  title: string;
  order: string;
  content: string;
}

const emptyBookForm = (): BookFormData => ({
  title: "",
  author: "",
  genre: "",
  description: "",
  coverUrl: "",
});

const emptyChapterForm = (): ChapterFormData => ({
  title: "",
  order: "1",
  content: "",
});

// ─── Book Form Dialog ─────────────────────────────────────────────────────────

function BookFormDialog({
  open,
  onClose,
  initialData,
  onSubmit,
  isPending,
  mode,
}: {
  open: boolean;
  onClose: () => void;
  initialData: BookFormData;
  onSubmit: (data: BookFormData) => void;
  isPending: boolean;
  mode: "add" | "edit";
}) {
  const [form, setForm] = useState<BookFormData>(initialData);

  // Reset when opened
  const handleOpenChange = (o: boolean) => {
    if (!o) onClose();
    else setForm(initialData);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">
            {mode === "add" ? "Add New Book" : "Edit Book"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {(["title", "author", "genre", "coverUrl"] as const).map((field) => (
            <div key={field}>
              <Label
                htmlFor={`book-${field}`}
                className="font-ui text-sm capitalize mb-1.5 block"
              >
                {field === "coverUrl" ? "Cover Image URL" : field}
              </Label>
              <Input
                id={`book-${field}`}
                value={form[field]}
                onChange={(e) =>
                  setForm((p) => ({ ...p, [field]: e.target.value }))
                }
                placeholder={
                  field === "coverUrl"
                    ? "https://picsum.photos/seed/MyBook/300/400"
                    : `Enter ${field}`
                }
                className="font-ui"
              />
            </div>
          ))}

          <div>
            <Label
              htmlFor="book-description"
              className="font-ui text-sm mb-1.5 block"
            >
              Description
            </Label>
            <Textarea
              id="book-description"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Brief description of the book…"
              rows={3}
              className="font-body resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="font-ui">
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit(form)}
            disabled={isPending || !form.title.trim()}
            className="font-ui bg-forest text-primary-foreground hover:bg-forest/90"
          >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {mode === "add" ? "Add Book" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Chapter Form Dialog ──────────────────────────────────────────────────────

function ChapterFormDialog({
  open,
  onClose,
  initialData,
  onSubmit,
  isPending,
  mode,
}: {
  open: boolean;
  onClose: () => void;
  initialData: ChapterFormData;
  onSubmit: (data: ChapterFormData) => void;
  isPending: boolean;
  mode: "add" | "edit";
}) {
  const [form, setForm] = useState<ChapterFormData>(initialData);

  const handleOpenChange = (o: boolean) => {
    if (!o) onClose();
    else setForm(initialData);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display">
            {mode === "add" ? "Add Chapter" : "Edit Chapter"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="ch-title"
                className="font-ui text-sm mb-1.5 block"
              >
                Chapter Title
              </Label>
              <Input
                id="ch-title"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Chapter title"
                className="font-ui"
              />
            </div>
            <div>
              <Label
                htmlFor="ch-order"
                className="font-ui text-sm mb-1.5 block"
              >
                Order
              </Label>
              <Input
                id="ch-order"
                type="number"
                min="1"
                value={form.order}
                onChange={(e) =>
                  setForm((p) => ({ ...p, order: e.target.value }))
                }
                className="font-ui"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="ch-content"
              className="font-ui text-sm mb-1.5 block"
            >
              Content
            </Label>
            <Textarea
              id="ch-content"
              value={form.content}
              onChange={(e) =>
                setForm((p) => ({ ...p, content: e.target.value }))
              }
              placeholder="Chapter text… Separate paragraphs with blank lines."
              rows={12}
              className="font-body resize-none text-sm"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="font-ui">
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit(form)}
            disabled={isPending || !form.title.trim()}
            className="font-ui bg-forest text-primary-foreground hover:bg-forest/90"
          >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {mode === "add" ? "Add Chapter" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Book Row ─────────────────────────────────────────────────────────────────

function BookRow({ book }: { book: Book }) {
  const [expanded, setExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addChapterOpen, setAddChapterOpen] = useState(false);
  const [editChapter, setEditChapter] = useState<Chapter | null>(null);

  const { data: chapters } = useGetChaptersByBookId(
    expanded ? book.id : undefined,
  );
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();
  const addChapter = useAddChapter();
  const updateChapter = useUpdateChapter();
  const deleteChapter = useDeleteChapter();

  const sortedChapters = [...(chapters || [])].sort((a, b) =>
    Number(a.order - b.order),
  );

  const handleEditBook = async (data: BookFormData) => {
    await updateBook.mutateAsync({
      id: book.id,
      book: {
        id: book.id,
        title: data.title,
        author: data.author,
        genre: data.genre,
        description: data.description,
        coverUrl: data.coverUrl,
      },
    });
    toast.success("Book updated");
    setEditOpen(false);
  };

  const handleDeleteBook = async () => {
    if (!window.confirm(`Delete "${book.title}"? This cannot be undone.`))
      return;
    await deleteBook.mutateAsync(book.id);
    toast.success("Book deleted");
  };

  const handleAddChapter = async (data: ChapterFormData) => {
    await addChapter.mutateAsync({
      id: BigInt(0),
      bookId: book.id,
      title: data.title,
      order: BigInt(Number.parseInt(data.order, 10) || 1),
      content: data.content,
    });
    toast.success("Chapter added");
    setAddChapterOpen(false);
  };

  const handleEditChapter = async (data: ChapterFormData) => {
    if (!editChapter) return;
    await updateChapter.mutateAsync({
      id: editChapter.id,
      chapter: {
        id: editChapter.id,
        bookId: book.id,
        title: data.title,
        order: BigInt(Number.parseInt(data.order, 10) || 1),
        content: data.content,
      },
    });
    toast.success("Chapter updated");
    setEditChapter(null);
  };

  const handleDeleteChapter = async (ch: Chapter) => {
    if (!window.confirm(`Delete chapter "${ch.title}"?`)) return;
    await deleteChapter.mutateAsync({ id: ch.id, bookId: book.id });
    toast.success("Chapter deleted");
  };

  return (
    <>
      <TableRow className="group">
        <TableCell className="w-10">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="p-1 rounded hover:bg-secondary transition-colors"
            aria-label={expanded ? "Collapse" : "Expand chapters"}
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-3">
            <img
              src={book.coverUrl}
              alt=""
              className="w-8 h-11 object-cover rounded shrink-0"
            />
            <div>
              <p className="font-display font-semibold text-sm">{book.title}</p>
              <p className="font-ui text-xs text-muted-foreground">
                {book.author}
              </p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Badge variant="secondary" className="font-ui text-xs">
            {book.genre}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditOpen(true)}
              className="font-ui h-8 w-8 p-0"
              aria-label="Edit book"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteBook}
              disabled={deleteBook.isPending}
              className="font-ui h-8 w-8 p-0 text-destructive hover:text-destructive"
              aria-label="Delete book"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {/* Expanded chapters */}
      {expanded && (
        <TableRow>
          <TableCell colSpan={4} className="p-0">
            <div className="bg-secondary/40 border-t border-border px-8 py-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-ui text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Chapters ({sortedChapters.length})
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="font-ui h-7 text-xs gap-1"
                  onClick={() => setAddChapterOpen(true)}
                >
                  <Plus className="w-3 h-3" />
                  Add Chapter
                </Button>
              </div>

              {sortedChapters.length === 0 ? (
                <p className="font-ui text-xs text-muted-foreground py-2">
                  No chapters yet.
                </p>
              ) : (
                <div className="space-y-1">
                  {sortedChapters.map((ch, i) => (
                    <div
                      key={ch.id.toString()}
                      className="flex items-center justify-between bg-card rounded px-3 py-2 border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-ui text-xs text-muted-foreground w-5">
                          {i + 1}
                        </span>
                        <span className="font-display text-sm font-medium">
                          {ch.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Link
                          to="/books/$bookId/read/$chapterId"
                          params={{
                            bookId: book.id.toString(),
                            chapterId: ch.id.toString(),
                          }}
                          target="_blank"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            aria-label="Preview chapter"
                          >
                            <BookOpen className="w-3 h-3" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => setEditChapter(ch)}
                          aria-label="Edit chapter"
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteChapter(ch)}
                          aria-label="Delete chapter"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}

      {/* Edit book dialog */}
      <BookFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={{
          title: book.title,
          author: book.author,
          genre: book.genre,
          description: book.description,
          coverUrl: book.coverUrl,
        }}
        onSubmit={handleEditBook}
        isPending={updateBook.isPending}
        mode="edit"
      />

      {/* Add chapter dialog */}
      <ChapterFormDialog
        open={addChapterOpen}
        onClose={() => setAddChapterOpen(false)}
        initialData={{
          ...emptyChapterForm(),
          order: String(sortedChapters.length + 1),
        }}
        onSubmit={handleAddChapter}
        isPending={addChapter.isPending}
        mode="add"
      />

      {/* Edit chapter dialog */}
      <ChapterFormDialog
        open={!!editChapter}
        onClose={() => setEditChapter(null)}
        initialData={
          editChapter
            ? {
                title: editChapter.title,
                order: editChapter.order.toString(),
                content: editChapter.content,
              }
            : emptyChapterForm()
        }
        onSubmit={handleEditChapter}
        isPending={updateChapter.isPending}
        mode="edit"
      />
    </>
  );
}

// ─── Admin Page ───────────────────────────────────────────────────────────────

export function AdminPage() {
  const { identity } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: books, isLoading: booksLoading } = useListAllBooks();
  const addBook = useAddBook();
  const assignRole = useAssignCallerUserRole();

  const [addBookOpen, setAddBookOpen] = useState(false);
  const [principalInput, setPrincipalInput] = useState("");
  const [roleInput, setRoleInput] = useState("admin");

  const handleAddBook = async (data: BookFormData) => {
    const nextId = BigInt((books?.length ?? 0) + 1);
    await addBook.mutateAsync({
      id: nextId,
      title: data.title,
      author: data.author,
      genre: data.genre,
      description: data.description,
      coverUrl:
        data.coverUrl ||
        `https://picsum.photos/seed/${encodeURIComponent(data.title)}/300/400`,
    });
    toast.success("Book added to library");
    setAddBookOpen(false);
  };

  const handleAssignRole = async () => {
    if (!principalInput.trim()) {
      toast.error("Please enter a Principal ID");
      return;
    }
    try {
      await assignRole.mutateAsync({
        principal: principalInput.trim(),
        role: roleInput,
      });
      toast.success(`Role '${roleInput}' assigned successfully`);
      setPrincipalInput("");
    } catch {
      toast.error("Failed to assign role. Check the Principal ID.");
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="container mx-auto px-4 py-20 text-center max-w-lg">
        <LayoutDashboard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-display text-3xl font-bold mb-3">
          Admin Dashboard
        </h1>
        <p className="font-body text-muted-foreground">
          Please log in to access the admin panel.
        </p>
      </main>
    );
  }

  if (adminLoading) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="container mx-auto px-4 py-20 text-center max-w-lg">
        <LayoutDashboard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-display text-3xl font-bold mb-3">Access Denied</h1>
        <p className="font-body text-muted-foreground">
          You don&apos;t have admin privileges. Contact an existing admin to
          grant you access.
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-forest" />
            <div>
              <h1 className="font-display text-3xl font-bold">
                Admin Dashboard
              </h1>
              <p className="font-ui text-sm text-muted-foreground mt-0.5">
                Manage books, chapters, and user roles
              </p>
            </div>
          </div>

          <Button
            onClick={() => setAddBookOpen(true)}
            className="font-ui bg-forest text-primary-foreground hover:bg-forest/90 gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Book
          </Button>
        </div>

        {/* Books table */}
        <section aria-labelledby="books-heading" className="mb-12">
          <h2
            id="books-heading"
            className="font-display text-xl font-semibold mb-4"
          >
            Library ({books?.length ?? 0} books)
          </h2>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead className="w-10" />
                  <TableHead className="font-ui text-xs uppercase tracking-wider">
                    Book
                  </TableHead>
                  <TableHead className="font-ui text-xs uppercase tracking-wider">
                    Genre
                  </TableHead>
                  <TableHead className="font-ui text-xs uppercase tracking-wider text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {booksLoading ? (
                  ["tbl-sk-1", "tbl-sk-2", "tbl-sk-3", "tbl-sk-4"].map((k) => (
                    <TableRow key={k}>
                      <TableCell colSpan={4}>
                        <div className="h-12 animate-pulse bg-secondary rounded" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : books && books.length > 0 ? (
                  books.map((book) => (
                    <BookRow key={book.id.toString()} book={book} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-12 text-muted-foreground font-ui text-sm"
                    >
                      No books yet. Add the first one!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Role assignment */}
        <section aria-labelledby="roles-heading">
          <div className="flex items-center gap-2 mb-4">
            <UserCog className="w-5 h-5 text-forest" />
            <h2
              id="roles-heading"
              className="font-display text-xl font-semibold"
            >
              Assign User Role
            </h2>
          </div>

          <div className="bg-secondary/30 rounded-lg border border-border p-6 max-w-lg">
            <p className="font-ui text-sm text-muted-foreground mb-4">
              Enter a Principal ID to grant or change their role.
            </p>

            <div className="space-y-3">
              <div>
                <Label
                  htmlFor="principal-input"
                  className="font-ui text-sm mb-1.5 block"
                >
                  Principal ID
                </Label>
                <Input
                  id="principal-input"
                  value={principalInput}
                  onChange={(e) => setPrincipalInput(e.target.value)}
                  placeholder="xxxxx-xxxxx-xxxxx-xxxxx-cai"
                  className="font-ui font-mono text-sm"
                />
              </div>

              <div>
                <Label
                  htmlFor="role-select"
                  className="font-ui text-sm mb-1.5 block"
                >
                  Role
                </Label>
                <select
                  id="role-select"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background font-ui text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="guest">Guest</option>
                </select>
              </div>

              <Button
                onClick={handleAssignRole}
                disabled={assignRole.isPending || !principalInput.trim()}
                className="font-ui bg-forest text-primary-foreground hover:bg-forest/90 gap-2"
              >
                {assignRole.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Assign Role
              </Button>
            </div>
          </div>
        </section>
      </motion.div>

      {/* Add book dialog */}
      <BookFormDialog
        open={addBookOpen}
        onClose={() => setAddBookOpen(false)}
        initialData={emptyBookForm()}
        onSubmit={handleAddBook}
        isPending={addBook.isPending}
        mode="add"
      />
    </main>
  );
}
