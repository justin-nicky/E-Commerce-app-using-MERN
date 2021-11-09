//helper functions for generating error messages for diffrent form inputs.

// #################### Validating Name! ###########################

// @desc    handles name input blur event
// @params  event object
// @returns error string, null if no error
export const nameInputBlurHandler = (name) => {
  if (name === '') {
    return 'This field cannot be empty!'
  } else if (name.length < 4) {
    return 'Name should have atleast 4 charecters.'
  } else if (name.slice(-1) === ' ') {
    return 'Name should not end with space.'
  } else {
    return null
  }
}

// @desc    handles name input change event
// @params  event object, error string
// @returns error string, null if no error
export const nameInputChangeHandler = (name, nameError) => {
  if (name.length === 0) {
    return null
  } else if (name.charAt(0) === ' ') {
    return 'Name should not start with space.'
  } else if (name.includes('  ')) {
    return 'Name should not contain consecutive spaces.'
  } else if (/\d/.test(name)) {
    return 'Name should not contain numbers.'
  } else if (!name.match(/^[a-zA-Z ]+$/)) {
    return 'Invalid charecter!'
  }
  //  if (
  //   nameError === 'Name should not contain numbers.' ||
  //   nameError === 'Name should not start with space.' ||
  //   nameError === 'Name should not contain consecutive spaces.' ||
  //   nameError === 'Invalid charecter!'
  // )
  else {
    return null
  }
}

// #################### Validating Email! ###########################

// @desc    handles email input blur event
// @params  event object
// @returns error string, null if no error
export const emailInputBlurHandler = (email) => {
  if (email === '') {
    return 'This field cannot be empty!'
  } else if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
    return 'This email id is not valid.'
  } else {
    return null
  }
}

// @desc    handles email input change event
// @params  event object, error string
// @returns error string, null if no error
export const emailInputChangeHandler = (email, emailError) => {
  if (email.includes(' ')) {
    return 'Email id should not contain space.'
  }
  // if (
  //   emailError === 'Email id should not contain space.' ||
  //   email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
  // )
  else {
    return null
  }
}

//######################### Validating phone number! ###########################

export const phoneInputBlurHandler = (phone) => {
  if (phone === '') {
    return 'This field cannot be empty!'
  } else if (phone.length < 10) {
    return 'Phone number does not have 10 digits'
  } else if (phone.length > 10) {
    return 'Phone number has more than 10 digits'
  } else {
    return null
  }
}

export const phoneInputChangeHandler = (phone, phoneError) => {
  if (!phone.match(/^\d{10}$/) && phone !== '') {
    return 'Enter numbers only!'
  } else if (phone.length > 10) {
    return 'Phone number has more than 10 digits'
  }
  //  if (
  //   phoneError == 'Phone number should not contain space.' ||
  //   phoneError == 'Enter numbers only!' ||
  //   phoneError == 'Phone number has more than 10 digits'
  // )
  else {
    return null
  }
}

//######################### Validating Password! ###########################

export const passwordInputBlurHandler = (password) => {
  if (password === '') {
    return 'This field cannot be empty!'
  } else if (password.length < 5) {
    return 'password should have atleast 5 charecters'
  } else if (password.length > 20) {
    return 'password should not exceed 20 characters'
  } else {
    return ''
  }
}

export const passwordInputChangeHandler = (password, passwordError) => {
  if (password.length > 20) {
    return 'password should not exceed 20 characters'
  } else {
    return ''
  }
}

// #################### Validating Address or similar stuff! ###########################

// @desc    handles address input blur event
// @params  event object
// @returns error string, null if no error
export const addressInputBlurHandler = (name) => {
  if (name === '') {
    return 'This field cannot be empty!'
  } else if (name.length < 4) {
    return 'This field should have atleast 4 charecters.'
  } else if (name.slice(-1) === ' ') {
    return 'This field should not end with space.'
  } else {
    return null
  }
}

// @desc    handles address input change event
// @params  event object, error string
// @returns error string, null if no error
export const addressInputChangeHandler = (name, nameError) => {
  if (name.length === 0) {
    return null
  } else if (name.charAt(0) === ' ') {
    return 'should not start with space.'
  } else if (name.includes('  ')) {
    return 'should not contain consecutive spaces.'
  }
  //  if (
  //   nameError === 'Name should not start with space.' ||
  //   nameError === 'Name should not contain consecutive spaces.' ||
  // )
  else {
    return null
  }
}
