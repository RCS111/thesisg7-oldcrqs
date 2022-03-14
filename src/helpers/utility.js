class Utility {
  static makeSentenceCase (text) {
    return text[0].toUpperCase() + text.subStr(1).toLowerCase()
  }

  static replaceToNull(text){
    return text === "null" ? null : text;
  }

  static getAlertBox = message => {
    return `<div class="alert alert-danger alert-dismissible fade show w-100 mb-2" role="alert">
    <div class="row g-2 align-items-center ">
      <div class="col-auto">
        <div class="d-flex align-content-center justify-content-start ">
          <svg class="d-block my-auto" xmlns="http://www.w3.org/2000/svg" width="16"
            height="16" fill="currentColor" class="bi bi-exclamation-octagon-fill" viewBox="0 0 16 16">
            <path
              d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </svg>
          <small class="ms-2 text-sm-start text-center align-content-center">${message}</small>
        </div>
      </div>
      <div class="col-auto">
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    </div>
  </div>`
  }
}

module.exports = Utility
