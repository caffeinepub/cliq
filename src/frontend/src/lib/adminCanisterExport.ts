import type { Principal } from "@dfinity/principal";
import type { backendInterface } from "../backend";
import { ExternalBlob } from "../backend";

export interface ExportResult {
  data: ExportData;
  errors: ExportError[];
}

export interface ExportData {
  exportedAt: string;
  entities: {
    userProfiles?: any[];
    posts?: any[];
    comments?: any[];
    marketplaceListings?: any[];
    ticketEvents?: any[];
    tickets?: any[];
    conversations?: any[];
    messages?: any[];
    notifications?: any[];
    admins?: any[];
  };
}

export interface ExportError {
  entityType: string;
  error: string;
}

// Helper to safely serialize special types
function serializeValue(value: any): any {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (value instanceof ExternalBlob) {
    return {
      _type: "ExternalBlob",
      url: value.getDirectURL(),
    };
  }

  // Handle Principal objects
  if (
    value &&
    typeof value === "object" &&
    "toText" in value &&
    typeof value.toText === "function"
  ) {
    return value.toText();
  }

  if (Array.isArray(value)) {
    return value.map(serializeValue);
  }

  if (typeof value === "object") {
    const serialized: any = {};
    for (const key in value) {
      if (Object.hasOwn(value, key)) {
        serialized[key] = serializeValue(value[key]);
      }
    }
    return serialized;
  }

  return value;
}

export async function exportCanisterData(
  actor: backendInterface,
): Promise<ExportResult> {
  const errors: ExportError[] = [];
  const entities: ExportData["entities"] = {};

  // Export user profiles
  try {
    const profiles = await actor.getAllUserProfiles();
    entities.userProfiles = profiles.map(serializeValue);
  } catch (error: any) {
    errors.push({
      entityType: "userProfiles",
      error: error.message || "Failed to fetch user profiles",
    });
  }

  // Export posts (paginated - fetch first 1000)
  try {
    const posts = await actor.listPosts(BigInt(1000), BigInt(0));
    entities.posts = posts.map(serializeValue);
  } catch (error: any) {
    errors.push({
      entityType: "posts",
      error: error.message || "Failed to fetch posts",
    });
  }

  // Export marketplace listings (paginated - fetch first 1000)
  try {
    const listings = await actor.listMarketplaceListings(
      BigInt(1000),
      BigInt(0),
    );
    entities.marketplaceListings = listings.map(serializeValue);
  } catch (error: any) {
    errors.push({
      entityType: "marketplaceListings",
      error: error.message || "Failed to fetch marketplace listings",
    });
  }

  // Export ticket events (paginated - fetch first 1000)
  try {
    const events = await actor.listTicketEvents(BigInt(1000), BigInt(0));
    entities.ticketEvents = events.map(serializeValue);
  } catch (error: any) {
    errors.push({
      entityType: "ticketEvents",
      error: error.message || "Failed to fetch ticket events",
    });
  }

  // Export conversations (paginated - fetch first 1000)
  try {
    const conversations = await actor.listConversations(
      BigInt(1000),
      BigInt(0),
    );
    entities.conversations = conversations.map(serializeValue);
  } catch (error: any) {
    errors.push({
      entityType: "conversations",
      error: error.message || "Failed to fetch conversations",
    });
  }

  // Export admins
  try {
    const admins = await actor.listAdmins();
    entities.admins = admins.map((p: Principal) => p.toString());
  } catch (error: any) {
    errors.push({
      entityType: "admins",
      error: error.message || "Failed to fetch admins",
    });
  }

  // Note: Comments, messages, tickets, and notifications are not directly exportable
  // via admin APIs in the current backend implementation
  errors.push({
    entityType: "comments",
    error: "No admin API available for bulk comment export",
  });
  errors.push({
    entityType: "messages",
    error: "Messages can only be fetched per conversation",
  });
  errors.push({
    entityType: "tickets",
    error: "No admin API available for bulk ticket export",
  });
  errors.push({
    entityType: "notifications",
    error: "Notifications are per-user and not bulk exportable",
  });

  return {
    data: {
      exportedAt: new Date().toISOString(),
      entities,
    },
    errors,
  };
}

export function downloadExportAsJSON(
  exportResult: ExportResult,
  filename = "cliq-export.json",
) {
  const json = JSON.stringify(exportResult.data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
