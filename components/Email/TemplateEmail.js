
// This file is exporting an Object with a single key/value pair.
// However, because this is not a part of the logic of the application
// it makes sense to abstract it to another file. Plus, it is now easily 
// extensible if the application needs to send different email templates
// (eg. unsubscribe) in the future.
module.exports = {

  confirm: id => ({
    subject: 'Confirm Your Account',
    html: `
      <a href='http://localhost:3000/confirm/${id}'>
        Click to Confirm Account!
      </a>
    `,      
    text: `Copy and paste this link: http://localhost:3000/confirm/${id}`
  }),

  changeEmail: id => ({
    subject: 'Request to Change Your Email',
    html: `
      <a href='http://localhost:3000/change-email/${id}'>
        Click to Change Your Email!
      </a>
    `,      
    text: `Copy and paste this link: http://localhost:3000/change-email/${id}`
  }),

  changePassword: id => ({
    subject: 'Request to Change Your Password',
    html: `
      <a href='http://localhost:3000/change-password/${id}'>
        Click to Change Your Email!
      </a>
    `,      
    text: `Copy and paste this link: http://localhost:3000/change-password/${id}`
  }),
  
}

