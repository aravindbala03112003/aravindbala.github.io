import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { navLinks } from '../data/portfolio';

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  useEffect(() => { if (open) setQuery(''); }, [open]);
  const links = navLinks.filter((link) => link.includes(query.toLowerCase()));
  const go = (link) => { document.getElementById(link)?.scrollIntoView({ behavior: 'smooth' }); onClose(); };
  return <AnimatePresence>{open && <motion.div className="palette-backdrop" onMouseDown={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className="command-palette" onMouseDown={(event) => event.stopPropagation()} initial={{ opacity: 0, y: -12, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: .98 }}><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Jump to a section..." /><div>{links.map((link) => <button onClick={() => go(link)} key={link}><span>{link}</span><kbd>↵</kbd></button>)}</div><small>Press Esc to close</small></motion.div></motion.div>}</AnimatePresence>;
}
