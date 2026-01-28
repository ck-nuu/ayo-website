'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'

export async function getPortfolioItems() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false })
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching portfolio items:', error)
        return []
    }

    return data
}

export async function getPortfolioItemWithImages(id: string) {
    const supabase = await createClient()

    const { data: item, error: itemError } = await supabase
        .from('portfolio')
        .select('*')
        .eq('id', id)
        .single()

    if (itemError || !item) {
        return null
    }

    const { data: images, error: imagesError } = await supabase
        .from('portfolio_images')
        .select('*')
        .eq('portfolio_id', id)
        .order('sort_order', { ascending: true })

    if (imagesError) {
        console.error('Error fetching portfolio images:', imagesError)
    }

    return {
        ...item,
        additional_images: images || []
    }
}

async function uploadImage(supabase: any, file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(fileName, file)

    if (uploadError) {
        console.error('Error uploading image:', uploadError)
        return null
    }

    const { data: publicUrlData } = supabase.storage
        .from('portfolio')
        .getPublicUrl(fileName)

    return publicUrlData.publicUrl
}

export async function createPortfolioItem(formData: FormData) {
    const supabase = await createClient()

    // Auth check
    console.log('[Portfolio] Starting createPortfolioItem...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        console.error('[Portfolio] Auth error:', authError)
        return { error: 'Unauthorized' }
    }
    console.log('[Portfolio] User authenticated:', user.id)

    const title = formData.get('title') as string
    const discipline = formData.get('discipline') as string
    const subcategory = formData.get('subcategory') as string
    const year = formData.get('year') as string
    const link = formData.get('link') as string | null
    const association = formData.get('association') as string | null
    const coverImage = formData.get('image') as File
    const additionalImages = formData.getAll('additional_images') as File[]

    console.log('[Portfolio] Form data:', { title, discipline, subcategory, year, link, association })
    console.log('[Portfolio] Cover image:', coverImage?.name, coverImage?.size)

    if (!title || !discipline || !subcategory || !year || !coverImage) {
        console.error('[Portfolio] Missing required fields')
        return { error: 'Missing required fields' }
    }

    // Check if coverImage is a valid file
    if (!coverImage || coverImage.size === 0) {
        console.error('[Portfolio] Cover image is empty or invalid')
        return { error: 'Cover image is required' }
    }

    // Upload cover image
    console.log('[Portfolio] Uploading cover image...')
    const image_url = await uploadImage(supabase, coverImage)
    if (!image_url) {
        console.error('[Portfolio] Failed to upload cover image')
        return { error: 'Failed to upload cover image' }
    }
    console.log('[Portfolio] Cover image uploaded:', image_url)

    // Insert portfolio record
    console.log('[Portfolio] Inserting portfolio record...')
    const { data: newItem, error: insertError } = await supabase
        .from('portfolio')
        .insert({
            title,
            discipline,
            subcategory,
            year,
            image_url,
            link,
            association
        })
        .select('id')
        .single()

    if (insertError || !newItem) {
        console.error('[Portfolio] Error creating portfolio item:', insertError)
        return { error: 'Failed to create portfolio item: ' + (insertError?.message || 'Unknown error') }
    }
    console.log('[Portfolio] Portfolio item created:', newItem.id)

    // Upload additional images
    if (additionalImages.length > 0) {
        const validFiles = additionalImages.filter(f => f.size > 0)
        for (let i = 0; i < validFiles.length; i++) {
            const imgUrl = await uploadImage(supabase, validFiles[i])
            if (imgUrl) {
                await supabase.from('portfolio_images').insert({
                    portfolio_id: newItem.id,
                    image_url: imgUrl,
                    sort_order: i
                })
            }
        }
    }

    revalidatePath('/admin/portfolio')
    return { success: true }
}

export async function updatePortfolioItem(id: string, formData: FormData) {
    const supabase = await createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    const title = formData.get('title') as string
    const discipline = formData.get('discipline') as string
    const subcategory = formData.get('subcategory') as string
    const year = formData.get('year') as string
    const link = formData.get('link') as string | null
    const association = formData.get('association') as string | null
    const coverImage = formData.get('image') as File | null
    const additionalImages = formData.getAll('additional_images') as File[]

    const updates: Record<string, unknown> = {
        title,
        discipline,
        subcategory,
        year,
        link,
        association,
        updated_at: new Date().toISOString()
    }

    // Handle new cover image
    if (coverImage && coverImage.size > 0) {
        const newCoverUrl = await uploadImage(supabase, coverImage)
        if (newCoverUrl) {
            updates.image_url = newCoverUrl
        }
    }

    const { error: updateError } = await supabase
        .from('portfolio')
        .update(updates)
        .eq('id', id)

    if (updateError) {
        return { error: 'Failed to update portfolio item' }
    }

    // Upload new additional images
    if (additionalImages.length > 0) {
        const validFiles = additionalImages.filter(f => f.size > 0)
        // Get current max sort_order
        const { data: existingImages } = await supabase
            .from('portfolio_images')
            .select('sort_order')
            .eq('portfolio_id', id)
            .order('sort_order', { ascending: false })
            .limit(1)

        let nextOrder = (existingImages && existingImages.length > 0)
            ? existingImages[0].sort_order + 1
            : 0

        for (const file of validFiles) {
            const imgUrl = await uploadImage(supabase, file)
            if (imgUrl) {
                await supabase.from('portfolio_images').insert({
                    portfolio_id: id,
                    image_url: imgUrl,
                    sort_order: nextOrder++
                })
            }
        }
    }

    revalidatePath('/admin/portfolio')
    revalidatePath(`/admin/portfolio/${id}`)
    return { success: true }
}

export async function deletePortfolioItem(id: string, imageUrl: string) {
    const supabase = await createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    // Get all images for this portfolio item
    const { data: allImages } = await supabase
        .from('portfolio_images')
        .select('image_url')
        .eq('portfolio_id', id)

    // Delete all images from storage (cover + additional)
    const imagesToDelete = [imageUrl, ...(allImages?.map(i => i.image_url) || [])]
    for (const url of imagesToDelete) {
        const urlParts = url.split('/')
        const fileName = urlParts[urlParts.length - 1]
        if (fileName) {
            await supabase.storage.from('portfolio').remove([fileName])
        }
    }

    // Delete record (cascade will handle portfolio_images)
    const { error: deleteError } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id)

    if (deleteError) {
        return { error: 'Failed to delete portfolio item' }
    }

    revalidatePath('/admin/portfolio')
    return { success: true }
}

export async function deletePortfolioImage(imageId: string, imageUrl: string) {
    const supabase = await createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    // Delete from storage
    const urlParts = imageUrl.split('/')
    const fileName = urlParts[urlParts.length - 1]
    if (fileName) {
        await supabase.storage.from('portfolio').remove([fileName])
    }

    // Delete record
    const { error: deleteError } = await supabase
        .from('portfolio_images')
        .delete()
        .eq('id', imageId)

    if (deleteError) {
        return { error: 'Failed to delete image' }
    }

    revalidatePath('/admin/portfolio')
    return { success: true }
}

// ============================================
// TUS Upload Support - Actions that accept pre-uploaded URLs
// ============================================

/**
 * Get access token for TUS uploads
 * This is needed for client-side TUS authentication
 */
export async function getAccessToken() {
    const supabase = await createClient()

    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
        return { error: 'Not authenticated' }
    }

    return { accessToken: session.access_token }
}

/**
 * Create portfolio item with pre-uploaded image URLs (for TUS uploads)
 */
export async function createPortfolioItemWithUrls(data: {
    title: string
    discipline: string
    subcategory: string
    year: string
    month?: number | null
    link?: string | null
    association?: string | null
    coverImageUrl: string
    additionalImageUrls?: string[]
}) {
    const supabase = await createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    if (!data.title || !data.discipline || !data.subcategory || !data.year || !data.coverImageUrl) {
        return { error: 'Missing required fields' }
    }

    // Insert portfolio record
    const { data: newItem, error: insertError } = await supabase
        .from('portfolio')
        .insert({
            title: data.title,
            discipline: data.discipline,
            subcategory: data.subcategory,
            year: data.year,
            month: data.month || 1,
            image_url: data.coverImageUrl,
            link: data.link,
            association: data.association
        })
        .select('id')
        .single()

    if (insertError || !newItem) {
        console.error('[Portfolio] Error creating portfolio item:', insertError)
        return { error: 'Failed to create portfolio item: ' + (insertError?.message || 'Unknown error') }
    }

    // Insert additional images
    if (data.additionalImageUrls && data.additionalImageUrls.length > 0) {
        for (let i = 0; i < data.additionalImageUrls.length; i++) {
            await supabase.from('portfolio_images').insert({
                portfolio_id: newItem.id,
                image_url: data.additionalImageUrls[i],
                sort_order: i
            })
        }
    }

    revalidatePath('/admin/portfolio')
    return { success: true, id: newItem.id }
}

/**
 * Update portfolio item with pre-uploaded image URLs (for TUS uploads)
 */
export async function updatePortfolioItemWithUrls(
    id: string,
    data: {
        title: string
        discipline: string
        subcategory: string
        year: string
        month?: number | null
        link?: string | null
        association?: string | null
        newCoverImageUrl?: string | null
        newAdditionalImageUrls?: string[]
    }
) {
    const supabase = await createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    const updates: Record<string, unknown> = {
        title: data.title,
        discipline: data.discipline,
        subcategory: data.subcategory,
        year: data.year,
        month: data.month || 1,
        link: data.link,
        association: data.association,
        updated_at: new Date().toISOString()
    }

    // Update cover image if new one provided
    if (data.newCoverImageUrl) {
        updates.image_url = data.newCoverImageUrl
    }

    const { error: updateError } = await supabase
        .from('portfolio')
        .update(updates)
        .eq('id', id)

    if (updateError) {
        return { error: 'Failed to update portfolio item' }
    }

    // Add new additional images
    if (data.newAdditionalImageUrls && data.newAdditionalImageUrls.length > 0) {
        // Get current max sort_order
        const { data: existingImages } = await supabase
            .from('portfolio_images')
            .select('sort_order')
            .eq('portfolio_id', id)
            .order('sort_order', { ascending: false })
            .limit(1)

        let nextOrder = (existingImages && existingImages.length > 0)
            ? existingImages[0].sort_order + 1
            : 0

        for (const imgUrl of data.newAdditionalImageUrls) {
            await supabase.from('portfolio_images').insert({
                portfolio_id: id,
                image_url: imgUrl,
                sort_order: nextOrder++
            })
        }
    }

    revalidatePath('/admin/portfolio')
    revalidatePath(`/admin/portfolio/${id}`)
    return { success: true }
}
