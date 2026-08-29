import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize or reuse Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// All Google Drive Scopes
export const DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata',
  'https://www.googleapis.com/auth/drive.activity',
  'https://www.googleapis.com/auth/drive.activity.readonly',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.apps.readonly',
  'https://www.googleapis.com/auth/drive.install',
  'https://www.googleapis.com/auth/drive.meet.readonly',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.photos.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.scripts',
];

const provider = new GoogleAuthProvider();
DRIVE_SCOPES.forEach((scope) => {
  provider.addScope(scope);
});

// In-memory token management
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
  webViewLink?: string;
  thumbnailLink?: string;
  iconLink?: string;
}

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('No se pudo obtener el token de acceso de Google Drive');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Error al iniciar sesión con Google:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Find or Create App folder in Google Drive
export const getOrCreateDevotionalFolder = async (folderName = '🕊️ Devocionales y Videos de Fe AI'): Promise<string> => {
  const token = await getAccessToken();
  if (!token) throw new Error('No hay sesión activa con Google Drive');

  // Search if folder exists
  const query = encodeURIComponent(`mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}' and trashed = false`);
  const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!searchRes.ok) {
    throw new Error('Error al buscar carpeta en Google Drive');
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Create folder if not found
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Carpeta oficial para videos devocionales, guiones y contenido de fe generado con IA.'
    })
  });

  if (!createRes.ok) {
    throw new Error('Error al crear carpeta en Google Drive');
  }

  const newFolder = await createRes.json();
  return newFolder.id;
};

// Upload Blob (e.g., WebM / MP4 video, SRT subtitles, Markdown script) via Multipart
export const uploadBlobToDrive = async (
  blob: Blob,
  filename: string,
  mimeType: string,
  folderId?: string
): Promise<DriveFileItem> => {
  const token = await getAccessToken();
  if (!token) throw new Error('No hay sesión activa con Google Drive');

  const targetFolderId = folderId || (await getOrCreateDevotionalFolder());

  const metadata = {
    name: filename,
    mimeType: mimeType,
    parents: targetFolderId ? [targetFolderId] : []
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', blob);

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,webViewLink,thumbnailLink,iconLink,createdTime',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: form
    }
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Fallo al subir archivo a Google Drive');
  }

  return await res.json();
};

// Upload Video to Google Drive
export const uploadVideoToDrive = async (
  videoBlob: Blob,
  title: string,
  folderId?: string
): Promise<DriveFileItem> => {
  const cleanTitle = title.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s_-]/g, '').trim().slice(0, 40);
  const filename = `Video_${cleanTitle || 'Devocional'}_${Date.now()}.webm`;
  return uploadBlobToDrive(videoBlob, filename, 'video/webm', folderId);
};

// Upload Image to Google Drive
export const uploadImageToDrive = async (
  imageBlob: Blob,
  title: string,
  folderId?: string
): Promise<DriveFileItem> => {
  const cleanTitle = title.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s_-]/g, '').trim().slice(0, 40);
  const filename = `Tarjeta_${cleanTitle || 'Bendicion'}_${Date.now()}.png`;
  return uploadBlobToDrive(imageBlob, filename, 'image/png', folderId);
};

// Upload text script or markdown to Google Drive
export const uploadScriptToDrive = async (
  title: string,
  content: string,
  folderId?: string
): Promise<DriveFileItem> => {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const cleanTitle = title.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s_-]/g, '').trim().slice(0, 40);
  const filename = `Guion_${cleanTitle || 'Devocional'}.md`;
  return uploadBlobToDrive(blob, filename, 'text/markdown', folderId);
};

// List files in Devotional Folder or overall Drive
export const listDriveFiles = async (folderId?: string): Promise<DriveFileItem[]> => {
  const token = await getAccessToken();
  if (!token) throw new Error('No hay sesión activa con Google Drive');

  let query = 'trashed = false';
  if (folderId) {
    query += ` and '${folderId}' in parents`;
  }

  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    query
  )}&orderBy=createdTime desc&pageSize=30&fields=files(id,name,mimeType,size,createdTime,modifiedTime,webViewLink,thumbnailLink,iconLink)`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    throw new Error('Error al listar archivos de Google Drive');
  }

  const data = await res.json();
  return data.files || [];
};

// Delete a file with explicit user confirmation requirement
export const deleteDriveFile = async (fileId: string): Promise<void> => {
  const token = await getAccessToken();
  if (!token) throw new Error('No hay sesión activa con Google Drive');

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    throw new Error('No se pudo eliminar el archivo de Google Drive');
  }
};
