import Map "mo:core/Map";
import Set "mo:core/Set";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type OldUserProfile = {
    username : Text;
    displayName : Text;
    university : Text;
    bio : Text;
    avatar : ?Storage.ExternalBlob;
  };

  type OldMediaAttachment = {
    #image : Storage.ExternalBlob;
    #video : Storage.ExternalBlob;
  };

  type OldComment = {
    id : Nat;
    postId : Nat;
    author : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  type OldMarketplaceListing = {
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

  type OldMessage = {
    id : Nat;
    conversationId : Nat;
    sender : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  type OldConversation = {
    id : Nat;
    participants : [Principal];
    lastMessageTime : Time.Time;
  };

  type OldNotification = {
    id : Nat;
    recipient : Principal;
    notificationType : OldNotificationType;
    relatedUser : ?Principal;
    relatedId : ?Nat;
    timestamp : Time.Time;
    read : Bool;
  };

  type OldNotificationType = {
    #like;
    #comment;
    #follow;
    #message;
  };

  type OldTicketEvent = {
    id : Nat;
    creator : Principal;
    title : Text;
    description : Text;
    university : Text;
    eventDate : Time.Time;
    verifiers : [Principal];
  };

  type OldTicket = {
    code : Text;
    eventId : Nat;
    attendee : Principal;
    checkedIn : Bool;
    checkedInAt : ?Time.Time;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    comments : Map.Map<Nat, OldComment>;
    posts : Map.Map<Nat, OldPost>;
    postLikes : Map.Map<Nat, Set.Set<Principal>>;
    following : Map.Map<Principal, Set.Set<Principal>>;
    marketplaceListings : Map.Map<Nat, OldMarketplaceListing>;
    conversations : Map.Map<Nat, OldConversation>;
    messages : Map.Map<Nat, OldMessage>;
    notifications : Map.Map<Nat, OldNotification>;
    ticketEvents : Map.Map<Nat, OldTicketEvent>;
    tickets : Map.Map<Text, OldTicket>;
  };

  type OldPost = {
    id : Nat;
    author : Principal;
    content : Text;
    media : ?OldMediaAttachment;
    timestamp : Time.Time;
    likes : Nat;
    university : Text;
  };

  type NewUserProfile = {
    username : Text;
    displayName : Text;
    university : Text;
    bio : Text;
    avatar : ?Storage.ExternalBlob;
  };

  type NewMediaAttachment = {
    #image : Storage.ExternalBlob;
    #video : Storage.ExternalBlob;
  };

  type NewPost = {
    id : Nat;
    author : Principal;
    content : Text;
    media : ?NewMediaAttachment;
    timestamp : Time.Time;
    likes : Nat;
    university : Text;
  };

  type NewComment = {
    id : Nat;
    postId : Nat;
    author : Principal;
    content : Text;
    timestamp : Time.Time;
    parentComment : ?Nat;
  };

  type NewMarketplaceListing = {
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

  type NewMessage = {
    id : Nat;
    conversationId : Nat;
    sender : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  type NewConversation = {
    id : Nat;
    participants : [Principal];
    lastMessageTime : Time.Time;
  };

  type NewNotification = {
    id : Nat;
    recipient : Principal;
    notificationType : NewNotificationType;
    relatedUser : ?Principal;
    relatedId : ?Nat;
    timestamp : Time.Time;
    read : Bool;
  };

  type NewNotificationType = {
    #like;
    #comment;
    #follow;
    #message;
  };

  type NewTicketEvent = {
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

  type NewTicket = {
    code : Text;
    eventId : Nat;
    attendee : Principal;
    checkedIn : Bool;
    checkedInAt : ?Time.Time;
    pricePaid : Nat;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    comments : Map.Map<Nat, NewComment>;
    posts : Map.Map<Nat, NewPost>;
    postLikes : Map.Map<Nat, Set.Set<Principal>>;
    following : Map.Map<Principal, Set.Set<Principal>>;
    marketplaceListings : Map.Map<Nat, NewMarketplaceListing>;
    conversations : Map.Map<Nat, NewConversation>;
    messages : Map.Map<Nat, NewMessage>;
    notifications : Map.Map<Nat, NewNotification>;
    ticketEvents : Map.Map<Nat, NewTicketEvent>;
    tickets : Map.Map<Text, NewTicket>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_k, v) { v }
    );

    let newPosts = old.posts.map<Nat, OldPost, NewPost>(
      func(_k, v) {
        {
          v with
          media = switch (v.media) {
            case (null) { null };
            case (?media) { ?media };
          };
        };
      }
    );

    let newComments = old.comments.map<Nat, OldComment, NewComment>(
      func(_k, v) { { v with parentComment = null } }
    );

    let newMarketplaceListings = old.marketplaceListings.map<Nat, OldMarketplaceListing, NewMarketplaceListing>(
      func(_k, v) { v }
    );

    let newMessages = old.messages.map<Nat, OldMessage, NewMessage>(
      func(_k, v) { v }
    );

    let newConversations = old.conversations.map<Nat, OldConversation, NewConversation>(
      func(_k, v) { v }
    );

    let newNotifications = old.notifications.map<Nat, OldNotification, NewNotification>(
      func(_k, v) {
        { v with notificationType = switch (v.notificationType) { case (#like) { #like }; case (#comment) { #comment }; case (#follow) { #follow }; case (#message) { #message } } };
      }
    );

    let newTicketEvents = old.ticketEvents.map<Nat, OldTicketEvent, NewTicketEvent>(
      func(_k, v) {
        { v with ticketPrice = 0 : Nat; availableTickets = 0 : Nat };
      }
    );

    let newTickets = old.tickets.map<Text, OldTicket, NewTicket>(
      func(_k, v) {
        { v with pricePaid = 0 : Nat };
      }
    );

    {
      userProfiles = newUserProfiles;
      posts = newPosts;
      comments = newComments;
      postLikes = old.postLikes;
      following = old.following;
      marketplaceListings = newMarketplaceListings;
      conversations = newConversations;
      messages = newMessages;
      notifications = newNotifications;
      ticketEvents = newTicketEvents;
      tickets = newTickets;
    };
  };
};
