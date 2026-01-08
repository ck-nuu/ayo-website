'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitContactForm(formData: FormData) {
    const supabase = await createClient()
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string

    if (!name || !email || !message) {
        return { error: 'Please fill in all fields' }
    }

    const { error } = await supabase
        .from('contacts')
        .insert({ name, email, message })

    if (error) {
        console.error('Contact submission error:', error)
        return { error: 'Failed to send message. Please try again.' }
    }

    return { success: 'Message sent successfully!' }
}

export async function subscribeNewsletter(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string

    if (!email) {
        return { error: 'Email is required' }
    }

    // Check if already subscribed (optional, but good UX)
    // Simple insert will fail if unique constraint is hit, which we have on email column
    const { error } = await supabase
        .from('subscribers')
        .insert({ email })

    if (error) {
        if (error.code === '23505') { // Unique violation
            return { error: 'You are already subscribed!' }
        }
        console.error('Newsletter error:', error)
        return { error: 'Failed to subscribe. Please try again.' }
    }

    revalidatePath('/')
    return { success: 'Successfully subscribed!' }
}

export async function submitBookingRequest(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const event_type = formData.get('event_type') as string
    const event_date = formData.get('event_date') as string
    const message = formData.get('message') as string

    if (!name || !email || !event_type) {
        return { error: 'Please fill in required fields' }
    }

    const { error } = await supabase
        .from('bookings')
        .insert({
            name,
            email,
            event_type,
            event_date: event_date || null,
            message,
            status: 'pending'
        })

    if (error) {
        console.error('Booking submission error:', error)
        return { error: 'Failed to submit booking request.' }
    }

    return { success: 'Booking request sent! We will contact you soon.' }
}
