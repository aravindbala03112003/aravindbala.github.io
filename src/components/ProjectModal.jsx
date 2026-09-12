import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from './Icons';
import DeviceViewer from './DeviceViewer';

export default function ProjectModal({ project, onClose, triggerRef }) {
  const modalRef = useRef(null);
  const scrollYRef = useRef(0);

  // Scroll lock: freeze body at current scroll position, restore on close
  useEffect(() => {
    if (!project) return;

    scrollYRef.current = window.scrollY;
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.classList.add('modal-open');

    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.top = '';
      window.scrollTo(0, scrollYRef.current);
    };
  }, [project]);

  // Focus the modal when it opens, return focus to trigger on close
  useEffect(() => {
    if (project && modalRef.current) {
      modalRef.current.focus({ preventScroll: true });
    }
    if (!project && triggerRef?.current) {
      triggerRef.current.focus({ preventScroll: true });
    }
  }, [project, triggerRef]);

  // Escape key handler
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    },
    [onClose],
  );

  const modal = (
    <AnimatePresence>
      {project && (
        <motion.div
          className="project-modal-backdrop"
          onMouseDown={onClose}
          onKeyDown={handleKeyDown}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.article
            ref={modalRef}
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${project.name} case study`}
            tabIndex={-1}
            onMouseDown={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            initial={{ y: 24, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Close case study"
            >
              Close ✕
            </button>

            <div className="modal-header">
              <p className="eyebrow"><span />Case study / {project.id}</p>
              <h2>{project.name}</h2>
              <p className="modal-description">{project.description}</p>
            </div>

            {/* Interactive Smartphone & Laptop Device Mockup Viewer */}
            <DeviceViewer project={project} />

            <div className="modal-footer">
              <div className="modal-grid">
                <div>
                  <small>Challenge</small>
                  <p>Turn a complex workflow into a clear experience people can trust and use without training.</p>
                </div>
                <div>
                  <small>Approach</small>
                  <p>Created a responsive, component-led product architecture with useful feedback at every important decision.</p>
                </div>
              </div>

              <div className="modal-stack">
                {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>

              <a href="#contact" onClick={onClose} className="button button-primary">
                Discuss a similar build <ArrowUpRight />
              </a>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}

