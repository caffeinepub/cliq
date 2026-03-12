import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  CheckCircle,
  Database,
  Download,
  Info,
  Loader2,
  Upload,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useActor } from "../../../hooks/useActor";
import { useAdminAuth } from "../../../hooks/useAdminAuth";
import {
  type ExportResult,
  downloadExportAsJSON,
  exportCanisterData,
} from "../../../lib/adminCanisterExport";
import {
  type SyncResult,
  syncToSupabase,
} from "../../../lib/adminSupabaseSync";
import {
  getSupabaseClient,
  initializeSupabase,
  isSupabaseReady,
} from "../../../lib/supabaseClient";

export function SupabasePanel() {
  const { actor } = useActor();
  const { isAdmin, isLoading: adminLoading } = useAdminAuth();

  const [isConfigured, setIsConfigured] = useState(false);
  const [isPackageInstalled, setIsPackageInstalled] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);

  useEffect(() => {
    const checkSupabase = async () => {
      setIsInitializing(true);

      // Check if environment variables are set
      const hasEnvVars = !!(
        import.meta.env.VITE_SUPABASE_URL &&
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );
      setIsConfigured(hasEnvVars);

      if (hasEnvVars) {
        // Try to initialize Supabase
        const client = await initializeSupabase();
        setIsPackageInstalled(client !== null);
      }

      setIsInitializing(false);
    };

    checkSupabase();
  }, []);

  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus("idle");
    setErrorMessage("");

    try {
      const client = getSupabaseClient();
      if (!client) {
        throw new Error("Supabase client not available");
      }

      // Simple test query to check connection
      const { error } = await client.from("_test_").select("*").limit(1);

      // If we get a "relation does not exist" error, that's actually good - it means we connected
      if (error && !error.message.includes("does not exist")) {
        throw error;
      }

      setConnectionStatus("success");
    } catch (error: any) {
      setConnectionStatus("error");
      setErrorMessage(error.message || "Failed to connect to Supabase");
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleExport = async () => {
    if (!actor) {
      setErrorMessage("Backend actor not available");
      return;
    }

    setIsExporting(true);
    setExportResult(null);
    setErrorMessage("");

    try {
      const result = await exportCanisterData(actor);
      setExportResult(result);

      // Automatically download the export
      downloadExportAsJSON(
        result,
        `cliq-export-${new Date().toISOString().split("T")[0]}.json`,
      );
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSync = async () => {
    if (!exportResult) {
      setErrorMessage("Please export data first before syncing");
      return;
    }

    const client = getSupabaseClient();
    if (!client) {
      setErrorMessage("Supabase client not available");
      return;
    }

    setIsSyncing(true);
    setSyncResult(null);
    setErrorMessage("");

    try {
      const result = await syncToSupabase(exportResult.data, client);
      setSyncResult(result);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to sync data to Supabase");
    } finally {
      setIsSyncing(false);
    }
  };

  if (isInitializing || adminLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Supabase Integration</CardTitle>
          <CardDescription>
            Optional frontend-only Supabase utilities
          </CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <Database className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">
            Supabase Not Configured
          </h3>
          <p className="mb-4 text-muted-foreground">
            To enable Supabase integration, add the following environment
            variables:
          </p>
          <div className="mx-auto max-w-md rounded-lg bg-muted p-4 text-left">
            <code className="text-sm">
              VITE_SUPABASE_URL=your_supabase_url
              <br />
              VITE_SUPABASE_ANON_KEY=your_anon_key
            </code>
          </div>

          <Alert className="mt-6 text-left">
            <Info className="h-4 w-4" />
            <AlertTitle>Important: Backend Architecture</AlertTitle>
            <AlertDescription>
              The Internet Computer Motoko canister is the backend-of-record for
              this application. Canister code cannot call Supabase network APIs.
              Supabase access here is optional and React-frontend-only.
            </AlertDescription>
          </Alert>

          <Alert className="mt-4 text-left">
            <Info className="h-4 w-4" />
            <AlertTitle>External Migration Note</AlertTitle>
            <AlertDescription>
              Migrating the codebase to Lovable AI or other platforms is
              external to this repository's runtime behavior. This app continues
              to operate with the Internet Computer canister backend plus
              optional frontend-only Supabase utilities.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!isPackageInstalled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Supabase Integration</CardTitle>
          <CardDescription>
            Optional frontend-only Supabase utilities
          </CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-yellow-600" />
          <h3 className="mb-2 text-lg font-semibold">
            Supabase Package Not Installed
          </h3>
          <p className="mb-4 text-muted-foreground">
            Environment variables are configured, but the Supabase package is
            not installed.
          </p>
          <div className="mx-auto max-w-md rounded-lg bg-muted p-4 text-left">
            <code className="text-sm">pnpm add @supabase/supabase-js</code>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Install the package and restart the development server to enable
            Supabase integration.
          </p>

          <Alert className="mt-6 text-left">
            <Info className="h-4 w-4" />
            <AlertTitle>Important: Backend Architecture</AlertTitle>
            <AlertDescription>
              The Internet Computer Motoko canister is the backend-of-record for
              this application. Canister code cannot call Supabase network APIs.
              Supabase access here is optional and React-frontend-only.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Integration</CardTitle>
          <CardDescription>
            Frontend-only Supabase connection and data utilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Backend Architecture</AlertTitle>
              <AlertDescription>
                The Internet Computer Motoko canister is the backend-of-record
                for this application. Canister code cannot call Supabase network
                APIs. Supabase access here is optional and React-frontend-only.
              </AlertDescription>
            </Alert>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>External Migration Note</AlertTitle>
              <AlertDescription>
                Migrating the codebase to Lovable AI or other platforms is
                external to this repository's runtime behavior. This app
                continues to operate with the Internet Computer canister backend
                plus optional frontend-only Supabase utilities.
              </AlertDescription>
            </Alert>

            <div className="flex items-center gap-4">
              <Button onClick={testConnection} disabled={isTestingConnection}>
                {isTestingConnection ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  "Test Connection"
                )}
              </Button>

              {connectionStatus === "success" && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Connection Successful</span>
                </div>
              )}

              {connectionStatus === "error" && (
                <div className="flex items-center gap-2 text-destructive">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">Connection Failed</span>
                </div>
              )}
            </div>

            {errorMessage && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle>Export Canister Data</CardTitle>
          <CardDescription>
            {isAdmin
              ? "Download canister data as JSON from the browser (admin only)"
              : "Export functionality is only available to administrators"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isAdmin ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Admin Access Required</AlertTitle>
              <AlertDescription>
                You must be an administrator to export canister data.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <Button
                onClick={handleExport}
                disabled={isExporting || !actor}
                className="w-full sm:w-auto"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </>
                )}
              </Button>

              {exportResult && (
                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-semibold">Export Results</h4>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2 text-sm">
                      {Object.entries(exportResult.data.entities).map(
                        ([entityType, data]) => (
                          <div
                            key={entityType}
                            className="flex items-center justify-between"
                          >
                            <span className="text-muted-foreground">
                              {entityType}:
                            </span>
                            <span className="font-medium">
                              {Array.isArray(data)
                                ? `${data.length} records`
                                : "N/A"}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </ScrollArea>

                  {exportResult.errors.length > 0 && (
                    <div className="mt-4">
                      <h5 className="mb-2 text-sm font-semibold text-destructive">
                        Errors/Warnings:
                      </h5>
                      <ScrollArea className="h-[150px]">
                        <div className="space-y-1 text-xs">
                          {exportResult.errors.map((error) => (
                            <div
                              key={error.entityType + error.error}
                              className="text-muted-foreground"
                            >
                              <span className="font-medium">
                                {error.entityType}:
                              </span>{" "}
                              {error.error}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sync Section */}
      {isSupabaseReady() && (
        <Card>
          <CardHeader>
            <CardTitle>Sync to Supabase</CardTitle>
            <CardDescription>
              {isAdmin
                ? "Best-effort upsert exported data to Supabase (admin only)"
                : "Sync functionality is only available to administrators"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isAdmin ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Admin Access Required</AlertTitle>
                <AlertDescription>
                  You must be an administrator to sync data to Supabase.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <Alert variant="default">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Frontend Sync Limitations</AlertTitle>
                  <AlertDescription>
                    Sync is performed from the frontend with anon-key
                    limitations. Proper Supabase RLS policies and table setup
                    are required outside this codebase. This is a best-effort
                    operation and may fail if tables don't exist or permissions
                    are insufficient.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={handleSync}
                  disabled={isSyncing || !exportResult}
                  className="w-full sm:w-auto"
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Sync to Supabase
                    </>
                  )}
                </Button>

                {!exportResult && (
                  <p className="text-sm text-muted-foreground">
                    Please export data first before syncing to Supabase.
                  </p>
                )}

                {syncResult && (
                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <h4 className="font-semibold">Sync Results</h4>
                      {syncResult.overallSuccess ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-2 text-sm">
                        {syncResult.entityResults.map((result) => (
                          <div
                            key={result.entityType + result.status}
                            className="rounded border p-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                {result.entityType}
                              </span>
                              <span
                                className={`text-xs ${
                                  result.status === "success"
                                    ? "text-green-600"
                                    : result.status === "error"
                                      ? "text-destructive"
                                      : "text-muted-foreground"
                                }`}
                              >
                                {result.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              Records: {result.recordsProcessed}
                            </div>
                            {result.error && (
                              <div className="mt-1 text-xs text-destructive">
                                {result.error}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
