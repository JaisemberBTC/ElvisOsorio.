import { DevotionalVideoProductionDoc, DevotionalSceneItem } from '../types';

export interface SavedDevotionalProject {
  id: string;
  title: string;
  createdAt: string;
  totalDurationSec: number;
  prompt: string;
  originalPrompt?: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  scenes: DevotionalSceneItem[];
  productionDoc: DevotionalVideoProductionDoc;
}

const DEVOTIONAL_STORAGE_KEY = 'fe_oracion_devotional_saved_projects_v1';

class DevotionalStorageService {
  getAllProjects(): SavedDevotionalProject[] {
    try {
      const data = localStorage.getItem(DEVOTIONAL_STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Error loading devotional projects:', err);
      return [];
    }
  }

  saveProject(productionDoc: DevotionalVideoProductionDoc, promptText?: string): SavedDevotionalProject {
    const existing = this.getAllProjects();
    const id = `dev_proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    const newProject: SavedDevotionalProject = {
      id,
      title: productionDoc.videoTitle || 'Devocional Sagrado',
      createdAt: new Date().toISOString(),
      totalDurationSec: productionDoc.totalDurationSec || 10,
      prompt: promptText || productionDoc.environmentOverview || '',
      originalPrompt: promptText || productionDoc.environmentOverview || '',
      aspectRatio: productionDoc.aspectRatio || '9:16',
      scenes: productionDoc.scenes || [],
      productionDoc
    };

    const updated = [newProject, ...existing.filter(p => p.title !== newProject.title)].slice(0, 30);
    try {
      localStorage.setItem(DEVOTIONAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving devotional project to localStorage:', err);
    }

    return newProject;
  }

  deleteProject(id: string): void {
    const existing = this.getAllProjects();
    const filtered = existing.filter(p => p.id !== id);
    try {
      localStorage.setItem(DEVOTIONAL_STORAGE_KEY, JSON.stringify(filtered));
    } catch (err) {
      console.error('Error deleting devotional project:', err);
    }
  }

  getProjectById(id: string): SavedDevotionalProject | null {
    const list = this.getAllProjects();
    return list.find(p => p.id === id) || null;
  }
}

export const devotionalStorageService = new DevotionalStorageService();
