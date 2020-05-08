var show_more = 'Show more';
var click_more_details = 'Click here for more details';
var see_all = 'See all';
var all_notif = 'All Notifications';
var notif = 'Notification';

function getMeta(metaName) {
  const metas = document.getElementsByTagName('meta');
  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute('name') === metaName) {
      return metas[i].getAttribute('content');
    }
  }
  return '';
}
function stripHtml(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent.trim() || tmp.innerText.trim() || "";
}


function nw_show_modal_m(obj) {
  if (obj.classList.contains('unread')) {
    obj.classList.remove('unread');
  }
  var title = obj.getAttribute('data-title');
  var body = obj.getAttribute('data-message');
  var redirecto = extractRedirectTo(obj.getAttribute('data-redirect'));

  // Set modal content
  document.getElementById('nw-notif-m-dialog').innerHTML = '';
  document.getElementById('nw-notif-m-dialog').innerHTML = `
    <div class="light-gray">
      <div></div>
      <div class="nw-m-row">
        <h3 class="nw-m-subject">`+title+`</h3>
      </div>
      <div class="nw-m-divider" role="separator"></div>
      <div class="nw-m-row" style="padding-top: 2px">
        <div >
          <pre class="nw-pre">`+body+`</pre>`+
          (obj.getAttribute('data-redirect') != null && obj.getAttribute('data-redirect') != 'null' ? 
            `<br><br><a class="nw-content-redirect link external" href="`+obj.getAttribute('data-redirect')+`" target="_blank">`+click_more_details+`</a>` : 
            ``)+
          `
        </div>
      </div>
    </div>
  `;

  // Open modal
  document.body.classList.add('noscroll');
  var nwModal = document.querySelector('.nw-modal');
  nwModal.classList.add('nw-modal--visible');
  var nwModalOverlay = document.querySelector('.nw-m-overlay');
  nwModalOverlay.classList.add('nw-m-overlay--visible');
}

function nw_show_more_modal(obj) {
  // var modalBg = document.querySelector('.notification-dewacrm-light') != null ? 'fff' : '424242';
  var title = obj.getAttribute('data-title');
  var body = obj.getAttribute('data-body');
  var isRedirectExist = obj.getAttribute('data-redirect') != null && obj.getAttribute('data-redirect') != 'null' ? true : false;
  // var redirecto = extractRedirectTo(obj.getAttribute('data-redirect'));
  var redirect = '<a class="nw-content-redirect" href="'+obj.getAttribute('data-redirect')+'" target="_blank">'+click_more_details+'</a>';

  // Set modal content
  document.getElementById('nw-desktop-modal-show-more-content').innerHTML = '';
  document.getElementById('nw-desktop-modal-show-more-content').innerHTML = `
    <button type="button" class="nw-modal__close" onclick="closeNwModal('dsm')">
      <span >&#10006;</span>
    </button>
    <div class="nw-content-modal" >
      <div class="nw-all-notifications">
        <h3>` + title + `</h3>
      </div>
      <div>
        <div class="nw-content-divider"></div>
      </div>
      <div class="nw-content-parent">
        <div class="nw-content-child">
          <div>
            <div class="nw-content-details-v2">
              <table width="100%">
                <tbody>
                  <tr>
                    <td class="nw-content-text-v2">
                        <span class="nw-content-body nw-body-padding"><div class="nw-pre">` + body + `</div></span><br>
                        ` + (isRedirectExist ? (`<span class="nw-contnet-body-redirect-span">` + redirect + `</span>`) : ``) + `
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Open modal
  var nwModal = document.querySelector('#nw-desktop-modal-show-more');
  nwModal.classList.add('nw-modal--visible');
}

function generate_content(title, body, redirect, date, is_read, device, n_id, n_type) {
  if (redirect != null) {
    redirect = redirect.replace('BASE_URL', window.location.origin);
    if (n_type == 'g') {
      redirect = "https://notification889.com/api/tracking?customer_id="+encodeURIComponent(cleanParams(document.getElementById('customer_id').value))+"&brand_id="+encodeURIComponent(cleanParams(document.getElementById('brand_id').value))+"&id="+encodeURIComponent(cleanParams(n_id))+"&type=click&redirect="+encodeURIComponent(redirect);
    }
  }
  
  var wContent = ``;
  var date_format  = moment(date + "+07:00", "YYYY-MM-DD HH:mm:ssZ");

  if(device == 'mobile') {
    wContent = `
    <tr onclick="nw_show_modal_m(this)" data-title="`+title+`" data-message="`+body.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/\\r\\n/g, "<br>")+`" data-redirect="`+redirect+`"` + (is_read == '0' ? ` class="unread"` : ``) + `>
      <td style="color:black;text-align:left;">` + title + `</td>
      <td style="color:black;">` + date_format.startOf('minutes').fromNow() + `</td>
    </tr>
    `;
  } else {
    var bRedirect = redirect;
    var mBody = isLongerThanLimit(body) ? truncateText(body, redirect, title) : body;
    var redirect = isLongerThanLimit(body) ? null : (extractRedirectTo(redirect) == '' ? null : redirect);
    wContent = `
    ` + (redirect ? `<a href="` + redirect + `" target="_blank">` : ``) + `
      <div class="nw-content-parent">
        <div class="nw-content-child` + (is_read == 1 ? `` : ` unread`) + `">
          <div>
            <div class="nw-content-details-v2" `+(redirect ? `` : `onclick="nw_show_more_modal(this)"`)+` data-title="`+title+`" data-body="`+body.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/\\r\\n/g, "<br>")+`" data-redirect="`+bRedirect+`">
              <table width="100%">
                <tbody>
                  <tr>
                    <td class="nw-content-text">
                        <h5 class="nw-content-title">` + title + `</h5>
                        <span class="nw-content-body">` + stripHtml(mBody) + '<br><strong style="text-decoration: underline;">'+show_more+'</strong></span>' + `</span><br/>
                        <span class="nw-content-date">` + date_format.startOf('minutes').fromNow() + `</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="nw-content-divider"></div>
      </div>        
    ` + (redirect ? `</a>` : ``) + ` 
  `;
  }

  return wContent;
}

function set_unread_count(unread_count) {
  if (unread_count != 0) {
    unread_count = unread_count > 99 ? '99+' : unread_count;
    var icon = document.querySelector('#notification-icon-dewacrm');
    icon.setAttribute('data-count', unread_count);
    icon.classList.add('nw-badge');
  }
}

function prepend_test_notification(res) {
  var wbDropdown = document.querySelector('.nw-dropdown-container');
  if (wbDropdown.children.length == 11) {
    wbDropdown.removeChild(wbDropdown.children[9]);
  } else if (wbDropdown.children.length == 1) {
    wbDropdown.removeChild(wbDropdown.children[wbDropdown.children.length - 1]);
  }

  if (res.redirect != null) {
    res.redirect = res.redirect.replace('BASE_URL', window.location.origin);
  }

  if (res.redirect != null && !isLongerThanLimit(res.message)) {
    var newNotif = document.createElement('a');
    newNotif.setAttribute('href', res.redirect);
    newNotif.setAttribute('target', '_blank');
  } else {
    var newNotif = document.createElement('div');
  }

  newNotif.innerHTML = `
    <div class="nw-content-parent">
      <div class="nw-content-child unread">
        <div>
        <div class="nw-content-details-v2" onclick="nw_show_more_modal(this)" data-title="`+res.title+`" data-body="`+res.message.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/\\r\\n/g, "<br>")+`" data-redirect="`+res.redirect+`">
            <table width="100%">
              <tbody>
                <tr>
                  <td class="nw-content-text">
                      <h5 class="nw-content-title">` + res.title + `</h5>
                      <span class="nw-content-body">` + stripHtml((isLongerThanLimit(res.message) ? truncateText(res.message, res.redirect, res.title) : res.message)) + '<br><strong style="text-decoration: underline;">'+show_more+'</strong></span>' + `</span><br/>
                      <span class="nw-content-date">` + moment().startOf('minutes').fromNow()  + `</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="nw-content-divider"></div>
    </div>     
  `;
  wbDropdown.prepend(newNotif);

  if (wbDropdown.children.length == 10) {
    var sm = document.createElement('div');
    sm.setAttribute('class', 'nw-see-more');
    sm.setAttribute('onclick', "nw_get_notifications('all')");
    sm.innerHTML = '<span>'+see_all+'</span>';
    wbDropdown.append(sm);
  }
}

function nw_get_notifications(type, isMarkRead = false, isWithTest = false, content = '') {
  var device = getMeta('forceClientDetect') == '' ? (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'mobile' : 'desktop') : getMeta('forceClientDetect');
  // Check for test notification
  if (isWithTest) {
    var wbDropdown = document.querySelector('.nw-dropdown-container');
    if (wbDropdown.children.length > 0) {
      prepend_test_notification(content);
      return true;
    }
  }

  // Show loading for desktop
  if (device == 'desktop' && type == 'top_10') {
    document.getElementsByClassName('nw-dropdown-container')[0].innerHTML = `
      <div style="position: relative; height: 50px;">
        <div id="nw-loading" class="nw-loading"></div>
      </div>
    `;
  }

  // Fetch all user notification
  var http = new XMLHttpRequest();
  var url = 'https://notification889.com/api/getNotification';
  var params = 'brand_id=' + cleanParams(document.getElementById('brand_id').value) + '&customer_id=' + cleanParams(document.getElementById('customer_id').value) + '&type=' + type;
  if(document.getElementById('registration_date') != null){
      params += '&registration_date='+cleanParams(document.getElementById('registration_date').value);
  }
  http.open('POST', url, true);


  // Send the proper header information along with the request
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  http.setRequestHeader('api_username', '+YwkE6XCpaSTOj0uD950Gk/izMjdv+P5+KLCa2PRWH8=');
  http.setRequestHeader('api_password', 'mf7kG2Vtfj3eGZlVN+iB6G3SonOjOrFVi1N83ZEjlYM=');

  http.onreadystatechange = function() {
    if(http.readyState == 4 && http.status == 200) {
      var res = JSON.parse(http.responseText);
      if(device == 'mobile') {
        var contentMHTML = ``;
        if (res.status == 'error') {
          console.log('No valid customer and brand id.');
          if (document.getElementById('notification-table-dewacrm')) {
            contentMHTML += `
              <tr>
                <td colspan="2" style="color:black;text-align:center;">No data available.</td>
              </tr>
            `;
            document.getElementById('notification-table-dewacrm').innerHTML = contentMHTML;
          }
        } else {
          var sample_data = res.message;

          // Set notification list content
          if (document.getElementById('notification-table-dewacrm')) {
            var hasUnread = false;
            // Generate HTML
            sample_data.forEach(function(n){
              contentMHTML += generate_content(n.title, n.message, n.redirect, n.created_at, n.is_read, device, n.id, n.type);
              if (!hasUnread) {
                hasUnread = n.is_read == '1' ? false : true;
              }
            });

            if (sample_data.length == 0) {
              contentMHTML += `
                <tr>
                  <td colspan="2" style="color:black;text-align:center;">No notifications.</td>
                </tr>`;
            }
            document.getElementById('notification-table-dewacrm').innerHTML = contentMHTML;
            if (hasUnread) {
              nw_read_notifications('all');
              nwSetCookie('nw_notif_count', '0');
            }
          }
        }
      } else {
        var contentHTML = type == 'top_10' ? '' : `
          <div class="nw-all-notifications">
            <h1>`+all_notif+`</h1>
          </div>
          <div>
            <div class="nw-content-divider"></div>
          </div>`;

        if (res.status == 'error') {
          console.log('No valid customer and brand id.');
          contentHTML += `
            <div class="nw-see-more" style="cursor:default !important;">
              <span>No data available.</span>
            </div>`;
          // Set dropdown content
          document.getElementsByClassName('nw-dropdown-container')[0].innerHTML = contentHTML;
        } else {
          var sample_data = res.message;
          // Generate HTML
          sample_data.forEach(function(n){
            contentHTML += generate_content(
              n.title, 
              n.message,
              n.redirect,
              n.created_at, 
              n.is_read,
              device,
              n.id,
              n.type);
          });

          if (type == 'top_10') {

            if (sample_data.length == 0) {
              contentHTML += `
                <div class="nw-see-more" style="cursor:default !important;">
                  <span>No notifications.</span>
                </div>`;
            }

            if (sample_data.length >= 10) {
              contentHTML += `
                <div class="nw-see-more" onclick="nw_get_notifications('all')">
                  <span>`+see_all+`</span>
                </div>`;
            }
            
            // Set dropdown content
            document.getElementsByClassName('nw-dropdown-container')[0].innerHTML = contentHTML;

            if (isMarkRead) {
              var eUnread = document.getElementsByClassName("unread");
              if (eUnread.length > 0) {
                nw_read_notifications('top_10');
              }
            }

            if (isWithTest) {
              prepend_test_notification(content);
            }
          } else {
            // Open all notifications modal
            var nwModal = document.querySelector('#nw-desktop-modal-all');
            nwModal.classList.add('nw-modal--visible');

            // Set modal box content
            // var modalBg = document.querySelector('.notification-dewacrm-light') != null ? 'fff' : '424242';
            document.getElementById('nw-desktop-modal-all-content').innerHTML = `
              <button type="button" class="nw-modal__close">
                <span onclick="closeNwModal('da')">&#10006;</span>
              </button>
              <div class="nw-content-modal">`
                + contentHTML + 
              `</div>`;
          }
        }
      }
    } else {
      if (device == 'desktop' && type == 'top_10') {
        document.getElementsByClassName('nw-dropdown-container')[0].innerHTML = `
        <div class="nw-see-more" style="cursor:default !important;">
          <span>Unable to retrieve notifications.</span>
        </div>
        `;
      }
    }
  }
  http.send(params);
}

function nw_read_notifications(type) {
  // Fetch all user notification
  var http = new XMLHttpRequest();
  var url = 'https://notification889.com/api/setRead';
  var params = 'brand_id=' + cleanParams(document.getElementById('brand_id').value) + '&customer_id=' + cleanParams(document.getElementById('customer_id').value) + '&type=' + type;
  if(document.getElementById('registration_date') != null){
      params += '&registration_date='+cleanParams(document.getElementById('registration_date').value);
  }
  http.open('POST', url, true);


  //Send the proper header information along with the request
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  http.setRequestHeader('api_username', '+YwkE6XCpaSTOj0uD950Gk/izMjdv+P5+KLCa2PRWH8=');
  http.setRequestHeader('api_password', 'mf7kG2Vtfj3eGZlVN+iB6G3SonOjOrFVi1N83ZEjlYM=');
  http.send(params);
  console.log('set notif count to 0')
  nwSetCookie('nw_notif_count', '0');
}

function nw_remove_unread_class(isMarkRead = false) {
  var eUnread = document.getElementsByClassName("unread");
  if (eUnread.length > 0) {
    if (isMarkRead) {
      nw_read_notifications('top_10');
    } else {
      while (eUnread.length) {
        eUnread[0].className = eUnread[0].className.replace(/\bunread\b/g, "");
      }
    }
  }
}

function nw_get_pending_count() {
  var count = nwGetCookie('nw_notif_count');
  if (count == "") {
    // Fetch user pending count
    var http = new XMLHttpRequest();
    var url = 'https://notification889.com/api/getPendingCount';
    var params = 'brand_id=' + cleanParams(document.getElementById('brand_id').value) + '&customer_id=' + cleanParams(document.getElementById('customer_id').value);
    if(document.getElementById('registration_date') != null){
      params += '&registration_date='+cleanParams(document.getElementById('registration_date').value);
    }

    http.open('POST', url, true);

    // Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.setRequestHeader('api_username', '+YwkE6XCpaSTOj0uD950Gk/izMjdv+P5+KLCa2PRWH8=');
    http.setRequestHeader('api_password', 'mf7kG2Vtfj3eGZlVN+iB6G3SonOjOrFVi1N83ZEjlYM=');

    http.onreadystatechange = function() {
      if(http.readyState == 4 && http.status == 200) {
        var res = JSON.parse(http.responseText);
        if (res.status != 'error') {
          nwSetCookie('nw_notif_count', res.message)
          set_unread_count(parseInt(res.message));
        }
      }
    }
    http.send(params);
  } else {
    set_unread_count(parseInt(count));
  }
}

function extractRedirectTo(link) {
  if (link != null) {
    var redirecto = '';
    if (link.indexOf('/tracking') > -1) {
        var q = link.split('?')[1];
        var p = q.split('&');
        var objParams = {};
        p.forEach(e => {
        var v = e.split('=');
        objParams[v[0]] = v[1];
        });

        if (objParams.hasOwnProperty('redirecto')) {
        redirecto = objParams.redirecto;
        } else {
        redirecto = objParams.redirect;
        }
    }
    return decodeURIComponent(redirecto);
  }
  return null;
}

function isLongerThanLimit(str) {
  var limit = 90;
  if (htmlDecode(str.replace(/<[^>]*>?/gm, '')).length > limit) {
    return true;
  }
  return false;
}


function truncateText(str, redirect, title) {
  var limit = 90;
  return '<span style="cursor: pointer; text-decoration: none; z-index: 1200;">' + htmlDecode(str.replace(/<[^>]*>?/gm, '')).substring(0, limit).replace(/\\r\\n/g, "&nbsp;") + '... ';
}

function htmlDecode(input) {
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes[0].nodeValue;
}

function cleanParams(text) {
  var cleaned = text.toString().replace(/\+/g, '-');
  return cleaned.replace(/\//g, '_');
}

function cleanReadParams(text) {
  var cleaned = text.replace(/-/g, '+');
  return cleaned.replace(/_/g, '/');
}

function closeNwModal(modal) {
  var nwModal;
  switch (modal) {
    case 'm':
      nwModal = document.querySelector('.nw-modal');
      nwModal.classList.remove('nw-modal--visible');

      var nwModalOverlay = document.querySelector('.nw-m-overlay');
      nwModalOverlay.classList.remove('nw-m-overlay--visible');

      document.body.classList.remove('noscroll');
      break;
    case 'da':
      var eUnread = document.getElementsByClassName("unread");
      if (eUnread.length > 0) {
        nw_read_notifications('all');
        nw_remove_unread_class();
      }
      nwModal = document.querySelector('#nw-desktop-modal-all');
      nwModal.classList.remove('nw-modal--visible');
      break;
    case 'dsm':
      nwModal = document.querySelector('#nw-desktop-modal-show-more');
      nwModal.classList.remove('nw-modal--visible');
      break;
  }
  let x = document.getElementsByClassName('nw-pre');
  if(x.length){
    x[0].innerHTML = '';
  }
}

function nwSetCookie(cname, cvalue) {
  var d = new Date();
  d.setTime(d.getTime() + (15 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function nwGetCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

document.addEventListener("DOMContentLoaded", () => {
  var lang = getMeta('notif-language');
  if(lang != ''){
    if(lang == 'ID'){
      show_more = 'lihat selengkapnya';
      click_more_details = 'Info Lebih Lanjut';
      see_all = 'Lihat Semua Notifikasi';
      all_notif = 'Semua Notifikasi ';
      notif = 'Notifikasi';
    } else if (lang == 'VN') {
      show_more = 'xem đầy đủ';
      click_more_details = 'Nhấn vào đây để biết thêm';
      see_all = 'Xem tất cả thông báo';
      all_notif = 'Tất cả các thông báo';
      notif = 'Thông báo';
    }
    
  }

  var device = getMeta('forceClientDetect') == '' ? (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'mobile' : 'desktop') : getMeta('forceClientDetect');
  // Check if has user session
  if (document.getElementById('customer_id') != null && document.getElementById('brand_id') != null) {
    if (document.getElementById('customer_id').value != "" && document.getElementById('brand_id').value != "") {
      /** SOCKET IO LISTENER */
      if (typeof io !== "undefined") { 
        // let crm_socket_notif = io(crm_io_address_notif, {transports: ['websocket']});
        if(typeof crm_socket !== "undefined"){
            var crm_socket_notif = crm_socket;
        }else{
           var crm_io_address_notif = navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ? 'https://socket_test.dewacrm.com:2710' : 'wss://realtime.dewacrm.com:443';
           const crm_socket_notif = io(crm_io_address_notif, {
              // path: '/socket.io',
              transports: ['websocket', 'polling'],
              // transports: ['polling','websocket'],
              upgrades: ["polling"],
              upgrade: true,
              rememberUpgrade: true
            });
        }
       
        crm_socket_notif.once('connect', function(){
          crm_socket_notif.emit('join_notification', {c: encodeURIComponent(cleanParams(document.getElementById('customer_id').value)), b: encodeURIComponent(cleanParams(document.getElementById('brand_id').value))});
        });
        crm_socket_notif.on("crm_notifications", function(n, v){
          var res = JSON.parse(n.content);
          var countFromCookie = nwGetCookie('nw_notif_count');
          var unread_count = countFromCookie == '' ? 0 : parseInt(countFromCookie);
          
          if (device == 'mobile') {
            var wbNotifPage = document.querySelector('#notification-table-dewacrm');
            if (wbNotifPage != null) {
              if (res.is_test == 1) {
                // TABLE PREPEND TEST NOTIFICATION
                res.redirect = typeof res.redirect_mobile !== 'undefined'  ? res.redirect_mobile : res.redirect;
                if (res.redirect != null) {
                  res.redirect = res.redirect.replace('BASE_URL', window.location.origin);
                }
                var newNotif = document.createElement('tr');
                
                newNotif.setAttribute("onclick", "nw_show_modal_m(this)");
                newNotif.setAttribute("data-title", res.title);
                newNotif.setAttribute("data-message", res.message);
                newNotif.setAttribute("data-redirect", res.redirect);
                newNotif.setAttribute("class", "unread");
        
                newNotif.innerHTML = `
                  <td style="color:black;text-align:left;">` + res.title + `</td>
                  <td style="color:black;">` + moment().startOf('minutes').fromNow() + `</td>        
                `;
                wbNotifPage.prepend(newNotif);
              } else {
                nw_get_notifications('all');
              }
            } else {
              var icon = document.querySelector('#notification-icon-dewacrm');
              if (icon != null) {
                if (!icon.classList.contains('nw-badge')) {
                  icon.classList.add('nw-badge');
                }
                icon.setAttribute('data-count', unread_count + 1);
                if (res.is_test == 0) {
                  nwSetCookie('nw_notif_count', unread_count + 1);
                }
              }
            }
          } else {
            var wbDropdown = document.querySelector('.nw-dropdown-container');
            if (wbDropdown != null) {
              if (wbDropdown.classList.contains('nw-hide')) {
                var icon = document.querySelector('#notification-icon-dewacrm');
                if (icon != null) {
                  if (!icon.classList.contains('nw-badge')) {
                    icon.classList.add('nw-badge');
                  }
                  icon.setAttribute('data-count', unread_count + 1);
                }
              }
              if (res.is_test == 1) {
                // DRAWER PREPEND TEST NOTIFICATION
                nw_get_notifications('top_10', false, true, res);
              } else {
                nw_get_notifications('top_10');
                nwSetCookie('nw_notif_count', unread_count + 1);
              }
            } 
          }
        });
      }
      /** END OF SOCKET IO LISTENER */

      /** ELEMENTS & BEHAVIOR */
      // Set theme based on class
      var wbButton = document.querySelector('.notification-dewacrm-light');

      /** STYLES */
      var wStylesLinkEl = document.createElement('link');
      wStylesLinkEl.setAttribute('rel', 'stylesheet');
      wStylesLinkEl.setAttribute('type', 'text/css');
      // wStylesLinkEl.setAttribute('href', 'nw-' + (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'm-' : '') + 'styles' + (wbButton != null ? '-light' : '') + '.css');
      wStylesLinkEl.setAttribute('href', 'https://s3-ap-southeast-1.amazonaws.com/idnpopups/retention/nw-' + (device == 'mobile' ? 'm-' : '') + 'styles' + (wbButton != null ? '-light' : '') + '.css');

      if (wbButton == null) {
        wbButton = document.querySelector('#notification-dewacrm');
      }

      var wm = document.createElement('div');
      wm.setAttribute('id', 'nw-desktop-modal-all');
      wm.setAttribute('class', 'nw-modal');

      if (device == 'mobile') {
        wm.innerHTML = `
          <div class="vertical-alignment-helper">
            <div class="vertical-align-center">
              <div class="nw-m-container">
                <div class="nw-m-dialog-titlebar">
                  <div class="nw-m-dialog-titlebar-content">
                    <span class="nw-m-dialog-title">`+notif+`</span>
                    <span class="nw-m-dialog-titlebar-close" onclick="closeNwModal('m')">&#10006;</span>
                  </div>
                </div>
                <div id="nw-notif-m-dialog">
                </div>
              </div>
            </div>
          </div>
        `;

        var wmOverlay = document.createElement('div');
        wmOverlay.setAttribute('class', 'nw-m-overlay');

        document.body.append(wmOverlay);
      }

      // Add to DOM
      document.head.append(wStylesLinkEl);
      document.body.append(wm);

      if(device == 'mobile') {
        if (wbButton != null) {
          var notifTable = document.createElement('table');
          notifTable.setAttribute("class", "nw-table");
          notifTable.setAttribute("cellspacing", "0");
          notifTable.setAttribute("cellpadding", "0");
          notifTable.setAttribute("border", "0");
          
          notifTable.innerHTML = `
            <thead>
              <tr>
                <th>Subjek</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody id="notification-table-dewacrm">
            </tbody>
          `;

          wbButton.appendChild(notifTable);
          nw_get_notifications('all');
        } else {
          nw_get_pending_count();
        }
      } else {
        /** BEHAVIOR */
        if (wbButton != null) {
          nw_get_pending_count();
          /** ELEMENTS */
          var arrow = document.createElement('div');
          arrow.setAttribute('class', 'nw-arrow nw-hide');

          var wd = document.createElement('div');
          wd.setAttribute('class', 'nw-dropdown-container nw-hide');

          wbButton.onclick = function() {
            var icon = document.querySelector('#notification-icon-dewacrm');
            var wbDropdown = document.querySelector('.nw-dropdown-container');
            var isFirstLoad = wbDropdown.children.length > 0 ? false : true;
            var wbArrow = document.querySelector('.nw-arrow');
            icon.setAttribute('data-count', 0);
            icon.classList.remove('nw-badge');
            wbDropdown.classList.toggle('nw-hide');
            wbArrow.classList.toggle('nw-hide');
            if (wbDropdown.classList.contains('nw-hide')) {
              nw_remove_unread_class();
            } else {
              if (isFirstLoad) {
                nw_get_notifications('top_10', true);
                isFirstLoad = false;
              } else {
                if (wbDropdown.children[0].firstElementChild.innerHTML == 'Unable to retrieve notifications.') {
                  nw_get_notifications('top_10', true);
                }
                nw_remove_unread_class(true);
              }
            }
          }

          wbButton.appendChild(arrow);
          wbButton.appendChild(wd);

          // All notifications modal
          document.getElementById('nw-desktop-modal-all').innerHTML = `
            <div class="nw-modal-box">
              <div id="nw-desktop-modal-all-content" class="nw-modal-box__content">
              </div>
            </div>
          `;

          // Show more modal
          var sm = document.createElement('div');
          sm.setAttribute('id', 'nw-desktop-modal-show-more')
          sm.setAttribute('class', 'nw-modal');

          document.body.append(sm);

          document.getElementById('nw-desktop-modal-show-more').innerHTML = `
            <div class="nw-modal-box">
              <div id="nw-desktop-modal-show-more-content" class="nw-modal-box__content">
              </div>
            </div>
          `;
        }
      }
      /** END OF ELEMENTS & BEHAVIOR */
    }
  }
});