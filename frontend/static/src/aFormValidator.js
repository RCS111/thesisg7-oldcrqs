;(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      'submit',
      function (event) {
        if (form.checkValidity()) {
          sendFormContent()
        }
        event.preventDefault()
        event.stopPropagation()
        form.classList.add('was-validated')
      },
      false
    )
  })
})()

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
  xhr.open('POST', '/admin/login', true)
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
