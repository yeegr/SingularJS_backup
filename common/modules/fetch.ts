// fetch configurations
interface IFetch {
  [key: string]: {
    method: string
    headers?: {
      Accept?: string
      'Content-Type': string
    }
  }
}

export const FETCH: IFetch = {
  GET: {
    method: 'GET'
  },

  POST: {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
  },

  UPDATE: {
    method: 'UPDATE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },

  PUT: {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },

  DELETE: {
    method: 'DELETE'
  },

  UPLOAD: {
    method: 'PUT',
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  }
}
