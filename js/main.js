var last_page = false,
  page = 1,
  listCommit = [],
  sdk_ver = "7.0",
  app_id = "209155810406484";

$(".js-select2").map(function(index, elem) {
  $(elem).select2({
    width: "100%",
    placeholder: $(elem).attr("data-placeholder") && $(elem).attr("data-placeholder")
  });
});

while (!last_page) {
  $.ajax({
    url: `https://api.github.com/repos/chuanghiduoc/font-awesome/commits?page=${page}`,
    dataType: "json",
    async: false,
    success: data => {
      if (data.length > 0) {
        data.forEach(child => {
          listCommit.push(child);
        });
        page++;
      } else {
        last_page = true;
      }
    }
  });
}

var listVersions = listCommit.map((arr, index) => {
  var regex = arr.commit.message.match(/\d+(\.\d+)+/g);
  if (regex != null) {
    arr.sha = arr.sha.slice(0, 7);
    arr.ver = regex[0];
  }
  return arr;
});

var removeDuplicate = listVersions.reduce((unique, value) => {
  if (!unique.some(obj => { return obj.ver === value.ver })) {
    unique.push(value);
  }
  return unique;
}, []);

removeDuplicate.forEach((value, index) => {
  if (value.ver) {
    $("#list-versions").append(`<option value="${value.sha}">v${value.ver}</option>`);
    $("#archive").append(`<option data-link="https://github.com/chuanghiduoc/font-awesome/archive/v${value.ver}.zip">v${value.ver}</option>`);
  }
});

var sha = removeDuplicate[0].sha,
  ver = removeDuplicate[0].ver;

$(".ver").text(ver);
$("#a").val(`<link href="https://cdn.jsdelivr.net/gh/chuanghiduoc/font-awesome@${sha}/css/all.css" rel="stylesheet" type="text/css" />`);
$("#c").val(`<link href="https://cdn.staticaly.com/gh/chuanghiduoc/font-awesome/${sha}/css/all.css" rel="stylesheet" type="text/css" />`);
$("#e").val(`<link href="https://rawcdn.githack.com/chuanghiduoc/font-awesome/${sha}/css/all.css" rel="stylesheet" type="text/css" />`);
$("head").append(`<link href="https://cdn.jsdelivr.net/gh/chuanghiduoc/font-awesome@${sha}/css/all.css" rel="stylesheet" type="text/css" />`);

$("body").on("select2:select", "#list-versions", function() {
  var _sha = $(this).val();
  $("#a").val(`<link href="https://cdn.jsdelivr.net/gh/chuanghiduoc/font-awesome@${_sha}/css/all.css" rel="stylesheet" type="text/css" />`);
  $("#c").val(`<link href="https://cdn.staticaly.com/gh/chuanghiduoc/font-awesome/${_sha}/css/all.css" rel="stylesheet" type="text/css" />`);
  $("#e").val(`<link href="https://rawcdn.githack.com/chuanghiduoc/font-awesome/${_sha}/css/all.css" rel="stylesheet" type="text/css" />`);
});

$("body").on("select2:select", "#archive", function() {
  window.open($(this).select2("data")[0].element.dataset.link, "_blank");
});

var obj = {
  item: {
    jsdelivr: {
      input: "a",
      btn: "b"
    },
    staticaly: {
      input: "c",
      btn: "d"
    },
    githack: {
      input: "e",
      btn: "f"
    }
  },
  copy: function() {
    for (var key in this.item) {
      if (this.item.hasOwnProperty(key)) {
        let btn = `#${this.item[key].btn}`,
          input = `#${this.item[key].input}`;
        $("body").on("click", btn, function() {
          if ($(input).val().length > 0) {
            $(input).select();
            document.execCommand("copy");
          }
        });
      }
    }
  }
}

obj.copy();

$(window).on("load", function() {
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = `https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v${sdk_ver}&appId=${app_id}&autoLogAppEvents=1`;
    fjs.parentNode.insertBefore(js, fjs);
  }(document, "script", "facebook-jssdk"));
});
