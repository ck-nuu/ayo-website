'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'

// Types for site content sections
export interface HeroContent {
    title_line1: string
    title_line2: string
    tagline: string
    image_url: string
}

export interface AboutIntroContent {
    heading: string
    bio: string
    quote: string
    image_url: string
}

export interface DisciplineItem {
    title: string
    description: string
}

export interface AboutDisciplinesContent {
    items: DisciplineItem[]
}

export interface ExperienceItem {
    year: string
    title: string
}

export interface AboutExperienceContent {
    items: ExperienceItem[]
}

export interface AboutCtaContent {
    heading: string
    subtitle: string
    button_text: string
    button_link: string
}

// Get content by section key
export async function getSiteContent<T>(sectionKey: string): Promise<T | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', sectionKey)
        .single()

    if (error || !data) {
        console.error('Error fetching site content:', error)
        return null
    }

    return data.content as T
}

// Get all site content
export async function getAllSiteContent() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('site_content')
        .select('*')

    if (error) {
        console.error('Error fetching all site content:', error)
        return []
    }

    return data
}

// Update site content (upsert)
export async function updateSiteContent(sectionKey: string, content: object) {
    const supabase = await createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    // Check if record exists
    const { data: existing } = await supabase
        .from('site_content')
        .select('id')
        .eq('section_key', sectionKey)
        .single()

    if (existing) {
        // Update
        const { error: updateError } = await supabase
            .from('site_content')
            .update({
                content,
                updated_at: new Date().toISOString()
            })
            .eq('section_key', sectionKey)

        if (updateError) {
            console.error('Error updating site content:', updateError)
            return { error: 'Failed to update content' }
        }
    } else {
        // Insert
        const { error: insertError } = await supabase
            .from('site_content')
            .insert({
                section_key: sectionKey,
                content
            })

        if (insertError) {
            console.error('Error inserting site content:', insertError)
            return { error: 'Failed to create content' }
        }
    }

    // Revalidate affected pages
    revalidatePath('/')
    revalidatePath('/about')
    revalidatePath('/admin/site-content')

    return { success: true }
}

// Upload image for site content
export async function uploadSiteImage(formData: FormData): Promise<{ url?: string; error?: string }> {
    const supabase = await createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    const file = formData.get('file') as File
    if (!file || file.size === 0) {
        return { error: 'No file provided' }
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `site-content/${uuidv4()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(fileName, file)

    if (uploadError) {
        console.error('Error uploading image:', uploadError)
        return { error: 'Failed to upload image' }
    }

    const { data: publicUrlData } = supabase.storage
        .from('portfolio')
        .getPublicUrl(fileName)

    return { url: publicUrlData.publicUrl }
}
