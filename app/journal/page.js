import PagePlaceholder from '@/components/PagePlaceholder';

export const metadata = {
  title: 'Journal',
  description:
    'Notes from the roastery — origin stories, brew guides, and tasting logs.',
};

export default function JournalPage() {
  return (
    <PagePlaceholder
      eyebrow="03 / Journal"
      title="Journal"
      subtitle="Notes from the roastery — origin stories, brew guides, tasting logs."
    />
  );
}
