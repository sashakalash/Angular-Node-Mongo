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
const editBtn = document.querySelector('.edit');
const deleteBtn = document.querySelector('.delete');
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

editBtn.style.setProperty('--editVis', 'hidden');
deleteBtn.style.setProperty('--deleteVis', 'hidden');
let isEdited = false;

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


const sendFormFunc = event => {
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
};

sendForm.addEventListener('input', sendFormFunc);

//----------------------------

//delete contact

deleteBtn.addEventListener('click', () => {
  const id = document.querySelector('.listItem.choosed').dataset.id;
  const opt = {
    body: JSON.stringify({id: id}),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  fetch('/delete', opt)
    .then(res => res.text())
    .then(res => outputList.textContent = res)
    .catch(err => outputList.textContent = err.message);
  deleteBtn.style.setProperty('--deleteVis', 'hidden');
});

//----------------------------

//send data

const sendData = event => {
  let url = '/';
  const data = {
    name: nameField.value, 
    lastname: lastnameField.value,
    phone: phonenumberField.value
  };

  if (isEdited) {
    url += 'update';

    isEdited = false;
    data.id = document.querySelector('.listItem.choosed').dataset.id;
  }
  const opt = {
    body: JSON.stringify(data),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  fetch(url, opt)
    .then(res => res.text())
    .then(res => outputList.textContent = res)
    .catch(err => outputList.textContent = err.message);
  nameField.value = null;
  lastnameField.value = null;
  phonenumberField.value = null;
  sendContactBtn.disabled = true;
  
};

sendContactBtn.addEventListener('click', sendData)

//-----------------------------

//editContact


editBtn.addEventListener('click', event => {
  const choosedContact = document.querySelector('.listItem.choosed');
  nameField.value = choosedContact.querySelector('.nameItem').dataset.value;
  lastnameField.value = choosedContact.querySelector('.lastnameItem').dataset.value;
  phonenumberField.value = choosedContact.querySelector('.phoneItem').dataset.value;
  editBtn.style.setProperty('--editVis', 'hidden');
  isEdited = true;
});




const editContact = () => {
  outputList.addEventListener('click', event => {
    if (!event.target.classList.contains('listItem')) {
      return;
    }
    if (event.target.classList.contains('choosed')) {
      return;
    } else if (!outputList.querySelector('.choosed')){
      event.target.classList.add('choosed');
    }
    outputList.querySelector('.choosed').classList.remove('choosed');
    event.target.classList.add('choosed');
       
    editBtn.style.setProperty('--editVis', 'visible');
    deleteBtn.style.setProperty('--deleteVis', 'visible');

   
  });
}; 
//-----------------------------

//show all
const showContact = (data) => {
  outputList.textContent = null;
  data.forEach(item => {
    const listItem = document.createElement('li');

    const nameItem = document.createElement('p');
    nameItem.classList.add('nameItem');
    nameItem.textContent = item.name;
    nameItem.dataset.value = item.name;

    const lastnameItem = document.createElement('p');
    lastnameItem.classList.add('lastnameItem');
    lastnameItem.textContent = item.lastname;
    lastnameItem.dataset.value = item.lastname;

    const phoneItem = document.createElement('p');
    phoneItem.classList.add('phoneItem');
    phoneItem.textContent = item.phone;
    phoneItem.dataset.value = item.phone;
      
    listItem.appendChild(nameItem);
    listItem.appendChild(lastnameItem);
    listItem.appendChild(phoneItem);
    listItem.classList.add('listItem');
    listItem.dataset.id = item['_id'];
    outputList.appendChild(listItem);

  });
  editContact();
};

showBtn.addEventListener('click', event => {
  fetch('/show')
    .then(res => res.json())
    .then(res => showContact(res))
    .catch(err => output.textContent = err.message);
});
//---------------------------------

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
  .then(res => showContact(res))
  .catch(err => output.textContent = err.message);
  editBtn.style.setProperty('--editVis', 'visible');
  deleteBtn.style.setProperty('--deleteVis', 'visible');
});
//------------------------------

