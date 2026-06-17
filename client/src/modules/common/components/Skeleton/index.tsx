import { FC } from 'react';

type SkeletonRadius = 'sm' | 'full' | 'none';

interface ISkeletonProps {
    /** Tailwind sizing/spacing utilities, e.g. "h-8 w-32". */
    className?: string;
    radius?: SkeletonRadius;
}

const RADIUS_CLASS: Record<SkeletonRadius, string> = {
    sm: 'rounded',
    full: 'rounded-full',
    none: '',
};

/**
 * Base loading-skeleton block.
 *
 * A single pulsing placeholder. Compose several to mimic the shape of the
 * content being loaded; size and spacing come from `className`.
 */
const Skeleton: FC<ISkeletonProps> = ({ className = '', radius = 'sm' }) => (
    <div aria-hidden className={`bg-gray-200 animate-pulse ${RADIUS_CLASS[radius]} ${className}`} />
);

export default Skeleton;
