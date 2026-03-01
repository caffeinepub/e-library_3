import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { AdminPage } from "./pages/AdminPage";
import { BookDetailPage } from "./pages/BookDetailPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { HomePage } from "./pages/HomePage";
import { ReaderPage } from "./pages/ReaderPage";

// ─── Root Layout ──────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => (
    <div className="grain-overlay flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <Footer />
      <Toaster position="bottom-right" richColors />
    </div>
  ),
});

// ─── Routes ───────────────────────────────────────────────────────────────────

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const bookDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/books/$bookId",
  component: BookDetailPage,
});

const readerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/books/$bookId/read/$chapterId",
  component: ReaderPage,
});

const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/favorites",
  component: FavoritesPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

// ─── Router ───────────────────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  indexRoute,
  bookDetailRoute,
  readerRoute,
  favoritesRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
