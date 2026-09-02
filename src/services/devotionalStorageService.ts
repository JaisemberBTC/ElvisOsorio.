import { DevotionalVideoProductionDoc } from '../types';

const STORAGE_KEY = 'devotional_cinematic_scenes_history';

export interface SavedDevotionalProject {
  id: string;
  title: string;
  originalPrompt: string;
  masterCharacterDescription: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  totalDurationSec: number;
  productionDoc: DevotionalVideoProductionDoc;
  createdAt: string;
  status: 'completed' | 'draft' | 'archived';
}

/**
 * Devotional Storage Service
 * Handles persistence to localStorage with ready hooks for Firestore/Firebase.
 */
class DevotionalStorageService {
  public getAllProjects(): SavedDevotionalProject[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (err) {
      console.warn('Error reading devotional scene projects from storage', err);
      return [];
    }
  }

  public saveProject(doc: DevotionalVideoProductionDoc, originalPrompt: string): SavedDevotionalProject {
    const projects = this.getAllProjects();
    const newProject: SavedDevotionalProject = {
      id: `devotional-project-${Date.now()}`,
      title: doc.videoTitle || 'Video Devocional',
      originalPrompt,
      masterCharacterDescription: doc.masterCharacterDescription,
      aspectRatio: doc.aspectRatio,
      totalDurationSec: doc.totalDurationSec,
      productionDoc: doc,
      createdAt: new Date().toISOString(),
      status: 'completed'
    };

    const updated = [newProject, ...projects.slice(0, 19)]; // Keep latest 20
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Error saving to localStorage', err);
    }

    return newProject;
  }

  public deleteProject(id: string): void {
    const projects = this.getAllProjects();
    const filtered = projects.filter(p => p.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (err) {
      console.warn('Error updating localStorage', err);
    }
  }

  /**
   * Prepared method for cloud sync when Firebase is connected
   */
  public async syncToCloudFirestore(userId: string, project: SavedDevotionalProject): Promise<boolean> {
    // Ready for Firestore collection('devotional_scene_projects').doc(project.id).set(...)
    console.info(`[DevotionalStorageService] Cloud sync prepared for user: ${userId}, project: ${project.id}`);
    return true;
  }
}

export const devotionalStorageService = new DevotionalStorageService();
