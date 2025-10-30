import React, { useState, useEffect } from 'react';
import { AdBanner } from '@/types';
import { api } from '@/services/api';

/**
 * СЛАЙДЕР РЕКЛАМНЫХ БАННЕРОВ
 *
 * Отображает:
 * - Автоматическую прокрутку баннеров
 * - Индикаторы слайдов
 * - Переход по клику
 */
const AdBannerSlider: React.FC = () => {
  const [banners, setBanners] = useState<AdBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBanners();
  }, []);

  // Автоматическая прокрутка каждые 5 секунд
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const data = await api.getAds();
      // Фильтруем только активные баннеры и сортируем по order
      const activeBanners = data
        .filter(banner => banner.active)
        .sort((a, b) => a.order - b.order);
      setBanners(activeBanners);
    } catch (err) {
      console.error('Ошибка загрузки баннеров:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBannerClick = (banner: AdBanner) => {
    if (banner.link && window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(banner.link);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      {/* Слайдер */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.ad_id}
            className="min-w-full"
            onClick={() => handleBannerClick(banner)}
          >
            <div className="relative h-48 cursor-pointer group">
              {/* Изображение */}
              <img
                src={banner.image_url}
                alt={banner.title}
                className="w-full h-full object-cover"
              />

              {/* Градиент оверлей */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

              {/* Контент */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-xl font-bold mb-1 group-hover:text-primary-300 transition-colors">
                  {banner.title}
                </h3>
                <p className="text-sm opacity-90 line-clamp-2">
                  {banner.description}
                </p>

                {/* Скидка */}
                {banner.discount_percent && banner.discount_percent > 0 && (
                  <div className="inline-block mt-2 px-3 py-1 bg-primary-500 rounded-full">
                    <span className="text-white text-sm font-bold">
                      -{banner.discount_percent}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Индикаторы */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                w-2 h-2 rounded-full transition-all
                ${index === currentIndex
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/75'
                }
              `}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdBannerSlider;
