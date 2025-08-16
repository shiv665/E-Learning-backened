function contactUsEmail(firstName, lastName, countryCode, phoneNumber, message) {
    return `
        <div style="font-family: Arial, sans-serif;">
            <h2>Thank you for contacting E-Learning, ${firstName} ${lastName}!</h2>
            <p>We received your message:</p>
            <blockquote>${message}</blockquote>
            <p><strong>Phone:</strong> +${countryCode} ${phoneNumber}</p>
            <p>We'll get back to you shortly!</p>
            <br>
            <p>– The E-Learning Team</p>
        </div>
    `;
}

// ✅ Correct export
module.exports = {
    contactUsEmail
};
