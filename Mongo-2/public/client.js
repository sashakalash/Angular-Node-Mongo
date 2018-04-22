const sendForm = document.querySelector('.send_form');
const nameField = document.querySelector('.name');
const lastnameField = document.querySelector('.lastname');
const phonenumberField = document.querySelector('.phonenumber');
const sendContactBtn = document.querySelector('.send_contact');
const findForm = document.querySelector('.find_form');
const findContactField = document.querySelector('.find_contact');
const findContactInput = document.querySelector('.find_field');
const findBtn = document.querySelector('.find');
const showBtn = document.querySelector('.show');
const output = document.querySelector('output_field');

sendContactBtn.disabled = true;
nameField.style.setProperty('--nameBrColor', '#d6d0d0');
lastnameField.style.setProperty('--lastnameBrColor', '#d6d0d0');
phonenumberField.style.setProperty('--phoneBrColor', '#d6d0d0');

nameField.style.setProperty('--nameBgColor', 'transparent');
lastnameField.style.setProperty('--lastnameBgColor', 'transparent');
phonenumberField.style.setProperty('--phoneBgColor', 'transparent');

//input data validation 
const wrongData = (fieldName, borderName, bgName, regExName) => {
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

sendForm.addEventListener('input', (event) => {
  let regExName, brColorName, bgColorName;
  if (event.target.classList.contains('phonenumber')) {
    regExName = /8?\d+/;
    borderName = '--phoneBrColor';
    bgName = '--phoneBgColor';
  } else if (event.target.classList.contains('name')) {
    regExName = /[а-яА-ЯёЁa-zA-Z]+/;
    borderName = '--nameBrColor';
    bgName = '--nameBgColor';
  } else {
    regExName = /[а-яА-ЯёЁa-zA-Z]+/;
    borderName = '--lastnameBrColor';
    bgName = '--lastnameBgColor';
  }
  if (!regExName.test(event.target.value)) {
    wrongData(event.target, borderName, bgName, regExName);
  }
  allFieldsValidate();
});

//send data
sendContactBtn.addEventListener('click', (event) => {
  event.preventDefault();
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
