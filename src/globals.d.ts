/// <reference types="vite/client" />

interface WPCoreEditorStore {
  // Post Data Selectors
  getCurrentPost(): {
    id: number;
    slug: string;
    link: string;
    title: { rendered: string };
    content: { rendered: string };
    status: string;
    date: string;
    modified: string;
    featured_media: number;
    excerpt: { rendered: string };
    meta: Record<string, any>;
  } | null;

  getCurrentPostAttribute(attributeName: string): any;
  getCurrentPostId(): number | null;
  getCurrentPostType(): string;
  getCurrentPostLastRevisionId(): number | null;
  getCurrentPostRevisionsCount(): number;

  getEditedPostAttribute(attributeName: string): any;
  getEditedPostContent(): string;
  getEditedPostSlug(): string;
  getEditedPostVisibility(): 'private' | 'password' | 'public';
  getEditedPostPreviewLink(): string | undefined;

  getPostEdits(): Record<string, any>;
  getPermalink(): string | null;
  getPermalinkParts(): {
    prefix: string;
    postName: string;
    suffix: string;
  } | null;

  // Post State Selectors
  isSavingPost(): boolean;
  isAutosavingPost(): boolean;
  isPublishingPost(): boolean;
  isPreviewingPost(): boolean;
  isDeletingPost(): boolean;

  didPostSaveRequestSucceed(): boolean;
  didPostSaveRequestFail(): boolean;

  isEditedPostNew(): boolean;
  isEditedPostDirty(): boolean;
  isEditedPostEmpty(): boolean;
  isEditedPostSaveable(): boolean;
  isEditedPostPublishable(): boolean;
  isEditedPostAutosaveable(): boolean;
  isEditedPostBeingScheduled(): boolean;
  isEditedPostDateFloating(): boolean;

  isCurrentPostPublished(): boolean;
  isCurrentPostScheduled(): boolean;
  isCurrentPostPending(): boolean;
  isCleanNewPost(): boolean;

  // Post Status & Permissions
  canUserUseUnfilteredHTML(): boolean;
  isPermalinkEditable(): boolean;

  // Post Locking
  isPostLocked(): boolean;
  isPostLockTakeover(): boolean;
  isPostSavingLocked(): boolean;
  isPostAutosavingLocked(): boolean;
  getActivePostLock(): Record<string, any>;
  getPostLockUser(): Record<string, any>;

  // Content & Changes
  hasChangedContent(): boolean;
  hasNonPostEntityChanges(): boolean;
  isSavingNonPostEntityChanges(): boolean;

  // Editor State
  getEditorMode(): string;
  getRenderingMode(): string;
  getDeviceType(): string;
  getEditorSettings(): Record<string, any>;

  // History
  hasEditorUndo(): boolean;
  hasEditorRedo(): boolean;

  // UI State
  isEditorPanelEnabled(panelName: string): boolean;
  isEditorPanelOpened(panelName: string): boolean;
  isEditorPanelRemoved(panelName: string): boolean;
  isInserterOpened(): boolean;
  isListViewOpened(): boolean;
  isPublishSidebarOpened(): boolean;
  shouldShowPublishPanel(): boolean;

  // Post Type & Template
  getPostTypeLabel(): string | undefined;
  getSuggestedPostFormat(): string | null;
  getCurrentTemplateId(): string | null;

  // Block Editor Integration (delegated to core/block-editor)
  getBlocks(): any[];
  getBlock(clientId: string): any;
  getSelectedBlock(): any;
  getSelectedBlockClientId(): string | null;
  getSelectedBlockCount(): number;
  hasSelectedBlock(): boolean;
  hasMultiSelection(): boolean;
  getMultiSelectedBlocks(): any[];
  getMultiSelectedBlockClientIds(): string[];
  isBlockSelected(clientId: string): boolean;
  isBlockMultiSelected(clientId: string): boolean;
  getBlockCount(rootClientId?: string): number;
  getGlobalBlockCount(blockName?: string): number;
  getBlockName(clientId: string): string;
  getBlockAttributes(clientId: string): Record<string, any>;
  getBlockIndex(clientId: string, rootClientId?: string): number;
  getBlockOrder(rootClientId?: string): string[];
  getBlockRootClientId(clientId: string): string | null;
  getBlockHierarchyRootClientId(clientId: string): string;
  getAdjacentBlockClientId(clientId: string, modifier?: number): string | null;
  getPreviousBlockClientId(clientId: string): string | null;
  getNextBlockClientId(clientId: string): string | null;
  getBlocksByClientId(clientIds: string[]): any[];
  getClientIdsOfDescendants(rootClientIds: string[]): string[];
  getClientIdsWithDescendants(rootClientIds: string[]): string[];
  isBlockValid(clientId: string): boolean;
  isBlockWithinSelection(clientId: string): boolean;
  hasSelectedInnerBlock(clientId: string, deep?: boolean): boolean;
  isAncestorMultiSelected(clientId: string): boolean;
  getMultiSelectedBlocksStartClientId(): string | null;
  getMultiSelectedBlocksEndClientId(): string | null;
  getBlockSelectionStart(): any;
  getBlockSelectionEnd(): any;
  isMultiSelecting(): boolean;
  isSelectionEnabled(): boolean;
  getBlockInsertionPoint(): any;
  isBlockInsertionPointVisible(): boolean;
  isTyping(): boolean;
  isCaretWithinFormattedText(): boolean;
  getBlockMode(clientId: string): string;
  isBlockHighlighted(clientId: string): boolean;
  getLastMultiSelectedBlockClientId(): string | null;
  getFirstMultiSelectedBlockClientId(): string | null;
  canInsertBlockType(blockName: string, rootClientId?: string): boolean;
  getInserterItems(rootClientId?: string): any[];
  hasInserterItems(rootClientId?: string): boolean;
  getBlockListSettings(clientId: string): any;
  getTemplate(): any[];
  getTemplateLock(rootClientId?: string): string | undefined;
  isValidTemplate(): boolean;
  getEditorBlocks(): any[];
  getEditorSelection(): any;
}

interface WPDataSelect {
  (storeName: 'core/editor'): WPCoreEditorStore | null;
}

interface WPDataSubscribe {
  (callback: () => void): () => void;
}

interface WPData {
  select: WPDataSelect;
  subscribe: WPDataSubscribe;
}

interface WP {
  data: WPData;
}

declare const wp: WP;
