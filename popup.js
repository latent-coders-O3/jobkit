document.addEventListener('DOMContentLoaded', function () {
    const uploadForm = document.getElementById('uploadForm');
    const resumeInput = document.getElementById('resume');
    const coverLetterInput = document.getElementById('coverLetter');
    const fileList = document.createElement('ul');
    document.body.appendChild(fileList);

    // Load stored files on startup
    chrome.storage.sync.get(['resumes', 'coverLetters'], function (data) {
        const resumes = data.resumes || [];
        const coverLetters = data.coverLetters || [];
        displayFiles(resumes, coverLetters);
    });

    // Load and display job applications
    chrome.storage.sync.get(['jobApplications'], function(data) {
        const jobApplications = data.jobApplications || [];
        displayJobApplications(jobApplications);
    });

    function displayJobApplications(applications) {
        const jobList = document.createElement('ul');
        applications.forEach(app => {
            const li = document.createElement('li');
            li.textContent = `Job: ${app.jobTitle}, Company: ${app.companyName}, Date: ${app.dateApplied}`;
            jobList.appendChild(li);
        });
        document.body.appendChild(jobList);
    }

    uploadForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const resumeFile = resumeInput.files[0];
        const coverLetterFile = coverLetterInput.files[0];

        if (resumeFile) {
            storeFile('resumes', resumeFile);
        }

        if (coverLetterFile) {
            storeFile('coverLetters', coverLetterFile);
        }
    });

    function storeFile(type, file) {
        const reader = new FileReader();
        reader.onload = function () {
            chrome.storage.sync.get([type], function (data) {
                const files = data[type] || [];
                files.push({ name: file.name, content: reader.result });
                chrome.storage.sync.set({ [type]: files }, function () {
                    displayFiles(type === 'resumes' ? files : null, type === 'coverLetters' ? files : null);
                });
            });
        };
        reader.readAsDataURL(file);
    }

    function displayFiles(resumes, coverLetters) {
        fileList.innerHTML = '';
        if (resumes) {
            resumes.forEach(file => {
                const li = document.createElement('li');
                li.textContent = `Resume: ${file.name}`;
                fileList.appendChild(li);
            });
        }
        if (coverLetters) {
            coverLetters.forEach(file => {
                const li = document.createElement('li');
                li.textContent = `Cover Letter: ${file.name}`;
                fileList.appendChild(li);
            });
        }
    }
});
