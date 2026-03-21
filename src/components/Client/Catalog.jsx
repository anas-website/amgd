import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'appwrite';
import {
  tables,
  DATABASE_ID,
  TABLE_SHOWER_TYPES,
  BUCKET_ID,
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
} from '../../appwrite/config';
import { ArrowRight, Droplets, Info, Loader2, Sparkles } from 'lucide-react';
import { useI18n } from '../../i18n';

const Catalog = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const response = await tables.listDocuments(DATABASE_ID, TABLE_SHOWER_TYPES, [Query.equal('active', true)]);
      setTypes(response.documents.map((doc) => ({ id: doc.$id, ...doc })));
    } catch (error) {
      console.error('Error fetching catalog from showerTypes table:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (fileId) => {
    return `${APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${APPWRITE_PROJECT_ID}`;
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-[var(--bg)]">
        <Loader2 className="animate-spin text-[var(--accent)]" size={44} aria-hidden />
        <span className="sr-only">{t('common.loading')}</span>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg)]">
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/90 via-white/40 to-[var(--bg)]" />
        <div className="absolute -top-24 -end-24 w-72 h-72 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="absolute -bottom-16 start-1/2 -translate-x-1/2 w-[min(100%,520px)] h-40 bg-indigo-400/10 blur-3xl rounded-full" />

        <div className="relative container-app py-14 sm:py-20 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-[var(--border)] text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-6 shadow-sm">
            <Sparkles size={14} className="text-amber-500" />
            {t('catalog.hero.highlight')}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-[var(--text)] tracking-tight mb-4 max-w-3xl mx-auto leading-[1.1]">
            {t('catalog.hero.title')}
          </h1>
          <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            {t('catalog.hero.sub')}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              to="/designer"
              className="ui-btn ui-btn-primary min-h-12 px-6 rounded-2xl text-[15px]"
            >
              {t('nav.designer')}
            </Link>
            <a
              href="#collection"
              className="ui-btn ui-btn-ghost min-h-12 px-6 rounded-2xl text-[15px] border-[var(--border-strong)]"
            >
              {t('nav.catalog')}
            </a>
          </div>
        </div>
      </section>

      <div id="collection" className="container-app py-12 sm:py-16 scroll-mt-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {types.map((type) => (
            <div key={type.id}>
              <Link
                to={`/product/${type.id}`}
                className="group flex flex-col h-full ui-card overflow-hidden hover:shadow-[var(--shadow-lg)] hover:border-blue-200/60 transition-all duration-300"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                  {type.mainImageId ? (
                    <img
                      src={getImageUrl(type.mainImageId)}
                      alt={type.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Droplets size={56} strokeWidth={1.25} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent opacity-90" />
                  <div className="absolute bottom-0 inset-x-0 p-5 flex justify-between items-end gap-3">
                    <div className="min-w-0 text-start">
                      <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider mb-1 block">
                        {t('catalog.badge.series')}
                      </span>
                      <h3 className="text-xl font-semibold text-white leading-tight drop-shadow-sm truncate">
                        {type.name}
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                      <ArrowRight size={22} className="rtl:rotate-180" />
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
                      <Info size={16} className="shrink-0" />
                      <span>{t('common.from')}</span>
                    </div>
                    <span className="text-lg font-bold text-[var(--text)] tabular-nums">
                      {type.pricePerM2}{' '}
                      <span className="text-xs font-medium text-[var(--text-muted)]">{t('common.ilsPerM2')}</span>
                    </span>
                  </div>
                  <p className="text-[var(--text-muted)] text-sm line-clamp-2 leading-relaxed flex-1">
                    {type.description ||
                      'Elegant and durable glass solution for your bathroom renovation project.'}
                  </p>
                  <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">
                      {t('catalog.tag.customSizing')}
                    </span>
                    <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">
                      {t('catalog.tag.tempered')}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {types.length === 0 && (
          <div className="text-center py-20 ui-card border-dashed">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-2">{t('catalog.empty.title')}</h3>
            <p className="text-[var(--text-muted)] text-sm">{t('catalog.empty.sub')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
