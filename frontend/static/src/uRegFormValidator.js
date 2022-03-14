document.addEventListener('DOMContentLoaded', () => {
  var toggleBtns = document.querySelectorAll('.btn-toggle-pass')
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', e => {
        var superParent = e.target.children[0].parentNode.parentNode;
        if(e.target.children[0].id === "ic-show-pass"){
            e.target.children[0].id = "ic-hide-pass"
            e.target.innerHTML = toggleIcons[1];
            superParent.children[1].type = "text"
        } else  {
            e.target.innerHTML = toggleIcons[0];
            superParent.children[1].type = "password"
        }
    });
  })
})

const insConEl = () => {
  var contactContainer = document.querySelector('.contact-container')
  contactContainer.insertAdjacentHTML("beforeend", inputContactAdded)
  updateContactNodes()
}

const updateContactNodes = () => {
  var ctcBtnNodes = document.querySelectorAll('#ctc-added')
  if (ctcBtnNodes) {
    ctcBtnNodes.forEach(btn => {
      btn.addEventListener('click', e => {
        var parent = e.target.parentNode
        var superParent = parent.parentNode
        superParent.removeChild(parent)
      })
    })
  }
}
