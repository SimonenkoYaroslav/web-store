import { CircularProgress } from '@mui/material';
import { FC } from 'react';

interface ILoadingProps {
    /** Optional visible message rendered under the spinner. */
    label?: string;
    /** Fill the whole viewport (use for route-level / global fallbacks). */
    fullScreen?: boolean;
}

/**
 * Global loading indicator for SSR data fetching.
 *
 * Drop it into a route's `loading.tsx` or a `<Suspense fallback>` while a
 * Server Component awaits its data. Centres an MUI spinner in the available
 * space; `fullScreen` stretches it to the viewport for top-level routes.
 */
const Loading: FC<ILoadingProps> = ({ label, fullScreen = false }) => (
    <div
        role="status"
        aria-live="polite"
        className={`flex flex-col items-center justify-center gap-3 ${
            fullScreen ? 'min-h-screen' : 'w-full min-h-60 py-12'
        }`}
    >
        <CircularProgress />
        {label && <p className="text-sm text-gray-500">{label}</p>}
        <span className="sr-only">{label ?? 'Loading'}</span>
    </div>
);

export default Loading;
