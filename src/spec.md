# Specification

## Summary
**Goal:** Add video posting support, threaded comment replies, and a ticket marketplace flow for browsing events and obtaining tickets within CLIQ.

**Planned changes:**
- Allow creating posts with an optional video attachment (in addition to images), including validation and clear English errors for unsupported file types and oversized uploads.
- Render video posts with an HTML `<video>` player (with controls) in both the feed post card and the post detail view.
- Add nested (threaded) comments by supporting comment replies (parent/child relationships) in the backend and displaying threaded comment trees with indentation and ordering in the post detail UI.
- Ensure only authenticated users can create comments/replies, and keep delete-own-comment behavior working for both top-level comments and replies.
- Add a ticket marketplace section where users can browse available events (title, university, date/time), view event details, and obtain a ticket that then appears under “My Tickets”.
- Expose backend APIs to list marketplace events and issue a ticket to the caller for an event, preventing duplicate tickets per caller+event (or returning a clear error).

**User-visible outcome:** Users can post videos, reply to other users’ comments in threaded discussions on post details, and browse ticketed events to obtain a ticket that shows up in “My Tickets”.
