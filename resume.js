;(function(global) {
  var document = global.document
  var head = document.getElementsByTagName('head').item(0)
  var link = document.getElementsByTagName('link').item(0)

  function Resume(file) {
    return new Resume.init(file)
  }

  Resume.init = function(file) {
    this.file = file
    return this
  }

  Resume.prototype = {
    version: '1.1.0',
    constructor: Resume,

    json: function(file) {
      this.file = file
      if(global.fetch) {
        return this.load(file, 'json')
      } else {
        // alternative with XMLHttpRequest ??
        console.log('alternative using XMLHttpRequest')
      }
    },

    load: function(file, rtype='json') {
      // type can only be `json`, `text` or `blob` for now
      this.file = file
      let types = ['json', 'text', 'blob']
      let seltype = (types.indexOf(rtype) === -1) ? 'json' : rtype
      return fetch(file)
        .then(resp => resp[seltype]())
        .catch(function(err) { throw `${err.message}` })
    },

    template: function(file, data, oSelector) {
      var target = document.querySelector(oSelector)
      fetch(file)
        .then(d => d.text())
        .then(function(t) {
          var c = _.template(t)
          target.innerHTML = c(data)
        })
      return this
    },

    theme: function(theme) {
      /* provided a them, apply css to resume */
      if(link) {
        link.setAttribute('href', theme)
      } else {
        var newlink = document.createElement('link')
        newlink.setAttribute('rel', 'stylesheet')
        newlink.setAttribute('type', 'text/css')
        newlink.setAttribute('href', theme)
        head.appendChild(newlink)
        link = newlink
      }

      return this
    },

    /* TODO: remove dependency on `$` */
    render: function(selector, data) {
      var elem = document.querySelector(selector)
      var script = document.querySelector('script' + selector)
      var c = _.template(script.text)
      elem.innerHTML = c(data)
      return this
    },

    jqRender: function(selector, data) {
      var script = $(selector).find('script')
      var c = _.template(script.text())
      $(selector).html(c(data))
      return this
    },

    topdf: function(path) {
      console.log('saving resume to pdf ...');
      return this
    },

    util: {
      titleCase: function(str) {
        return str.replace(/\b(\w)/g, function(s) { return s.toUpperCase(); })
      },

      dateFormat: function(format) {
        // returns a formatted date
      }
    }
  }

  Resume.init.prototype = Resume.prototype

  global.Resume = Resume.init.prototype
}(this));