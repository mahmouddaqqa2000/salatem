import { useQuery } from '@tanstack/react-query';
import { product } from '@salla.sa/twilight-theme-engine/api/product';
import { ProductCardSkeleton } from '@salla.sa/twilight-theme-engine/common';
import { ProductCard } from './ProductCard';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { useTwilight } from '@salla.sa/twilight-theme-engine/providers';

const families = [
  { id: 'all', name: { ar: 'كل العطور', en: 'All fragrances' } },
  { id: 'woody', name: { ar: 'خشبية', en: 'Woody' } },
  { id: 'floral', name: { ar: 'زهرية', en: 'Floral' } },
  { id: 'citrus', name: { ar: 'حمضية', en: 'Citrus' } },
] as const;

const fragrances = [
  { id: 'oud', family: 'woody', name: { ar: 'ليل العود', en: 'Oud Night' }, notes: { ar: 'عود وخشب وعنبر', en: 'Oud, woods and amber' } },
  { id: 'jasmine', family: 'floral', name: { ar: 'ياسمين السحر', en: 'Jasmine Hour' }, notes: { ar: 'ياسمين ومسك أبيض', en: 'Jasmine and white musk' } },
  { id: 'rose', family: 'floral', name: { ar: 'ورد الرمال', en: 'Desert Rose' }, notes: { ar: 'ورد ومسك ناعم', en: 'Rose and soft musk' } },
  { id: 'bergamot', family: 'citrus', name: { ar: 'برغموت الندى', en: 'Dew Bergamot' }, notes: { ar: 'برغموت ولمسة خضراء', en: 'Bergamot and green notes' } },
] as const;

export function useFragrancePreview() {
  const { theme } = useTwilight();
  const settings = theme?.settings;
  return Boolean(settings && 'fragrance_preview' in settings && settings.fragrance_preview === true);
}

export function fragranceFamilyName(family: string, locale: string | undefined) {
  const selected = families.find((entry) => entry.id === family) ?? families[0];
  return selected.name[locale === 'ar' || !locale ? 'ar' : 'en'];
}

export function FragranceCatalog({ family = 'all', home = false }: { family?: string; home?: boolean }) {
  const { locale, t } = useTranslation();
  const language = locale === 'ar' ? 'ar' : 'en';
  const selected = families.find((entry) => entry.id === family) ?? families[0];
  const { theme } = useTwilight();
  const settings = theme?.settings as Record<string, unknown> | undefined;
  const selectedIds = fragrances
    .filter((item) => selected.id === 'all' || item.family === selected.id)
    .map((item) => Number(settings?.[`fragrance_product_${item.id}`]))
    .filter((id) => Number.isSafeInteger(id) && id > 0);
  const configured = selectedIds.length > 0;
  const { data: result, isPending, isError, refetch } = useQuery(
    product.queries.list({
      source: configured ? 'selected' : 'latest',
      ...(configured ? { sourceValue: selectedIds } : {}),
      perPage: 12,
    })
  );
  const items = result?.items ?? [];
  const title = home || !configured ? t('fragrance.collection', 'Salatem collection') : fragranceFamilyName(family, locale);
  const Heading = home ? 'h2' : 'h1';

  return (
    <section id={home ? 'salatem-collection' : undefined} className="container fragrance-catalog">
      <Heading>{title}</Heading>
      <nav aria-label={t('fragrance.families', 'Fragrance families')}>
        {families.map((entry) => (
          <Link key={entry.id} to={`/collections/${entry.id}`}
            aria-current={!home && selected.id === entry.id ? 'page' : undefined}>
            {entry.name[language]}
          </Link>
        ))}
      </nav>
      {isError ? (
        <div role="status">
          <p>{t('fragrance.load_error', 'Products could not be loaded.')}</p>
          <button type="button" onClick={() => refetch()}>{t('fragrance.retry', 'Try again')}</button>
        </div>
      ) : (
        <div className="fragrance-catalog__products s-products-list-wrapper s-products-list-vertical-cards">
          {isPending
            ? Array.from({ length: 4 }, (_, index) => <ProductCardSkeleton key={index} />)
            : items.map((item) => <ProductCard key={item.id} product={item} layout="vertical" />)}
        </div>
      )}
      {!isPending && !isError && !items.length && (
        <p role="status">{t('fragrance.empty', 'No products are available yet.')}</p>
      )}

    </section>
  );
}

export function FragranceHomeCatalog() {
  return <FragranceCatalog home />;
}
