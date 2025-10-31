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
 * FILTER MODAL - Liquid Glass Style
 *
 * Modal for filtering and sorting menu items
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
    { value: 'popular', label: 'Popular' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end animate-fade-in">
      {/* Modal Container with Liquid Glass effect */}
      <div
        className="w-full bg-white rounded-t-3xl shadow-2xl animate-slide-up"
        style={{
          backdropFilter: 'blur(24px) saturate(180%)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          maxHeight: '80vh'
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
        <div className="px-6 py-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 140px)' }}>
          {/* Sort By Section */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Sort By</h3>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilters({ ...filters, sortBy: option.value as any })}
                  className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                    filters.sortBy === option.value
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.label}</span>
                    {filters.sortBy === option.value && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Available Only Toggle */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Availability</h3>
            <button
              onClick={() => setFilters({ ...filters, showAvailableOnly: !filters.showAvailableOnly })}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Show available only</span>
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  filters.showAvailableOnly ? 'bg-primary-500' : 'bg-gray-300'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${
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
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
