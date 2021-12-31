var request = new XMLHttpRequest();
var url_string =
  "https://gist.githubusercontent.com/rvsp/add40254aa126f045837fa5b51f47f1f/raw/4d724bfabf4cce7379a386e23bef6576ab99a2f9/pagination.json";

request.open("GET", url_string, true);
request.send();
request.onload = function () {
  var tableData = JSON.parse(this.response);

  var state = {
    querySet: tableData,
    page: 1,
    prev: 1,
    next: 2,
    rows: 10,
    window: 5,
  };

  //create dom elements
  var container = document.createElement("div");
  container.setAttribute("class", "container");

  var tab = document.createElement("table");
  tab.setAttribute("class", "table table-bordered");
  tab.setAttribute("id", "our-table");

  var tabhead = document.createElement("thead");
  var tr1 = document.createElement("tr");

  var col1 = document.createElement("th");
  col1.innerHTML = "Id";

  var col2 = document.createElement("th");
  col2.innerHTML = "Name";

  var col3 = document.createElement("th");
  col3.innerHTML = "Email";

  tr1.append(col1, col2, col3);

  var tabbody = document.createElement("tbody");
  tabbody.setAttribute("id", "table-body");

  tabhead.append(tr1);
  tab.append(tabhead, tabbody);

  var wrapp = document.createElement("div");
  wrapp.setAttribute("id", "pagination-wrapper");

  var heading = document.createElement("h2");
  heading.setAttribute(
    "style",
    "text-align:center; font-family:sans-serif"
  );
  heading.innerHTML = "User Data Pagination";

  container.append(heading, tab, wrapp);

  document.body.append(container);

  //close dom

  //Generate the table
  buildTable();

  function pagination(querySet, page, rows) {
    //debugger
    var trimStart = (page - 1) * rows;
    var trimEnd = trimStart + rows;

    var trimmedData = querySet.slice(trimStart, trimEnd);

    var pages = Math.round(querySet.length / rows);

    return {
      querySet: trimmedData,
      pages: pages,
    };
  }

  function pageButtons(pages) {
    var wrapper = document.getElementById("pagination-wrapper");

    wrapper.innerHTML = ``;
    //console.log('Pages:', pages)

    var maxLeft = state.page - Math.floor(state.window / 2);
    var maxRight = state.page + Math.floor(state.window / 2);

    if (maxLeft < 1) {
      maxLeft = 1;
      maxRight = state.window;
    }

    if (maxRight > pages) {
      maxLeft = pages - (state.window - 1);

      if (maxLeft < 1) {
        maxLeft = 1;
      }
      maxRight = pages;
    }

    wrapper.innerHTML += `<button value=${state.prev} class="page btn btn-sm btn-success">&#171; Previous</button>`;
    for (var page = maxLeft; page <= maxRight; page++) {
      wrapper.innerHTML += `<button value=${page} class="page btn btn-sm btn-success">${page}</button>`;
    }
    wrapper.innerHTML += `<button value=${state.next} class="page btn btn-sm btn-success">Next  &#187;</button>`;

    if (state.page != 1) {
      wrapper.innerHTML = `<button value=${1} class="page btn btn-sm btn-success">First</button>${
        wrapper.innerHTML
      }`;
    }

    if (state.page != pages) {
      wrapper.innerHTML = `${wrapper.innerHTML}<button value=${pages} class="page btn btn-sm btn-success">Last</button>`;
    }

    [...document.querySelectorAll(".page")].forEach(function (item) {
      //debugger

      item.addEventListener("click", function () {
        document.querySelector("#table-body").innerHTML = "";
        let pageVal = +this.value;
        state.page = pageVal;
        state.prev = pageVal == 1 ? 1 : pageVal - 1;
        state.next = pageVal == pages ? pages : pageVal + 1;
        console.log(state.prev, state.next);
        buildTable();
      });
    });
  }

  function buildTable() {
    //debugger
    var table = document.querySelector("#table-body");
    var data = pagination(state.querySet, state.page, state.rows);
    var myList = data.querySet;

    for (var i = 1 in myList) {
      var row = document.createElement("tr");

      var td1 = document.createElement("td");
      td1.setAttribute("style", "padding-top:20px");
      td1.innerHTML = myList[i].id;

      var td2 = document.createElement("td");
      td2.setAttribute("style", "padding-top:20px");
      td2.innerHTML = myList[i].name;

      var td3 = document.createElement("td");
      td3.setAttribute("style", "padding-top:20px");
      td3.innerHTML = myList[i].email;

      row.append(td1, td2, td3);

      tabbody.append(row);
    }

    pageButtons(data.pages);
  }
};