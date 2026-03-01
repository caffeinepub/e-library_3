import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Float "mo:core/Float";

actor {
  module Book {
    public func compare(book1 : { id : Nat }, book2 : { id : Nat }) : Order.Order {
      Nat.compare(book1.id, book2.id);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Book = {
    id : Nat;
    title : Text;
    author : Text;
    genre : Text;
    description : Text;
    coverUrl : Text;
  };

  public type Chapter = {
    id : Nat;
    bookId : Nat;
    title : Text;
    order : Nat;
    content : Text;
  };

  public type Review = {
    userId : Principal;
    bookId : Nat;
    rating : Nat;
    comment : Text;
  };

  public type ReadingProgress = {
    userId : Principal;
    bookId : Nat;
    chapterIndex : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  let books = Map.empty<Nat, Book>();
  let chapters = Map.empty<Nat, Chapter>();
  let reviews = Map.empty<Nat, List.List<Review>>();
  let favorites = Map.empty<Principal, List.List<Nat>>();
  let progress = Map.empty<Principal, List.List<ReadingProgress>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextBookId = 0;
  var nextChapterId = 0;

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Book Management (Admin only)
  public shared ({ caller }) func addBook(book : Book) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add books");
    };
    let newBook : Book = { book with id = nextBookId };
    books.add(nextBookId, newBook);
    nextBookId += 1;
  };

  public shared ({ caller }) func updateBook(id : Nat, book : Book) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update books");
    };
    if (not books.containsKey(id)) {
      Runtime.trap("Book not found");
    };
    books.add(id, book);
  };

  public shared ({ caller }) func deleteBook(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete books");
    };
    books.remove(id);
  };

  // Chapter Management (Admin only)
  public shared ({ caller }) func addChapter(chapter : Chapter) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add chapters");
    };
    let newChapter : Chapter = { chapter with id = nextChapterId };
    chapters.add(nextChapterId, newChapter);
    nextChapterId += 1;
  };

  public shared ({ caller }) func updateChapter(id : Nat, chapter : Chapter) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update chapters");
    };
    if (not chapters.containsKey(id)) {
      Runtime.trap("Chapter not found");
    };
    chapters.add(id, chapter);
  };

  public shared ({ caller }) func deleteChapter(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete chapters");
    };
    chapters.remove(id);
  };

  // Reviews (Authenticated users only)
  public shared ({ caller }) func addReview(bookId : Nat, rating : Nat, comment : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add reviews");
    };
    if (rating < 1 or rating > 5) {
      Runtime.trap("Invalid rating: must be between 1 and 5");
    };

    // Check if user already reviewed this book
    let existingReviews = switch (reviews.get(bookId)) {
      case (null) { List.empty<Review>() };
      case (?revs) { revs };
    };

    let hasReviewed = existingReviews.toArray().find(func(r : Review) : Bool { r.userId == caller });
    if (hasReviewed != null) {
      Runtime.trap("User has already reviewed this book");
    };

    let review : Review = {
      userId = caller;
      bookId;
      rating;
      comment;
    };

    existingReviews.add(review);
    reviews.add(bookId, existingReviews);
  };

  // Favorites (Authenticated users only)
  public shared ({ caller }) func addFavorite(bookId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add favorites");
    };
    let currentFavorites = switch (favorites.get(caller)) {
      case (null) { List.empty<Nat>() };
      case (?favs) { favs };
    };

    // Check if already in favorites
    let alreadyFavorite = currentFavorites.toArray().find(func(fav : Nat) : Bool { fav == bookId });
    if (alreadyFavorite != null) {
      Runtime.trap("Book is already in favorites");
    };

    currentFavorites.add(bookId);
    favorites.add(caller, currentFavorites);
  };

  public shared ({ caller }) func removeFavorite(bookId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can remove favorites");
    };
    switch (favorites.get(caller)) {
      case (null) { Runtime.trap("No favorites found") };
      case (?favs) {
        let newFavorites = favs.filter(func(fav) { fav != bookId });
        favorites.add(caller, newFavorites);
      };
    };
  };

  // Reading Progress (Authenticated users only)
  public shared ({ caller }) func updateReadingProgress(bookId : Nat, chapterIndex : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update reading progress");
    };
    let currentProgress = switch (progress.get(caller)) {
      case (null) { List.empty<ReadingProgress>() };
      case (?p) { p };
    };
    let filteredProgress = currentProgress.filter(func(p) { p.bookId != bookId });
    filteredProgress.add({
      userId = caller;
      bookId;
      chapterIndex;
    });
    progress.add(caller, filteredProgress);
  };

  // Public Queries (No authentication required)
  public query func listAllBooks() : async [Book] {
    books.values().toArray();
  };

  public query func getBookById(id : Nat) : async ?Book {
    books.get(id);
  };

  public query func searchBooks(keyword : Text) : async [Book] {
    books.values().toArray().filter(
      func(book) {
        book.title.contains(#text keyword) or book.author.contains(#text keyword);
      }
    );
  };

  public query func filterByGenre(genre : Text) : async [Book] {
    books.values().toArray().filter(func(book) { book.genre == genre });
  };

  public query func getChaptersByBookId(bookId : Nat) : async [Chapter] {
    chapters.values().toArray().filter(func(chapter) { chapter.bookId == bookId });
  };

  public query func getChapterById(id : Nat) : async ?Chapter {
    chapters.get(id);
  };

  public query func getReviewsByBookId(bookId : Nat) : async [Review] {
    switch (reviews.get(bookId)) {
      case (null) { [] };
      case (?revs) { revs.toArray() };
    };
  };

  public query func getAverageRating(bookId : Nat) : async ?Float {
    switch (reviews.get(bookId)) {
      case (null) { null };
      case (?revs) {
        let reviewArray = revs.toArray();
        if (reviewArray.size() == 0) {
          return null;
        };
        var sum = 0;
        for (review in reviewArray.vals()) {
          sum += review.rating;
        };
        ?(sum.toFloat() / reviewArray.size().toFloat());
      };
    };
  };

  // Authenticated Queries
  public query ({ caller }) func getFavorites() : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view favorites");
    };
    switch (favorites.get(caller)) {
      case (null) { [] };
      case (?favs) { favs.toArray() };
    };
  };

  public query ({ caller }) func getReadingProgress(bookId : Nat) : async ?Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view reading progress");
    };
    switch (progress.get(caller)) {
      case (null) { null };
      case (?p) {
        switch (p.toArray().find(func(prog) { prog.bookId == bookId })) {
          case (null) { null };
          case (?prog) { ?prog.chapterIndex };
        };
      };
    };
  };
};
