export type File = {
  name: string
  path: string
  is_supported: boolean
  content: string
  extension: string
}

export type Directory = {
  name: string
  path: string
  directories: Directory[]
  files: File[]
}

export type Plan = {}

export async function saveFileByPath({ path, body = '' }: any) {
  return await fetchApi<File>(`files/${path}`, { method: 'post', body })
}

export async function getContext() {
  return await fetchApi<{
    models: Array<string>
    engine_adapter: string
    path: string
    dialect: string
    scheduler: string
    time_column_format: string
    concurrent_tasks: number
  }>('context')
}

export async function getContextByEnvironment(environment: string = '') {
  return await fetchApi<{
    environment: string
    backfills: Array<[string, string]>,
    changes: {
      added: Array<string>,
      removed: Array<string>,
      modified: Array<string>,
    }
  }>(`plan${environment ? `?environment=${environment}` : ''}`)
}

type FetchResponse<T> = Promise<T | null>

async function fetchApi<T = unknown>(
  path: Path,
  options: RequestInit = { method: 'GET' }
): FetchResponse<T> {
  const host = window.location.origin
  // Ensure that the final string does not contain any unnecessary or duplicate slashes
  const destination = `/api/${path}`.replace(/([^:]\/)\/+/g, '$1')
  const url = new URL(destination, host)

  try {
    const response = await fetch(url, options)

    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error(error)
  }

  return null
}