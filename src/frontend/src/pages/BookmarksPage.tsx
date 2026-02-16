import { Bookmark } from 'lucide-react';

export function BookmarksPage() {
  return (
    <div className="space-y-4 p-4">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">Bookmarks</h1>
        <p className="text-sm text-muted-foreground">Posts you've saved</p>
      </div>

      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Bookmark className="mb-4 h-16 w-16 text-muted-foreground" />
        <h2 className="mb-2 text-xl font-semibold">No bookmarks yet</h2>
        <p className="text-muted-foreground">
          Bookmark posts to easily find them later.
        </p>
      </div>
    </div>
  );
}
