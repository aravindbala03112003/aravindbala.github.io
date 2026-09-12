import { AnimatePresence, motion } from 'framer-motion';

export default function TimelineGallery({ item, onClose }) {
  return <AnimatePresence>{item && <motion.div className="project-modal-backdrop timeline-gallery-backdrop" onMouseDown={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.article className="timeline-gallery" onMouseDown={(event) => event.stopPropagation()} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}><button className="modal-close" onClick={onClose}>Close x</button><p className="eyebrow"><span />Supporting record</p><h2>{item.title}</h2><p>{item.place}</p><div className="timeline-photo-grid">{item.photos.map((photo, index) => <a href={photo} target="_blank" rel="noreferrer" key={photo}><img src={photo} alt={`${item.title} record ${index + 1}`} /></a>)}</div><small>Select an image to view it at full size.</small></motion.article></motion.div>}</AnimatePresence>;
}
