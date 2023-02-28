/* 
!Rules:
    [x] 1 entry per day
    [x] 1 instant win prize per entrant allowed
    [x] display account info, and submission history
    [] create a responsive design
*/

/*
TODO:
    1 Entry per day:
        - Create a 24 hour time that begins after submission
TODO: 
    1 Instant win prize:
        - create an if statement that checks if the user has already won
TODO: 
    Display Account Info and submission history:
        - Display Info
        - Style
TODO: 
    Create responsive design
*/
fetch('https://api-test.promotiongeeks.com/user')
      .then(response => response.json())
      .then(data => {
        // Display the account information
        const accountInfo = document.querySelector('#account-info');
        accountInfo.innerHTML = `
          <p>First Name: ${data.info.first_name}</p>
          <p>Last Name: ${data.info.last_name}</p>
          <p>Email: ${data.info.email}</p>
          <p>Address: ${data.info.address}</p>
          <p>City: ${data.info.city}</p>
          <p>State: ${data.info.state}</p>
          <p>Zip: ${data.info.zip}</p>
          <p>Phone: ${data.info.phone}</p>
        `;

        // Display the submission history
        const historyTable = document.querySelector('#history tbody');
        data.entries.forEach(entry => {
          const row = historyTable.insertRow();
          row.innerHTML = `
            <td>${entry.code}</td>
            <td>${entry.product}</td>
            <td>${entry.submitted}</td>
            <td>${entry.winner ? 'Yes!' : 'No'}</td>
          `;
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

      const form = document.getElementById('form');

      // Add event listener for form submit
      form.addEventListener('submit', (event) => {
          event.preventDefault();

          // Get the form data
          const formData = new FormData(event.target);

          // Check if user has already submitted an entry today
          const today = new Date().toLocaleDateString();
          const previousSubmissions = JSON.parse(localStorage.getItem('submissions')) || [];
          const hasSubmittedToday = previousSubmissions.some(submission => submission.date === today);
          if (hasSubmittedToday) {
              document.getElementById('error-message').textContent = 'You have already submitted an entry today. Please try again tomorrow.';
              document.getElementById('error-message').style.display = 'block';

              return;
          }

          // Store the submission data in localStorage
          const submissionData = {
              date: today,
              formData: Object.fromEntries(formData)
          };
          console.log(submissionData)
          previousSubmissions.push(submissionData);
          localStorage.setItem('submissions', JSON.stringify(previousSubmissions));
        
          const newestEntry = document.querySelector('#latest-submission tbody');
          const row = newestEntry.insertRow();
          row.innerHTML = `
            <td>${submissionData.formData.code}</td>
            <td>${submissionData.formData.product}</td>
            <td>${submissionData.date}</td>
            <td>${'No'}</td>
          `;
        
          // Reset the form and display success message
        //   form.reset();
          alert('Thank you for your submission!');
      });