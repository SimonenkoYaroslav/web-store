import { FC } from 'react';

interface IProps {
    message: string;
    className?: string;
}

/**
 * The glass-panel empty-list placeholder shared by tables and grids. Extra
 * layout classes (margins etc.) come in via `className`.
 */
const EmptyState: FC<IProps> = ({ message, className }) => (
    <div className={`glass-panel py-12 text-center uppercase tracking-wider text-brand-600 ${className ?? ''}`}>
        {message}
    </div>
);

export default EmptyState;
