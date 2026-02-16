import Text "mo:core/Text";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Option "mo:core/Option";
import Int "mo:core/Int";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  type UserProfile = {
    username : Text;
    displayName : Text;
    university : Text;
    bio : Text;
    avatar : ?Storage.ExternalBlob;
  };

  type MediaAttachment = {
    #image : Storage.ExternalBlob;
    #video : Storage.ExternalBlob;
  };

  type Post = {
    id : Nat;
    author : Principal;
    content : Text;
    media : ?MediaAttachment;
    timestamp : Time.Time;
    likes : Nat;
    university : Text;
  };

  type Comment = {
    id : Nat;
    postId : Nat;
    author : Principal;
    content : Text;
    timestamp : Time.Time;
    parentComment : ?Nat;
  };

  type MarketplaceListing = {
    id : Nat;
    seller : Principal;
    title : Text;
    description : Text;
    price : Nat;
    university : Text;
    media : ?Storage.ExternalBlob;
    timestamp : Time.Time;
    sold : Bool;
  };

  type Message = {
    id : Nat;
    conversationId : Nat;
    sender : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  type Conversation = {
    id : Nat;
    participants : [Principal];
    lastMessageTime : Time.Time;
  };

  type Notification = {
    id : Nat;
    recipient : Principal;
    notificationType : NotificationType;
    relatedUser : ?Principal;
    relatedId : ?Nat;
    timestamp : Time.Time;
    read : Bool;
  };

  type NotificationType = {
    #like;
    #comment;
    #follow;
    #message;
  };

  type TicketEvent = {
    id : Nat;
    creator : Principal;
    title : Text;
    description : Text;
    university : Text;
    eventDate : Time.Time;
    verifiers : [Principal];
    ticketPrice : Nat;
    availableTickets : Nat;
  };

  type Ticket = {
    code : Text;
    eventId : Nat;
    attendee : Principal;
    checkedIn : Bool;
    checkedInAt : ?Time.Time;
    pricePaid : Nat;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  let userProfiles = Map.empty<Principal, UserProfile>();
  let posts = Map.empty<Nat, Post>();
  let comments = Map.empty<Nat, Comment>();
  let postLikes = Map.empty<Nat, Set.Set<Principal>>();
  let following = Map.empty<Principal, Set.Set<Principal>>();
  let marketplaceListings = Map.empty<Nat, MarketplaceListing>();
  let conversations = Map.empty<Nat, Conversation>();
  let messages = Map.empty<Nat, Message>();
  let notifications = Map.empty<Nat, Notification>();
  let ticketEvents = Map.empty<Nat, TicketEvent>();
  let tickets = Map.empty<Text, Ticket>();

  var nextPostId : Nat = 0;
  var nextCommentId : Nat = 0;
  var nextListingId : Nat = 0;
  var nextConversationId : Nat = 0;
  var nextMessageId : Nat = 0;
  var nextNotificationId : Nat = 0;
  var nextEventId : Nat = 0;

  module UserProfile {
    public func compare(user1 : UserProfile, user2 : UserProfile) : Order.Order {
      Text.compare(user1.username, user2.username);
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func searchUsers(term : Text, universityFilter : ?Text) : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can search");
    };
    if (term.trim(#char ' ').isEmpty()) {
      Runtime.trap("Search term cannot be empty");
    };

    let filteredUsers = userProfiles.values().toArray().filter(
      func(profile) {
        let matchesUniversity = switch (universityFilter) {
          case (null) { true };
          case (?university) { profile.university == university };
        };

        matchesUniversity and (profile.username.contains(#text term) or profile.displayName.contains(#text term));
      }
    );
    filteredUsers.sort();
  };

  public query ({ caller }) func hasProfile() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check profile status");
    };
    userProfiles.containsKey(caller);
  };

  public query ({ caller }) func getAllUserProfiles() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all profiles");
    };
    userProfiles.values().toArray().sort();
  };

  public shared ({ caller }) func createPost(content : Text, media : ?MediaAttachment) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };
    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile required to create posts") };
      case (?p) { p };
    };

    let postId = nextPostId;
    nextPostId += 1;

    let post : Post = {
      id = postId;
      author = caller;
      content = content;
      media = media;
      timestamp = Time.now();
      likes = 0;
      university = profile.university;
    };

    posts.add(postId, post);
    postLikes.add(postId, Set.empty<Principal>());
    postId;
  };

  public query ({ caller }) func getPost(postId : Nat) : async ?Post {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view posts");
    };
    posts.get(postId);
  };

  public query ({ caller }) func listPosts(limit : Nat, offset : Nat) : async [Post] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list all posts");
    };
    let allPosts = posts.values().toArray();
    let sorted = allPosts.sort(
      func(a : Post, b : Post) : Order.Order {
        Int.compare(b.timestamp, a.timestamp);
      },
    );
    let start = Nat.min(offset, sorted.size());
    let end = Nat.min(offset + limit, sorted.size());
    sorted.sliceToArray(start, end);
  };

  public shared ({ caller }) func deletePost(postId : Nat) : async () {
    let post = switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?p) { p };
    };

    if (not AccessControl.isAdmin(accessControlState, caller)) {
      if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
        Runtime.trap("Unauthorized: Only users can delete posts");
      };
      if (post.author != caller) {
        Runtime.trap("Unauthorized: Can only delete your own posts");
      };
    };

    posts.remove(postId);
    postLikes.remove(postId);
  };

  public shared ({ caller }) func likePost(postId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can like posts");
    };
    let post = switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?p) { p };
    };

    let likes = switch (postLikes.get(postId)) {
      case (null) { Set.empty<Principal>() };
      case (?s) { s };
    };

    if (not likes.contains(caller)) {
      likes.add(caller);
      postLikes.add(postId, likes);
      let updatedPost = {
        post with likes = post.likes + 1;
      };
      posts.add(postId, updatedPost);

      if (post.author != caller) {
        createNotification(post.author, #like, ?caller, ?postId);
      };
    };
  };

  public shared ({ caller }) func unlikePost(postId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unlike posts");
    };
    let post = switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?p) { p };
    };

    let likes = switch (postLikes.get(postId)) {
      case (null) { Runtime.trap("Post has no likes") };
      case (?s) { s };
    };

    if (likes.contains(caller)) {
      likes.remove(caller);
      postLikes.add(postId, likes);
      let updatedPost = {
        post with likes = switch (post.likes) {
          case (0) { 0 };
          case (n) { n - 1 };
        };
      };
      posts.add(postId, updatedPost);
    };
  };

  public shared ({ caller }) func addComment(postId : Nat, content : Text, parentComment : ?Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can comment");
    };
    let post = switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?p) { p };
    };

    if (content.trim(#char ' ').isEmpty()) {
      Runtime.trap("Comment content cannot be empty!");
    };

    let commentId = nextCommentId;
    nextCommentId += 1;

    let comment : Comment = {
      id = commentId;
      postId = postId;
      author = caller;
      content = content;
      timestamp = Time.now();
      parentComment = parentComment;
    };

    comments.add(commentId, comment);

    if (post.author != caller) {
      createNotification(post.author, #comment, ?caller, ?postId);
    };

    commentId;
  };

  public query ({ caller }) func getComments(postId : Nat) : async [Comment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view comments");
    };
    comments.values().toArray().filter(func(c) { c.postId == postId });
  };

  public query ({ caller }) func getCommentThread(postId : Nat, parentComment : ?Nat) : async [Comment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view comment threads");
    };

    let commentsArray = comments.values().toArray();
    commentsArray.filter(
      func(c) { c.postId == postId and c.parentComment == parentComment }
    );
  };

  private func deleteCommentRecursive(commentId : Nat, requestingCaller : Principal) {
    let comment = switch (comments.get(commentId)) {
      case (null) { return };
      case (?c) { c };
    };

    if (not AccessControl.isAdmin(accessControlState, requestingCaller)) {
      if (comment.author != requestingCaller) {
        Runtime.trap("Unauthorized: Can only delete your own comments!");
      };
    };

    comments.remove(commentId);

    let childIds = comments.entries().toArray().filter(
      func((childId, childComment)) {
        switch (childComment.parentComment) {
          case (?parentId) { parentId == commentId };
          case (null) { false };
        };
      }
    ).map(func((id, _)) { id });

    for (childId in childIds.vals()) {
      deleteCommentRecursive(childId, requestingCaller);
    };
  };

  public shared ({ caller }) func deleteComment(commentId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete comments");
    };
    deleteCommentRecursive(commentId, caller);
  };

  public query ({ caller }) func getFollowingFeed(limit : Nat, offset : Nat) : async [Post] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view feeds");
    };
    let followingSet = switch (following.get(caller)) {
      case (null) { Set.empty<Principal>() };
      case (?s) { s };
    };

    let feedPosts = posts.values().toArray().filter(
      func(post) { followingSet.contains(post.author) }
    );

    let sorted = feedPosts.sort(
      func(a : Post, b : Post) : Order.Order {
        Int.compare(b.timestamp, a.timestamp);
      },
    );

    let start = Nat.min(offset, sorted.size());
    let end = Nat.min(offset + limit, sorted.size());
    sorted.sliceToArray(start, end);
  };

  public query ({ caller }) func getCampusFeed(limit : Nat, offset : Nat) : async [Post] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view feeds");
    };
    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile required to view campus feed") };
      case (?p) { p };
    };

    let feedPosts = posts.values().toArray().filter(
      func(post) { post.university == profile.university }
    );

    let sorted = feedPosts.sort(
      func(a : Post, b : Post) : Order.Order {
        Int.compare(b.timestamp, a.timestamp);
      },
    );

    let start = Nat.min(offset, sorted.size());
    let end = Nat.min(offset + limit, sorted.size());
    sorted.sliceToArray(start, end);
  };

  public query ({ caller }) func getUniversalFeed(limit : Nat, offset : Nat) : async [Post] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view feeds");
    };
    let allPosts = posts.values().toArray();

    let sorted = allPosts.sort(
      func(a : Post, b : Post) : Order.Order {
        Int.compare(b.timestamp, a.timestamp);
      },
    );

    let start = Nat.min(offset, sorted.size());
    let end = Nat.min(offset + limit, sorted.size());
    sorted.sliceToArray(start, end);
  };

  public shared ({ caller }) func followUser(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can follow others");
    };
    if (caller == user) {
      Runtime.trap("Cannot follow yourself");
    };
    if (not userProfiles.containsKey(user)) {
      Runtime.trap("User not found");
    };

    let followingSet = switch (following.get(caller)) {
      case (null) { Set.empty<Principal>() };
      case (?s) { s };
    };

    followingSet.add(user);
    following.add(caller, followingSet);

    createNotification(user, #follow, ?caller, null);
  };

  public shared ({ caller }) func unfollowUser(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unfollow others");
    };
    let followingSet = switch (following.get(caller)) {
      case (null) { Runtime.trap("Not following this user") };
      case (?s) { s };
    };

    followingSet.remove(user);
    following.add(caller, followingSet);
  };

  public query ({ caller }) func isFollowing(user : Principal) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check follow status");
    };
    let followingSet = switch (following.get(caller)) {
      case (null) { return false };
      case (?s) { s };
    };
    followingSet.contains(user);
  };

  public query ({ caller }) func getFollowers(user : Principal) : async [Principal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view followers");
    };
    let followers = following.entries().toArray().filter(
      func((follower, followingSet)) { followingSet.contains(user) }
    ).map(func((follower, _)) { follower });
    followers;
  };

  public query ({ caller }) func getFollowing(user : Principal) : async [Principal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view following");
    };
    let followingSet = switch (following.get(user)) {
      case (null) { return [] };
      case (?s) { s };
    };
    followingSet.toArray();
  };

  public shared ({ caller }) func createListing(
    title : Text,
    description : Text,
    price : Nat,
    media : ?Storage.ExternalBlob
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create listings");
    };
    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile required to create listings") };
      case (?p) { p };
    };

    let listingId = nextListingId;
    nextListingId += 1;

    let listing : MarketplaceListing = {
      id = listingId;
      seller = caller;
      title = title;
      description = description;
      price = price;
      university = profile.university;
      media = media;
      timestamp = Time.now();
      sold = false;
    };

    marketplaceListings.add(listingId, listing);
    listingId;
  };

  public query ({ caller }) func getListing(listingId : Nat) : async ?MarketplaceListing {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view listings");
    };
    marketplaceListings.get(listingId);
  };

  public query ({ caller }) func searchListings(
    searchTerm : ?Text,
    universityFilter : ?Text
  ) : async [MarketplaceListing] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can search listings");
    };

    let callerProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile required to search listings") };
      case (?p) { p };
    };

    let filtered = marketplaceListings.values().toArray().filter(
      func(listing) {
        if (listing.sold) { return false };

        let matchesUniversity = switch (universityFilter) {
          case (null) { listing.university == callerProfile.university };
          case (?university) {
            if (not AccessControl.isAdmin(accessControlState, caller)) {
              listing.university == callerProfile.university and listing.university == university;
            } else {
              listing.university == university;
            };
          };
        };

        let matchesSearch = switch (searchTerm) {
          case (null) { true };
          case (?term) {
            listing.title.contains(#text term) or listing.description.contains(#text term);
          };
        };

        matchesUniversity and matchesSearch;
      }
    );
    filtered;
  };

  public query ({ caller }) func listMarketplaceListings(limit : Nat, offset : Nat) : async [MarketplaceListing] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list all marketplace listings");
    };
    let allListings = marketplaceListings.values().toArray();
    let sorted = allListings.sort(
      func(a : MarketplaceListing, b : MarketplaceListing) : Order.Order {
        Int.compare(b.timestamp, a.timestamp);
      },
    );
    let start = Nat.min(offset, sorted.size());
    let end = Nat.min(offset + limit, sorted.size());
    sorted.sliceToArray(start, end);
  };

  public shared ({ caller }) func markListingAsSold(listingId : Nat) : async () {
    let listing = switch (marketplaceListings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?l) { l };
    };

    if (not AccessControl.isAdmin(accessControlState, caller)) {
      if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
        Runtime.trap("Unauthorized: Only users can mark listings as sold");
      };
      if (listing.seller != caller) {
        Runtime.trap("Unauthorized: Can only mark your own listings as sold");
      };
    };

    let updatedListing = {
      listing with sold = true;
    };
    marketplaceListings.add(listingId, updatedListing);
  };

  public shared ({ caller }) func deleteListing(listingId : Nat) : async () {
    let listing = switch (marketplaceListings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?l) { l };
    };

    if (not AccessControl.isAdmin(accessControlState, caller)) {
      if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
        Runtime.trap("Unauthorized: Only users can delete listings");
      };
      if (listing.seller != caller) {
        Runtime.trap("Unauthorized: Can only delete your own listings");
      };
    };

    marketplaceListings.remove(listingId);
  };

  public shared ({ caller }) func startConversation(otherUser : Principal) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can start conversations");
    };
    if (caller == otherUser) {
      Runtime.trap("Cannot start conversation with yourself");
    };
    if (not userProfiles.containsKey(otherUser)) {
      Runtime.trap("User not found");
    };

    for ((convId, conv) in conversations.entries()) {
      let participants = conv.participants;
      if (participants.size() == 2) {
        if ((participants[0] == caller and participants[1] == otherUser) or
            (participants[0] == otherUser and participants[1] == caller)) {
          return convId;
        };
      };
    };

    let conversationId = nextConversationId;
    nextConversationId += 1;

    let conversation : Conversation = {
      id = conversationId;
      participants = [caller, otherUser];
      lastMessageTime = Time.now();
    };

    conversations.add(conversationId, conversation);
    conversationId;
  };

  public shared ({ caller }) func sendMessage(conversationId : Nat, content : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };
    let conversation = switch (conversations.get(conversationId)) {
      case (null) { Runtime.trap("Conversation not found") };
      case (?c) { c };
    };

    let isParticipant = conversation.participants.find(func(p : Principal) : Bool { p == caller });
    if (isParticipant == null) {
      Runtime.trap("Unauthorized: Not a participant in this conversation");
    };

    let messageId = nextMessageId;
    nextMessageId += 1;

    let message : Message = {
      id = messageId;
      conversationId = conversationId;
      sender = caller;
      content = content;
      timestamp = Time.now();
    };

    messages.add(messageId, message);

    let updatedConversation = {
      conversation with lastMessageTime = Time.now();
    };
    conversations.add(conversationId, updatedConversation);

    for (participant in conversation.participants.vals()) {
      if (participant != caller) {
        createNotification(participant, #message, ?caller, ?conversationId);
      };
    };

    messageId;
  };

  public query ({ caller }) func getConversations() : async [Conversation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view conversations");
    };
    let userConversations = conversations.values().toArray().filter(
      func(conv) {
        conv.participants.find(func(p : Principal) : Bool { p == caller }) != null;
      }
    );

    userConversations;
  };

  public query ({ caller }) func listConversations(limit : Nat, offset : Nat) : async [Conversation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list all conversations");
    };
    let allConversations = conversations.values().toArray();
    let sorted = allConversations.sort(
      func(a : Conversation, b : Conversation) : Order.Order {
        Int.compare(b.lastMessageTime, a.lastMessageTime);
      },
    );
    let start = Nat.min(offset, sorted.size());
    let end = Nat.min(offset + limit, sorted.size());
    sorted.sliceToArray(start, end);
  };

  public query ({ caller }) func getMessages(conversationId : Nat) : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };
    let conversation = switch (conversations.get(conversationId)) {
      case (null) { Runtime.trap("Conversation not found") };
      case (?c) { c };
    };

    let isParticipant = conversation.participants.find(func(p : Principal) : Bool { p == caller });
    if (isParticipant == null and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Not a participant in this conversation");
    };

    let conversationMessages = messages.values().toArray().filter(
      func(msg) { msg.conversationId == conversationId }
    );

    conversationMessages;
  };

  public query ({ caller }) func getContactList() : async [Conversation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view contacts");
    };

    let userConversations = conversations.values().toArray().filter(
      func(conversation) {
        conversation.participants.find(func(p : Principal) : Bool { p == caller }) != null;
      }
    );

    userConversations;
  };

  private func createNotification(
    recipient : Principal,
    notificationType : NotificationType,
    relatedUser : ?Principal,
    relatedId : ?Nat
  ) {
    let notificationId = nextNotificationId;
    nextNotificationId += 1;

    let notification : Notification = {
      id = notificationId;
      recipient = recipient;
      notificationType = notificationType;
      relatedUser = relatedUser;
      relatedId = relatedId;
      timestamp = Time.now();
      read = false;
    };

    notifications.add(notificationId, notification);
  };

  public query ({ caller }) func getNotifications(since : ?Time.Time) : async [Notification] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view notifications");
    };
    let userNotifications = notifications.values().toArray().filter(
      func(notif) {
        if (notif.recipient != caller) { return false };
        switch (since) {
          case (null) { true };
          case (?timestamp) { notif.timestamp > timestamp };
        };
      }
    );
    userNotifications;
  };

  public shared ({ caller }) func markNotificationAsRead(notificationId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark notifications as read");
    };
    let notification = switch (notifications.get(notificationId)) {
      case (null) { Runtime.trap("Notification not found") };
      case (?n) { n };
    };

    if (notification.recipient != caller) {
      Runtime.trap("Unauthorized: Can only mark your own notifications as read");
    };

    let updatedNotification = {
      notification with read = true;
    };
    notifications.add(notificationId, updatedNotification);
  };

  public query ({ caller }) func getUnreadNotificationCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view notification count");
    };
    let unreadCount = notifications.values().toArray().filter(
      func(notif) { notif.recipient == caller and not notif.read }
    ).size();
    unreadCount;
  };

  public shared ({ caller }) func createTicketEvent(
    title : Text,
    description : Text,
    eventDate : Time.Time,
    verifiers : [Principal],
    ticketPrice : Nat,
    availableTickets : Nat,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create events");
    };
    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile required to create events") };
      case (?p) { p };
    };

    let eventId = nextEventId;
    nextEventId += 1;

    let event : TicketEvent = {
      id = eventId;
      creator = caller;
      title = title;
      description = description;
      university = profile.university;
      eventDate = eventDate;
      verifiers = verifiers;
      ticketPrice = ticketPrice;
      availableTickets = availableTickets;
    };

    ticketEvents.add(eventId, event);
    eventId;
  };

  public shared ({ caller }) func purchaseTicket(eventId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can purchase tickets");
    };
    let event = switch (ticketEvents.get(eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?e) { e };
    };

    if (event.availableTickets == 0) {
      Runtime.trap("No tickets available");
    };

    let code = caller.toText() # "_" # eventId.toText();

    if (tickets.containsKey(code)) {
      Runtime.trap("You already have a ticket for this event");
    };

    let ticket : Ticket = {
      code = code;
      eventId = eventId;
      attendee = caller;
      checkedIn = false;
      checkedInAt = null;
      pricePaid = event.ticketPrice;
    };

    tickets.add(code, ticket);

    let updatedEvent = {
      event with availableTickets = event.availableTickets - 1;
    };
    ticketEvents.add(eventId, updatedEvent);
  };

  public shared ({ caller }) func issueTicket(eventId : Nat, attendee : Principal, code : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can issue tickets");
    };
    let event = switch (ticketEvents.get(eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?e) { e };
    };

    if (event.creator != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only event creator can issue tickets");
    };

    if (tickets.containsKey(code)) {
      Runtime.trap("Ticket code already exists");
    };

    let ticket : Ticket = {
      code = code;
      eventId = eventId;
      attendee = attendee;
      checkedIn = false;
      checkedInAt = null;
      pricePaid = event.ticketPrice;
    };

    tickets.add(code, ticket);
  };

  public shared ({ caller }) func verifyTicket(code : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can verify tickets");
    };
    let ticket = switch (tickets.get(code)) {
      case (null) { return false };
      case (?t) { t };
    };

    let event = switch (ticketEvents.get(ticket.eventId)) {
      case (null) { return false };
      case (?e) { e };
    };

    let isVerifier = event.verifiers.find(func(v : Principal) : Bool { v == caller });
    if (isVerifier == null and event.creator != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Not an authorized verifier for this event");
    };

    not ticket.checkedIn;
  };

  public shared ({ caller }) func checkInTicket(code : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check in tickets");
    };
    let ticket = switch (tickets.get(code)) {
      case (null) { Runtime.trap("Ticket not found") };
      case (?t) { t };
    };

    let event = switch (ticketEvents.get(ticket.eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?e) { e };
    };

    let isVerifier = event.verifiers.find(func(v : Principal) : Bool { v == caller });
    if (isVerifier == null and event.creator != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Not an authorized verifier for this event");
    };

    if (ticket.checkedIn) {
      Runtime.trap("Ticket already checked in");
    };

    let updatedTicket = {
      ticket with
      checkedIn = true;
      checkedInAt = ?Time.now();
    };
    tickets.add(code, updatedTicket);
  };

  public query ({ caller }) func getTicketEvent(eventId : Nat) : async ?TicketEvent {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view events");
    };
    ticketEvents.get(eventId);
  };

  public query ({ caller }) func browseTicketEvents(universityFilter : ?Text, limit : Nat, offset : Nat) : async [TicketEvent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can browse events");
    };

    let callerProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile required to browse events") };
      case (?p) { p };
    };

    let filtered = ticketEvents.values().toArray().filter(
      func(event) {
        switch (universityFilter) {
          case (null) { event.university == callerProfile.university };
          case (?university) {
            if (not AccessControl.isAdmin(accessControlState, caller)) {
              event.university == callerProfile.university and event.university == university;
            } else {
              event.university == university;
            };
          };
        };
      }
    );

    let sorted = filtered.sort(
      func(a : TicketEvent, b : TicketEvent) : Order.Order {
        Int.compare(b.eventDate, a.eventDate);
      },
    );

    let start = Nat.min(offset, sorted.size());
    let end = Nat.min(offset + limit, sorted.size());
    sorted.sliceToArray(start, end);
  };

  public query ({ caller }) func listTicketEvents(limit : Nat, offset : Nat) : async [TicketEvent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list all ticket events");
    };
    let allEvents = ticketEvents.values().toArray();
    let sorted = allEvents.sort(
      func(a : TicketEvent, b : TicketEvent) : Order.Order {
        Int.compare(b.eventDate, a.eventDate);
      },
    );
    let start = Nat.min(offset, sorted.size());
    let end = Nat.min(offset + limit, sorted.size());
    sorted.sliceToArray(start, end);
  };

  public query ({ caller }) func getMyTickets() : async [Ticket] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their tickets");
    };
    tickets.values().toArray().filter(func(ticket) { ticket.attendee == caller });
  };

  public query ({ caller }) func getEventTickets(eventId : Nat) : async [Ticket] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view event tickets");
    };
    let event = switch (ticketEvents.get(eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?e) { e };
    };

    let isVerifier = event.verifiers.find(func(v : Principal) : Bool { v == caller });
    if (event.creator != caller and isVerifier == null and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only event creator or verifiers can view all tickets");
    };

    tickets.values().toArray().filter(func(ticket) { ticket.eventId == eventId });
  };

  public query ({ caller }) func listAdmins() : async [Principal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list admins");
    };
    userProfiles.keys().toArray().filter(
      func(user) { AccessControl.getUserRole(accessControlState, user) == #admin }
    );
  };

  public shared ({ caller }) func grantAdminRole(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can grant admin privileges");
    };
    AccessControl.assignRole(accessControlState, caller, user, #admin);
  };

  public shared ({ caller }) func revokeAdminRole(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can revoke admin privileges");
    };
    AccessControl.assignRole(accessControlState, caller, user, #user);
  };
};
