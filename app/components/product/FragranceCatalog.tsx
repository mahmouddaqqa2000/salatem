import { useId, useState } from 'react';
import { SallaAddProductButton } from '@salla.sa/twilight-components-react/add-product-button';
import { ShoppingBagIcon } from '../icons';
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
  return Boolean(import.meta.env.DEV && settings &&
    'fragrance_preview' in settings && settings.fragrance_preview === true);
}

export function fragranceFamilyName(family: string, locale: string | undefined) {
  const selected = families.find((entry) => entry.id === family) ?? families[0];
  return selected.name[locale === 'ar' || !locale ? 'ar' : 'en'];
}

function FragranceCartButton({ id, name }: { id: string; name: string }) {
  const { t } = useTranslation();
  const { theme } = useTwilight();
  const [showNotice, setShowNotice] = useState(false);
  const noticeId = useId();
  const settings = theme?.settings as Record<string, unknown> | undefined;
  const rawId = settings?.[`fragrance_product_${id}`];
  const productId = typeof rawId === 'string' || typeof rawId === 'number' ? Number(rawId) : 0;
  const label = t('fragrance.add_to_cart', 'Add to cart');

  return (
    <div className="fragrance-catalog__purchase">
      {Number.isSafeInteger(productId) && productId > 0 ? (
        <SallaAddProductButton productId={productId} productStatus="sale"
          productType="product" quantity={1} width="wide" fill="solid">
          <ShoppingBagIcon aria-hidden="true" />
          <span>{label}</span>
        </SallaAddProductButton>
      ) : (
        <button type="button" className="fragrance-catalog__add"
          aria-label={`${label} — ${name}`}
          aria-describedby={showNotice ? noticeId : undefined}
          onClick={() => setShowNotice(true)}>
          <ShoppingBagIcon aria-hidden="true" />
          <span>{label}</span>
        </button>
      )}
      {showNotice && (
        <p id={noticeId} role="status" className="fragrance-catalog__notice">
          {t('fragrance.link_required', 'This preview item needs to be linked to a Salla product before it can be purchased.')}
        </p>
      )}
    </div>
  );
}

export function FragranceCatalog({ family = 'all', home = false }: { family?: string; home?: boolean }) {
  const { locale, t } = useTranslation();
  const language = locale === 'ar' ? 'ar' : 'en';
  const selected = families.find((entry) => entry.id === family) ?? families[0];
  const items = selected.id === 'all'
    ? fragrances
    : fragrances.filter((item) => item.family === selected.id);
  const title = home ? t('fragrance.collection', 'Salatem collection') : fragranceFamilyName(family, locale);
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
      <ul className="fragrance-catalog__grid">
        {items.map((item) => (
          <li key={item.id}>
            <img src={`/salatem/${item.id}.jpg`} alt="" width="600" height="600" loading="lazy" />
            <div className="fragrance-catalog__info">
              <h3>{item.name[language]}</h3>
              <p>{item.notes[language]}</p>
            </div>
            <FragranceCartButton id={item.id} name={item.name[language]} />
          </li>
        ))}
      </ul>
    </section>
  );
}
