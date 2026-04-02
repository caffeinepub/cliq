# CLIQ — Tumblr-Styled Postcards

## Current State
- `MockPostCard.tsx` renders posts with a flat Twitter-like layout: avatar left, content right, engagement buttons in a horizontal row at the bottom
- `PostCard.tsx` uses a Card/CardContent wrapper, vertical engagement stack with labels
- Cards have no visual container — they blend into the feed background with only a border-bottom divider
- The "postcard" feel is missing: no distinct card body, no Tumblr-style header/footer separation, no note count strip
- Engagement buttons on MockPostCard are horizontal inline row; on PostCard they have column layout with labels

## Requested Changes (Diff)

### Add
- Tumblr-style card container: white bg, slightly elevated shadow, visible rounded corners (`rounded-2xl`), subtle border, margin between cards
- Tumblr-style header strip: avatar (circle, 32px) + display name + username + timestamp — all on one line, compact
- Tumblr note count bar at the bottom of card: small note count (likes + comments + recliqs) in muted text, e.g. "142 notes"
- Reblog/note strip below note count: horizontal row of tiny stacked avatars showing who liked/reblogged (mock)
- Tumblr tag pills at the bottom: `#campus`, `#unilag` style hashtag chips
- Community tag displayed as a subtle inline pill in the header row (not floating top-right)
- Media fills full card width with no padding (edge-to-edge), like Tumblr image posts
- Engagement row (Like 🔥, Comment 💬, Recliq ↻, Share 📤): horizontal, icon + count only, no labels, compact — sits in the card footer area, left-aligned cluster + share far right

### Modify
- Remove border-bottom divider pattern; replace with card-per-post layout with margin between cards
- University tag: keep below post body but style it as a Tumblr source/via attribution line (small, muted, with 🏛️ icon), not an orange pill floating right
- Card background: white in light mode, `#1a1a1a` (not pure black) in dark mode for that Tumblr dark feel
- Rounded media corners only if media is standalone (no text above); edge-to-edge if first content after header
- Avatar size reduced to 32-36px for compact Tumblr header feel
- Post text: 15px, relaxed line height, `font-normal`

### Remove
- Flat border-bottom divider between posts (replaced by card gaps)
- Orange pill university tag (replaced by source attribution style)
- Engagement button labels ("Like", "Comment", "Recliq", "Share")

## Implementation Plan
1. Redesign `MockPostCard.tsx` with full Tumblr-style card layout:
   - Outer wrapper: `bg-white dark:bg-[#1a1a1a] rounded-2xl border border-[#E8E8E8] dark:border-zinc-800 shadow-[0_2px_12px_rgba(0,0,0,0.06)] mb-3 overflow-hidden`
   - Header: compact row with small avatar, name, username, timestamp, community tag pill
   - Media: edge-to-edge (no horizontal padding), `max-h-96 object-cover w-full`
   - Content: `px-4 py-3` text body
   - University attribution: small muted line `🏛️ UNILAG · campus` below content
   - Note count bar: `px-4 py-1.5 text-xs text-muted border-t border-[#F0F0F0]` — "142 notes"
   - Engagement footer: `px-4 py-2 flex items-center gap-1 border-t border-[#F0F0F0]` — icon-only buttons, counts, share far right
2. Apply same layout to `PostCard.tsx` for consistency
3. Update feed container in `HomeFeedPage.tsx`: remove `divide-y` classes, add `space-y-3 px-3 py-3` for card gap layout
