"use client";

import BombCard from "./BombCard";

interface Props {
    revealed: (boolean | null)[];
    bombs: (boolean | null)[];
    disabled: boolean;
    onPick: (index: number) => void;
}

export default function BombGrid({ revealed, bombs, disabled, onPick }: Props) {
    return (
        <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <BombCard
                    key={i}
                    revealed={revealed[i] === true}
                    isBomb={bombs[i]}
                    disabled={disabled}
                    onClick={() => onPick(i)}
                />
            ))}
        </div>
    );
}