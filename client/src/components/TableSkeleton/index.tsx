import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { FC } from 'react';

import Skeleton from '../Skeleton';

interface ITableSkeletonProps {
    columns: number;
    rows?: number;
}

/**
 * Loading placeholder for {@link DataTable}.
 *
 * Mirrors the Paper-wrapped shell, gray header and row rhythm of the real
 * table so the layout doesn't shift when SSR data resolves. Pass the same
 * column count the table will render.
 */
const TableSkeleton: FC<ITableSkeletonProps> = ({ columns, rows = 5 }) => (
    <TableContainer component={Paper} className="rounded-lg overflow-hidden shadow">
        <Table>
            <TableHead className="bg-gray-100">
                <TableRow>
                    {Array.from({ length: columns }).map((_, index) => (
                        <TableCell key={`head-${index}`}>
                            <Skeleton className="h-4 w-20" />
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <TableRow key={`row-${rowIndex}`}>
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                                <Skeleton className="h-4 w-full max-w-40" />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

export default TableSkeleton;
