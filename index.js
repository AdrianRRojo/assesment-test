/* 
!Rules:
    [x] 1 entry per day
    [x] 1 instant win prize per entrant allowed
    [x] display account info, and submission history
    [x] create a responsive design
    [x] if an entrant has won before they cannot win again.
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

        //determine if the entrant has won previously
        let hasWonBefore = false;

    // Loop over the entries to check for a winning combination
        data.entries.forEach(entry => {
      // Check if the entry is a winning combination
        if (entry.winner) {
          hasWonBefore = true;
        }
    });
      if (hasWonBefore) {
      console.log('User has won before');
    } else {
      console.log('User has not won before');
    }
    const form = document.getElementById('form');

      // Add event listener for form submit
      form.addEventListener('submit', (event) => {
          event.preventDefault();

          // Get the form data
          const formData = new FormData(event.target);

          // Check if user has already submitted an entry today
          const today = new Date().toLocaleDateString();
          console.log(today)
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
          // console.log(submissionData)
          previousSubmissions.push(submissionData);
          localStorage.setItem('submissions', JSON.stringify(previousSubmissions));
        
          const newestEntry = document.querySelector('#history tbody');
          const row = newestEntry.insertRow();
          row.innerHTML = `
            <td>${submissionData.formData.code}</td>
            <td>${submissionData.formData.product}</td>
            <td>${submissionData.date.substring(0,10)}</td>
            <td>${hasWonBefore ? 'No' : 'Yes!'}</td>
          `;
        
          // Reset the form and display success message
          form.reset();
          alert('Thank you for your submission!');
      });
  
        // Display the account information
        const accountInfo = document.querySelector('#account-info');
        accountInfo.innerHTML = `
          <p>Welcome ${data.info.first_name} ${data.info.last_name}</p>
          <p>Thank you for participating, if you find a find a winning code you will be emailed the confirmation at ${data.info.email}</p>
          <p>Any winning products will be shipped to your address at ${data.info.address}, ${ data.info.city}, ${ data.info.state} ${data.info.zip} </p>
          <p>if we need any more information we will call you at ${data.info.phone}</p>
          <p>Here is a look at your previous submissions</p>
        `;

        // Display the submission history
        const historyTable = document.querySelector('#history tbody');
        data.entries.forEach(entry => {
          const row = historyTable.insertRow();
          row.innerHTML = `
            <td>${entry.code}</td>
            <td>${entry.product}</td>
            <td>${entry.submitted.substring(0,10)} : ${entry.submitted.substring(11,19)}</td>
            <td>${entry.winner ? 'Yes!' : 'No'}</td>
          `;
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

      