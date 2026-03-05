'use client'

import { useForm, FieldApi } from '@tanstack/react-form'
import { useText2ReelStore } from '@/store/useText2ReelStore'
import { MusicNote, Palette, Schedule, Bolt } from '@mui/icons-material'

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
    return (
        <>
            {field.state.meta.touchedErrors ? (
                <em className="text-red-500 text-[10px] absolute -bottom-5 left-4 font-bold uppercase tracking-wider">{field.state.meta.touchedErrors}</em>
            ) : null}
        </>
    )
}

interface DescriptionInputProps {
    onSubmit: (data: { description: string }) => void
}

export default function DescriptionInput({ onSubmit }: DescriptionInputProps) {
    const { isLoading } = useText2ReelStore()

    const form = useForm({
        defaultValues: {
            description: '',
        },
        onSubmit: async ({ value }) => {
            onSubmit(value)
        },
    })

    return (
        <div className="w-full">
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
                className="flex flex-col"
            >
                <form.Field
                    name="description"
                    validators={{
                        onChange: ({ value }) =>
                            !value ? 'The vision is empty...' : undefined,
                    }}
                >
                    {(field) => (
                        <div className="relative">
                            <textarea
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="Describe 'The Vision' for your cinematic scene here..."
                                className="w-full bg-transparent border-none focus:ring-0 p-6 text-[#FFD9CC] placeholder:text-slate-600 resize-none min-h-[160px] text-lg leading-relaxed font-sans scrollbar-hide"
                                disabled={isLoading}
                            />
                            <FieldInfo field={field} />

                            <div className="flex items-center justify-between p-4 bg-primary/5 border-t border-primary/10">
                                <div className="flex items-center gap-4">
                                    <button type="button" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5 group">
                                        <MusicNote fontSize="small" className="group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Beat Sync</span>
                                    </button>
                                    <button type="button" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5 group">
                                        <Palette fontSize="small" className="group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Mood</span>
                                    </button>
                                    <button type="button" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5 group">
                                        <Schedule fontSize="small" className="group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Duration</span>
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-primary/20 text-primary border border-primary/30 font-black px-5 py-2 rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-primary/30 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="size-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            Igniting...
                                        </div>
                                    ) : (
                                        <>
                                            <Bolt fontSize="small" />
                                            Generate Blueprint
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </form.Field>
            </form>
        </div>
    )
}
