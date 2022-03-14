// AJAX IS USE TO PREVENT THE REFRESH ON SINGLE PAGE APPLICATIONS
const sendFormContent = () => {
  var xhr = new XMLHttpRequest()
  xhr.onload = res => {
    if (res.target.status !== 200) {
      document.querySelector('#alert-box').innerHTML = res.target.responseText
    } else {
      window.location.assign(res.target.responseText);
    }
  }
  xhr.open('POST', '/login', true)
  xhr.setRequestHeader('Content-type', 'application/json')
  xhr.send(
    JSON.stringify({
      email: `${document.querySelector('#formEmail').value}`,
      password: `${document.querySelector('#formPassword').value}`
    })
  )
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input').forEach(alertBox => {
    alertBox.addEventListener('change', event => {
      var alertBox = document.querySelector('.alert')
      if (alertBox) {
        new bootstrap.Alert(alertBox)
        bootstrap.Alert.getInstance(alertBox).close()
      }
    })
  })
})
