'use client'

import { useState, useEffect } from 'react'
import { Archive, Clock, Edit2 } from 'lucide-react'
import { useText2ReelStore, type Scene } from '@/store/useText2ReelStore'

interface Project {
    id: string
    name: string
    scenes: Scene[]
    createdAt: string
    updatedAt: string
}

export default function ProjectsList({ onProjectLoaded }: { onProjectLoaded: (id: string) => void }) {
    const { setScenes } = useText2ReelStore()
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/projects')
                if (!res.ok) throw new Error('Failed to fetch projects')
                const data = await res.json()
                setProjects(data)
            } catch (err) {
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProjects()
    }, [])

    const handleLoadProject = (project: Project) => {
        setScenes(project.scenes)
        onProjectLoaded(project.id)
    }

    return (
        <section className="flex-1 flex flex-col overflow-y-auto border-r border-primary/10 p-6 lg:p-8 space-y-8 atmospheric-glow relative z-10 custom-scrollbar shadow-inner">
            <div className="flex items-center gap-3 border-b border-primary/10 pb-6">
                <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                    <Archive className="text-primary" />
                </div>
                <div>
                    <h2 className="font-display text-2xl font-bold text-[#FFD9CC] uppercase tracking-widest">My Projects</h2>
                    <p className="text-slate-400 text-xs italic">Load and edit previously saved cinematic reels</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center flex-1 text-slate-500 italic opacity-50 space-y-4">
                    <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p>Loading projects...</p>
                </div>
            ) : projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-slate-500 italic opacity-50 space-y-4">
                    <Archive size={64} className="opacity-20" />
                    <p>No projects saved yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                    {projects.map((project) => (
                        <div key={project.id} className="glass-panel p-5 rounded-3xl border border-primary/10 hover:border-primary/30 transition-all group flex flex-col justify-between h-48">
                            <div>
                                <h3 className="text-lg font-bold text-[#FFD9CC] uppercase tracking-wide truncate">{project.name}</h3>
                                <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1 font-bold uppercase tracking-widest">
                                    <Clock size={10} /> {new Date(project.updatedAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-[10px] uppercase font-bold tracking-widest">
                                    {project.scenes.length} Scenes
                                </span>
                            </div>

                            <button
                                onClick={() => handleLoadProject(project)}
                                className="mt-4 w-full bg-primary/20 hover:bg-primary text-primary hover:text-background-dark border border-primary/30 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                            >
                                <Edit2 size={12} /> Load Project
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}
