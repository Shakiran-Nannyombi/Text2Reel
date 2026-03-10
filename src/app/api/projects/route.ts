import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic';

// POST /api/projects/save — save or update a project
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, scenes, id } = body as { name?: string; scenes: unknown[]; id?: string }

        if (!scenes || !Array.isArray(scenes)) {
            return NextResponse.json({ error: 'scenes array is required' }, { status: 400 })
        }

        const scenesJson = JSON.stringify(scenes)

        const project = id
            ? await prisma.project.upsert({
                where: { id },
                update: { name: name ?? 'Untitled Reel', scenes: scenesJson, updatedAt: new Date() },
                create: { id, name: name ?? 'Untitled Reel', scenes: scenesJson },
            })
            : await prisma.project.create({
                data: { name: name ?? 'Untitled Reel', scenes: scenesJson },
            })

        return NextResponse.json({ ok: true, project: { ...project, scenes: JSON.parse(project.scenes) } })
    } catch (err) {
        console.error('[projects/save] error:', err)
        return NextResponse.json({ error: 'Failed to save project', details: err instanceof Error ? err.message : String(err) }, { status: 500 })
    }
}

// GET /api/projects — list all saved projects
export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { updatedAt: 'desc' },
        })
        return NextResponse.json(
            projects.map((p) => ({ ...p, scenes: JSON.parse(p.scenes) }))
        )
    } catch (err) {
        console.error('[projects] error:', err)
        return NextResponse.json({ error: 'Failed to load projects' }, { status: 500 })
    }
}
