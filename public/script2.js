document.getElementById('myForm').addEventListener('submit', submitForm);

function submitForm(event) {
  event.preventDefault();

  var formData = new FormData();
  formData.append('name', document.getElementById('name').value);
  formData.append('age', document.getElementById('age').value);
  formData.append('weight', document.getElementById('weight').value);
  formData.append('email', document.getElementById('email').value);
  formData.append('healthReport', document.getElementById('health-report').files[0]);

  fetch('/submit', {
    method: 'POST',
    body: formData
  })
    .then(response => response.text())
    .then(data => {
      console.log(data);
      // Do something with the response data
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


