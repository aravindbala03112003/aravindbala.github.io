import MuseumCertificateViewer from './MuseumCertificateViewer';

export default function TimelineModal({ item, onClose }) {
  if (!item) return null;
  return <MuseumCertificateViewer key={item.title} item={item} onClose={onClose} />;
}
