export interface SavedDevotionalProject {
  id: string;
  timestamp: number;
  title: string;
  prompt: string;
  doc: any;
}

const STORAGE_KEY = 'saved_devotional_projects_v1';

export const devotionalStorageService = {
  getAllProjects(): SavedDevotionalProject[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Error reading devotional projects:', e);
    }
    return [];
  },

  saveProject(doc: any, prompt: string): SavedDevotionalProject {
    const projects = this.getAllProjects();
    const newProj: SavedDevotionalProject = {
      id: `dev_${Date.now()}`,
      timestamp: Date.now(),
      title: doc?.title || doc?.titulo || 'Devocional de Fe',
      prompt,
      doc
    };
    projects.unshift(newProj);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects.slice(0, 50)));
    } catch (e) {
      console.warn('Error saving devotional project:', e);
    }
    return newProj;
  },

  deleteProject(id: string): void {
    const projects = this.getAllProjects().filter(p => p.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.warn('Error deleting devotional project:', e);
    }
  }
};
