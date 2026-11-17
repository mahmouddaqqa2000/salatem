import { createFileRoute, notFound } from '@tanstack/react-router';
import { FragranceCatalog, fragranceFamilyName, useFragrancePreview } from '../components/product/FragranceCatalog';

function CollectionPage() {
  const enabled = useFragrancePreview();
  const { family } = Route.useParams();
  if (!enabled) throw notFound();
  return <FragranceCatalog family={family} />;
}

export const Route = createFileRoute('/{-$locale}/collections/$family')({
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound();
  },
  loader: ({ params }) => ({
    page: { title: fragranceFamilyName(params.family, params.locale) },
  }),
  head: ({ loaderData }) => ({ meta: [{ title: loaderData?.page.title }] }),
  component: CollectionPage,
});
