import { createContext, useContext, useEffect, useState } from 'react';
import * as skillService from '../services/skillService';

const SkillsContext = createContext(null);

export function SkillsProvider({ children }) {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);

  // App shuru hole ekbar skill list load kore rakhi.
  useEffect(() => {
    Promise.all([skillService.getAllSkills(), skillService.getCategories()]).then(
      ([loadedSkills, loadedCategories]) => {
        setSkills(loadedSkills);
        setCategories(loadedCategories);
      }
    );
  }, []);

  const getSkillById = (id) => skills.find((skill) => skill.id === id);
  const getSkillName = (id) => getSkillById(id)?.name ?? 'Unknown skill';

  return (
    <SkillsContext.Provider value={{ skills, categories, getSkillById, getSkillName }}>
      {children}
    </SkillsContext.Provider>
  );
}

export function useSkills() {
  const context = useContext(SkillsContext);
  if (!context) throw new Error('useSkills must be used inside <SkillsProvider>');
  return context;
}