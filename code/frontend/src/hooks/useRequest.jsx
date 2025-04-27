const useRequest = () => {
  const get = async (url, headers) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...headers,
        },
      })

      const data = await response.json()

      return {
        ok: response.ok,
        data,
        detail: data.detail || 'Ошибка выполнения запроса',
      }
    } catch (e) {
      return {
        ok: false,
        data: null,
        detail: e.message || 'Неизвестная ошибка',
      }
    }
  }

  const post = async (url, body, headers) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      return {
        ok: response.ok,
        data,
        detail: data.detail || 'Ошибка выполнения запроса',
      }
    } catch (e) {
      return {
        ok: false,
        data: null,
        detail: e.message || 'Неизвестная ошибка',
      }
    }
  }

  const postFormData = async (url, formData, headers) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          ...headers,
        },
        body: formData,
      })

      const data = await response.json()

      return {
        ok: response.ok,
        data,
        detail: data.detail || 'Ошибка выполнения запроса',
      }
    } catch (e) {
      return {
        ok: false,
        data: null,
        detail: e.message || 'Неизвестная ошибка',
      }
    }
  }

  return { get, post, postFormData }
}

export default useRequest
