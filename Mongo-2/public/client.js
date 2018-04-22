const sendForm = document.querySelector('.send_form');
const nameField = document.querySelector('.name');
const lastnameField = document.querySelector('.lastname');
const phonenumberField = document.querySelector('.phonenumber');
const sendContactBtn = document.querySelector('.send_contact');
const findForm = document.querySelector('.find_form');
const contactSelect = document.querySelector('.contact_select');
const findContactInput = document.querySelector('.find_field');
const findBtn = document.querySelector('.find');
const showBtn = document.querySelector('.show');
const output = document.querySelector('.output_field');
const outputList = output.querySelector('ul');

sendContactBtn.disabled = true;
nameField.style.setProperty('--nameBrColor', '#d6d0d0');
lastnameField.style.setProperty('--lastnameBrColor', '#d6d0d0');
phonenumberField.style.setProperty('--phoneBrColor', '#d6d0d0');
contactSelect.style.setProperty('--findBrColor', '#d6d0d0');

nameField.style.setProperty('--nameBgColor', 'transparent');
lastnameField.style.setProperty('--lastnameBgColor', 'transparent');
phonenumberField.style.setProperty('--phoneBgColor', 'transparent');
contactSelect.style.setProperty('--findBgColor', 'transparent');

//input data validation 
const phoneRegEx = /8?\d+/;
const textRegEx = /[а-яА-ЯёЁa-zA-Z]+/;

const wrongData = (fieldName, borderName, bgName) => {
  fieldName.style.setProperty(borderName, '#fa2f2f');
  fieldName.style.setProperty(bgName, '#eda8a8');
  fieldName.value = '';
  setTimeout(() => {
    fieldName.style.setProperty(borderName, '#d6d0d0');
    fieldName.style.setProperty(bgName, 'transparent');
  }, 1000);
    
};

const allFieldsValidate = () => {
  if (nameField.value && lastnameField.value && phonenumberField.value) {
    sendContactBtn.disabled = false;
  }
};

sendForm.addEventListener('input', event => {
  let regExName, brColorName, bgColorName;
  if (event.target.classList.contains('phonenumber')) {
    regExName = phoneRegEx;
    borderName = '--phoneBrColor';
    bgName = '--phoneBgColor';
  } else if (event.target.classList.contains('name')) {
    regExName = textRegEx;
    borderName = '--nameBrColor';
    bgName = '--nameBgColor';
  } else {
    regExName = textRegEx;
    borderName = '--lastnameBrColor';
    bgName = '--lastnameBgColor';
  }
  if (!regExName.test(event.target.value)) {
    wrongData(event.target, borderName, bgName);
  }
  allFieldsValidate();
});

//send data
sendContactBtn.addEventListener('click', event => {
  const opt = {
    body: JSON.stringify({
      name: nameField.value, 
      lastname: lastnameField.value,
      phone: phonenumberField.value
    }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  fetch('/', opt)
    .then(res => res.text())
    .then(res => output.textContent = res)
    .catch(err => output.textContent = err.message);
  nameField.value = null;
  lastnameField.value = null;
  phonenumberField.value = null;
});

//show all
const showContactList = (arr) => {
  outputList.textContent = null;
  arr.forEach(item => {
    const listItem = document.createElement('li');
    listItem.textContent = `Имя: ${item.name} Фамилия: ${item.lastname} Телефон: ${item.phone}`;
    outputList.appendChild(listItem);
  });
};

showBtn.addEventListener('click', event => {
  fetch('/show/')
    .then(res => res.json())
    .then(res => showContactList(res))
    .catch(err => output.textContent = err.message);
});

//find contact
const findDataValidate = (RegEx, data, field) => {
  if (!RegEx.test(data)) {
    data = data.replace(RegEx, '');
    wrongData(field, '--findBrColor', '--findBgColor');
  }
};

findContactInput.addEventListener('input', event => {
  if (!contactSelect.value) {
    wrongData(event.target, '--findBrColor', '--findBgColor');
    return;
  }
  const RegEx = contactSelect.value === 'phonenumber'? phoneRegEx: textRegEx;
  findDataValidate(RegEx, event.target.value, event.target);  
});

findBtn.addEventListener('click', event => {
  event.preventDefault();
  const opt = {
    body: JSON.stringify({
      data: findContactInput.value,
      type: contactSelect.value
    }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  fetch('/find', opt)
  .then(res => res.json())
  .then(res => showContactList(res))
  .catch(err => output.textContent = err.message);
});