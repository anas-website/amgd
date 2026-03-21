import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tables, DATABASE_ID, TABLE_SHOWER_TYPES, BUCKET_ID, APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from '../../appwrite/config';
import { ArrowLeft, Droplets, Loader2, ShieldCheck, Tag } from 'lucide-react';
import Calculator from './Calculator';
import { useI18n } from '../../i18n';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await tables.getDocument(DATABASE_ID, TABLE_SHOWER_TYPES, id);
        setProduct({ id: response.$id, ...response });
      } catch (error) {
        console.error('Error fetching product from showerTypes table:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getImageUrl = (fileId) => {
    return `${APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${APPWRITE_PROJECT_ID}`;
  };

  const designerUrl = useMemo(() => {
    if (!product) return '/designer';
    const params = new URLSearchParams({
      modelId: product.id,
      modelName: product.name,
      pricePerM2: String(product.pricePerM2 ?? ''),
      layout: 'straight',
    });
    return `/designer?${params.toString()}`;
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-[var(--bg)]">
        <Loader2 className="animate-spin text-[var(--accent)]" size={44} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-[var(--bg)]">
        <h1 className="text-2xl font-semibold text-[var(--text)] mb-4">{t('product.notFound')}</h1>
        <Link
          to="/"
          className="text-[var(--accent)] font-medium inline-flex items-center gap-2 min-h-11 px-4 rounded-xl hover:bg-[var(--accent-soft)]"
        >
          <ArrowLeft size={20} className="rtl:rotate-180" /> {t('product.back')}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg)] min-h-[60vh]">
      <div className="container-app py-8 sm:py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] mb-8 font-medium text-sm transition-colors min-h-11 px-2 -ms-2 rounded-xl hover:bg-white/60"
        >
          <ArrowLeft size={18} className="rtl:rotate-180" />
          {t('product.back')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-20">
          <div className="space-y-6">
            <div className="aspect-[4/5] md:aspect-square ui-card overflow-hidden relative group p-0">
              {product.mainImageId ? (
                <img src={getImageUrl(product.mainImageId)} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                  <Droplets size={80} strokeWidth={1} />
                </div>
              )}

              <div className="absolute top-4 start-4">
                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-[var(--border)]">
                  <ShieldCheck size={16} className="text-[var(--accent)] shrink-0" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                    {t('product.verified')}
                  </span>
                </div>
              </div>
            </div>

            <div className="ui-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--accent-soft)] rounded-2xl flex items-center justify-center shrink-0">
                  <Tag className="text-[var(--accent)]" size={24} />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-muted)] font-medium">{t('product.basePrice')}</p>
                  <h4 className="text-xl font-bold text-[var(--text)] tabular-nums">
                    {product.pricePerM2} {t('calc.currency')}{' '}
                    <span className="text-sm font-normal text-[var(--text-muted)]">/ m²</span>
                  </h4>
                </div>
              </div>
              <div className="hidden sm:block text-end">
                <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-tighter mb-2">
                  {t('product.includes')}
                </p>
                <div className="flex flex-wrap gap-2 justify-end">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">{t('product.tag.glass')}</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">{t('product.tag.hinges')}</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">{t('product.tag.fitting')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-display font-semibold text-[var(--text)] mb-3 tracking-tight">
                {product.name}
              </h1>
              <p className="text-[var(--text-muted)] text-base leading-relaxed">
                {product.description || t('product.descFallback')}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to={designerUrl}
                  className="ui-btn ui-btn-primary min-h-12 px-6 rounded-2xl text-[15px] shadow-lg"
                >
                  {t('product.cta3d')}
                </Link>
              </div>
            </div>

            <div className="h-px bg-[var(--border)]" />

            <Calculator product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
