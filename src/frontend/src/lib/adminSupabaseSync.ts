import type { ExportData } from "./adminCanisterExport";

export interface SyncResult {
  entityResults: EntitySyncResult[];
  overallSuccess: boolean;
}

export interface EntitySyncResult {
  entityType: string;
  status: "success" | "error" | "skipped";
  recordsProcessed: number;
  error?: string;
}

export async function syncToSupabase(
  exportData: ExportData,
  supabaseClient: any,
): Promise<SyncResult> {
  const entityResults: EntitySyncResult[] = [];

  // Sync user profiles
  if (
    exportData.entities.userProfiles &&
    exportData.entities.userProfiles.length > 0
  ) {
    try {
      const { error } = await supabaseClient
        .from("user_profiles")
        .upsert(exportData.entities.userProfiles, { onConflict: "username" });

      if (error) throw error;

      entityResults.push({
        entityType: "userProfiles",
        status: "success",
        recordsProcessed: exportData.entities.userProfiles.length,
      });
    } catch (error: any) {
      entityResults.push({
        entityType: "userProfiles",
        status: "error",
        recordsProcessed: 0,
        error: error.message || "Failed to sync user profiles",
      });
    }
  } else {
    entityResults.push({
      entityType: "userProfiles",
      status: "skipped",
      recordsProcessed: 0,
      error: "No data to sync",
    });
  }

  // Sync posts
  if (exportData.entities.posts && exportData.entities.posts.length > 0) {
    try {
      const { error } = await supabaseClient
        .from("posts")
        .upsert(exportData.entities.posts, { onConflict: "id" });

      if (error) throw error;

      entityResults.push({
        entityType: "posts",
        status: "success",
        recordsProcessed: exportData.entities.posts.length,
      });
    } catch (error: any) {
      entityResults.push({
        entityType: "posts",
        status: "error",
        recordsProcessed: 0,
        error: error.message || "Failed to sync posts",
      });
    }
  } else {
    entityResults.push({
      entityType: "posts",
      status: "skipped",
      recordsProcessed: 0,
      error: "No data to sync",
    });
  }

  // Sync marketplace listings
  if (
    exportData.entities.marketplaceListings &&
    exportData.entities.marketplaceListings.length > 0
  ) {
    try {
      const { error } = await supabaseClient
        .from("marketplace_listings")
        .upsert(exportData.entities.marketplaceListings, { onConflict: "id" });

      if (error) throw error;

      entityResults.push({
        entityType: "marketplaceListings",
        status: "success",
        recordsProcessed: exportData.entities.marketplaceListings.length,
      });
    } catch (error: any) {
      entityResults.push({
        entityType: "marketplaceListings",
        status: "error",
        recordsProcessed: 0,
        error: error.message || "Failed to sync marketplace listings",
      });
    }
  } else {
    entityResults.push({
      entityType: "marketplaceListings",
      status: "skipped",
      recordsProcessed: 0,
      error: "No data to sync",
    });
  }

  // Sync ticket events
  if (
    exportData.entities.ticketEvents &&
    exportData.entities.ticketEvents.length > 0
  ) {
    try {
      const { error } = await supabaseClient
        .from("ticket_events")
        .upsert(exportData.entities.ticketEvents, { onConflict: "id" });

      if (error) throw error;

      entityResults.push({
        entityType: "ticketEvents",
        status: "success",
        recordsProcessed: exportData.entities.ticketEvents.length,
      });
    } catch (error: any) {
      entityResults.push({
        entityType: "ticketEvents",
        status: "error",
        recordsProcessed: 0,
        error: error.message || "Failed to sync ticket events",
      });
    }
  } else {
    entityResults.push({
      entityType: "ticketEvents",
      status: "skipped",
      recordsProcessed: 0,
      error: "No data to sync",
    });
  }

  // Sync conversations
  if (
    exportData.entities.conversations &&
    exportData.entities.conversations.length > 0
  ) {
    try {
      const { error } = await supabaseClient
        .from("conversations")
        .upsert(exportData.entities.conversations, { onConflict: "id" });

      if (error) throw error;

      entityResults.push({
        entityType: "conversations",
        status: "success",
        recordsProcessed: exportData.entities.conversations.length,
      });
    } catch (error: any) {
      entityResults.push({
        entityType: "conversations",
        status: "error",
        recordsProcessed: 0,
        error: error.message || "Failed to sync conversations",
      });
    }
  } else {
    entityResults.push({
      entityType: "conversations",
      status: "skipped",
      recordsProcessed: 0,
      error: "No data to sync",
    });
  }

  // Sync admins
  if (exportData.entities.admins && exportData.entities.admins.length > 0) {
    try {
      const adminRecords = exportData.entities.admins.map(
        (principal: string) => ({
          principal,
          role: "admin",
        }),
      );

      const { error } = await supabaseClient
        .from("admins")
        .upsert(adminRecords, { onConflict: "principal" });

      if (error) throw error;

      entityResults.push({
        entityType: "admins",
        status: "success",
        recordsProcessed: exportData.entities.admins.length,
      });
    } catch (error: any) {
      entityResults.push({
        entityType: "admins",
        status: "error",
        recordsProcessed: 0,
        error: error.message || "Failed to sync admins",
      });
    }
  } else {
    entityResults.push({
      entityType: "admins",
      status: "skipped",
      recordsProcessed: 0,
      error: "No data to sync",
    });
  }

  const overallSuccess = entityResults.every(
    (result) => result.status === "success" || result.status === "skipped",
  );

  return {
    entityResults,
    overallSuccess,
  };
}
