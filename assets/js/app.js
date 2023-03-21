const url = 'https://api.shrtco.de/v2/shorten?url=';
const input = document.querySelector('#url-input');
const button = document.querySelector('#shorten-btn');
const result = document.querySelector('#results .container');


// Get Copied Links from local storage
window.onload = () => {
  let links = getCopied();
  if (links) {
    links.forEach(url => {
      addShortened(url.shrtUrl , url.longUrl);
    })
  }
}


// shortening the url
button.addEventListener('click', () => {
  if (!input.value) {
    invalid()
  } else {
    fetch(`${url}${input.value}`)
      .then(response => response.json())
      .then(data => {
        if (data.ok) {
          // save the result in local storage
          saveUrl(data.result.short_link, input.value);
        } else {
          invalid();
        }
      })
      .catch(error => {
        invalid();
      });
  }
});

function saveUrl(shrt, long) {
  const CopiedLinks = getCopied();
  const linkObj = {
    id: Math.floor(Math.random() * 100000),
    shrtUrl: shrt,
    longUrl: long
  };

  // create teh url box and add it to dom
  addShortened(shrt, long);
  
  CopiedLinks.push(linkObj);

  saveUrls(CopiedLinks)

}

function saveUrls(links) {
  console.log(links);
  localStorage.setItem("copied", JSON.stringify(links));
}

function getCopied() {
  return JSON.parse(localStorage.getItem("copied") || "[]");
}


function addShortened(shrt, long) {
  const resultBox = document.createElement('div');
  resultBox.classList.add('row','results__box', 'bg-white', 'rounded', 'p-2', 'align-items-center');
  let shortInputValue;


  // keep the display of long link in less than 40 ch
  if (long.length > 40) {
    shortInputValue = long.substring(0, 40) + "...";
  } else {
    shortInputValue = long;
  }

  resultBox.innerHTML = `
      <div class="col-md-6">
      <h3 class="fs-body-sm m-0 py-2">${shortInputValue}</h3>
    </div>
    <div class="col-md-4">
      <a href="https://${shrt}" class="fs-body-sm text-primary d-block text-md-end py-3">https://${shrt}</a>
    </div>
    <div class="col-md-2">
      <button class="copy-btn btn btn-primary text-white rounded fw-bold w-100">Copy</button>
    </div>
  `;

  // add event listener to the copy button
  copyEvent(resultBox, `https://${shrt}`);

  result.appendChild(resultBox)
}


function copyEvent(box, link) {
  let copyBtn = box.querySelector('.copy-btn');

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(link);
    copyBtn.classList.add('btn-secondary');
    copyBtn.textContent = 'Copied!';

    // restore the default copy btn when focus change
    copyBtn.addEventListener('blur', () => {
      copyBtn.classList.remove('btn-secondary');
      copyBtn.textContent = 'Copy';
    })
  })
}


function invalid() {
  input.classList.add('invalid');

  input.addEventListener('click', () => {
    input.value = '';
    input.classList.remove('invalid')
  })
}



