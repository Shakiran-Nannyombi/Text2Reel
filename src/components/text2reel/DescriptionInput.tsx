'use client'

import { useForm } from '@tanstack/react-form'
import type { FieldApi } from '@tanstack/react-form'
import { useText2ReelStore } from '@/store/useText2ReelStore'

function FieldInfo({ field }: { field: any }) {
    return (
        <>
            {field.state.meta.touchedErrors ? (
                <em className="text-red-500 text-sm absolute -bottom-6 left-0">{field.state.meta.touchedErrors}</em>
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
            >
                <form.Field
                    name="description"
                    validators={{
                        onChange: ({ value }) =>
                            !value ? 'A description is required' : undefined,
                    }}
                >
                    {(field) => (
                        <div className="relative">
                            <textarea
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="Describe your video idea..."
                                className="w-full h-24 bg-black/40 text-[#FFD9CC] p-4 rounded-2xl border border-[#F79A7A]/30 focus:border-[#F79A7A] focus:ring-1 focus:ring-[#F79A7A] outline-none transition-all placeholder:text-gray-600 resize-none font-sans text-base backdrop-blur-sm"
                                disabled={isLoading}
                            />
                            <FieldInfo field={field} />

                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="text-[10px] text-[#F79A7A] uppercase tracking-wider font-extrabold py-1">Try:</span>
                                {[
                                    "A futuristic tech intro",
                                    "A calm nature scene",
                                    "A high-energy gym intro",
                                ].map((prompt) => (
                                    <button
                                        key={prompt}
                                        type="button"
                                        onClick={() => field.handleChange(prompt)}
                                        className="text-xs bg-[#F79A7A]/10 hover:bg-[#F79A7A]/20 border border-[#F79A7A]/20 text-[#FFD9CC] px-4 py-1.5 rounded-full transition-all cursor-pointer hover:scale-105 active:scale-95"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </form.Field>
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 bg-[#F79A7A] hover:bg-[#FBC3AD] active:bg-[#E56F4C] disabled:opacity-50 disabled:cursor-not-allowed text-black font-extrabold rounded-xl transition-all shadow-[0_0_20px_rgba(247,154,122,0.3)] hover:shadow-[0_0_30px_rgba(247,154,122,0.5)] transform hover:-translate-y-0.5"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                Generating...
                            </div>
                        ) : 'Generate Scenes'}
                    </button>
                </div>
            </form>
        </div>
    )
}
