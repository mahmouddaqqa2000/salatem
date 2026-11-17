import { useId, useState } from 'react';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { useMotionAllowed } from '../../hooks/useMotionAllowed';

interface ShowcaseItem {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

interface ShowcaseData {
  anchor?: string;
  title?: string;
  description?: string;
  image?: string;
  second_image?: string;
  video?: string;
  mobile_video?: string;
  url?: string;
  button?: string;
  layout?: string | { value?: string; key?: string }[];
  items?: ShowcaseItem[];
}

function Action({ data }: { data: ShowcaseData }) {
  if (!data.url || !data.button) return null;
  if (data.url.startsWith('#')) {
    return <a className="showcase-action" href={data.url}>{data.button}</a>;
  }
  return <Link className="showcase-action" to={data.url}>{data.button}</Link>;
}

export function ShowcaseHero({ data }: { data: ShowcaseData }) {
  const { t } = useTranslation();
  const motionAllowed = useMotionAllowed();
  const [paused, setPaused] = useState(false);
  if (!data.video && !data.image) return null;
  const play = motionAllowed && !paused && Boolean(data.video);

  return (
    <div className="showcase-hero">
      {data.image && <img src={data.image} alt="" fetchPriority="high" />}
      {play && (
        <video autoPlay loop muted playsInline preload="metadata" poster={data.image} aria-hidden="true">
          {data.mobile_video && <source src={data.mobile_video} media="(max-width: 640px)" type="video/mp4" />}
          <source src={data.video} type="video/mp4" />
        </video>
      )}
      {(data.title || data.description || data.button) && (
        <div className="showcase-hero__copy container">
          {data.title && <h2>{data.title}</h2>}
          {data.description && <p>{data.description}</p>}
          <Action data={data} />
        </div>
      )}
      {motionAllowed && data.video && (
        <button type="button" className="showcase-hero__motion" onClick={() => setPaused(!paused)}>
          {paused ? t('showcase.play', 'Play video') : t('showcase.pause', 'Pause video')}
        </button>
      )}
    </div>
  );
}

function Comparison({ before, after }: { before: string; after: string }) {
  const { t } = useTranslation();
  const id = useId();
  const [position, setPosition] = useState(50);
  return (
    <div className="showcase-comparison">
      <div className="showcase-comparison__images">
        <img src={before} alt={t('showcase.before', 'Before')} loading="lazy" />
        <img src={after} alt={t('showcase.after', 'After')} loading="lazy"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }} />
      </div>
      <label className="sr-only" htmlFor={id}>{t('showcase.compare', 'Compare the two images')}</label>
      <input id={id} dir="ltr" type="range" min="0" max="100" value={position}
        onChange={(event) => setPosition(event.currentTarget.valueAsNumber)} />
    </div>
  );
}

function ShowcaseCards({ items, duplicate = false }: { items: ShowcaseItem[]; duplicate?: boolean }) {
  return (
    <ul className="showcase-cards" aria-hidden={duplicate || undefined} inert={duplicate || undefined}>
      {items.map((item, index) => {
        const content = (
          <>
            {item.image && <img src={item.image} alt={item.title ?? ''} loading="lazy" decoding="async" />}
            {(item.title || item.description) && (
              <div className="showcase-card__copy">
                {item.title && <h3>{item.title}</h3>}
                {item.description && <p>{item.description}</p>}
              </div>
            )}
          </>
        );
        return (
          <li key={`${item.image ?? item.title}-${index}`}>
            {item.url && !duplicate ? <Link to={item.url}>{content}</Link> : content}
          </li>
        );
      })}
    </ul>
  );
}

function BrandMarquee({ items }: { items: ShowcaseItem[] }) {
  const { t } = useTranslation();
  const [paused, setPaused] = useState(false);

  if (items.length < 2) return <ShowcaseCards items={items} />;

  return (
    <div className="showcase-brands" data-paused={paused}>
      <div className="showcase-brands__track" dir="ltr">
        <ShowcaseCards items={items} />
        <ShowcaseCards items={items} duplicate />
      </div>
      <button type="button" className="showcase-brands__toggle" onClick={() => setPaused((value) => !value)}>
        {paused ? t('showcase.brands_resume', 'Resume logos') : t('showcase.brands_pause', 'Pause logos')}
      </button>
    </div>
  );
}

export function ShowcaseSection({ data }: { data: ShowcaseData }) {
  const layout = typeof data.layout === 'string'
    ? data.layout
    : data.layout?.[0]?.value ?? data.layout?.[0]?.key;
  const items = (data.items ?? []).filter((item) => item.title || item.description || item.image);
  if (!data.title && !data.description && !data.image && !data.video && !items.length) return null;

  if (layout === 'strip') {
    return <div className="showcase-strip">{data.url ? <Link to={data.url}>{data.title}</Link> : data.title}</div>;
  }

  return (
    <div id={data.anchor || undefined} className={`showcase-section showcase-section--${layout ?? 'grid'} container`}>
      {(data.title || data.description || data.button) && (
        <div className="showcase-heading">
          {data.title && <h2>{data.title}</h2>}
          {data.description && <p>{data.description}</p>}
          <Action data={data} />
        </div>
      )}
      {layout === 'compare' && data.image && data.second_image ? (
        <Comparison before={data.image} after={data.second_image} />
      ) : data.video ? (
        <video controls playsInline preload="none" poster={data.image} src={data.video} />
      ) : data.image && <img className="showcase-section__image" src={data.image} alt="" loading="lazy" />}
      {layout === 'faq' ? items.map((item, index) => (
        <details key={`${item.title}-${index}`}><summary>{item.title}</summary><p>{item.description}</p></details>
      )) : layout === 'brands' && items.length > 0 ? (
        <BrandMarquee items={items} />
      ) : items.length > 0 && <ShowcaseCards items={items} />}
    </div>
  );
}
