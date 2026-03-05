'use client'

import * as React from 'react'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { useText2ReelStore } from '@/store/useText2ReelStore'
import type { Scene } from '@/store/useText2ReelStore'

const columnHelper = createColumnHelper<Scene>()

export default function SceneTable() {
    const { scenes, updateScene } = useText2ReelStore()

    const columns = [
        columnHelper.accessor('text', {
            header: 'Text Overlay',
            cell: (info) => (
                <input
                    value={info.getValue()}
                    onChange={(e) => {
                        const newScene = { ...info.row.original, text: e.target.value }
                        updateScene(info.row.index, newScene)
                    }}
                    className="w-full bg-transparent border-b border-transparent focus:border-[#F79A7A] outline-none text-white py-1 transition-all"
                />
            ),
        }),
        columnHelper.accessor('duration', {
            header: 'Duration (s)',
            cell: (info) => (
                <input
                    type="number"
                    value={info.getValue()}
                    onChange={(e) => {
                        const newScene = { ...info.row.original, duration: Number(e.target.value) }
                        updateScene(info.row.index, newScene)
                    }}
                    className="w-20 bg-transparent border-b border-transparent focus:border-[#F79A7A] outline-none text-white py-1 transition-all"
                />
            ),
        }),
        columnHelper.accessor('color', {
            header: 'Bg Color',
            cell: (info) => (
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={info.getValue()}
                        onChange={(e) => {
                            const newScene = { ...info.row.original, color: e.target.value }
                            updateScene(info.row.index, newScene)
                        }}
                        className="w-8 h-8 rounded cursor-pointer border-none bg-transparent p-0"
                    />
                    <span className="text-gray-400 text-xs font-mono">{info.getValue()}</span>
                </div>
            ),
        }),
        columnHelper.accessor('icon', {
            header: 'Icon',
            cell: (info) => (
                <input
                    value={info.getValue() || ''}
                    onChange={(e) => {
                        const newScene = { ...info.row.original, icon: e.target.value }
                        updateScene(info.row.index, newScene)
                    }}
                    placeholder="e.g. Rocket"
                    className="w-24 bg-transparent border-b border-transparent focus:border-[#F79A7A] outline-none text-white py-1 transition-all text-sm"
                />
            ),
        }),
        columnHelper.accessor('animationStyle', {
            header: 'Animation',
            cell: (info) => (
                <input
                    value={info.getValue() || ''}
                    onChange={(e) => {
                        const newScene = { ...info.row.original, animationStyle: e.target.value }
                        updateScene(info.row.index, newScene)
                    }}
                    placeholder="e.g. particles"
                    className="w-24 bg-transparent border-b border-transparent focus:border-[#F79A7A] outline-none text-white py-1 transition-all text-xs"
                />
            ),
        }),
        columnHelper.accessor('imageUrl', {
            header: 'Background Image',
            cell: (info) => (
                <div className="flex items-center gap-2">
                    <input
                        value={info.getValue() || ''}
                        onChange={(e) => {
                            const newScene = { ...info.row.original, imageUrl: e.target.value }
                            updateScene(info.row.index, newScene)
                        }}
                        placeholder="Paste link..."
                        className="w-32 bg-transparent border-b border-transparent focus:border-[#F79A7A] outline-none text-white py-1 transition-all text-xs truncate"
                    />
                    <label className="cursor-pointer hover:text-[#F79A7A] transition-colors">
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                    // Simulated upload: in a real app, this would upload to S3/Cloudinary
                                    const reader = new FileReader()
                                    reader.onload = (event) => {
                                        const newScene = { ...info.row.original, imageUrl: event.target?.result as string }
                                        updateScene(info.row.index, newScene)
                                    }
                                    reader.readAsDataURL(file)
                                }
                            }}
                            accept="image/*"
                        />
                        <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded border border-white/20 whitespace-nowrap">UPLOAD</span>
                    </label>
                    {info.getValue() && (
                        <button
                            onClick={() => {
                                const newScene = { ...info.row.original, imageUrl: '' }
                                updateScene(info.row.index, newScene)
                            }}
                            className="text-red-400 hover:text-red-500 text-xs font-bold leading-none p-1"
                            title="Clear Image"
                        >
                            ✕
                        </button>
                    )}
                </div>
            ),
        }),
    ]

    const table = useReactTable({
        data: scenes,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-[#F79A7A]/20 bg-black/40 backdrop-blur-md flex flex-col">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead className="bg-[#F79A7A]/10 text-[#F79A7A]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="p-4 font-extrabold text-xs tracking-widest uppercase border-b border-[#F79A7A]/20">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-[#F79A7A]/10">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-[#F79A7A]/5 transition-colors">
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="p-4 text-sm text-[#FFD9CC]">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {scenes.length === 0 && (
                    <div className="p-12 text-center text-[#FFD9CC]/40 italic text-sm tracking-wide">
                        Your generated scenes will appear here...
                    </div>
                )}
            </div>
        </div>
    )
}
