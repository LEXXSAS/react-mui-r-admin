// @ts-nocheck
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ReactDOM from 'react-dom/client';
import {
    QueryClient,
    QueryClientProvider
  } from 'react-query';
import App from './App.jsx';
import './index.css';
import './App.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
    <App />
    </QueryClientProvider>
)
