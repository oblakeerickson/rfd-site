/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, you can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright Oxide Computer Company
 */

import { data, type ActionFunction } from 'react-router'

import { themeCookie } from '~/services/cookies.server'

// Theme can be 'light', 'dark', or null (meaning follow system preference)
export type Theme = 'light' | 'dark' | null

export const action: ActionFunction = async ({ request }) => {
  const currentTheme: Theme =
    (await themeCookie.parse(request.headers.get('Cookie'))) ?? null

  // Get the user's system preference from the request header (set by client-side script)
  const formData = await request.formData()
  const systemPreference = formData.get('systemPreference') as 'light' | 'dark' | null

  // Determine the effective current theme (what the user is seeing)
  const effectiveTheme = currentTheme ?? systemPreference ?? 'dark'

  // Toggle to the opposite theme
  const newTheme: Theme = effectiveTheme === 'light' ? 'dark' : 'light'

  const headers = new Headers()
  headers.append('Cache-Control', 'no-cache')
  headers.append('Set-Cookie', await themeCookie.serialize(newTheme))

  return data(null, { headers })
}
