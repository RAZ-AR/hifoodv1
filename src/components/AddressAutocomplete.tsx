/**
 * Компонент автокомплита адреса с проверкой зоны доставки
 */

import React, { useState, useEffect, useRef } from 'react';
import { api } from '@/services/api';
import type { AddressAutocompleteResult, ZoneCheckResult } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected: (details: {
    formatted_address: string;
    latitude: number;
    longitude: number;
    place_id: string;
    zoneCheck: ZoneCheckResult;
  }) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onPlaceSelected,
  placeholder,
  required = false,
  disabled = false,
  className = '',
}) => {
  const { t } = useLanguage();
  const [suggestions, setSuggestions] = useState<AddressAutocompleteResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sessionToken] = useState(() => Math.random().toString(36).substring(7));
  const [zoneCheck, setZoneCheck] = useState<ZoneCheckResult | null>(null);
  const [isCheckingZone, setIsCheckingZone] = useState(false);

  const debounceTimeout = useRef<NodeJS.Timeout>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Закрываем список при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Автокомплит с debounce
  useEffect(() => {
    if (value.length < 3) {
      setSuggestions([]);
      setZoneCheck(null);
      return;
    }

    // Очищаем предыдущий таймер
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Устанавливаем новый таймер
    debounceTimeout.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await api.autocompleteAddress(value, sessionToken);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Autocomplete error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [value, sessionToken]);

  // Выбор адреса из списка
  const handleSelectAddress = async (suggestion: AddressAutocompleteResult) => {
    setShowSuggestions(false);
    onChange(suggestion.formatted_address);
    setIsCheckingZone(true);
    setZoneCheck(null);

    try {
      // Получаем детали места (координаты)
      const placeDetails = await api.getPlaceDetails(suggestion.place_id);

      // Проверяем зону доставки
      const zoneResult = await api.checkDeliveryZone(
        placeDetails.latitude,
        placeDetails.longitude
      );

      setZoneCheck(zoneResult);

      // Вызываем callback с полной информацией
      onPlaceSelected({
        formatted_address: placeDetails.formatted_address,
        latitude: placeDetails.latitude,
        longitude: placeDetails.longitude,
        place_id: suggestion.place_id,
        zoneCheck: zoneResult,
      });
    } catch (error) {
      console.error('Error selecting address:', error);
      setZoneCheck({
        in_zone: false,
        delivery_fee: 0,
        message: t('address.errorCheckingZone'),
      });
    } finally {
      setIsCheckingZone(false);
    }
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* Input field */}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || t('address.enter')}
          required={required}
          disabled={disabled}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />

        {/* Loading indicator */}
        {(isLoading || isCheckingZone) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              type="button"
              onClick={() => handleSelectAddress(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">{suggestion.main_text}</div>
              <div className="text-sm text-gray-600">{suggestion.secondary_text}</div>
            </button>
          ))}
        </div>
      )}

      {/* Zone check result */}
      {zoneCheck && !isCheckingZone && (
        <div
          className={`mt-2 p-3 rounded-lg ${
            zoneCheck.in_zone
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${zoneCheck.in_zone ? 'text-green-500' : 'text-red-500'}`}>
              {zoneCheck.in_zone ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3 flex-1">
              <p className={`text-sm font-medium ${zoneCheck.in_zone ? 'text-green-800' : 'text-red-800'}`}>
                {zoneCheck.message}
              </p>
              {zoneCheck.in_zone && (
                <div className="mt-2 text-sm text-gray-700">
                  <div>
                    {t('address.deliveryFee')}: <span className="font-semibold">{zoneCheck.delivery_fee} RSD</span>
                  </div>
                  {zoneCheck.free_delivery_threshold && (
                    <div className="text-xs text-gray-600 mt-1">
                      {t('address.freeDeliveryFrom')} {zoneCheck.free_delivery_threshold} RSD
                    </div>
                  )}
                  {zoneCheck.estimated_delivery_time && (
                    <div className="text-xs text-gray-600">
                      {t('address.estimatedTime')}: {zoneCheck.estimated_delivery_time} {t('address.minutes')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
