declare module 'react-window' {
    import * as React from 'react';

    export interface ListOnScrollProps {
        scrollDirection: 'forward' | 'backward';
        scrollOffset: number;
        scrollUpdateWasRequested: boolean;
    }

    export interface FixedSizeListProps {
        children: React.ComponentType<{ index: number; style: React.CSSProperties }>;
        className?: string;
        height: number | string;
        itemCount: number;
        itemSize: number;
        width: number | string;
        onScroll?: (props: ListOnScrollProps) => void;
        ref?: React.Ref<any>;
    }

    export class FixedSizeList extends React.Component<FixedSizeListProps> { }

    export interface VariableSizeListProps {
        children: React.ComponentType<{ index: number; style: React.CSSProperties }>;
        className?: string;
        height: number | string;
        itemCount: number;
        itemSize: (index: number) => number;
        width: number | string;
        onScroll?: (props: ListOnScrollProps) => void;
        ref?: React.Ref<any>;
    }

    export class VariableSizeList extends React.Component<VariableSizeListProps> { }
}
