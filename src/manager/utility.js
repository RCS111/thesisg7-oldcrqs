class Utility {
  static makeSentenceCase (text) {
    return text[0].toUpperCase() + text.subStr(1).toLowerCase()
  }

  static replaceToNull(text){
    return text === "null" ? null : text;
  }
}

module.exports = Utility
