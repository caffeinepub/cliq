import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { getSupabaseClient, initializeSupabase } from '../../../lib/supabaseClient';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function SupabasePanel() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isPackageInstalled, setIsPackageInstalled] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const checkSupabase = async () => {
      setIsInitializing(true);
      
      // Check if environment variables are set
      const hasEnvVars = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
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
    setConnectionStatus('idle');
    setErrorMessage('');

    try {
      const client = getSupabaseClient();
      if (!client) {
        throw new Error('Supabase client not available');
      }

      // Simple test query to check connection
      const { error } = await client.from('_test_').select('*').limit(1);
      
      // If we get a "relation does not exist" error, that's actually good - it means we connected
      if (error && !error.message.includes('does not exist')) {
        throw error;
      }

      setConnectionStatus('success');
    } catch (error: any) {
      setConnectionStatus('error');
      setErrorMessage(error.message || 'Failed to connect to Supabase');
    } finally {
      setIsTestingConnection(false);
    }
  };

  if (isInitializing) {
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
          <CardDescription>Optional frontend-only Supabase connection</CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <Database className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">Supabase Not Configured</h3>
          <p className="mb-4 text-muted-foreground">
            To enable Supabase integration, add the following environment variables:
          </p>
          <div className="mx-auto max-w-md rounded-lg bg-muted p-4 text-left">
            <code className="text-sm">
              VITE_SUPABASE_URL=your_supabase_url
              <br />
              VITE_SUPABASE_ANON_KEY=your_anon_key
            </code>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Note: Supabase integration is frontend-only and does not affect the Internet Computer backend.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!isPackageInstalled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Supabase Integration</CardTitle>
          <CardDescription>Optional frontend-only Supabase connection</CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-yellow-600" />
          <h3 className="mb-2 text-lg font-semibold">Supabase Package Not Installed</h3>
          <p className="mb-4 text-muted-foreground">
            Environment variables are configured, but the Supabase package is not installed.
          </p>
          <div className="mx-auto max-w-md rounded-lg bg-muted p-4 text-left">
            <code className="text-sm">
              pnpm add @supabase/supabase-js
            </code>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Install the package and restart the development server to enable Supabase integration.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supabase Integration</CardTitle>
        <CardDescription>Frontend-only Supabase connection status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert>
            <Database className="h-4 w-4" />
            <AlertTitle>Configuration Detected</AlertTitle>
            <AlertDescription>
              Supabase client is configured and ready to use. This integration is frontend-only and does not
              interact with the Internet Computer backend.
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
                'Test Connection'
              )}
            </Button>

            {connectionStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Connection Successful</span>
              </div>
            )}

            {connectionStatus === 'error' && (
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

          <div className="rounded-lg border p-4">
            <h4 className="mb-2 font-semibold">Usage Notes</h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Supabase is only accessible from the React frontend</li>
              <li>The Motoko backend cannot call Supabase endpoints</li>
              <li>Use Supabase for admin-side operations or external data</li>
              <li>Internet Computer storage remains the source of truth for app data</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
