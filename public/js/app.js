var switchColumn = function () {
  var content = document.getElementsByClassName('content-col-1')[0]
  if (content) {
    content.className = 'content-col-2'
  }
  else {
    document.getElementsByClassName('content-col-2')[0].className = 'content-col-1'
  }
}
