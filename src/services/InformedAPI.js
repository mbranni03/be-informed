import { API_BASE_URL } from 'src/config'

class InformedAPIError extends Error {
  constructor(message, isOffline = false) {
    super(message)
    this.name = 'InformedAPIError'
    this.isOffline = isOffline
  }
}

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))

      // Treat 404 as "endpoint not available" - likely backend not configured
      if (response.status === 404) {
        throw new InformedAPIError(
          `Endpoint not found: ${endpoint}. Ensure the backend /learn plugin is running.`,
          true, // treat as offline for UI purposes
        )
      }

      throw new InformedAPIError(error.error || `Request failed: ${response.status}`)
    }

    // Handle text responses (e.g., Mermaid graph)
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('text/plain')) {
      return await response.text()
    }

    return response.json()
  } catch (error) {
    // Re-throw our custom errors
    if (error instanceof InformedAPIError) {
      throw error
    }

    // Handle network errors (backend not running)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new InformedAPIError(
        'Cannot connect to learning server. Please ensure the backend is running on localhost:3000.',
        true,
      )
    }
    throw error
  }
}

export async function getStateCandidates(state, office, district) {
  const params = new URLSearchParams()
  if (office) params.append('office', office)
  if (district) params.append('district', district)

  const queryString = params.toString()
  const endpoint = `/candidates/${state}${queryString ? `?${queryString}` : ''}`

  return await apiRequest(endpoint)
}

export { InformedAPIError }
