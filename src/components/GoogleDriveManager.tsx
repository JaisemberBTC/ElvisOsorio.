import React, { useState, useEffect } from 'react';
import { 
  FolderCheck, 
  Upload, 
  Trash2, 
  ExternalLink, 
  RefreshCw, 
  FileText, 
  Video, 
  Captions, 
  HardDrive, 
  X, 
  CheckCircle2, 
  AlertCircle,
  LogOut,
  FolderOpen
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  googleSignIn, 
  logoutGoogle, 
  initAuth, 
  listDriveFiles, 
  deleteDriveFile, 
  uploadScriptToDrive,
  getOrCreateDevotionalFolder,
  DriveFileItem 
} from '../services/googleDriveService';

interface GoogleDriveManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentScriptTitle?: string;
  currentScriptMarkdown?: string;
}

export const GoogleDriveManager: React.FC<GoogleDriveManagerProps> = ({
  isOpen,
  onClose,
  currentScriptTitle,
  currentScriptMarkdown
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser) => {
        setUser(currentUser);
        setHasToken(true);
      },
      () => {
        setUser(null);
        setHasToken(false);
        setFiles([]);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch files whenever user is authenticated and modal opens
  useEffect(() => {
    if (isOpen && hasToken) {
      loadDriveContent();
    }
  }, [isOpen, hasToken]);

  const loadDriveContent = async () => {
    setIsLoadingFiles(true);
    setFeedback(null);
    try {
      const fId = await getOrCreateDevotionalFolder();
      setFolderId(fId);
      const items = await listDriveFiles(fId);
      setFiles(items);
    } catch (err: any) {
      console.error('Error al cargar Google Drive:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'No se pudieron cargar los archivos de Google Drive.'
      });
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    setFeedback(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setHasToken(true);
        loadDriveContent();
      }
    } catch (err: any) {
      console.error('Error de login con Google:', err);
      setFeedback({
        type: 'error',
        message: 'No se completó la vinculación con Google Drive. Reintenta.'
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutGoogle();
      setUser(null);
      setHasToken(false);
      setFiles([]);
    } catch (err: any) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  const handleUploadCurrentScript = async () => {
    if (!currentScriptMarkdown || !currentScriptTitle) return;
    setIsUploading(true);
    setFeedback(null);
    try {
      const uploaded = await uploadScriptToDrive(
        currentScriptTitle,
        currentScriptMarkdown,
        folderId || undefined
      );
      setFeedback({
        type: 'success',
        message: `¡Guion "${uploaded.name}" guardado exitosamente en tu Google Drive!`
      });
      loadDriveContent();
    } catch (err: any) {
      console.error('Error al subir a Drive:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'Error al guardar el guion en Google Drive.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;
    try {
      await deleteDriveFile(fileToDelete.id);
      setFeedback({
        type: 'success',
        message: `Archivo "${fileToDelete.name}" eliminado de tu Google Drive.`
      });
      setFileToDelete(null);
      loadDriveContent();
    } catch (err: any) {
      console.error('Error al eliminar:', err);
      setFeedback({
        type: 'error',
        message: 'No se pudo eliminar el archivo.'
      });
      setFileToDelete(null);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('video')) return <Video className="w-4 h-4 text-rose-400 shrink-0" />;
    if (mimeType.includes('text') || mimeType.includes('markdown')) return <FileText className="w-4 h-4 text-amber-400 shrink-0" />;
    if (mimeType.includes('plain')) return <Captions className="w-4 h-4 text-sky-400 shrink-0" />;
    return <HardDrive className="w-4 h-4 text-slate-400 shrink-0" />;
  };

  const formatFileSize = (bytesStr?: string) => {
    if (!bytesStr) return '';
    const bytes = parseInt(bytesStr, 10);
    if (isNaN(bytes)) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-cinzel">
                Google Drive para Devocionales & Videos
              </h3>
              <p className="text-xs text-slate-400">
                Almacena tus guiones, videos devocionales y subtítulos en tu propia nube
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Feedback alerts */}
          {feedback && (
            <div className={`p-3.5 rounded-2xl flex items-center gap-2.5 text-xs ${
              feedback.type === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
            }`}>
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Authentication State */}
          {!hasToken ? (
            <div className="text-center py-8 px-4 rounded-3xl bg-slate-950/60 border border-white/5 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.15)]">
                <FolderCheck className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h4 className="text-base font-bold text-white font-cinzel">
                  Conecta tu Cuenta de Google Drive
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Concede acceso con permisos para sincronizar automáticamente tus videos con Jesús, guiones bíblicos y archivos de subtítulos directamente en tu carpeta de Google Drive.
                </p>
              </div>

              {/* Official Google Sign-In Styled Button */}
              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleSignIn}
                  disabled={isLoggingIn}
                  className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-medium text-sm flex items-center gap-3 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>{isLoggingIn ? 'Conectando con Google...' : 'Iniciar Sesión con Google'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Connected User Profile Card */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Google Avatar" className="w-10 h-10 rounded-full border border-amber-400/40" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                      {user?.displayName?.[0] || 'G'}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white">{user?.displayName || 'Usuario de Google'}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Conectado
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadDriveContent}
                    disabled={isLoadingFiles}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Actualizar lista de archivos"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingFiles ? 'animate-spin text-amber-400' : ''}`} />
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                    title="Cerrar Sesión de Google"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              {currentScriptMarkdown && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-amber-300">
                      Guion Actual: "{currentScriptTitle || 'Devocional'}"
                    </p>
                    <p className="text-[11px] text-slate-300">
                      Guarda el guion completo y storyboard en tu carpeta de Google Drive
                    </p>
                  </div>
                  <button
                    onClick={handleUploadCurrentScript}
                    disabled={isUploading}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Guardando...' : 'Guardar en Drive'}</span>
                  </button>
                </div>
              )}

              {/* Files in Folder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                    Archivos en "🕊️ Devocionales y Videos de Fe AI" ({files.length})
                  </span>
                  <a
                    href="https://drive.google.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <span>Abrir Google Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {isLoadingFiles ? (
                  <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Sincronizando archivos con Google Drive...</span>
                  </div>
                ) : files.length === 0 ? (
                  <div className="py-8 text-center rounded-2xl bg-slate-950/40 border border-white/5 text-xs text-slate-400">
                    Aún no has guardado archivos en esta carpeta. Puedes guardar tu guion o exportar tu video directamente a Google Drive.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="p-3 rounded-xl bg-slate-950/60 border border-white/5 hover:border-white/10 flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {getFileIcon(file.mimeType)}
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-200 truncate">
                              {file.name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {formatFileSize(file.size)} {file.createdTime ? `• ${new Date(file.createdTime).toLocaleDateString()}` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                              title="Ver en Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => setFileToDelete(file)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                            title="Eliminar de Google Drive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>

      {/* Confirmation Dialog for Destructive Delete (Mandatory per Skill instructions) */}
      {fileToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-sm font-bold text-white">¿Eliminar archivo de Google Drive?</h4>
              <p className="text-xs text-slate-400">
                ¿Estás seguro de que deseas eliminar permanentemente <strong>"{fileToDelete.name}"</strong>? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setFileToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteFile}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-rose-900/30"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
