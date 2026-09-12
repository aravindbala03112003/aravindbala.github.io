import MuseumCertificateViewer from './MuseumCertificateViewer';

export default function TimelineModal({ item, onClose }) {
  if (!item) return null;
  return <MuseumCertificateViewer item={item} onClose={onClose} />;
}
