/**
 * Everything the window can ask the app to do.
 *
 * Note what is not here: no prompt body reaches the main screen. `listRecipes`
 * deliberately returns everything *except* the prompt, and `getRecipe` — the
 * only way to see one — is called from the editor alone.
 */
import { invoke } from '@tauri-apps/api/core'

export type RecipeView = {
  id: string
  name: string
  purpose: string
  explanation: string
  icon: string
  accent: string
  enabled: boolean
  order: number
  builtin: boolean
  /** A built-in the user has edited, so "reset" is worth offering. */
  modified: boolean
  fileName: string
}

export type Recipe = {
  id: string
  name: string
  purpose: string
  explanation: string
  prompt: string
  icon: string
  accent: string
  enabled: boolean
  order: number
  origin: string | null
}

export type RecipeInput = {
  id?: string
  name: string
  purpose: string
  explanation: string
  prompt: string
  icon: string
  accent: string
}

export type Settings = {
  alwaysOnTop: boolean
  showTray: boolean
  launchAtLogin: boolean
  selectedRecipe: string | null
  seenIntro: boolean
}

export type Preset = { id: string; label: string; value: string }
export type PourOutcome = 'dropped' | 'cancelled'

export const listRecipes = (enabledOnly: boolean) =>
  invoke<RecipeView[]>('list_recipes', { enabledOnly })

export const getRecipe = (id: string) => invoke<Recipe>('get_recipe', { id })
export const saveRecipe = (input: RecipeInput) => invoke<RecipeView>('save_recipe', { input })
export const duplicateRecipe = (id: string) => invoke<RecipeView>('duplicate_recipe', { id })
export const deleteRecipe = (id: string) => invoke<void>('delete_recipe', { id })
export const resetRecipe = (id: string) => invoke<RecipeView>('reset_recipe', { id })
export const setRecipeEnabled = (id: string, enabled: boolean) =>
  invoke<void>('set_recipe_enabled', { id, enabled })
export const reorderRecipes = (ids: string[]) => invoke<void>('reorder_recipes', { ids })

export const iconPresets = () => invoke<Preset[]>('icon_presets')
export const accentPresets = () => invoke<Preset[]>('accent_presets')

export const exportRecipes = (path: string) => invoke<string>('export_recipes', { path })
export const importRecipes = (path: string) => invoke<number>('import_recipes', { path })

export const getSettings = () => invoke<Settings>('get_settings')
export const selectRecipe = (id: string) => invoke<void>('select_recipe', { id })
export const markIntroSeen = () => invoke<void>('mark_intro_seen')
export const setAlwaysOnTop = (enabled: boolean) => invoke<void>('set_always_on_top', { enabled })
export const setShowTray = (enabled: boolean) => invoke<void>('set_show_tray', { enabled })
export const setLaunchAtLogin = (enabled: boolean) =>
  invoke<void>('set_launch_at_login', { enabled })
export const resetWindowSize = () => invoke<void>('reset_window_size')
export const resetWindowPosition = () => invoke<void>('reset_window_position')
export const closeWindow = () => invoke<void>('close_window')
export const configPath = () => invoke<string>('config_path')

export const pour = (recipeId: string) => invoke<PourOutcome>('pour', { recipeId })

/** Hex for an accent id, with a sane fallback if the presets have not loaded. */
export function accentHex(presets: Preset[], id: string): string {
  return presets.find((p) => p.id === id)?.value ?? '#8C5A3B'
}
