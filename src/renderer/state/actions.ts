import { IPreferences, IUser, IRun } from '../types/interfaces';

export const setCurrentPage = (page: string) => ({
  type: 'SET_CURRENT_PAGE',
  payload: page,
});

export const setApplicationFont = (font: string) => ({
  type: 'SET_APPLICATION_FONT',
  payload: font,
});

export const setContentScale = (scale: number) => ({
  type: 'SET_CONTENT_SCALE',
  payload: scale,
});

export const setDefaultChatPanelPosition = (position: 'left' | 'right') => ({
  type: 'SET_DEFAULT_CHAT_PANEL_POSITION',
  payload: position,
});

export const setHighlightButtons = (highlight: boolean) => ({
  type: 'SET_HIGHLIGHT_BUTTONS',
  payload: highlight,
});

export const setShowSystemMessages = (show: boolean) => ({
  type: 'SET_SHOW_SYSTEM_MESSAGES',
  payload: show,
});

export const setUserProfileActiveTab = (
  tab: IPreferences['userProfileActiveTab']
) => ({
  type: 'SET_USER_PROFILE_ACTIVE_TAB',
  payload: tab,
});

export const setUserOS = (os: IUser['os']) => ({
  type: 'SET_USER_OS',
  payload: os,
});

export const setDataSourceImportStatus = (sourceId: string, status: 'not_imported' | 'importing' | 'imported') => ({
  type: 'SET_DATA_SOURCE_IMPORT_STATUS',
  payload: { sourceId, status },
});

export const addRun = (run: IRun) => ({
  type: 'ADD_RUN',
  payload: run,
});

export const updateRunStatus = (runId: string, status: IRun['status'], endDate?: string) => ({
  type: 'UPDATE_RUN_STATUS',
  payload: { runId, status, endDate },
});

export const updateStepStatus = (runId: string, taskId: string, stepId: string, status: IStep['status'], startTime?: string, endTime?: string, logs?: string) => ({
  type: 'UPDATE_STEP_STATUS',
  payload: { runId, taskId, stepId, status, startTime, endTime, logs },
});

export const updateTaskStatus = (runId: string, taskId: string, status: ITask['status'], startTime?: string, endTime?: string, logs?: string) => ({
  type: 'UPDATE_TASK_STATUS',
  payload: { runId, taskId, status, startTime, endTime, logs },
});

export const deleteRunsForPlatform = (platformId: string) => ({
  type: 'DELETE_RUNS_FOR_PLATFORM',
  payload: platformId,
});

export const deleteRun = (runId: string) => ({
  type: 'DELETE_RUN',
  payload: runId,
});

export const setActiveWebviewIndex = (index: number) => ({
  type: 'SET_ACTIVE_WEBVIEW_INDEX',
  payload: index,
});

export const startRun = (run: IRun) => ({
  type: 'START_RUN',
  payload: run,
});

export const setActiveRunIndex = (index: number) => ({
  type: 'SET_ACTIVE_RUN_INDEX',
  payload: index,
});

export const adjustActiveRunIndex = () => ({
  type: 'ADJUST_ACTIVE_RUN_INDEX',
});

export const closeRun = (runId: string) => ({
  type: 'CLOSE_RUN',
  payload: runId,
});

export const toggleRunVisibility = () => ({
  type: 'TOGGLE_RUN_VISIBILITY',
});

export const stopRun = (runId: string) => ({
  type: 'STOP_RUN',
  payload: runId,
});

export const updateExportStatus = (platformId: string, exportData: any, runID: string) => ({
  type: 'UPDATE_EXPORT_STATUS',
  payload: { platformId, exportData, runID },
});

export const setExportRunning = (platformId: string, isRunning: boolean) => ({
  type: 'SET_EXPORT_RUNNING',
  payload: { platformId, isRunning },
});
