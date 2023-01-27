import { AntelopeSection } from './../model/AntelopeSection';
import { defineStore } from 'pinia'

export const useSectionStore = defineStore('section', {
  state: (): AntelopeSection[] => ([]),
})
