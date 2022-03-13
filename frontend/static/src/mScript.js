const logout = (path) => {
  const xhr = new XMLHttpRequest()

  xhr.open('GET', path, true)
  xhr.setRequestHeader('Content-type', 'application/json')
  xhr.send(JSON.stringify({}))
  xhr.onload = res => {
    if (res.target.status !== 200) {
      // error
    } else {
      window.location.assign(res.target.responseText)
    }
  }
}
