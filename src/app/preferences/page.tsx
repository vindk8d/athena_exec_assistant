'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Preferences() {
  const [workingHours, setWorkingHours] = useState({
    start: '09:00',
    end: '17:00',
  })
  const [preferredMeetingDuration, setPreferredMeetingDuration] = useState(30)
  const [bufferTime, setBufferTime] = useState(15)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/auth/signin')
        }
      } catch (error) {
        console.error('Session check error:', error)
        router.push('/auth/signin')
      }
    }
    checkSession()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Save preferences to database
    console.log('Saving preferences:', {
      workingHours,
      preferredMeetingDuration,
      bufferTime,
    })
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Preferences</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Working Hours</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start-time" className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                id="start-time"
                value={workingHours.start}
                onChange={(e) => setWorkingHours({ ...workingHours, start: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="end-time" className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="time"
                id="end-time"
                value={workingHours.end}
                onChange={(e) => setWorkingHours({ ...workingHours, end: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Meeting Settings</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="meeting-duration" className="block text-sm font-medium text-gray-700">
                Preferred Meeting Duration (minutes)
              </label>
              <select
                id="meeting-duration"
                value={preferredMeetingDuration}
                onChange={(e) => setPreferredMeetingDuration(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>
            <div>
              <label htmlFor="buffer-time" className="block text-sm font-medium text-gray-700">
                Buffer Time Between Meetings (minutes)
              </label>
              <select
                id="buffer-time"
                value={bufferTime}
                onChange={(e) => setBufferTime(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  )
} 