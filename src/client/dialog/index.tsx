import { createRoot } from 'react-dom/client';
import Content from "./content";
import './styles.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { appConfigs } from "../shared/lib/app-config";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../shared/lib/query-client';
import { ToastProvider } from '../shared/contexts/ToastContext';

const App = () => {


  return (
    <QueryClientProvider client={queryClient}>
      <Content />
    </QueryClientProvider>
  );
  
};

// Convert to React 18 rendering
const container = document.getElementById('index');
if (container) {
  const root = createRoot(container);
  root.render(
    <GoogleOAuthProvider clientId={appConfigs.googleOAuthClientId}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </GoogleOAuthProvider>
  );
}
