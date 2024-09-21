(function() {
    // Function to simulate file upload
    function simulateFileUpload(inputElement, fileData) {
        const dataTransfer = new DataTransfer();
        const file = new File([fileData.content], fileData.name, { type: 'application/pdf' });
        dataTransfer.items.add(file);
        inputElement.files = dataTransfer.files;
        inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Function to log job application
    function logJobApplication(jobTitle, companyName) {
        const dateApplied = new Date().toLocaleDateString();
        const jobEntry = { jobTitle, companyName, dateApplied };

        chrome.storage.sync.get(['jobApplications'], function(data) {
            const jobApplications = data.jobApplications || [];
            jobApplications.push(jobEntry);
            chrome.storage.sync.set({ jobApplications }, function() {
                console.log('Job application logged:', jobEntry);
            });
        });
    }

    // Example usage: log a job application
    // This should be replaced with actual data extraction from the job application page
    logJobApplication('Software Engineer', 'Tech Company');

    // Function to autofill the forms
    function autofillForms() {
        chrome.storage.sync.get(['resumes', 'coverLetters'], function(data) {
            const resumes = data.resumes || [];
            const coverLetters = data.coverLetters || [];

            // Assuming the first resume and cover letter are the defaults
            const defaultResume = resumes[0];
            const defaultCoverLetter = coverLetters[0];

            if (defaultResume) {
                const resumeInput = document.querySelector('input[type="file"][name*="resume"]');
                if (resumeInput) {
                    console.log('Resume input found:', resumeInput);
                    simulateFileUpload(resumeInput, defaultResume);
                } else {
                    console.log('Resume input not found');
                }
            }

            if (defaultCoverLetter) {
                const coverLetterInput = document.querySelector('input[type="file"][name*="coverLetter"]');
                if (coverLetterInput) {
                    console.log('Cover letter input found:', coverLetterInput);
                    simulateFileUpload(coverLetterInput, defaultCoverLetter);
                } else {
                    console.log('Cover letter input not found');
                }
            }
        });
    }

    // Run the autofill function when the page loads
    window.addEventListener('load', autofillForms);
})();
