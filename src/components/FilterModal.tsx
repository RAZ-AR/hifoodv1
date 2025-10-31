import React from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export interface FilterOptions {
  sortBy: 'name' | 'price-asc' | 'price-desc' | 'rating' | 'popular';
  priceRange: [number, number] | null;
  showAvailableOnly: boolean;
}

/**
 * FILTER MODAL - Compact Centered Design with Icons
 */
const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  currentFilters
}) => {
  const [filters, setFilters] = React.useState<FilterOptions>(currentFilters);

  React.useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters, isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      sortBy: 'popular',
      priceRange: null,
      showAvailableOnly: true
    };
    setFilters(defaultFilters);
  };

  const sortOptions = [
    {
      value: 'popular',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Popular'
    },
    {
      value: 'name',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'A-Z'
    },
    {
      value: 'price-asc',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19V5M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Price ↓'
    },
    {
      value: 'price-desc',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Price ↑'
    },
    {
      value: 'rating',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Rating'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4 animate-fade-in">
      {/* Compact Modal Container */}
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl animate-fade-in"
        style={{
          backdropFilter: 'blur(24px) saturate(180%)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)'
        }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Sort By Section with Icons */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Sort By</h3>
            <div className="grid grid-cols-3 gap-3">
              {sortOptions.map((option) => {
                const isSelected = filters.sortBy === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setFilters({ ...filters, sortBy: option.value as any })}
                    className={`relative px-3 py-4 rounded-2xl transition-all ${
                      isSelected
                        ? 'bg-[#01fff7] text-gray-900 shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className={isSelected ? 'text-gray-900' : 'text-gray-600'}>
                        {option.icon}
                      </div>
                      <span className="text-xs font-semibold">{option.label}</span>

                      {/* Simple Checkmark */}
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Available Only Toggle */}
          <div className="mb-4">
            <button
              onClick={() => setFilters({ ...filters, showAvailableOnly: !filters.showAvailableOnly })}
              className="w-full px-4 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 text-sm">Show available only</span>
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  filters.showAvailableOnly ? 'bg-[#01fff7]' : 'bg-gray-300'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform shadow-md ${
                    filters.showAvailableOnly ? 'ml-6' : 'ml-0.5'
                  }`}></div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 py-3 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 bg-accent-black text-white rounded-xl font-semibold hover:bg-opacity-90 transition-all active:scale-95"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
