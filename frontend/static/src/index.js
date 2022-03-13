// Example starter JavaScript for disabling form submissions if there are invalid fields
document.addEventListener('DOMContentLoaded', () => {
  let forms = document.querySelectorAll('.needs-validation')
  Array.prototype.slice.call(forms).forEach(form => {
    form.addEventListener(
      'submit',
      e => {
        if (form.checkValidity()) {
          console.log("testing");
          e.preventDefault()
          e.stopPropagation()
        }
        form.classList.add('was-validated')
      },
      false
    )
  })
})

// AJAX IS USE TO PREVENT THE REFRESH ON SINGLE PAGE APPLICATIONS
const sendFormContent = () => {
  var xhr = new XMLHttpRequest()
  xhr.onload = res => {
    if (res.target.status === 200) {
      console.log('success')
    } else {
      console.log(res.target.responseText)
    }
  }
  xhr.open('POST', '/register', true)
  xhr.setRequestHeader('Content-type', 'application/json')

  xhr.send(
    JSON.stringify({
      email: 'zian.catacutanasd2@gmail.com',
      password: 'erikaMay',
      name: {
        first: 'zian',
        middle: 'MANALO',
        last: 'CATACUTAN',
        extension: 'null'
      },
      sex: 'M',
      address: {
        house: 'null',
        blk: '65',
        lot: '21',
        purok: '10',
        street: 'SAN MIGUEL ST.'
      },
      year: '2018',
      civilStatus: 'SINGLE',
      birth: {
        date: '09/02/2000',
        place: 'ONA OSPITAL NING ANGELES CITY PAMPANGA'
      },
      contactNumber: ['09517570099'],
      vaccinationStatus: '1',
      approvalDate: 'null'
    })
  )
  // xhr.send({
  //   email: 'zian.catacutan4@gmail.com',
  //   password: 'erikamay12',
  //   fullName: {
  //     fName: 'ZIAN',
  //     midName: 'MANALO',
  //     lName: 'CATACUTAN',
  //     extName: null
  //   },
  //   sex: 'M',
  //   address: {
  //     houseNo: null,
  //     blkNo: 65,
  //     lotNo: '21',
  //     purokNo: '21',
  //     street: 'SAN MIGUEL ST.'
  //   },
  //   startYear: '2018',
  //   civilStatus: 'SINGLE',
  //   birthDay: {
  //     date: '09/02/2000',
  //     place: 'ONA OSPITAL NING ANGELES CITY PAMPANGA'
  //   },
  //   contactNo: ['09517570099'],
  //   vaccStatus: '1',
  //   approvalDate: null
  // })
}
