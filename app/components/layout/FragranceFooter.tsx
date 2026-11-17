import { Link } from '@salla.sa/twilight-theme-engine/common';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';

export function FragranceFooter() {
  const { t } = useTranslation();
  return (
    <footer className="fragrance-footer">
      <div className="container fragrance-footer__columns">
        <div>
          <Link className="fragrance-footer__brand" to="/">سلاتم</Link>
          <p>{t('fragrance.footer_intro', 'Discover fragrances from warm woods to fresh citrus.')}</p>
        </div>
        <nav aria-label={t('fragrance.families', 'Fragrance families')}>
          <h2>{t('fragrance.collection', 'Salatem collection')}</h2>
          <Link to="/collections/all">{t('fragrance.all', 'All fragrances')}</Link>
          <Link to="/collections/woody">{t('fragrance.woody', 'Woody')}</Link>
          <Link to="/collections/floral">{t('fragrance.floral', 'Floral')}</Link>
          <Link to="/collections/citrus">{t('fragrance.citrus', 'Citrus')}</Link>
        </nav>
        <nav aria-label={t('fragrance.shopping', 'Shopping')}>
          <h2>{t('fragrance.shopping', 'Shopping')}</h2>
          <Link to="/cart">{t('fragrance.cart', 'Shopping bag')}</Link>
          <Link to="/account/orders">{t('fragrance.orders', 'My orders')}</Link>
          <Link to="/account/profile">{t('fragrance.account', 'My account')}</Link>
        </nav>
      </div>
      <div className="container fragrance-footer__bottom">
        © {new Date().getFullYear()} سلاتم
      </div>
    </footer>
  );
}
