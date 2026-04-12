import { Search } from 'lucide-react';

interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TableSearch({ value, onChange, placeholder = 'Cari...' }: TableSearchProps) {
  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#1b1c21] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-primary outline-none"
      />
    </div>
  );
}
