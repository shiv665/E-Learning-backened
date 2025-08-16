exports.courseEnrollmentEmail = (courseName, studentName, instructorName) => {
    return `
        <html>
            <body>
                <h1>Course Enrollment Confirmation</h1>
                <p>Dear ${studentName},</p>
                <p>Congratulations! You have successfully enrolled in the course <strong>${courseName}</strong>.</p>
                <p>Your instructor for this course is <strong>${instructorName}</strong>.</p>
                <p>We wish you a great learning experience!</p>
                <p>Best regards,</p>
                <p>The Course Team</p>
            </body>
        </html>
    `;
};