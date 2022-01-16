(function() {

    "use strict";
  
    // Modal window iframe (map) version 2.0 09-04-2016
  
    // v2.0 - multiple versions, no button in html
  
    // Assumption:
    //    First object in modal is the modal title
    //    Last object is the modal close button
    // Therefore to keep tab control inside modal:
    //    listen for tab keypress on close button
    //    listen for shift-tab keypress on title
    //    Always listen for the ESC key.
  
    // To do:
    //    Window resize.
    //    Externalise hard coded attribute values.
    //    animate in out.
  
    var d = document;
    var content = d.getElementById("content");
    var imgBtns = d.querySelectorAll("[data-iframesrc]");
    var i;
  
    var _closeModal = function(e) {
      var count = e.target.count; // lightbox, modal (ESC key), close btn
      var modal = d.getElementById("modal_" + count);
      var lightbox = d.getElementById("lightbox_" + count);
      var imgBtn;
      if (modal) {
        modal.setAttribute("aria-hidden", "true");
        lightbox.className = lightbox.className.replace(" ON", "");
        content.setAttribute("aria-hidden", "false");
        imgBtn = d.getElementById(modal.returnId);
        // reset activation button press
        imgBtn.setAttribute("aria-pressed", "false");
        // move focus back to initialising button
        imgBtn.focus();
      }
    };
  
    var _createiframe = function(image, modalHeight) {
      var iframe = d.createElement("iframe");
      if (image) {
        iframe.src = image.getAttribute("data-iframesrc");
        iframe.width = image.offsetWidth;
        iframe.height = modalHeight;
        iframe.setAttribute("frameborder", 0);
        iframe.setAttribute("allowfullscreen", true);
      }
      return iframe;
    };
  
    var _modal_title_shiftTabKeyPressed = function(e) {
      // if tab key and shift
      if (e.which === 9 && e.shiftKey) {
        e.preventDefault();
        //focus on last object in modal (close btn)
        d.getElementById("modal_btn_close_" + e.target.count).focus();
      }
    };
  
    var _escKeyPressed = function(e) {
      // only if ESC pressed
      if (e.which === 27) {
        _closeModal(e);
      }
    };
  
    var _displayModal = function (modal, count) {
      var image = d.getElementById("modal_img_" + count);
      var modalHeight;
  
      if (image) {
        modalHeight = Math.min(modal.offsetHeight, image.offsetHeight);
        modal.style.maxHeight = modalHeight + "px";
        modal.replaceChild(_createiframe(image, modalHeight), image);
        // ESC key check
        modal.addEventListener("keydown", _escKeyPressed, false);
      }
    };
  
    var _openModal = function(e) {
  
      e.preventDefault();
  
      var count = e.target.count;
      var modal = d.getElementById("modal_" + count);
      var lightbox = d.getElementById("lightbox_" + count);
      var modal_title;
  
      if (modal && lightbox) {
        if (!lightbox.className.match(" ON")) {
          lightbox.className += " ON";
        }
        e.target.setAttribute("aria-pressed", "true");
        modal.setAttribute("aria-hidden", "false");
        _displayModal(modal, count);
        content.setAttribute("aria-hidden", "true");
        modal_title = d.getElementById("modal_title_" + count);
        if (modal_title) {
          modal_title.count = count;
          modal_title.addEventListener("keydown", _modal_title_shiftTabKeyPressed, false);
          // move focus to the modal h1
          modal_title.focus();
        }
      }
    };
  
    var _addLightbox = function(imgMapBtn) {
      var count = imgMapBtn.count;
      var lightboxDiv = d.createElement("div");
      lightboxDiv.id = "lightbox_" + count;
      lightboxDiv.className = "lightbox";
      lightboxDiv.count = count;
      lightboxDiv.returnId = imgMapBtn.id;
      // optional - should not be able to reach this via keyboard
      lightboxDiv.setAttribute("tabindex", "0");
      d.body.appendChild(lightboxDiv);
      // mouse / touch only
      lightboxDiv.addEventListener("click", _closeModal, false);
    };
  
    var _modal_closeBtn_tabKeyPressed = function(e) {
      // if tab key and not shift. ESC key handled separately by _escKeyPressed()
      if (e.which === 9 && !e.shiftKey) {
        e.preventDefault();
        //focus on first object in modal - or should it be the modal, requires testing
        d.getElementById("modal_title_" + e.target.count).focus();
        // console.log("modal close button keypress = " + e.which);
      }
    };
  
    var _getModalCloseBtnHTML = function (imgBtn) {
      var str;
      str = "<button id=modal_btn_close_" + imgBtn.count;
      str += " class=\"btn btn-modalClose\"><span>Close</span>";
      // SVG not checked in IE
      str += '<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><title>Close modal</title><path d="M311.1,250.2L487.2,74c16.9-16.9,16.9-44.2,0-61.1C470.3-3.9,443-3.9,426.1,13L250,189.1L73.9,13C57-3.9,29.7-3.9,12.8,13s-16.8,44.2,0,61l176.1,176.1L12.8,426.3c-16.9,16.9-16.9,44.2,0,61.1c8.4,8.4,19.5,12.6,30.5,12.6s22.1-4.2,30.5-12.6L250,311.2l176.1,176.1c8.4,8.4,19.5,12.6,30.5,12.6s22.1-4.2,30.5-12.6c16.9-16.9,16.9-44.2,0-61.1L311.1,250.2z"></path></svg>';
      str += "</button>";
      return str;
    };
  
    var _addModalCloseBtn = function(imgBtn) {
      var modal = d.getElementById("modal_" + imgBtn.count);
      var closeBtn;
      if (modal) {
        modal.innerHTML += _getModalCloseBtnHTML(imgBtn);
        closeBtn = d.getElementById("modal_btn_close_" + imgBtn.count);
        if (closeBtn) {
          closeBtn.count = imgBtn.count;
          closeBtn.returnId = imgBtn.id;
          closeBtn.addEventListener("click", _closeModal, false);
          closeBtn.addEventListener("keydown", _modal_closeBtn_tabKeyPressed, false);
        }
      }
    };
  
    var _getModalHTML = function(imgBtn) {
      var str;
      str = "<h1 tabindex=0 id=modal_title_" + imgBtn.count + " class=modal-title>";
      str += imgBtn.alt.replace("Click for ", "");
      str += "</h1>";
      str += "<div tabindex=0 id=modal_desc_" + imgBtn.count + " class=modal-desc>";
      str += "Esc key to leave modal, tab &amp; shift-tab to move focus.";
      str += "</div>";
      str += "<img id=modal_img_" + imgBtn.count;
      str += " data-iframesrc=\"" + imgBtn.frameSrc + "\"";
      str += " class=img-map src=\"" + imgBtn.src + "\" alt=\"\">";
      return str;
    };
  
    var _addModalBlock = function(imgBtn) {
      var modal = d.createElement("section");
      modal.id = "modal_" + imgBtn.count;
      modal.returnId = imgBtn.id;
      modal.className = "modal-map";
      modal.setAttribute("aria-hidden", "true");
      modal.setAttribute("aria-labelledby", "modal_title_" + imgBtn.count);
      modal.setAttribute("aria-describedby", "modal_desc_" + imgBtn.count);
      modal.setAttribute("role", "dialog");
      modal.innerHTML = _getModalHTML(imgBtn);
      d.body.appendChild(modal);
    };
  
    var _imgBtn_enterSpacePressed = function(e) {
      // if enter or space key
      if (e.which === 13 || e.which === 32) {
        e.preventDefault();
        console.log("open " + e.target.count + " button pressed");
        _openModal(e);
      }
    };
  
    var _addButtonAttr = function (imgBtn) {
      imgBtn.id = imgBtn.id || "img_btn_" + imgBtn.count;
      imgBtn.setAttribute("role", "button");
      imgBtn.setAttribute("aria-pressed", "false");
      imgBtn.setAttribute("aria-controls", "modal_" + imgBtn.count);
      imgBtn.setAttribute("tabindex", "0");
      imgBtn.alt = "Click for " + imgBtn.alt + " ";
      imgBtn.alt += imgBtn.getAttribute("data-type");
      imgBtn.addEventListener("click", _openModal, false);
      imgBtn.addEventListener("keydown", _imgBtn_enterSpacePressed, false);
      console.log(imgBtn.count);
    };
  
  
    if (content && imgBtns) {
      i = imgBtns.length;
      while (i--) {
        imgBtns[i].frameSrc = imgBtns[i].getAttribute("data-iframesrc");
        imgBtns[i].count = i;
        _addButtonAttr(imgBtns[i]);
        _addModalBlock(imgBtns[i]);
        _addModalCloseBtn(imgBtns[i]);
        _addLightbox(imgBtns[i]);
      }
    }
  
  }());