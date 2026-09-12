import { useState, useRef } from 'react';
import SectionHeading from '../components/SectionHeading';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import { useSound } from '../context/SoundContext';
import { projects } from '../data/portfolio';

export default function Work() {
  const { playSynthSound } = useSound();
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const triggerRef = useRef(null);
  const options = ['All', 'Web', 'Mobile', 'Systems'];

  const handleFilter = (option) => {
    playSynthSound('pop');
    setFilter(option);
  };

  const handleOpen = (project, buttonEl) => {
    playSynthSound('pop');
    triggerRef.current = buttonEl;
    setSelected(project);
  };

  const handleClose = () => {
    setSelected(null);
  };

  const getCount = (option) => {
    if (option === 'All') return projects.length;
    return projects.filter((project) => project.categories?.includes(option) || project.type?.toLowerCase().includes(option.toLowerCase())).length;
  };

  const shown = filter === 'All' 
    ? projects 
    : projects.filter((project) => project.categories?.includes(filter) || project.type?.toLowerCase().includes(filter.toLowerCase()));

  return (
    <section id="work" className="section work">
      <div className="container">
        <SectionHeading eyebrow="Selected work" title={<>A few things I've<br /><em>made real.</em></>} copy="A focused selection of software projects that began with a real-world problem." />
        <div className="project-filters reveal">
          {options.map((option) => (
            <button className={`filter-chip ${filter === option ? 'selected' : ''}`} onClick={() => handleFilter(option)} key={option}>
              {option} <span className="chip-count">{getCount(option)}</span>
            </button>
          ))}
        </div>
        <div className="projects">
          {shown.map((project) => (
            <ProjectCard project={project} onOpen={handleOpen} key={project.name} />
          ))}
        </div>
        <div className="work-more reveal">
          <p>More experiments, explorations, and open-source work on GitHub.</p>
          <a className="text-link" href="#contact">View all projects <span>↗</span></a>
        </div>
      </div>
      <ProjectModal project={selected} onClose={handleClose} triggerRef={triggerRef} />
    </section>
  );
}

