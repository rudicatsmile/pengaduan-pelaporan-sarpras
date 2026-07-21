import { useState, useEffect } from 'react';

export default function PerPageSelector({ value, onChange }) {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            applyChange(localValue);
        }
    };

    const applyChange = (val) => {
        const parsed = parseInt(val, 10);
        if (!isNaN(parsed) && parsed > 0) {
            onChange(parsed);
        } else {
            setLocalValue(value); // revert to valid prop value if invalid
        }
    };

    return (
        <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Tampilkan</span>
            <input
                type="number"
                min="1"
                list="per-page-options"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={(e) => applyChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-20 rounded-md border-gray-300 py-1.5 px-3 text-sm focus:border-teal-500 focus:ring-teal-500 shadow-sm"
                title="Ketik jumlah baris lalu tekan Enter"
            />
            <datalist id="per-page-options">
                <option value="10" />
                <option value="25" />
                <option value="50" />
                <option value="100" />
            </datalist>
            <span>baris</span>
        </div>
    );
}
