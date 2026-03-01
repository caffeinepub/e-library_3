import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Book {
    id: bigint;
    title: string;
    description: string;
    author: string;
    genre: string;
    coverUrl: string;
}
export interface Chapter {
    id: bigint;
    title: string;
    content: string;
    order: bigint;
    bookId: bigint;
}
export interface UserProfile {
    name: string;
}
export interface Review {
    userId: Principal;
    bookId: bigint;
    comment: string;
    rating: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBook(book: Book): Promise<void>;
    addChapter(chapter: Chapter): Promise<void>;
    addFavorite(bookId: bigint): Promise<void>;
    addReview(bookId: bigint, rating: bigint, comment: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteBook(id: bigint): Promise<void>;
    deleteChapter(id: bigint): Promise<void>;
    filterByGenre(genre: string): Promise<Array<Book>>;
    getAverageRating(bookId: bigint): Promise<number | null>;
    getBookById(id: bigint): Promise<Book | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChapterById(id: bigint): Promise<Chapter | null>;
    getChaptersByBookId(bookId: bigint): Promise<Array<Chapter>>;
    getFavorites(): Promise<Array<bigint>>;
    getReadingProgress(bookId: bigint): Promise<bigint | null>;
    getReviewsByBookId(bookId: bigint): Promise<Array<Review>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllBooks(): Promise<Array<Book>>;
    removeFavorite(bookId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchBooks(keyword: string): Promise<Array<Book>>;
    updateBook(id: bigint, book: Book): Promise<void>;
    updateChapter(id: bigint, chapter: Chapter): Promise<void>;
    updateReadingProgress(bookId: bigint, chapterIndex: bigint): Promise<void>;
}
