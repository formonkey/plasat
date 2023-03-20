import create from 'zustand'

export const useGlobalStore = create(set => ({
    configuration: null,
    updateConfiguration: (configuration: any) => set(() => ({configuration})),
}))
